const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const {
  createServiceApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/serviceApplicationController');

// All routes require authentication
router.use(authMiddleware);

// Create new service application
router.post('/', createServiceApplication);

// Get current user's applications
router.get('/my-applications', getUserApplications);

// Get single application by ID
router.get('/:id', getApplicationById);

// Admin: Get all applications
router.get('/admin/all-applications', getAllApplications);

// Admin: Update application status
router.put('/:id/status', updateApplicationStatus);

// Delete application
router.delete('/:id', deleteApplication);

module.exports = router;
