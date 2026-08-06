const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    
    requestType: {
      type: String,
      enum: ["appointment", "consultation"],
      default: "appointment"
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null
    },

    serviceName: {
      type: String,
      default: ""
    },

    consultationReason: {
      type: String,
      default: ""
    },

    alternateEmail: {
      type: String,
      default: ""
    },

    meetingLink: {
      type: String,
      default: ""
    },
    
    // Appointment details
    appointmentDate: {
      type: Date,
      required: true
    },
    
    appointmentTime: {
      type: String,
      required: true
    },
    
    location: {
      type: String,
      default: "Online video consultation"
    },
    
    purpose: {
      type: String,
      default: "Discussion on complaint resolution"
    },
    
    // Status tracking
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Pending"
    },
    
    // User response
    userResponse: {
      status: {
        type: String,
        enum: ["Accepted", "Declined", "Requested Reschedule"],
        default: null
      },
      respondedAt: Date,
      reason: String
    },

    // Read status for user
    isRead: {
      type: Boolean,
      default: false
    },

    // Reschedule requests
    rescheduleRequests: [{
      requestedAt: {
        type: Date,
        default: Date.now
      },
      proposedDate: Date,
      proposedTime: String,
      proposedLocation: String,
      reason: String,
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
      },
      adminResponse: String,
      respondedAt: Date
    }],
    
    // Meeting notes
    notes: {
      type: String,
      default: ""
    },
    
    // Outcome
    outcome: {
      type: String,
      default: ""
    },
    
    // Follow-up
    followUpRequired: {
      type: Boolean,
      default: false
    },
    
    followUpNotes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
