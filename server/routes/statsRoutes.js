const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');

// Get system-wide statistics (public)
router.get('/system', async (req, res) => {
  try {
    const [
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalDocuments,
      totalSolutions
    ] = await Promise.all([
      User.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      UserDocument.countDocuments(),
      Solution.countDocuments()
    ]);

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    res.json({
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalDocuments,
      totalSolutions,
      resolutionRate
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get recent complaints (public)
router.get('/complaints/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('department issueKeyword status createdAt');
    
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching recent complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;