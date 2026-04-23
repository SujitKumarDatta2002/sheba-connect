const mongoose = require("mongoose");

const geoDataSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    division: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    district: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    upazila: {
      type: String,
      default: "",
      trim: true,
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

geoDataSchema.index(
  { source: 1, division: 1, district: 1, upazila: 1 },
  { unique: true, partialFilterExpression: { district: { $exists: true } } }
);

module.exports = mongoose.model("GeoData", geoDataSchema);
