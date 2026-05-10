const { Queue } = require("bullmq");
const { env } = require("../../config/env");
const { logger } = require("../../config/logger");

const AI_QUEUE_NAME = "sam-ai-tasks";

// Reuse the connection logic from runs.queue
function redisConnectionFromUrl(redisUrl) {
  try {
    const u = new URL(redisUrl || "redis://localhost:6379");
    const port = u.port ? Number(u.port) : 6379;
    const password = u.password ? decodeURIComponent(u.password) : undefined;
    return { 
      host: u.hostname, 
      port, 
      password, 
      tls: u.protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      connectTimeout: 15000 
    };
  } catch (err) {
    logger.error({ err, redisUrl }, "Invalid Redis URL in AI Queue");
    return { 
      host: "localhost", 
      port: 6379, 
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      connectTimeout: 15000
    };
  }
}

let _aiQueue = null;

function getAiQueue() {
  if (!_aiQueue) {
    try {
      _aiQueue = new Queue(AI_QUEUE_NAME, {
        connection: redisConnectionFromUrl(env.REDIS_URL),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: 1000,
        },
      });
      
      _aiQueue.on("error", (err) => {
        logger.error({ err }, "BullMQ AI Queue Error");
      });
      
      logger.info("AI Persistence Queue initialized successfully");
    } catch (err) {
      logger.error({ err }, "Failed to initialize AI Queue");
    }
  }
  return _aiQueue;
}

module.exports = { AI_QUEUE_NAME, getAiQueue };
