const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');

// Get all available services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's saved services
router.get('/saved/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedServices');
    res.json(user.savedServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save a service for user
router.post('/save', async (req, res) => {
  try {
    const { userId, serviceId } = req.body;
    
    const user = await User.findById(userId);
    const service = await Service.findById(serviceId);
    
    if (!user || !service) {
      return res.status(404).json({ message: 'User or Service not found' });
    }
    
    if (!user.savedServices.includes(serviceId)) {
      user.savedServices.push(serviceId);
      await user.save();
      
      service.savedBy.push(userId);
      await service.save();
    }
    
    res.json({ message: 'Service saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a saved service
router.delete('/remove', async (req, res) => {
  try {
    const { userId, serviceId } = req.body;
    
    const user = await User.findById(userId);
    const service = await Service.findById(serviceId);
    
    if (!user || !service) {
      return res.status(404).json({ message: 'User or Service not found' });
    }
    
    user.savedServices = user.savedServices.filter(id => id.toString() !== serviceId);
    await user.save();
    
    service.savedBy = service.savedBy.filter(id => id.toString() !== userId);
    await service.save();
    
    res.json({ message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new service (admin)
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get missing prerequisites warnings for user
router.get('/warnings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedServices');
    const warnings = [];
    
    user.savedServices.forEach(service => {
      service.prerequisites.forEach(prereq => {
        warnings.push({
          type: 'Warning',
          message: `Missing prerequisite: ${prereq} for ${service.name}`,
          serviceName: service.name
        });
      });
      
      service.documentsRequired.forEach(doc => {
        warnings.push({
          type: 'Alert',
          message: `Missing document: ${doc} for ${service.name}`,
          serviceName: service.name
        });
      });
    });
    
    res.json(warnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
