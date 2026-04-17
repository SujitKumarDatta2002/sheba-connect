

// const mongoose = require("mongoose");

// const complaintSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

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
//       type: String,
//       default: ""
//     },

//     address: {
//       type: String,
//       default: ""
//     },

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
//       unique: true
//     },

//     formalTemplate: {
//       type: String,
//       default: ""
//     },

//     timeline: {
//       type: [{
//         status: String,
//         comment: String,
//         updatedBy: String,
//         date: {
//           type: Date,
//           default: Date.now
//         }
//       }],
//       default: []
//     },
    
//     // Edit history tracking
//     editHistory: [{
//       editedAt: {
//         type: Date,
//         default: Date.now
//       },
//       previousDescription: String,
//       newDescription: String,
//       previousTemplate: String,
//       newTemplate: String,
//       editReason: String,
//       statusAtEdit: String,
//       reviewedByAdmin: {
//         type: Boolean,
//         default: false
//       }
//     }],
    
//     // Admin feedback
//     adminFeedback: [{
//       message: String,
//       askedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       },
//       askedAt: {
//         type: Date,
//         default: Date.now
//       },
//       isQuestion: {
//         type: Boolean,
//         default: false
//       },
//       requiresResponse: {
//         type: Boolean,
//         default: false
//       },
//       response: {
//         text: String,
//         respondedAt: Date,
//         respondedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User"
//         }
//       }
//     }]
//   },
//   { 
//     timestamps: true 
//   }
// );

// module.exports = mongoose.model("Complaint", complaintSchema);
// const mongoose = require("mongoose");

// const complaintSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
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
//       type: String,
//       default: ""
//     },
//     address: {
//       type: String,
//       default: ""
//     },
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
//       sparse: true  // Add sparse: true to allow null values
//     },
//     formalTemplate: {
//       type: String,
//       default: ""
//     },
//     timeline: {
//       type: [{
//         status: String,
//         comment: String,
//         updatedBy: String,
//         date: {
//           type: Date,
//           default: Date.now
//         }
//       }],
//       default: []
//     },
//     editHistory: [{
//       editedAt: {
//         type: Date,
//         default: Date.now
//       },
//       previousDescription: String,
//       newDescription: String,
//       previousTemplate: String,
//       newTemplate: String,
//       editReason: String,
//       statusAtEdit: String,
//       reviewedByAdmin: {
//         type: Boolean,
//         default: false
//       }
//     }],
//     adminFeedback: [{
//       message: String,
//       askedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       },
//       askedAt: {
//         type: Date,
//         default: Date.now
//       },
//       isQuestion: {
//         type: Boolean,
//         default: false
//       },
//       requiresResponse: {
//         type: Boolean,
//         default: false
//       },
//       response: {
//         text: String,
//         respondedAt: Date,
//         respondedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User"
//         }
//       }
//     }]
//   },
//   { 
//     timestamps: true 
//   }
// );

// // Generate complaint number before saving
// complaintSchema.pre('save', async function(next) {
//   try {
//     // Only generate if complaintNumber doesn't exist
//     if (!this.complaintNumber) {
//       const now = new Date();
//       const year = now.getFullYear().toString().slice(-2);
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
//       const day = now.getDate().toString().padStart(2, '0');
//       const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       this.complaintNumber = `CMP${year}${month}${day}${random}`;
      
//       // Verify uniqueness (in case of collision)
//       const existing = await this.constructor.findOne({ complaintNumber: this.complaintNumber });
//       if (existing) {
//         // Recursive retry with new random number
//         return this.save();
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

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
      unique: true
    },
    formalTemplate: {
      type: String,
      default: ""
    },
    timeline: {
      type: [{
        status: String,
        comment: String,
        updatedBy: String,
        date: {
          type: Date,
          default: Date.now
        }
      }],
      default: []
    },
    editHistory: [{
      editedAt: {
        type: Date,
        default: Date.now
      },
      previousDescription: String,
      newDescription: String,
      previousTemplate: String,
      newTemplate: String,
      editReason: String,
      statusAtEdit: String,
      reviewedByAdmin: {
        type: Boolean,
        default: false
      }
    }],
    adminFeedback: [{
      message: String,
      askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      askedAt: {
        type: Date,
        default: Date.now
      },
      isQuestion: {
        type: Boolean,
        default: false
      },
      requiresResponse: {
        type: Boolean,
        default: false
      },
      response: {
        text: String,
        respondedAt: Date,
        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      }
    }]
  },
  { 
    timestamps: true 
  }
);

// NO pre-save hook - generate complaint number in the route instead

module.exports = mongoose.model("Complaint", complaintSchema);