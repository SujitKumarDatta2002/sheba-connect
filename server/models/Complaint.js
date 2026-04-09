
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Citizen Information
    citizenName: {
      type: String,
      required: true
    },

    citizenId: {
      type: String,
      required: true
    },

    contactNumber: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    address: {
      type: String
    },

    // Complaint Details
    department: {
      type: String,
      required: true
    },

    issueKeyword: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Resolved"],
      default: "Pending"
    },

    complaintNumber: {
      type: String,
      unique: true,
      sparse: true
    },

    timeline: [
      {
        status: String,
        comment: String,
        updatedBy: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);