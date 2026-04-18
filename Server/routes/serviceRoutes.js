
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Public routes (no auth required for viewing)
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only routes
router.post('/', authMiddleware, createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;