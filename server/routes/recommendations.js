const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');

// Get all recommendations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get personalized recommendations for a user
router.get('/personalized/:userId', async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ 
      user: req.params.userId,
      isPersonalized: true 
    }).sort({ priority: -1, createdAt: -1 });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new recommendation
router.post('/', async (req, res) => {
  try {
    const recommendation = new Recommendation(req.body);
    const newRecommendation = await recommendation.save();
    res.status(201).json(newRecommendation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a recommendation
router.patch('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    Object.assign(recommendation, req.body);
    const updatedRecommendation = await recommendation.save();
    res.json(updatedRecommendation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a recommendation
router.delete('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    await recommendation.remove();
    res.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate sample recommendations for a user
router.post('/generate/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const sampleRecommendations = [
      {
        user: userId,
        title: "Complete Your Profile",
        description: "Add more information to your profile to get personalized service recommendations",
        category: "Profile",
        priority: "High",
        isPersonalized: true
      },
      {
        user: userId,
        title: "Upload Required Documents",
        description: "Make sure all necessary documents are uploaded for your saved services",
        category: "Documents",
        priority: "Medium",
        isPersonalized: true
      },
      {
        user: userId,
        title: "New Services Available",
        description: "Check out the latest services that match your interests",
        category: "Services",
        priority: "Low",
        isPersonalized: true
      }
    ];
    
    const recommendations = await Recommendation.insertMany(sampleRecommendations);
    res.status(201).json(recommendations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
