const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');
const Service = require('../models/Service');
const ServiceFeedback = require('../models/ServiceFeedback');

const router = express.Router();
const allowedTags = ['⚡ Quick Service', '👨‍💼 Helpful Staff', '😐 Average Experience', '⏳ Long Waiting Time', '👎 Poor Service'];

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, rating, tags = [], comment = '', office } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) return res.status(400).json({ message: 'A valid service ID is required.' });
    if (rating !== undefined && rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5.' });
    if (!Array.isArray(tags) || tags.some((tag) => !allowedTags.includes(tag))) return res.status(400).json({ message: 'One or more feedback tags are invalid.' });
    if (typeof comment !== 'string' || comment.length > 2000) return res.status(400).json({ message: 'Comment must be 2,000 characters or fewer.' });
    if (office && (!['node', 'way', 'relation'].includes(office.osmType) || !office.osmId || typeof office.osmId !== 'string')) return res.status(400).json({ message: 'Office feedback must include a valid OpenStreetMap office identifier.' });
    if (!await Service.exists({ _id: serviceId })) return res.status(404).json({ message: 'Service not found.' });

    const feedback = await ServiceFeedback.create({ serviceId, userId: req.user.userId, rating: rating ?? null, tags: [...new Set(tags)], comment, office: office ? { osmType: office.osmType, osmId: office.osmId, name: office.name || '' } : undefined });
    return res.status(201).json({ message: 'Thank you for your feedback.', feedback });
  } catch (error) {
    console.error('Create service feedback error:', error);
    return res.status(500).json({ message: 'Unable to submit feedback right now.' });
  }
});

module.exports = router;
