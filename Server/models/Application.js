const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING_ADMIN_REVIEW", "AWAITING_USER_DOCS", "COMPLETED", "REJECTED"],
      default: "PENDING_ADMIN_REVIEW"
    },
    requestedFields: {
      type: [String],
      default: []
    },
    deadlines: {
      applicationDate: {
        type: Date,
        default: null
      },
      documentDate: {
        type: Date,
        default: null
      },
      appointmentDate: {
        type: Date,
        default: null
      }
    }
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);