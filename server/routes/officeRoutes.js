
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getNearbyOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice
} = require('../controllers/officeController');

// Public routes
router.get('/nearby', getNearbyOffices);
router.get('/:id', getOfficeById);

// Admin routes
router.post('/', authMiddleware, createOffice);
router.put('/:id', authMiddleware, updateOffice);
router.delete('/:id', authMiddleware, deleteOffice);

module.exports = router;
