const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');

// Get user's personal statistics
router.get('/my-stats', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get user's complaints
    const complaints = await Complaint.find({ 
      userId,
      ...dateFilter
    }).sort({ createdAt: -1 }).limit(10);
    
    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    
    // Calculate resolution rate
    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;
    
    // Get user's documents
    const documents = await UserDocument.find({ 
      userId,
      ...dateFilter
    }).sort({ uploadedAt: -1 }).limit(10);
    
    const totalDocuments = documents.length;
    
    // Get user's solutions
    const solutions = await Solution.find({ 
      userId,
      ...dateFilter
    });
    
    const totalSolutions = solutions.length;
    
    // Calculate average resolution time from surveys (if available)
    let avgResolutionTime = 'N/A';
    // You can add survey model to calculate this
    
    res.json({
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      resolutionRate,
      totalDocuments,
      totalSolutions,
      avgResolutionTime,
      recentComplaints: complaints,
      recentDocuments: documents
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;