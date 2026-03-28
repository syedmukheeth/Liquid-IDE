const { RunModel } = require("../runs/runs.model");

/**
 * Aggregates execution metrics for the last 24 hours.
 */
async function getExecutionStats() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stats = await RunModel.aggregate([
    {
      $match: {
        createdAt: { $gte: twentyFourHoursAgo }
      }
    },
    {
      $group: {
        _id: "$runtime",
        avgDurationMs: { $avg: "$metrics.durationMs" },
        count: { $sum: 1 },
        successCount: {
          $sum: { $cond: [{ $eq: ["$status", "succeeded"] }, 1, 0] }
        },
        failedCount: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        language: "$_id",
        avgDurationMs: { $round: ["$avgDurationMs", 2] },
        count: 1,
        successCount: 1,
        failedCount: 1,
        successRate: {
          $multiply: [
            { $divide: ["$successCount", { $add: ["$count", 0.0001] }] },
            100
          ]
        }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return stats;
}

/**
 * Gets throughput (counts) for the last 7 days, grouped by day.
 */
async function getThroughputChart() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const chart = await RunModel.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  return chart;
}

module.exports = { getExecutionStats, getThroughputChart };
