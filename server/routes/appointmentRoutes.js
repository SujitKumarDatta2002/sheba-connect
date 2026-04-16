const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Complaint = require('../models/Complaint');

// ============================================
// USER APPOINTMENT ROUTES
// ============================================

// Get user's own appointments
router.get('/appointments', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .populate('complaintId', 'complaintNumber department issueKeyword status')
      .populate('adminId', 'name email phone')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// User responds to appointment (Accept/Decline/Reschedule)
router.put('/appointments/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { status, reason, proposedDate, proposedTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Verify user owns this appointment
    if (appointment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    appointment.userResponse = {
      status: status,
      respondedAt: new Date(),
      reason: reason || ''
    };
    
    if (status === 'Accepted') {
      appointment.status = 'Confirmed';
    } else if (status === 'Declined') {
      appointment.status = 'Declined';
    } else if (status === 'Requested Reschedule') {
      appointment.status = 'Reschedule Requested';
      
      // Add reschedule request
      if (!appointment.rescheduleRequests) {
        appointment.rescheduleRequests = [];
      }
      appointment.rescheduleRequests.push({
        requestedAt: new Date(),
        proposedDate: proposedDate,
        proposedTime: proposedTime,
        reason: reason,
        status: 'Pending'
      });
    }
    
    await appointment.save();
    
    // Add to complaint timeline
    const complaint = await Complaint.findById(appointment.complaintId);
    if (complaint) {
      complaint.timeline.push({
        status: complaint.status,
        comment: `User ${status.toLowerCase()} the appointment scheduled for ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
        updatedBy: complaint.citizenName,
        date: new Date()
      });
      await complaint.save();
    }
    
    res.json({ message: `Appointment ${status.toLowerCase()} successfully`, appointment });
  } catch (error) {
    console.error('Error responding to appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// ADMIN APPOINTMENT ROUTES
// ============================================

// Create new appointment (Admin only)
router.post('/admin/appointments', authMiddleware, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { complaintId, userId, appointmentDate, appointmentTime, location, purpose } = req.body;
    
    // Validate required fields
    if (!complaintId || !userId || !appointmentDate || !appointmentTime || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const appointment = new Appointment({
      complaintId,
      userId,
      adminId: req.user.userId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      location,
      purpose: purpose || 'Discussion on complaint resolution'
    });
    
    await appointment.save();
    
    // Add to complaint timeline
    complaint.timeline.push({
      status: complaint.status,
      comment: `Appointment scheduled for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}`,
      updatedBy: 'Admin',
      date: new Date()
    });
    await complaint.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email phone')
      .populate('adminId', 'name email')
      .populate('complaintId', 'complaintNumber description');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments (Admin only)
router.get('/admin/appointments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const appointments = await Appointment.find()
      .populate('userId', 'name email phone')
      .populate('adminId', 'name email')
      .populate('complaintId', 'complaintNumber department issueKeyword')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a specific complaint (Admin only)
router.get('/api/admin/complaints/:complaintId/appointments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const appointments = await Appointment.find({ complaintId: req.params.complaintId })
      .populate('userId', 'name email phone')
      .populate('adminId', 'name email')
      .sort({ appointmentDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching complaint appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update appointment (Admin only)
router.put('/api/admin/appointments/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { appointmentDate, appointmentTime, location, purpose, status, notes, outcome } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (location) appointment.location = location;
    if (purpose) appointment.purpose = purpose;
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (outcome) appointment.outcome = outcome;
    
    await appointment.save();
    
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete appointment (Admin only)
router.delete('/api/admin/appointments/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
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

module.exports = router;