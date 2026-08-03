const express = require('express');
const router = express.Router();
const { mockServices, mockWarnings } = require('../mock-data');

// Get all available services
router.get('/', (req, res) => {
  console.log('GET /api/services - returning mock data');
  res.json(mockServices);
});

// Get user's saved services
router.get('/saved/:userId', (req, res) => {
  console.log('GET /api/services/saved/:userId - returning saved services');
  const savedServices = mockServices.slice(0, 3);
  res.json(savedServices);
});

// Save a service for user
router.post('/save', (req, res) => {
  console.log('POST /api/services/save - saving service');
  res.json({ message: 'Service saved successfully' });
});

// Remove a saved service
router.delete('/remove', (req, res) => {
  console.log('DELETE /api/services/remove - removing service');
  res.json({ message: 'Service removed successfully' });
});

// Get missing prerequisites warnings
router.get('/warnings/:userId', (req, res) => {
  console.log('GET /api/services/warnings/:userId - returning warnings');
  res.json(mockWarnings);
});

// Create a new service (admin)
router.post('/', (req, res) => {
  console.log('POST /api/services - creating service');
  const newService = req.body;
  res.status(201).json(newService);
});

module.exports = router;
