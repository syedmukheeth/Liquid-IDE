const { RunModel } = require("./runs.model");
const { runsQueue } = require("./runs.queue");
const { executeDirectly } = require("./directExecutor");
const { logger } = require("../../config/logger");

async function createRun(input) {
  const run = await RunModel.create({
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

  try {
    const queuePromise = runsQueue.add(
      "execute",
      { runId: run._id.toString() },
      {
        removeOnComplete: { age: 3600, count: 1000 },
        removeOnFail: { age: 24 * 3600, count: 1000 }
      }
    );

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Redis Timeout")), 3000)
    );

    await Promise.race([queuePromise, timeoutPromise]);
  } catch (err) {
    logger.warn({ runId: run._id, err: err.message }, "Redis Queue failed or timed out. Switching to direct execution.");
    
    // Direct Execution Fallback
    run.status = "running";
    run.startedAt = new Date();
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
  return await RunModel.findById(runId).lean();
}

module.exports = { createRun, getRun };

