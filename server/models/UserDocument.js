

// const mongoose = require("mongoose");

// const UserDocumentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   documentType: {
//     type: String,
//     required: true
//   },

//   filePath: {
//     type: String,
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ["Pending", "Verified", "Rejected"],
//     default: "Pending"
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// module.exports = mongoose.model("UserDocument", UserDocumentSchema);



const mongoose = require("mongoose");

const UserDocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true  // Make userId required
  },

  documentType: {
  type: String,
  required: true,
  enum: ["passport", "nid", "birthCertificate", "tin", "drivingLicense", "citizenship", "educationalCertificate"]
  },
  
  fileName: {
    type: String,
    required: true  // Store original filename
  },

  filePath: {
    type: String,
    required: true
  },

  fileSize: {
    type: Number,
    required: true  // Store file size for display
  },

  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // Add timestamps for createdAt/updatedAt

// Ensure one document per type per user
UserDocumentSchema.index({ userId: 1, documentType: 1 }, { unique: true });

module.exports = mongoose.model("UserDocument", UserDocumentSchema);