const { RunModel } = require("./runs.model");
const { executeDirectly } = require("./directExecutor");
const { logger } = require("../../config/logger");
const mongoose = require("mongoose");

async function createRun(input) {
  const isConnected = mongoose.connection.readyState === 1;
  let run;
  let useMongo = false;

  if (isConnected) {
    try {
      run = await RunModel.create({
        projectId: input.projectId,
        runtime: input.runtime,
        status: "running",
        entrypoint: input.entrypoint,
        files: input.files,
        stdout: "",
        stderr: "",
        exitCode: null,
        startedAt: new Date(),
        finishedAt: null
      });
      useMongo = true;
    } catch (err) {
      logger.error({ err }, "Failed to create run in Mongo, using in-request object");
    }
  }

  if (!run) {
    const runId = new mongoose.Types.ObjectId().toString();
    run = {
      _id: runId,
      ...input,
      status: "running",
      stdout: "",
      stderr: "",
      exitCode: null,
      startedAt: new Date(),
      finishedAt: null,
    };
  }

  // Always execute directly — no queue/worker on Vercel serverless
  try {
    const result = await executeDirectly(run);
    run.stdout = result.stdout;
    run.stderr = result.stderr;
    run.exitCode = result.exitCode;
    run.status = result.exitCode === 0 ? "succeeded" : "failed";
    run.finishedAt = new Date();
  } catch (err) {
    logger.error({ err }, "Direct execution error");
    run.stderr = `Execution error: ${err.message}`;
    run.exitCode = 1;
    run.status = "failed";
    run.finishedAt = new Date();
  }

  // Persist the result so GET /runs/:id can find it
  if (useMongo) {
    try {
      await RunModel.findByIdAndUpdate(run._id, {
        stdout: run.stdout,
        stderr: run.stderr,
        exitCode: run.exitCode,
        status: run.status,
        finishedAt: run.finishedAt
      });
    } catch (err) {
      logger.warn({ err }, "Failed to update run in MongoDB after execution");
    }
  }

  return run;
}

async function getRun(runId) {
  if (mongoose.connection.readyState === 1) {
    try {
      const mongoRun = await RunModel.findById(runId).lean();
      if (mongoRun) return mongoRun;
    } catch (err) {
      logger.warn({ err }, "Failed to find run in MongoDB");
    }
  }
  return null;
}

module.exports = { createRun, getRun };

