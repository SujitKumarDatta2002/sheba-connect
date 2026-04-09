const mongoose = require('mongoose');

const serviceApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    applicantName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    nid: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    documentDetails: [
      {
        documentType: {
          type: String,
          required: true
        },
        reference: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],
    adminRequestedDocuments: [
      {
        type: String,
        enum: ['nid', 'birthCertificate', 'passport', 'drivingLicense', 'tin', 'citizenship', 'educationalCertificate']
      }
    ],
    submittedRequestedDocuments: [
      {
        documentType: {
          type: String,
          required: true
        },
        reference: {
          type: String,
          required: true,
          trim: true
        },
        submittedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    documentEditRequested: {
      type: Boolean,
      default: false
    },
    documentEditPermissionGranted: {
      type: Boolean,
      default: false
    },
    additionalInfo: {
      type: String,
      default: ''
    },
    applicationDeadline: {
      type: Date,
      default: null
    },
    documentSubmissionDate: {
      type: Date,
      default: null
    },
    appointmentDate: {
      type: Date,
      default: null
    },
    reminderEnabled: {
      type: Boolean,
      default: true
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// One user can apply only once per service.
serviceApplicationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

module.exports = mongoose.model('ServiceApplication', serviceApplicationSchema);
