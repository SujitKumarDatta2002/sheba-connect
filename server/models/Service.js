
// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   department: {
//     type: String,
//     required: true,
//     enum: [
//       'Passport Office',
//       'Electricity',
//       'Road Maintenance',
//       'Waste Management',
//       'Health Services',
//       'Education',
//       'Revenue',
//       'Municipal Services',
//       'Police',
//       'Fire Service',
//       'Ambulance'
//     ]
//   },
//   requiredDocuments: [{
//     type: String,
//     enum: ['nid', 'birthCertificate', 'passport', 'drivingLicense', 'tin', 'citizenship', 'educationalCertificate']
//   }],
//   eligibilityCriteria: {
//     type: String,
//     required: true
//   },
//   cost: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   processingTime: {
//     type: String, // e.g., "3-5 working days"
//     required: true
//   },
//   urgency: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'emergency'],
//     default: 'medium'
//   },
//   helpline: {
//     type: String,
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Service', serviceSchema);










// server/models/Service.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Passport Office',
        'Electricity',
        'Road Maintenance',
        'Waste Management',
        'Health Services',
        'Education',
        'Revenue',
        'Municipal Services',
        'Police',
        'Fire Service',
        'Ambulance'
      ]
    },
    requiredDocuments: [
      {
        type: String,
        enum: [
          'nid',
          'birthCertificate',
          'passport',
          'drivingLicense',
          'tin',
          'citizenship',
          'educationalCertificate'
        ]
      }
    ],
    eligibilityCriteria: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    processingTime: {
      type: String, // e.g., "3-5 working days"
      required: true
    },
    processSteps: {
      type: String,
      default: ''
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium'
    },
    helpline: {
      type: String, // phone number
      required: true
    },
    // New fields
    location: {
      type: String, // e.g., "Dhaka, Agargaon"
      default: ''
    },
    website: {
      type: String, // official website URL
      default: ''
    },
    email: {
      type: String, // contact email
      default: ''
    },
    mapUrl: {
      type: String, // Google Maps link
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
