const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Get all complaints for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new complaint
router.post('/', async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    const newComplaint = await complaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update complaint status
router.patch('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    if (req.body.status) {
      complaint.status = req.body.status;
    }
    if (req.body.priority) {
      complaint.priority = req.body.priority;
    }
    
    complaint.updatedAt = Date.now();
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    await complaint.remove();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
