const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');
const Survey = require('../models/Survey');
const Service = require('../models/Service');
const Helpline = require('../models/Helpline');
const Appointment = require('../models/Appointment');

// Admin routes - auth must come before admin check
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
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      processingComplaints
    ] = await Promise.all([
      User.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Solution.countDocuments({ status: 'Pending' }),
      UserDocument.countDocuments(),
      UserDocument.countDocuments({ status: 'Verified' }),
      UserDocument.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Processing' })
    ]);

    // Get complaints with unreviewed edits
    const complaintsWithUnreviewedEdits = await Complaint.countDocuments({
      'editHistory.reviewedByAdmin': false
    });

    res.json({
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      processingComplaints,
      pendingSolutions,
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      unreviewedEdits: complaintsWithUnreviewedEdits
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

    await Promise.all([
      Complaint.deleteMany({ userId: req.params.id }),
      UserDocument.deleteMany({ userId: req.params.id }),
      Solution.deleteMany({ userId: req.params.id }),
      Survey.deleteMany({ userId: req.params.id })
    ]);

    res.json({ message: 'User deleted successfully' });
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

// Get complaints with unreviewed edits (new section)
router.get('/complaints/unreviewed-edits', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      'editHistory.reviewedByAdmin': false
    })
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints with unreviewed edits:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single complaint (admin view)
router.get('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone nid address')
      .populate('adminFeedback.askedBy', 'name')
      .populate('adminFeedback.response.respondedBy', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status
router.put('/complaints/:id/status', async (req, res) => {
  try {
    console.log('Status Update Request:', { id: req.params.id, body: req.body });
    
    const { status, comment } = req.body;
    
    // Validate status value
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (!['Pending', 'Processing', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}. Must be Pending, Processing, or Resolved.` });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Ensure timeline array exists
    if (!Array.isArray(complaint.timeline)) {
      complaint.timeline = [];
    }

    // Update status and add timeline entry
    complaint.status = status;
    complaint.timeline.push({
      status,
      comment: comment || `Status updated to ${status} by admin`,
      updatedBy: 'Admin',
      date: new Date()
    });

    // Save the complaint - this will trigger the pre-save hook
    const updatedComplaint = await complaint.save();
    
    console.log('Status updated successfully:', updatedComplaint._id);
    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ 
      message: error.message, 
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Mark edit as reviewed
router.put('/complaints/:id/edits/:editId/review', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const edit = complaint.editHistory?.id(req.params.editId);
    if (!edit) {
      return res.status(404).json({ message: 'Edit history not found' });
    }
    
    edit.reviewedByAdmin = true;
    await complaint.save();
    
    res.json({ message: 'Edit marked as reviewed' });
  } catch (error) {
    console.error('Error reviewing edit:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all documents
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
    const { status } = req.body;
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

// Get pending solutions
router.get('/solutions/pending', async (req, res) => {
  try {
    const solutions = await Solution.find({ status: 'Pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });
    res.json(solutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
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

// Service Management
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helpline Management
router.get('/helplines', async (req, res) => {
  try {
    const helplines = await Helpline.find().sort({ 
      isEmergency: -1,
      available24x7: -1,
      name: 1 
    });
    res.json(helplines);
  } catch (error) {
    console.error('Error fetching helplines:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/helplines', async (req, res) => {
  try {
    const helpline = new Helpline(req.body);
    await helpline.save();
    res.status(201).json(helpline);
  } catch (error) {
    console.error('Error creating helpline:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/helplines/:id', async (req, res) => {
  try {
    const helpline = await Helpline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!helpline) {
      return res.status(404).json({ message: 'Helpline not found' });
    }
    res.json(helpline);
  } catch (error) {
    console.error('Error updating helpline:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/helplines/:id', async (req, res) => {
  try {
    const helpline = await Helpline.findByIdAndDelete(req.params.id);
    if (!helpline) {
      return res.status(404).json({ message: 'Helpline not found' });
    }
    res.json({ message: 'Helpline deleted successfully' });
  } catch (error) {
    console.error('Error deleting helpline:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// APPOINTMENT MANAGEMENT ROUTES
// ============================================

// Create new appointment (admin initiates meeting request)
router.post('/appointments', async (req, res) => {
  try {
    const { complaintId, userId, appointmentDate, appointmentTime, location, purpose } = req.body;
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const appointment = new Appointment({
      complaintId,
      userId,
      adminId: req.user.userId,
      appointmentDate,
      appointmentTime,
      location,
      purpose
    });

    await appointment.save();
    await appointment.populate(['userId', 'adminId', 'complaintId']);

    res.status(201).json({
      message: 'Appointment scheduled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email phone')
      .populate('adminId', 'name email')
      .populate('complaintId', 'complaintNumber description')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get complaints with scheduled appointments
router.get('/appointments/complaints/scheduled', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: { $in: ['Scheduled', 'Rescheduled'] }
    })
      .populate('userId', 'name email phone')
      .populate('complaintId')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching scheduled appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single appointment
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('adminId', 'name email')
      .populate('complaintId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update appointment (admin edits details)
router.put('/appointments/:id', async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, location, purpose, notes, outcome, followUpRequired, followUpNotes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        appointmentDate,
        appointmentTime,
        location,
        purpose,
        notes,
        outcome,
        followUpRequired,
        followUpNotes
      },
      { new: true, runValidators: true }
    ).populate(['userId', 'adminId', 'complaintId']);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Mark appointment as completed
router.put('/appointments/:id/complete', async (req, res) => {
  try {
    const { outcome, followUpRequired, followUpNotes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        outcome: outcome || appointment.outcome,
        followUpRequired: followUpRequired || false,
        followUpNotes: followUpNotes || ''
      },
      { new: true }
    ).populate(['userId', 'adminId', 'complaintId']);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment marked as completed',
      appointment
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Cancel appointment
router.put('/appointments/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    ).populate(['userId', 'adminId', 'complaintId']);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment cancelled',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// ADMIN FEEDBACK ROUTES
// ============================================

// Add feedback to complaint
router.post('/complaints/:id/feedback', async (req, res) => {
  try {
    const { message, isQuestion, requiresResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.adminFeedback.push({
      message,
      askedBy: req.user.userId,
      isQuestion: isQuestion || false,
      requiresResponse: requiresResponse || false,
      askedAt: new Date()
    });

    await complaint.save();
    res.json({
      message: 'Feedback added successfully',
      complaint
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

// Respond to admin feedback
router.post('/complaints/:id/feedback/:feedbackId/respond', async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const feedback = complaint.adminFeedback.id(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.response = {
      text,
      respondedBy: req.user.userId,
      respondedAt: new Date()
    };

    await complaint.save();
    res.json({
      message: 'Response added successfully',
      complaint
    });
  } catch (error) {
    console.error('Error responding to feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get pending feedbacks
router.get('/complaints/feedback/pending', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      'adminFeedback.requiresResponse': true,
      'adminFeedback.response': { $exists: false }
    })
      .populate('userId', 'name email')
      .select('complaintNumber description adminFeedback')
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Error fetching pending feedbacks:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;