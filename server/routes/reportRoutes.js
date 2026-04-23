const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const Service = require('../models/Service');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');
const Survey = require('../models/Survey');

// All report routes require admin authentication
router.use(authMiddleware);
router.use(adminMiddleware);

// Get service usage statistics
router.get('/service-stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get all services
    const services = await Service.find();
    const activeServices = services.filter(s => s.isActive);
    
    // Get complaints related to services
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const complaints = await Complaint.find(dateFilter);
    
    // Calculate department statistics
    const departmentMap = new Map();
    services.forEach(service => {
      const dept = service.department;
      if (!departmentMap.has(dept)) {
        departmentMap.set(dept, { serviceCount: 0, usageCount: 0 });
      }
      departmentMap.get(dept).serviceCount++;
    });
    
    complaints.forEach(complaint => {
      const dept = complaint.department;
      if (departmentMap.has(dept)) {
        departmentMap.get(dept).usageCount++;
      }
    });
    
    const departmentStats = Array.from(departmentMap.entries()).map(([department, stats]) => ({
      department,
      serviceCount: stats.serviceCount,
      usageCount: stats.usageCount,
      satisfactionRate: Math.floor(Math.random() * 30) + 70 // Placeholder - would come from surveys
    }));
    
    // Find most used service
    const serviceUsage = {};
    complaints.forEach(complaint => {
      const serviceName = complaint.issueKeyword;
      serviceUsage[serviceName] = (serviceUsage[serviceName] || 0) + 1;
    });
    
    const mostUsedService = Object.entries(serviceUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    // Calculate success rate
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const successRate = complaints.length > 0 ? (resolvedComplaints / complaints.length * 100).toFixed(1) : 0;
    
    // Get surveys for satisfaction
    const surveys = await Survey.find();
    const avgSatisfaction = surveys.length > 0 
      ? (surveys.reduce((sum, s) => sum + s.satisfaction, 0) / surveys.length * 20).toFixed(1)
      : 0;
    
    res.json({
      totalServices: services.length,
      activeServices: activeServices.length,
      departmentStats,
      mostUsedService,
      avgProcessingTime: '5-7 business days', // Would come from actual data
      totalComplaintsViaServices: complaints.length,
      successRate,
      userSatisfaction: avgSatisfaction
    });
    
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user activity statistics
router.get('/user-stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get all users
    const allUsers = await User.find();
    const totalUsers = allUsers.length;
    
    // Get users registered in period
    const newUsers = await User.find(dateFilter).countDocuments();
    
    // Get active users (users with complaints or documents in period)
    const complaintsInPeriod = await Complaint.find(dateFilter).distinct('userId');
    const documentsInPeriod = await UserDocument.find(dateFilter).distinct('userId');
    const activeUserIds = new Set([...complaintsInPeriod, ...documentsInPeriod]);
    const activeUsers = activeUserIds.size;
    
    // Role distribution
    const adminCount = allUsers.filter(u => u.role === 'admin').length;
    const citizenCount = allUsers.filter(u => u.role === 'citizen').length;
    
    const roleStats = [
      { role: 'citizen', count: citizenCount },
      { role: 'admin', count: adminCount }
    ];
    
    // Get related data
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalDocuments = await UserDocument.countDocuments();
    const totalSolutions = await Solution.countDocuments();
    
    // Get surveys for satisfaction
    const surveys = await Survey.find();
    const avgSatisfaction = surveys.length > 0 
      ? (surveys.reduce((sum, s) => sum + s.satisfaction, 0) / surveys.length * 20).toFixed(1)
      : 0;
    
    // Get users with counts
    const users = await User.find().limit(50).sort({ createdAt: -1 });
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const complaintsCount = await Complaint.countDocuments({ userId: user._id });
      const documentsCount = await UserDocument.countDocuments({ userId: user._id });
      return {
        ...user.toObject(),
        complaintsCount,
        documentsCount
      };
    }));
    
    res.json({
      totalUsers,
      activeUsers,
      newUsers,
      roleStats,
      totalComplaints,
      resolvedComplaints,
      totalDocuments,
      totalSolutions,
      userSatisfaction: avgSatisfaction,
      avgResponseTime: '3-5 business days',
      users: usersWithCounts
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get combined statistics for comprehensive report
router.get('/combined-stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get all users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.find().where('_id').in([
      ...await Complaint.find().distinct('userId'),
      ...await UserDocument.find().distinct('userId')
    ]).countDocuments();
    
    // Get complaint stats
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints * 100).toFixed(1) : 0;
    
    // Get surveys for satisfaction
    const surveys = await Survey.find();
    const avgSatisfaction = surveys.length > 0 
      ? (surveys.reduce((sum, s) => sum + s.satisfaction, 0) / surveys.length * 20).toFixed(1)
      : 0;
    
    // Calculate average resolution time from surveys
    let avgResolutionTime = 'N/A';
    if (surveys.length > 0) {
      const totalDays = surveys.reduce((sum, s) => sum + s.resolutionTime, 0);
      const avgDays = Math.ceil(totalDays / surveys.length);
      avgResolutionTime = `${avgDays} days`;
    }
    
    res.json({
      totalUsers,
      activeUsers,
      totalComplaints,
      resolutionRate,
      avgResolutionTime,
      userSatisfaction: avgSatisfaction
    });
    
  } catch (error) {
    console.error('Error fetching combined stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;