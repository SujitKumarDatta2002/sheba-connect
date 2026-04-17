const mongoose = require('mongoose');

const serviceApplicationSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    requiredDocuments: [{
      type: String,
      enum: ['nid', 'birthCertificate', 'passport', 'drivingLicense', 'tin', 'citizenship', 'educationalCertificate']
    }],
    submittedDocuments: [{
      type: String,
      enum: ['nid', 'birthCertificate', 'passport', 'drivingLicense', 'tin', 'citizenship', 'educationalCertificate']
    }],
    additionalInfo: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'requires_additional_info'],
      default: 'submitted'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date
    },
    processedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceApplication', serviceApplicationSchema);
