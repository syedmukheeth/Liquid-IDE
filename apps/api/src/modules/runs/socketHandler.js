const { Server } = require("socket.io");
const { logger } = require("../../config/logger");

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust as needed, but for local dev * is fine
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Client connected to socket");

    socket.on("subscribe", ({ jobId }) => {
      logger.info({ socketId: socket.id, jobId }, "Socket subscribed to job");
      socket.join(`run:${jobId}`);
    });

    socket.on("unsubscribe", ({ jobId }) => {
      logger.info({ socketId: socket.id, jobId }, "Socket unsubscribed from job");
      socket.leave(`run:${jobId}`);
    });

    socket.on("exec:input", ({ jobId, input }) => {
      logger.info({ socketId: socket.id, jobId }, "Socket received input for job");
      // This will be handled by the executor if we can find the process
      process.emit(`run:input:${jobId}`, input);
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Client disconnected from socket");
    });
  });

  return io;
}

function getIO() {
  return io;
}

/**
 * Emit a log to all subscribers of a job
 */
function emitLog(jobId, type, chunk) {
  if (!io) return;
  io.to(`run:${jobId}`).emit("exec:log", { type, chunk });
}

module.exports = { initSocket, getIO, emitLog };
