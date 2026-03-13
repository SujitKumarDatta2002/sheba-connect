const mongoose = require("mongoose");

const userDocumentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  nid: {
    type: Boolean,
    default: false
  },
  birthCertificate: {
    type: Boolean,
    default: false
  },
  passport: {
    type: Boolean,
    default: false
  },
  drivingLicense: {
    type: Boolean,
    default: false
  },
  tin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("UserDocument", userDocumentSchema);