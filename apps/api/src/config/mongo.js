const mongoose = require("mongoose");
const { env } = require("./env");
const { logger } = require("./logger");

let cachedConn = null;

async function connectMongo() {
  if (cachedConn) {
    if (mongoose.connection.readyState >= 1) return cachedConn;
    cachedConn = null; // Reset if broken
  }

  try {
    mongoose.set("strictQuery", true);
    console.log("DEBUG: Connecting to MongoDB...");
    
    cachedConn = mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50, // Reduced from 100 to support safe horizontal scale (e.g. 10 pods * 50 = 500 conns)
      minPoolSize: 5,  // Maintain a baseline of 5 connections to avoid cold-start stalls
      autoIndex: false // Disable auto-indexing in production for better performance
    });

    await cachedConn;
    logger.info("Connected to MongoDB");
    console.log("🟢 [DB] Connected to MongoDB");
    return cachedConn;
  } catch (err) {
    cachedConn = null;
    console.error("🔴 [DB] Connection to MongoDB failed. Reconnecting in background...", err.message);
    logger.warn({ err }, "Initial MongoDB connection failed. Retrying in background.");
    // Do NOT throw. Let the server start and Mongoose will retry.
    return null;
  }
}

module.exports = { connectMongo };

