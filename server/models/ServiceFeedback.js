const mongoose = require('mongoose');

const serviceFeedbackSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    tags: {
      type: [{
        type: String,
        enum: ['⚡ Quick Service', '👨‍💼 Helpful Staff', '😐 Average Experience', '⏳ Long Waiting Time', '👎 Poor Service']
      }],
      default: []
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceFeedback', serviceFeedbackSchema);
