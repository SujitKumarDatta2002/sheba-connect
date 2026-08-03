const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  issueKeyword: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  resolveDate: {
    type: Date,
    required: true
  },
  resolutionTime: {
    type: Number, // in days
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  satisfaction: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  helpful: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
surveySchema.index({ department: 1, issueKeyword: 1 });
surveySchema.index({ tags: 1 });

module.exports = mongoose.model("Survey", surveySchema);