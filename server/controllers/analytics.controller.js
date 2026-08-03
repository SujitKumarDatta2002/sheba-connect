const PublicData = require("../models/publicData.model");
const GeoData = require("../models/geoData.model");
const WeatherData = require("../models/weatherData.model");
const Application = require("../models/Application");
const { normalizeDateRange, fetchGoogleCalendarEvents } = require("../services/calendar.service");
const { fetchAndStorePublicData } = require("../services/dataFetcher.service");
const { buildInsights, getLatestInsights } = require("../services/dataProcessor.service");

async function getPublicData(req, res) {
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";

  try {
    if (refresh) {
      await fetchAndStorePublicData();
    }

    const data = await PublicData.find({}).sort({ lastUpdated: -1 }).lean();

    if (!data.length) {
      const sync = await fetchAndStorePublicData();
      const afterSync = await PublicData.find({}).sort({ lastUpdated: -1 }).lean();
      return res.json({ success: true, source: "external-api", sync, data: afterSync });
    }

    return res.json({ success: true, source: "mongodb-cache", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getGeo(req, res) {
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";

  try {
    if (refresh) {
      await fetchAndStorePublicData();
    }

    const geo = await GeoData.find({}).sort({ lastUpdated: -1 }).lean();

    if (!geo.length) {
      const sync = await fetchAndStorePublicData();
      const afterSync = await GeoData.find({}).sort({ lastUpdated: -1 }).lean();
      return res.json({ success: true, source: "external-api", sync, data: afterSync });
    }

    return res.json({ success: true, source: "mongodb-cache", data: geo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getInsights(req, res) {
  const refresh = String(req.query.refresh || "false").toLowerCase() === "true";

  try {
    let insights = null;

    if (refresh) {
      const sync = await fetchAndStorePublicData();
      insights = await buildInsights();
      return res.json({ success: true, source: "external+processed", sync, data: insights });
    }

    insights = await getLatestInsights();

    if (!insights) {
      await fetchAndStorePublicData();
      insights = await buildInsights();
      return res.json({ success: true, source: "external+processed", data: insights });
    }

    return res.json({ success: true, source: "mongodb-cache", data: insights });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const { fetchWeatherByDateRange, fetchAirQualityByDateRange } = require("../services/dataFetcher.service");

async function getByDate(req, res) {
  try {
    const { start, end } = req.query;
    const dateRange = normalizeDateRange(start, end);

    // Fetch weather data from Open-Meteo dynamically for the selected date range
    const [weatherData, highFrequencyData, serviceTrends, calendarEvents] = await Promise.all([
      fetchWeatherByDateRange(dateRange.startDay, dateRange.endDay),
      fetchAirQualityByDateRange(dateRange.startDay, dateRange.endDay),
      Application.aggregate([
        {
          $match: {
            createdAt: {
              $gte: dateRange.startDate,
              $lte: dateRange.endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
              d: { $dayOfMonth: "$createdAt" },
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
      ]),
      fetchGoogleCalendarEvents(dateRange.startISO, dateRange.endISO),
    ]);

    return res.json({
      success: true,
      source: "open-meteo+google-calendar",
      dateRange: {
        start: dateRange.startDay,
        end: dateRange.endDay,
      },
      data: {
        weatherData,
        serviceTrends,
        highFrequencyData,
      },
      calendar: calendarEvents,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  getPublicData,
  getGeo,
  getInsights,
  getByDate,
};
