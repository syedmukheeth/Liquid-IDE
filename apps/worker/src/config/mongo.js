const mongoose = require("mongoose");
const { env } = require("./env");
const { logger } = require("./logger");

async function connectMongo() {
  try {
    mongoose.set("strictQuery", true);
    // Return the promise to allow awaiting in serverless environments
    return mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 20, // Lower than API as workers are more CPU intensive
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      autoIndex: false
    }).then(() => {
      logger.info("Worker connected to MongoDB with optimized pooling");
    }).catch(err => {
      logger.error({ err }, "Worker failed to connect to MongoDB (deferred)");
      throw err;
    });
  } catch (err) {
    logger.error({ err }, "Worker failed to initiate MongoDB connection");
    throw err;
  }
}

module.exports = { connectMongo };

