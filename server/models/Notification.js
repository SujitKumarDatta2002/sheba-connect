// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     message: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     isRead: {
//       type: Boolean,
//       default: false
//     },
//     category: {
//       type: String,
//       enum: ["APPLICATION", "DEADLINE", "DOCUMENT", "APPOINTMENT"],
//       default: "APPLICATION"
//     }
//   },
//   { timestamps: true }
// );

// notificationSchema.index({ userId: 1, isRead: 1 });
// notificationSchema.index({ userId: 1, createdAt: -1 });

// module.exports = mongoose.model("Notification", notificationSchema);

// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["GENERAL", "COMPLAINT", "APPOINTMENT", "DOCUMENT", "APPLICATION", "DEADLINE"],
      default: "GENERAL",
    },
    // 🔹 NEW: type to differentiate notifications
    type: {
      type: String,
      enum: ["feedback", "appointment", "consultation"],
      default: "appointment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Consultation-specific fields
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    serviceName: {
      type: String,
      default: "",
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
    },
    // Feedback-specific fields
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
    feedbackIndex: {
      type: Number,
    },
    requiresResponse: {
      type: Boolean,
      default: false,
    },
    // Appointment-specific
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
    },
    userResponseStatus: {
      type: String,
    },
    rescheduleRequests: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);