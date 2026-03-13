// const mongoose = require("mongoose");

// const userDocumentSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true
//   },
//   nid: {
//     type: Boolean,
//     default: false
//   },
//   birthCertificate: {
//     type: Boolean,
//     default: false
//   },
//   passport: {
//     type: Boolean,
//     default: false
//   },
//   drivingLicense: {
//     type: Boolean,
//     default: false
//   },
//   tin: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("UserDocument", userDocumentSchema);









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