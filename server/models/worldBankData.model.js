const mongoose = require("mongoose");

const worldBankDataSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "worldbank.org",
      index: true,
    },
    countryCode: {
      type: String,
      default: "BD",
      index: true,
    },
    indicatorCode: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    indicatorName: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    value: {
      type: Number,
      default: null,
    },
    unit: {
      type: String,
      default: "",
      trim: true,
    },
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

worldBankDataSchema.index({ countryCode: 1, indicatorCode: 1, year:1 }, { unique: true });

module.exports = mongoose.model("WorldBankData", worldBankDataSchema);
