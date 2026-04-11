const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
      required: true
    },
    
    purpose: {
      type: String,
      default: "Discussion on complaint resolution"
    },
    
    // Status tracking
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled"
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
    
    // Reschedule requests
    rescheduleRequests: [{
      requestedAt: {
        type: Date,
        default: Date.now
      },
      proposedDate: Date,
      proposedTime: String,
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
