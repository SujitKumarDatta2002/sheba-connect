const cron = require("node-cron");
const { fetchAndStorePublicData } = require("../services/dataFetcher.service");
const { buildInsights } = require("../services/dataProcessor.service");

async function runDataSyncNow() {
  const syncSummary = await fetchAndStorePublicData();
  const insights = await buildInsights();

  return {
    syncedAt: new Date().toISOString(),
    syncSummary,
    insightsGeneratedAt: insights.generatedAt,
  };
}

function startDataSyncJob() {
  const expression = "0 */6 * * *";
  cron.schedule(expression, async () => {
    try {
      const result = await runDataSyncNow();
      console.log("[AnalyticsCron] 6h sync completed", result.syncedAt);
    } catch (error) {
      console.error("[AnalyticsCron] sync failed", error.message);
    }
  });

  console.log("[AnalyticsCron] scheduled to run every 6 hours");
}

module.exports = {
  startDataSyncJob,
  runDataSyncNow,
};
