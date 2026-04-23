const PublicData = require("../models/publicData.model");
const AnalyticsInsights = require("../models/analytics.model");

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function latestFromSeries(rows) {
  if (!rows.length) return null;
  return rows[rows.length - 1];
}

async function buildInsights() {
  const docs = await PublicData.find({}).lean();

  const byKey = new Map(docs.map((doc) => [doc.datasetKey, doc]));
  const populationSeries = asArray(byKey.get("worldbank-population")?.processedData)
    .map((row) => ({ year: toNumber(row.year), value: toNumber(row.value) }))
    .filter((row) => row.year && row.value !== null)
    .sort((a, b) => a.year - b.year);

  const gdpSeries = asArray(byKey.get("worldbank-gdp")?.processedData)
    .map((row) => ({ year: toNumber(row.year), value: toNumber(row.value) }))
    .filter((row) => row.year && row.value !== null)
    .sort((a, b) => a.year - b.year);

  const inflationSeries = asArray(byKey.get("worldbank-inflation")?.processedData)
    .map((row) => ({ year: toNumber(row.year), value: toNumber(row.value) }))
    .filter((row) => row.year && row.value !== null)
    .sort((a, b) => a.year - b.year);

  const unemploymentSeries = asArray(byKey.get("worldbank-unemployment")?.processedData)
    .map((row) => ({ year: toNumber(row.year), value: toNumber(row.value) }))
    .filter((row) => row.year && row.value !== null)
    .sort((a, b) => a.year - b.year);

  const temperatureSeries = asArray(byKey.get("openmeteo-dhaka-temperature")?.processedData)
    .map((row) => ({ date: row.date, value: toNumber(row.value) }))
    .filter((row) => row.date && row.value !== null);

  const categoryMap = docs.reduce((acc, doc) => {
    const key = doc.category || "unknown";
    if (!acc[key]) {
      acc[key] = { _id: key, totalRecords: 0, avgRecords: 0, count: 0 };
    }
    acc[key].totalRecords += toNumber(doc.recordsCount) || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  const categoryBreakdown = Object.values(categoryMap)
    .map((item) => ({
      _id: item._id,
      totalRecords: item.totalRecords,
      avgRecords: item.count ? item.totalRecords / item.count : 0,
    }))
    .sort((a, b) => b.totalRecords - a.totalRecords);

  const latestPopulation = latestFromSeries(populationSeries);
  const latestGdp = latestFromSeries(gdpSeries);
  const latestInflation = latestFromSeries(inflationSeries);
  const latestUnemployment = latestFromSeries(unemploymentSeries);

  const latestIndicators = [
    latestPopulation
      ? { name: "Population", value: latestPopulation.value, year: latestPopulation.year, unit: "people" }
      : null,
    latestGdp ? { name: "GDP", value: latestGdp.value, year: latestGdp.year, unit: "USD" } : null,
    latestInflation
      ? { name: "Inflation", value: latestInflation.value, year: latestInflation.year, unit: "%" }
      : null,
    latestUnemployment
      ? { name: "Unemployment", value: latestUnemployment.value, year: latestUnemployment.year, unit: "%" }
      : null,
  ].filter(Boolean);

  const totalRecords = docs.reduce((sum, doc) => sum + (toNumber(doc.recordsCount) || 0), 0);

  const result = {
    districtUsage: [],
    categoryBreakdown,
    trends: [],
    latestIndicators,
    series: {
      population: populationSeries,
      gdp: gdpSeries,
      inflation: inflationSeries,
      unemployment: unemploymentSeries,
      temperature: temperatureSeries,
    },
    kpis: {
      datasetCount: docs.length,
      totalRecords,
    },
    generatedAt: new Date().toISOString(),
  };

  await AnalyticsInsights.create({
    type: "external-public-insights",
    result,
    createdAt: new Date(),
  });

  return result;
}

async function getLatestInsights() {
  const latest = await AnalyticsInsights.findOne({ type: "external-public-insights" })
    .sort({ createdAt: -1 })
    .lean();

  return latest?.result || null;
}

module.exports = {
  buildInsights,
  getLatestInsights,
};
