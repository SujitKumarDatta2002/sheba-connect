const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');
const Survey = require('../models/Survey');

// All routes require admin authentication
router.use(authMiddleware);
router.use(adminMiddleware);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      pendingSolutions,
      totalDocuments
    ] = await Promise.all([
      User.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Solution.countDocuments({ status: 'Pending' }),
      UserDocument.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      pendingSolutions,
      totalDocuments
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete user's complaints, documents, etc.
    await Promise.all([
      Complaint.deleteMany({ userId: req.params.id }),
      UserDocument.deleteMany({ userId: req.params.id }),
      Solution.deleteMany({ userId: req.params.id }),
      Survey.deleteMany({ userId: req.params.id })
    ]);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints (admin view)
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status (admin)
router.put('/complaints/:id/status', async (req, res) => {
  try {
    const { status, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      comment: comment || `Status updated to ${status} by admin`,
      updatedBy: 'Admin',
      date: new Date()
    });

    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all documents (admin view)
router.get('/documents', async (req, res) => {
  try {
    const documents = await UserDocument.find()
      .populate('userId', 'name email')
      .sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify document
router.put('/documents/:id/verify', async (req, res) => {
  try {
    const { status } = req.body; // "Verified" or "Rejected"
    const document = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all pending solutions
router.get('/solutions/pending', async (req, res) => {
  try {
    const solutions = await Solution.find({ status: 'Pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });
    res.json(solutions);
  } catch (error) {
    console.error('Error fetching pending solutions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify solution
router.put('/solutions/:id/verify', async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    solution.status = status;
    solution.verified = status === 'Approved';
    solution.verifiedBy = req.user.userId;
    solution.verifiedAt = new Date();
    solution.isVisible = status === 'Approved';
    
    if (adminFeedback) {
      solution.adminFeedback = adminFeedback;
    }

    await solution.save();

    res.json(solution);
  } catch (error) {
    console.error('Error verifying solution:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get system logs (optional)
router.get('/logs', async (req, res) => {
  try {
    // Implement log fetching if you have logging
    res.json({ message: 'Logs feature coming soon' });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;