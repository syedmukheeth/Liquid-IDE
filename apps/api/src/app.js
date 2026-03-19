const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const pino = require("pino-http");
const passport = require("./config/passport");
const { logger } = require("./config/logger");
const { env } = require("./config/env");
const { runsRouter } = require("./modules/runs/runs.routes");
const { githubRouter } = require("./modules/github/github.routes");
const { authRouter } = require("./modules/auth/auth.routes");

function createApp() {
  const app = express();

  app.use(pino({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (e.g., server-to-server, curl)
        if (!origin) return callback(null, true);
        const allowed = [
          env.WEB_ORIGIN,
          "http://localhost:5173",
          "http://localhost:5179",
          "http://localhost:3000"
        ];
        // Allow any vercel.app deployment URL
        if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(passport.initialize());

  app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
  app.use("/runs", runsRouter);
  app.use("/github", githubRouter);
  app.use("/auth", authRouter);

  // Global Error Handler
  app.use((err, req, res, next) => {
    void next;
    req.log.error({ err }, "Unhandled application error");
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "production" ? {} : err
    });
  });

  return app;
}

module.exports = { createApp };

