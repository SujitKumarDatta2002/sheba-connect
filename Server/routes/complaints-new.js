const express = require('express');
const router = express.Router();
const { mockComplaints } = require('../mock-data');

// Get all complaints for a user
router.get('/user/:userId', (req, res) => {
  console.log('GET /api/complaints/user/:userId - returning complaints');
  res.json(mockComplaints);
});

// Create a new complaint
router.post('/', (req, res) => {
  console.log('POST /api/complaints - creating complaint');
  const newComplaint = {
    _id: '60f7b3b3b3b3b3b3b3b3b' + Date.now(),
    user: req.body.user,
    subject: req.body.subject,
    description: req.body.description,
    status: 'Pending',
    priority: req.body.priority || 'Medium',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  res.status(201).json(newComplaint);
});

// Update complaint status
router.patch('/:id', (req, res) => {
  console.log('PATCH /api/complaints/:id - updating complaint');
  const updatedComplaint = {
    ...req.body,
    updatedAt: new Date()
  };
  res.json(updatedComplaint);
});

// Delete a complaint
router.delete('/:id', (req, res) => {
  console.log('DELETE /api/complaints/:id - deleting complaint');
  res.json({ message: 'Complaint deleted successfully' });
});

// Get complaint by ID
router.get('/:id', (req, res) => {
  console.log('GET /api/complaints/:id - getting complaint');
  const complaint = mockComplaints.find(c => c._id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  res.json(complaint);
});

module.exports = router;
