const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Helpline = require('../models/Helpline');

// Get all services with filters
router.get('/services', async (req, res) => {
  try {
    const { department, urgency, minCost, maxCost, processingTime, requiredDocuments, search } = req.query;
    
    let query = { isActive: true }; // Only show active services to users

    if (department) query.department = department;
    if (urgency) query.urgency = urgency;
    
    if (minCost || maxCost) {
      query.cost = {};
      if (minCost) query.cost.$gte = parseInt(minCost);
      if (maxCost) query.cost.$lte = parseInt(maxCost);
    }
    
    if (processingTime) query.processingTime = processingTime;
    
    if (requiredDocuments) {
      const docs = requiredDocuments.split(',');
      query.requiredDocuments = { $in: docs };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single service by ID
router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isActive: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all helplines with filters
router.get('/helplines', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const helplines = await Helpline.find(query).sort({ 
      isEmergency: -1,
      available24x7: -1,
      name: 1 
    });
    res.json(helplines);
  } catch (error) {
    console.error('Error fetching helplines:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get emergency helplines
router.get('/helplines/emergency', async (req, res) => {
  try {
    const helplines = await Helpline.find({ isEmergency: true }).sort({ name: 1 });
    res.json(helplines);
  } catch (error) {
    console.error('Error fetching emergency helplines:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get helplines by category
router.get('/helplines/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const helplines = await Helpline.find({ category }).sort({ name: 1 });
    res.json(helplines);
  } catch (error) {
    console.error('Error fetching helplines by category:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;