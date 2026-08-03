const axios = require("axios");
const WeatherData = require("../models/weatherData.model");
const PublicData = require("../models/publicData.model");

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function mergeWeatherRows(dates, temps, rainfalls, dataType, location) {
  return dates
    .map((date, index) => ({
      source: "open-meteo",
      location,
      date,
      temperature: Number(temps[index]),
      rainfall: Number(rainfalls[index]),
      dataType,
      rawData: {
        date,
        temperature: temps[index],
        rainfall: rainfalls[index],
      },
      lastUpdated: new Date(),
    }))
    .filter((row) => row.date && Number.isFinite(row.temperature) && Number.isFinite(row.rainfall));
}

async function fetchHistoricalWeather({ latitude, longitude, location }) {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date();
  start.setDate(end.getDate() - 29);

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${isoDate(start)}&end_date=${isoDate(end)}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;
  const response = await axios.get(url, { timeout: 25000 });

  const rows = mergeWeatherRows(
    asArray(response.data?.daily?.time),
    asArray(response.data?.daily?.temperature_2m_mean),
    asArray(response.data?.daily?.precipitation_sum),
    "historical",
    location
  );

  return { url, rows, rawData: response.data };
}

async function fetchForecastWeather({ latitude, longitude, location }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_mean,precipitation_sum&forecast_days=7&timezone=auto`;
  const response = await axios.get(url, { timeout: 25000 });

  const rows = mergeWeatherRows(
    asArray(response.data?.daily?.time),
    asArray(response.data?.daily?.temperature_2m_mean),
    asArray(response.data?.daily?.precipitation_sum),
    "forecast",
    location
  );

  return { url, rows, rawData: response.data };
}

async function upsertWeatherRows(rows) {
  if (!rows.length) return;

  const operations = rows.map((row) => ({
    updateOne: {
      filter: {
        location: row.location,
        date: row.date,
        dataType: row.dataType,
      },
      update: { $set: row },
      upsert: true,
    },
  }));

  await WeatherData.bulkWrite(operations, { ordered: false });
}

async function upsertPublicMirror(rows) {
  await PublicData.updateOne(
    { source: "open-meteo", datasetKey: "weather-dhaka-rolling-30-7" },
    {
      $set: {
        source: "open-meteo",
        category: "climate",
        datasetKey: "weather-dhaka-rolling-30-7",
        rawData: {
          note: "rolling weather dataset: last 30 days + next 7 days",
        },
        processedData: rows,
        recordsCount: rows.length,
        lastUpdated: new Date(),
      },
    },
    { upsert: true }
  );
}

async function fetchAndStoreRollingWeatherData(config = {}) {
  const payload = {
    latitude: config.latitude || 23.8103,
    longitude: config.longitude || 90.4125,
    location: config.location || "Dhaka,BD",
  };

  const historical = await fetchHistoricalWeather(payload);
  const forecast = await fetchForecastWeather(payload);

  const rows = historical.rows.concat(forecast.rows);
  await upsertWeatherRows(rows);
  await upsertPublicMirror(rows);

  console.log("Fetched Weather data", historical.url);
  console.log("Fetched Weather data", forecast.url);

  return {
    source: "open-meteo",
    location: payload.location,
    recordsStored: rows.length,
    historicalDays: historical.rows.length,
    forecastDays: forecast.rows.length,
  };
}

module.exports = {
  fetchAndStoreRollingWeatherData,
};
