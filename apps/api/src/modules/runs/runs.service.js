const { RunModel } = require("./runs.model");
const { getRunsQueue } = require("./runs.queue");
const { executeDirectly } = require("./directExecutor");
const { logger } = require("../../config/logger");
const mongoose = require("mongoose");

// In-memory fallback for when MongoDB is disconnected
const memoryRuns = new Map();

async function createRun(input) {
  const isConnected = mongoose.connection.readyState === 1;
  let run;

  if (isConnected) {
    try {
      run = await RunModel.create({
        projectId: input.projectId,
        runtime: input.runtime,
        status: "queued",
        entrypoint: input.entrypoint,
        files: input.files,
        stdout: "",
        stderr: "",
        exitCode: null,
        startedAt: null,
        finishedAt: null
      });
    } catch (err) {
      logger.error({ err }, "Failed to create run in Mongo, falling back to memory");
    }
  }

  if (!run) {
    // Fallback run object
    const runId = new mongoose.Types.ObjectId().toString();
    run = {
      _id: runId,
      ...input,
      status: "running", // Direct execution starts immediately
      stdout: "",
      stderr: "",
      exitCode: null,
      startedAt: new Date(),
      save: async function() { 
        memoryRuns.set(this._id.toString(), { ...this });
        return this; 
      }
    };
    memoryRuns.set(runId, { ...run });
  }

  // If connected, try the queue; otherwise, go direct immediately
  let useQueue = isConnected;
  if (useQueue) {
    try {
      const queue = getRunsQueue();
      if (!queue) throw new Error("Queue unavailable");

      const queuePromise = queue.add(
        "execute",
        { runId: run._id.toString() },
        {
          removeOnComplete: { age: 3600, count: 1000 },
          removeOnFail: { age: 24 * 3600, count: 1000 }
        }
      );

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Redis Timeout")), 2000)
      );

      await Promise.race([queuePromise, timeoutPromise]);
    } catch (err) {
      logger.warn({ runId: run._id, err: err.message }, "Redis Queue failed or timed out. Switching to direct execution.");
      useQueue = false;
    }
  }

  if (!useQueue || !isConnected) {
    // Direct Execution Fallback (or primary if disconnected)
    run.status = "running";
    if (!run.startedAt) run.startedAt = new Date();
    await run.save();

    const result = await executeDirectly(run);
    
    run.stdout = result.stdout;
    run.stderr = result.stderr;
    run.exitCode = result.exitCode;
    run.status = result.exitCode === 0 ? "succeeded" : "failed";
    run.finishedAt = new Date();
    await run.save();
  }

  return run;
}

async function getRun(runId) {
  if (mongoose.connection.readyState === 1) {
    const mongoRun = await RunModel.findById(runId).lean();
    if (mongoRun) return mongoRun;
  }
  return memoryRuns.get(runId.toString());
}

module.exports = { createRun, getRun };

