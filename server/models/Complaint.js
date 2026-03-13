const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
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

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Resolved"],
      default: "Pending"
    },

    timeline: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);