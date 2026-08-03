const axios = require("axios");
const PublicData = require("../models/publicData.model");

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

async function fetchHighFrequencyDataset(config = {}) {
  const latitude = config.latitude || 23.8103;
  const longitude = config.longitude || 90.4125;
  const location = config.location || "Dhaka,BD";

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide&past_days=2&forecast_days=2&timezone=auto`;
  const response = await axios.get(url, { timeout: 25000 });

  const times = asArray(response.data?.hourly?.time);
  const pm10 = asArray(response.data?.hourly?.pm10);
  const pm25 = asArray(response.data?.hourly?.pm2_5);
  const co = asArray(response.data?.hourly?.carbon_monoxide);
  const no2 = asArray(response.data?.hourly?.nitrogen_dioxide);

  const rows = times
    .map((timestamp, i) => ({
      timestamp,
      date: String(timestamp).slice(0, 10),
      location,
      pm10: Number(pm10[i]),
      pm25: Number(pm25[i]),
      carbonMonoxide: Number(co[i]),
      nitrogenDioxide: Number(no2[i]),
    }))
    .filter((row) => row.timestamp && Number.isFinite(row.pm10) && Number.isFinite(row.pm25));

  return { url, rows, rawData: response.data, location };
}

async function storeHighFrequencyDataset(dataset) {
  await PublicData.updateOne(
    { source: "open-meteo-air-quality", datasetKey: "highfreq-air-quality-dhaka" },
    {
      $set: {
        source: "open-meteo-air-quality",
        category: "high-frequency",
        datasetKey: "highfreq-air-quality-dhaka",
        rawData: dataset.rawData,
        processedData: dataset.rows,
        recordsCount: dataset.rows.length,
        lastUpdated: new Date(),
      },
    },
    { upsert: true }
  );
}

async function fetchAndStoreHighFrequencyData(config = {}) {
  const dataset = await fetchHighFrequencyDataset(config);
  await storeHighFrequencyDataset(dataset);
  console.log("Fetched High-Frequency dataset", dataset.url);

  return {
    source: "open-meteo-air-quality",
    recordsStored: dataset.rows.length,
    location: dataset.location,
  };
}

module.exports = {
  fetchAndStoreHighFrequencyData,
};
