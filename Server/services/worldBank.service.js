const axios = require("axios");
const WorldBankData = require("../models/worldBankData.model");
const PublicData = require("../models/publicData.model");

const WORLD_BANK_INDICATORS = [
  {
    code: "SP.POP.TOTL",
    name: "Population",
    category: "demographics",
    unit: "people",
  },
  {
    code: "NY.GDP.MKTP.CD",
    name: "GDP (current US$)",
    category: "economy",
    unit: "USD",
  },
  {
    code: "FP.CPI.TOTL.ZG",
    name: "Inflation, consumer prices (annual %)",
    category: "economy",
    unit: "%",
  },
  {
    code: "SL.UEM.TOTL.ZS",
    name: "Unemployment, total (% of labor force)",
    category: "economy",
    unit: "%",
  },
];

function toRows(apiRows, indicator) {
  return (Array.isArray(apiRows) ? apiRows : [])
    .filter((row) => row && row.value !== null)
    .map((row) => ({
      source: "worldbank.org",
      countryCode: "BD",
      indicatorCode: indicator.code,
      indicatorName: indicator.name,
      year: Number(row.date),
      value: Number(row.value),
      unit: indicator.unit,
      rawData: row,
      lastUpdated: new Date(),
    }))
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.value))
    .sort((a, b) => a.year - b.year);
}

async function fetchIndicator(indicator) {
  const url = `https://api.worldbank.org/v2/country/BD/indicator/${indicator.code}?format=json&per_page=200`;
  const response = await axios.get(url, { timeout: 25000 });
  return {
    url,
    rows: toRows(response.data?.[1], indicator),
    indicator,
    rawData: response.data,
  };
}

async function upsertWorldBankRows(rows) {
  if (!rows.length) return;

  const operations = rows.map((row) => ({
    updateOne: {
      filter: {
        countryCode: row.countryCode,
        indicatorCode: row.indicatorCode,
        year: row.year,
      },
      update: {
        $set: row,
      },
      upsert: true,
    },
  }));

  await WorldBankData.bulkWrite(operations, { ordered: false });
}

async function upsertPublicMirror(indicator, rawData, rows) {
  await PublicData.updateOne(
    { source: "worldbank.org", datasetKey: `worldbank-${indicator.code.toLowerCase()}` },
    {
      $set: {
        source: "worldbank.org",
        category: indicator.category,
        datasetKey: `worldbank-${indicator.code.toLowerCase()}`,
        rawData,
        processedData: rows,
        recordsCount: rows.length,
        lastUpdated: new Date(),
      },
    },
    { upsert: true }
  );
}

async function fetchAndStoreWorldBankData() {
  const summary = {
    source: "worldbank.org",
    fetched: 0,
    storedRows: 0,
    datasetKeys: [],
  };

  for (const indicator of WORLD_BANK_INDICATORS) {
    const { url, rows, rawData } = await fetchIndicator(indicator);
    await upsertWorldBankRows(rows);
    await upsertPublicMirror(indicator, rawData, rows);

    summary.fetched += 1;
    summary.storedRows += rows.length;
    summary.datasetKeys.push(`worldbank-${indicator.code.toLowerCase()}`);
    console.log("Fetched World Bank data", url);
  }

  return summary;
}

module.exports = {
  WORLD_BANK_INDICATORS,
  fetchAndStoreWorldBankData,
};
