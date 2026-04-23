// Fetch air quality data (PM10, PM2.5) from Open-Meteo for a custom date range (YYYY-MM-DD)
async function fetchAirQualityByDateRange(startDate, endDate) {
  // Open-Meteo Air Quality API for Dhaka
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=23.8103&longitude=90.4125&start_date=${startDate}&end_date=${endDate}&hourly=pm10,pm2_5&timezone=auto`;
  const response = await fetchWithRetry(url);
  const times = asArray(response.data?.hourly?.time);
  const pm10 = asArray(response.data?.hourly?.pm10);
  const pm25 = asArray(response.data?.hourly?.pm2_5);
  const rows = times.map((time, index) => ({
    timestamp: safeStr(time),
    pm10: Number(pm10[index]),
    pm25: Number(pm25[index]),
  })).filter(row => row.timestamp && (Number.isFinite(row.pm10) || Number.isFinite(row.pm25)));
  return rows;
}
// Fetch weather data from Open-Meteo for a custom date range (YYYY-MM-DD)
async function fetchWeatherByDateRange(startDate, endDate) {
  // Open-Meteo API for Dhaka
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=23.8103&longitude=90.4125&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,rain_sum&timezone=auto`;
  const response = await fetchWithRetry(url);
  const dates = asArray(response.data?.daily?.time);
  const temps = asArray(response.data?.daily?.temperature_2m_mean);
  const rain = asArray(response.data?.daily?.rain_sum);
  const rows = dates.map((date, index) => ({
    date: safeStr(date),
    temperature: Number(temps[index]),
    rainfall: Number(rain[index]),
  })).filter(row => row.date && (Number.isFinite(row.temperature) || Number.isFinite(row.rainfall)));
  return rows;
}
const axios = require("axios");
const PublicData = require("../models/publicData.model");

const http = axios.create({
  timeout: Number(process.env.ANALYTICS_FETCH_TIMEOUT_MS || 20000),
  headers: {
    "User-Agent": "ShebaConnect-Analytics/1.0",
    Accept: "application/json,text/csv,text/plain,*/*",
  },
});

const EXTERNAL_ENDPOINTS = {
  worldBank: {
    population:
      "https://api.worldbank.org/v2/country/BGD/indicator/SP.POP.TOTL?format=json&per_page=200",
    gdp: "https://api.worldbank.org/v2/country/BGD/indicator/NY.GDP.MKTP.CD?format=json&per_page=200",
    inflation:
      "https://api.worldbank.org/v2/country/BGD/indicator/FP.CPI.TOTL.ZG?format=json&per_page=200",
    unemployment:
      "https://api.worldbank.org/v2/country/BGD/indicator/SL.UEM.TOTL.ZS?format=json&per_page=200",
  },
  openMeteoDhaka:
    "https://archive-api.open-meteo.com/v1/archive?latitude=23.8103&longitude=90.4125&start_date=2025-01-01&end_date=2025-03-31&daily=temperature_2m_mean&timezone=auto",
};

function asArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.result?.results)) return data.result.results;
  return [data];
}

function safeStr(value) {
  return String(value || "").trim();
}

async function fetchWithRetry(url, retries = 3) {
  let lastError;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await http.get(url);
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (i + 1)));
      }
    }
  }
  throw lastError;
}

async function fetchWorldBankIndicator(url, datasetKey, category, label, unit) {
  const response = await fetchWithRetry(url);
  console.log("Fetched from external API", url);

  const rows = asArray(response.data?.[1])
    .filter((row) => row && row.value !== null && row.date)
    .map((row) => ({
      year: Number(row.date),
      value: Number(row.value),
      indicator: label,
      unit,
    }))
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.value))
    .sort((a, b) => a.year - b.year);

  return {
    source: "worldbank.org",
    category,
    datasetKey,
    rawData: response.data,
    processedData: rows,
  };
}

async function fetchDhakaTemperature() {
  const response = await fetchWithRetry(EXTERNAL_ENDPOINTS.openMeteoDhaka);
  console.log("Fetched from external API", EXTERNAL_ENDPOINTS.openMeteoDhaka);

  const dates = asArray(response.data?.daily?.time);
  const temps = asArray(response.data?.daily?.temperature_2m_mean);
  const rows = dates
    .map((date, index) => ({
      date: safeStr(date),
      value: Number(temps[index]),
      indicator: "Dhaka Mean Daily Temperature",
      unit: "C",
    }))
    .filter((row) => row.date && Number.isFinite(row.value));

  return {
    source: "open-meteo.com",
    category: "climate",
    datasetKey: "openmeteo-dhaka-temperature",
    rawData: response.data,
    processedData: rows,
  };
}

async function upsertPublicData(doc) {
  await PublicData.updateOne(
    { source: doc.source, datasetKey: doc.datasetKey },
    {
      $set: {
        source: doc.source,
        category: doc.category,
        datasetKey: doc.datasetKey,
        rawData: doc.rawData,
        processedData: doc.processedData,
        recordsCount: asArray(doc.processedData).length,
        lastUpdated: new Date(),
      },
    },
    { upsert: true }
  );
}

async function fetchAndStorePublicData() {
  const summary = {
    syncedAt: new Date().toISOString(),
    externalCalls: [],
    failedCalls: [],
    geoRecordsStored: 0,
    publicDatasetsStored: 0,
  };

  const datasets = [];
  const tasks = [
    {
      key: EXTERNAL_ENDPOINTS.worldBank.population,
      run: () =>
        fetchWorldBankIndicator(
          EXTERNAL_ENDPOINTS.worldBank.population,
          "worldbank-population",
          "demographics",
          "Population",
          "people"
        ),
    },
    {
      key: EXTERNAL_ENDPOINTS.worldBank.gdp,
      run: () =>
        fetchWorldBankIndicator(
          EXTERNAL_ENDPOINTS.worldBank.gdp,
          "worldbank-gdp",
          "economy",
          "GDP (current US$)",
          "USD"
        ),
    },
    {
      key: EXTERNAL_ENDPOINTS.worldBank.inflation,
      run: () =>
        fetchWorldBankIndicator(
          EXTERNAL_ENDPOINTS.worldBank.inflation,
          "worldbank-inflation",
          "economy",
          "Inflation, consumer prices (annual %)",
          "%"
        ),
    },
    {
      key: EXTERNAL_ENDPOINTS.worldBank.unemployment,
      run: () =>
        fetchWorldBankIndicator(
          EXTERNAL_ENDPOINTS.worldBank.unemployment,
          "worldbank-unemployment",
          "economy",
          "Unemployment, total (% of labor force)",
          "%"
        ),
    },
    {
      key: EXTERNAL_ENDPOINTS.openMeteoDhaka,
      run: () => fetchDhakaTemperature(),
    },
  ];

  for (const task of tasks) {
    try {
      const dataset = await task.run();
      datasets.push(dataset);
      summary.externalCalls.push(task.key);
    } catch (error) {
      summary.failedCalls.push({ source: task.key, message: error.message });
      console.warn("Failed to fetch external dataset:", task.key, error.message);
    }
  }

  for (const dataset of datasets) {
    await upsertPublicData(dataset);
  }

  summary.geoRecordsStored = 0;
  summary.publicDatasetsStored = datasets.length;

  if (!datasets.length) {
    throw new Error("All external dataset fetches failed");
  }

  return summary;
}

module.exports = {
  fetchAndStorePublicData,
  EXTERNAL_ENDPOINTS,
  fetchWeatherByDateRange,
  fetchAirQualityByDateRange,
};
