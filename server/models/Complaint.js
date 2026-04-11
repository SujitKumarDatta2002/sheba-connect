
// const mongoose = require("mongoose");

// const complaintSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     // Citizen Information
//     citizenName: {
//       type: String,
//       required: true
//     },

//     citizenId: {
//       type: String,
//       required: true
//     },

//     contactNumber: {
//       type: String,
//       required: true
//     },

//     email: {
//       type: String
//     },

//     address: {
//       type: String
//     },

//     // Complaint Details
//     department: {
//       type: String,
//       required: true
//     },

//     issueKeyword: {
//       type: String,
//       required: true
//     },

//     description: {
//       type: String,
//       required: true
//     },

//     priority: {
//       type: String,
//       enum: ["low", "medium", "high"],
//       default: "medium"
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Processing", "Resolved"],
//       default: "Pending"
//     },

//     complaintNumber: {
//       type: String,
//       unique: true,
//       sparse: true
//     },

//     timeline: [
//       {
//         status: String,
//         comment: String,
//         updatedBy: String,
//         date: {
//           type: Date,
//           default: Date.now
//         }
//       }
//     ]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Complaint", complaintSchema);

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    citizenName: {
      type: String,
      required: true
    },
    citizenId: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      required: true
    },
    issueKeyword: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Resolved"],
      default: "Pending"
    },
    complaintNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    formalTemplate: {
      type: String,
      default: ""
    },
    timeline: [
      {
        status: String,
        comment: String,
        updatedBy: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    surveySubmitted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Generate complaint number before saving
complaintSchema.pre('save', async function(next) {
  try {
    if (!this.complaintNumber) {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.complaintNumber = `CMP${year}${month}${day}${random}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);