const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "open-meteo",
      index: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    temperature: {
      type: Number,
      default: null,
    },
    rainfall: {
      type: Number,
      default: null,
    },
    dataType: {
      type: String,
      enum: ["historical", "forecast"],
      default: "historical",
      index: true,
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

weatherDataSchema.index({ location: 1, date: 1, dataType: 1 }, { unique: true });

module.exports = mongoose.model("WeatherData", weatherDataSchema);
