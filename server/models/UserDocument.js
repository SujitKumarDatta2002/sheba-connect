

const mongoose = require("mongoose");

const UserDocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  documentType: {
    type: String,
    required: true
  },

  filePath: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("UserDocument", UserDocumentSchema);