const cron = require("node-cron");
const { fetchAndStoreWorldBankData } = require("../services/worldBank.service");
const { fetchAndStoreRollingWeatherData } = require("../services/weather.service");
const { fetchAndStoreHighFrequencyData } = require("../services/highFreqData.service");

function startExtendedDataSyncJobs() {
	// Weather every 6 hours
	cron.schedule("0 */6 * * *", async () => {
		try {
			await fetchAndStoreRollingWeatherData();
			console.log("[ExtendedAnalyticsCron] weather sync completed");
		} catch (error) {
			console.error("[ExtendedAnalyticsCron] weather sync failed", error.message);
		}
	});

	// High-frequency dataset every hour
	cron.schedule("0 * * * *", async () => {
		try {
			await fetchAndStoreHighFrequencyData();
			console.log("[ExtendedAnalyticsCron] high-frequency sync completed");
		} catch (error) {
			console.error("[ExtendedAnalyticsCron] high-frequency sync failed", error.message);
		}
	});

	// World Bank once daily at 02:00
	cron.schedule("0 2 * * *", async () => {
		try {
			await fetchAndStoreWorldBankData();
			console.log("[ExtendedAnalyticsCron] World Bank sync completed");
		} catch (error) {
			console.error("[ExtendedAnalyticsCron] World Bank sync failed", error.message);
		}
	});
}

async function runExtendedSyncNow() {
	const [worldBank, weather, highFrequency] = await Promise.all([
		fetchAndStoreWorldBankData(),
		fetchAndStoreRollingWeatherData(),
		fetchAndStoreHighFrequencyData(),
	]);

	return {
		syncedAt: new Date().toISOString(),
		worldBank,
		weather,
		highFrequency,
	};
}

module.exports = {
	startExtendedDataSyncJobs,
	runExtendedSyncNow,
};
