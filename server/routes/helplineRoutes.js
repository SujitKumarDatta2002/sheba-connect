const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getHelplines,
  createHelpline,
  updateHelpline,
  deleteHelpline
} = require('../controllers/helplineController');

// Public routes
router.get('/', getHelplines);

// Admin only routes
router.post('/', authMiddleware, createHelpline);
router.put('/:id', authMiddleware, updateHelpline);
router.delete('/:id', authMiddleware, deleteHelpline);

module.exports = router;

