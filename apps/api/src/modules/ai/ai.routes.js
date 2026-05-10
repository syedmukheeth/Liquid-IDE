const { Router } = require("express");
const { generateRefactor, streamChat } = require("./ai.service");
const { logger } = require("../../config/logger");

const aiRouter = Router();

/**
 * Handle AI Refactoring requests.
 */
const { getAiQueue } = require("./ai.queue");

/**
 * Handle AI Refactoring requests via Background Queue.
 * Ensures "Never Offline" status by offloading to BullMQ.
 */
aiRouter.post("/refactor", async (req, res, next) => {
  try {
    const { code, language, metrics, query, socketId } = req.body;
    const userId = req.user?.id || "guest";

    const queue = getAiQueue();
    if (!queue) {
      // Fallback if Redis/Queue is down - attempt synchronous execution
      const refactor = await generateRefactor({ code, language, metrics, query });
      return res.json({ refactor, async: false });
    }

    const job = await queue.add("refactor-task", {
      userId,
      socketId,
      context: { code, language, metrics, query }
    });

    logger.info({ jobId: job.id, userId }, "AI Refactor task queued successfully");
    res.json({ jobId: job.id, async: true, status: "queued" });
  } catch (err) {
    logger.error({ err }, "Refactor queueing failed");
    next(err);
  }
});

/**
 * Handle AI Chat with SSE streaming.
 */
aiRouter.post("/chat", async (req, res) => {
  const { code, language, messages } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await streamChat({ code, language, messages }, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    logger.error({ err }, "Chat stream route failed");
    res.write(`data: ${JSON.stringify({ error: err.message, terminal: true })}\n\n`);
    res.end();
  }

});

module.exports = { aiRouter };
