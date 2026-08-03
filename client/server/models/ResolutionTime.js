const mongoose = require("mongoose");

const resolutionTimeSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  estimatedDays: {
    type: Number,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ResolutionTime", resolutionTimeSchema);