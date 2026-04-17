// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getProfileStatus } = require('../controllers/userController');
const Appointment = require('../models/Appointment');

// All user routes are protected
router.use(authMiddleware);

router.get('/profile/status', getProfileStatus);

// ============================================
// USER APPOINTMENT ROUTES
// ============================================

// Get user's appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .populate('adminId', 'name email phone')
      .populate('complaintId', 'complaintNumber description status')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single appointment
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    })
      .populate('adminId', 'name email phone')
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

// User respond to appointment (Accept/Decline/Request Reschedule)
router.put('/appointments/:id/respond', async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['Accepted', 'Declined', 'Requested Reschedule'].includes(status)) {
      return res.status(400).json({ message: 'Invalid response status' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.userResponse = {
      status,
      respondedAt: new Date(),
      reason: reason || ''
    };

    if (status === 'Requested Reschedule') {
      appointment.status = 'Rescheduled';
    }

    await appointment.save();

    res.json({
      message: 'Response recorded successfully',
      appointment
    });
  } catch (error) {
    console.error('Error responding to appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// User request reschedule
router.post('/appointments/:id/reschedule-request', async (req, res) => {
  try {
    const { proposedDate, proposedTime, reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!proposedDate || !proposedTime) {
      return res.status(400).json({ message: 'Proposed date and time are required' });
    }

    appointment.rescheduleRequests.push({
      proposedDate: new Date(proposedDate),
      proposedTime,
      reason: reason || 'User not available',
      status: 'Pending',
      requestedAt: new Date()
    });

    appointment.userResponse = {
      status: 'Requested Reschedule',
      respondedAt: new Date(),
      reason
    };

    appointment.status = 'Rescheduled';

    await appointment.save();

    res.json({
      message: 'Reschedule request submitted',
      appointment
    });
  } catch (error) {
    console.error('Error requesting reschedule:', error);
    res.status(400).json({ message: error.message });
  }
});

// User view reschedule requests status
router.get('/appointments/:id/reschedule-status', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).select('rescheduleRequests appointmentDate appointmentTime');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      currentAppointment: {
        date: appointment.appointmentDate,
        time: appointment.appointmentTime
      },
      rescheduleRequests: appointment.rescheduleRequests
    });
  } catch (error) {
    console.error('Error fetching reschedule status:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// USER NOTIFICATIONS/MESSAGES
// ============================================

// Get unread notification count
router.get('/notifications/unread-count', async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const userId = req.user.userId;

    // Count unread feedback messages
    const feedbackCount = await Complaint.countDocuments({
      userId: userId,
      'adminFeedback.isRead': false
    });

    // Count unread appointments (newly scheduled or with updates)
    const appointmentCount = await Appointment.countDocuments({
      userId: userId,
      isRead: false
    });

    res.json({
      feedback: feedbackCount,
      appointments: appointmentCount,
      total: feedbackCount + appointmentCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all user notifications (combined feedback and appointments)
router.get('/notifications', async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const userId = req.user.userId;

    // Get unread feedback from complaints
    const complaints = await Complaint.find({ userId: userId })
      .populate('userId', 'name email')
      .select('complaintNumber description adminFeedback createdAt')
      .sort({ createdAt: -1 });

    // Get unread appointments
    const appointments = await Appointment.find({ userId: userId })
      .populate('adminId', 'name email')
      .populate('complaintId', 'complaintNumber')
      .sort({ createdAt: -1 });

    // Format notifications
    const feedbackNotifications = [];
    complaints.forEach(complaint => {
      complaint.adminFeedback.forEach((feedback, index) => {
        if (!feedback.isRead) {
          feedbackNotifications.push({
            _id: `feedback-${complaint._id}-${index}`,
            type: 'feedback',
            complaintId: complaint._id,
            complaintNumber: complaint.complaintNumber,
            message: feedback.message,
            isRead: feedback.isRead,
            createdAt: feedback.askedAt,
            requiresResponse: feedback.requiresResponse,
            feedbackIndex: index,
            adminName: feedback.askedBy?.name || 'Admin'
          });
        }
      });
    });

    const appointmentNotifications = appointments.map(apt => ({
      _id: apt._id,
      type: 'appointment',
      appointmentId: apt._id,
      complaintNumber: apt.complaintId?.complaintNumber,
      message: `Appointment scheduled for ${new Date(apt.appointmentDate).toLocaleDateString()} at ${apt.appointmentTime}`,
      isRead: apt.isRead,
      createdAt: apt.createdAt,
      status: apt.status,
      userResponseStatus: apt.userResponse?.status,
      adminName: apt.adminId?.name || 'Admin',
      date: apt.appointmentDate,
      time: apt.appointmentTime,
      location: apt.location
    }));

    // Combine and sort by date
    const allNotifications = [...feedbackNotifications, ...appointmentNotifications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark feedback as read
router.put('/notifications/feedback/:complaintId/:feedbackIndex/read', async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const { complaintId, feedbackIndex } = req.params;
    const userId = req.user.userId;

    const complaint = await Complaint.findOne({
      _id: complaintId,
      userId: userId
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.adminFeedback[feedbackIndex]) {
      complaint.adminFeedback[feedbackIndex].isRead = true;
      await complaint.save();
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark appointment as read
router.put('/appointments/:id/mark-read', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment marked as read', appointment });
  } catch (error) {
    console.error('Error marking appointment as read:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve reschedule request from admin
router.put('/appointments/:appointmentId/reschedule-request/:requestId/approve', async (req, res) => {
  try {
    const { appointmentId, requestId } = req.params;
    const userId = req.user.userId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const request = appointment.rescheduleRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    // Update appointment with new date/time
    appointment.appointmentDate = request.proposedDate;
    appointment.appointmentTime = request.proposedTime;
    appointment.status = 'Rescheduled';

    // Mark request as approved
    request.status = 'Approved';
    request.respondedAt = new Date();
    request.adminResponse = 'Approved';

    await appointment.save();

    res.json({ message: 'Reschedule request approved', appointment });
  } catch (error) {
    console.error('Error approving reschedule request:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reject reschedule request from admin
router.put('/appointments/:appointmentId/reschedule-request/:requestId/reject', async (req, res) => {
  try {
    const { appointmentId, requestId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const request = appointment.rescheduleRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    // Mark request as rejected
    request.status = 'Rejected';
    request.respondedAt = new Date();
    request.adminResponse = reason || 'Your reschedule request has been rejected';

    await appointment.save();

    res.json({ message: 'Reschedule request rejected', appointment });
  } catch (error) {
    console.error('Error rejecting reschedule request:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
