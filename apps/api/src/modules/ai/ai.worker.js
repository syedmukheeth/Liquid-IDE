const { Worker } = require("bullmq");
const { AI_QUEUE_NAME } = require("./ai.queue");
const { generateRefactor } = require("./ai.service");
const { getIO } = require("../runs/socketHandler");
const { env } = require("../../config/env");
const { logger } = require("../../config/logger");

function initAiWorker() {
  const redisOptions = {
    host: new URL(env.REDIS_URL || "redis://localhost:6379").hostname,
    port: new URL(env.REDIS_URL || "redis://localhost:6379").port || 6379,
    password: new URL(env.REDIS_URL || "redis://localhost:6379").password ? decodeURIComponent(new URL(env.REDIS_URL || "redis://localhost:6379").password) : undefined,
    tls: (env.REDIS_URL || "").startsWith("rediss:") ? {} : undefined,
    maxRetriesPerRequest: null,
  };

  const worker = new Worker(AI_QUEUE_NAME, async (job) => {
    const { userId, socketId, context } = job.data;
    logger.info({ jobId: job.id, userId }, "Processing AI Refactor task in background");

    try {
      // Execute the AI refactor with auto-fallback logic in ai.service
      const refactor = await generateRefactor(context);

      // Push back to user via Socket.io
      const io = getIO();
      if (io) {
        // Emit specifically to the user's private room or specific socket
        io.to(socketId).emit("ai:refactor:result", { 
          jobId: job.id, 
          result: refactor, 
          success: true 
        });
        logger.info({ jobId: job.id, socketId }, "AI Refactor result pushed to socket");
      }
    } catch (err) {
      logger.error({ err: err.message, jobId: job.id }, "AI Worker failed task");
      const io = getIO();
      if (io) {
        io.to(socketId).emit("ai:refactor:result", { 
          jobId: job.id, 
          error: err.message, 
          success: false 
        });
      }
      throw err; // Allow BullMQ to retry if appropriate
    }
  }, { 
    connection: redisOptions,
    concurrency: 5 // Process 5 AI tasks at once
  });

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "AI background task completed");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job.id, err: err.message }, "AI background task failed after all retries");
  });

  logger.info("SAM AI Worker initialized and listening for tasks");
  return worker;
}

module.exports = { initAiWorker };
