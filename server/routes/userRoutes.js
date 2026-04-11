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

module.exports = router;
