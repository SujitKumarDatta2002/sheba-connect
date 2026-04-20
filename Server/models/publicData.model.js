const mongoose = require("mongoose");

const publicDataSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    datasetKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    processedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    recordsCount: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

publicDataSchema.index({ source: 1, datasetKey: 1 }, { unique: true });

module.exports = mongoose.model("PublicData", publicDataSchema);
