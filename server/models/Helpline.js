

const mongoose = require('mongoose');

const helplineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Emergency',
      'Passport',
      'Electricity',
      'Road',
      'Waste',
      'Health',
      'Education',
      'Revenue',
      'Municipal',
      'Police',
      'Fire',
      'Ambulance',
      'Women & Children',
      'Disaster Management'
    ]
  },
  numbers: [{
    type: String,
    required: true
  }],
  website: {
    type: String,
    required: false // optional
  },
  description: {
    type: String
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  available24x7: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Helpline', helplineSchema);
