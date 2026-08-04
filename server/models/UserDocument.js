

// models/UserDocument.js
// Stores metadata for each document a user uploads.
// The actual file binary lives in MongoDB GridFS (uploads.files / uploads.chunks).
// gridFSFileId is the link between this record and the file in GridFS.

const mongoose = require('mongoose');

const userDocumentSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this document
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Type of government document (must match one of the allowed values)
    documentType: {
      type:     String,
      required: true,
      enum: [
        'passport',
        'nid',
        'birthCertificate',
        'tin',
        'drivingLicense',
        'citizenship',
        'educationalCertificate',
      ],
    },

    // Original filename as uploaded by the user
    fileName: {
      type:     String,
      required: true,
    },

    // File size in bytes
    fileSize: {
      type: Number,
    },

    // ObjectId pointing to the file stored in GridFS (uploads.files collection)
    // This replaces the old local filePath field
    gridFSFileId: {
      type:     mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Admin verification status
    status: {
      type:    String,
      enum:    ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },

    uploadedAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enforce one document per type per user
userDocumentSchema.index({ userId: 1, documentType: 1 }, { unique: true });

module.exports = mongoose.model('UserDocument', userDocumentSchema);