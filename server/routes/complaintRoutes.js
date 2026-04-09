const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const requiredFields = [
      'userId', 
      'citizenName', 
      'citizenId', 
      'contactNumber', 
      'department', 
      'issueKeyword', 
      'description'
    ];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `Missing required field: ${field}` 
        });
      }
    }

    const timeline = [
      {
        status: "Pending",
        comment: "Complaint submitted successfully",
        updatedBy: req.body.citizenName || "Citizen",
        date: new Date()
      }
    ];

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const complaintNumber = `CMP${year}${month}${random}`;

    const complaintData = {
      userId: req.body.userId,
      citizenName: req.body.citizenName,
      citizenId: req.body.citizenId,
      contactNumber: req.body.contactNumber,
      email: req.body.email || "",
      address: req.body.address || "",
      department: req.body.department,
      issueKeyword: req.body.issueKeyword,
      description: req.body.description,
      priority: req.body.priority || "medium",
      status: "Pending",
      complaintNumber: complaintNumber,
      timeline: timeline
    };

    console.log("Creating complaint with data:", complaintData);

    const complaint = new Complaint(complaintData);
    const newComplaint = await complaint.save();
    
    const populatedComplaint = await Complaint.findById(newComplaint._id)
      .populate('userId', 'name email');
    
    console.log("Saved complaint:", populatedComplaint);
    res.status(201).json(populatedComplaint);
    
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, comment, updatedBy } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    //timeline
    complaint.timeline.push({
      status: status || complaint.status,
      comment: comment || `Status updated to ${status || complaint.status}`,
      updatedBy: updatedBy || 'Admin',
      date: new Date()
    });

    if (status) {
      complaint.status = status;
    }

    const updatedComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(updatedComplaint._id)
      .populate('userId', 'name email');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;