const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  // Who submitted the solution
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Related complaint (if any)
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  },

  // Solution details
  department: {
    type: String,
    required: true
  },

  issueKeyword: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  steps: [{
    stepNumber: Number,
    description: String
  }],

  attachments: [{
    filename: String,
    filepath: String
  }],

  // Status: Pending, Approved, Rejected
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  verified: {
    type: Boolean,
    default: false
  },

  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  verifiedAt: Date,

  // Admin feedback (if rejected)
  adminFeedback: String,

  // Helpfulness stats
  helpfulCount: {
    type: Number,
    default: 0
  },

  notHelpfulCount: {
    type: Number,
    default: 0
  },

  // Tags for searching
  tags: [String],

  // Visibility (before verification)
  isVisible: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search
solutionSchema.index({ department: 1, issueKeyword: 1, tags: 1 });
solutionSchema.index({ status: 1, isVisible: 1 });

module.exports = mongoose.model("Solution", solutionSchema);