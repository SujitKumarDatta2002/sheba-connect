const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const ServiceApplication = require('../models/ServiceApplication');

const {
  createServiceApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  sendCustomApplicationMessage
} = require('../controllers/serviceApplicationController');

// All routes require authentication
router.use(authMiddleware);

// Create new service application
router.post('/', createServiceApplication);

// Get current user's applications
router.get('/my-applications', getUserApplications);

// Get single application by ID
router.get('/admin/all-applications', getAllApplications);

// Get single application by ID
router.get('/:id', getApplicationById);

// Admin: Update application status (supports PUT and PATCH)
router.put('/:id/status', updateApplicationStatus);
router.patch('/:id/status', updateApplicationStatus);

// Admin: Update application details (phone number, etc)
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { notificationPhone, adminNotes } = req.body;
    const updates = {};
    
    if (notificationPhone !== undefined) updates.notificationPhone = notificationPhone;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    
    const application = await ServiceApplication.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone').populate('serviceId', 'name');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ message: 'Application updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Send custom message to applicant
router.post('/:id/message', sendCustomApplicationMessage);

// Delete application
router.delete('/:id', deleteApplication);

module.exports = router;
