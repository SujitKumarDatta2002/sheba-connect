const mongoose = require("mongoose");

const analyticsInsightsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

analyticsInsightsSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("AnalyticsInsights", analyticsInsightsSchema);
