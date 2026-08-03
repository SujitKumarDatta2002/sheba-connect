
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth');
// const {
//   getNearbyOffices,
//   getOfficeById,
//   createOffice,
//   updateOffice,
//   deleteOffice
// } = require('../controllers/officeController');

// // Public routes
// router.get('/nearby', getNearbyOffices);
// router.get('/:id', getOfficeById);

// // Admin routes
// router.post('/', authMiddleware, createOffice);
// router.put('/:id', authMiddleware, updateOffice);
// router.delete('/:id', authMiddleware, deleteOffice);

// module.exports = router;











const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getNearbyOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
  debugOffices,
} = require('../controllers/officeController');

// Debug — visit /api/offices/debug/<serviceId> to inspect your data
// Remove after confirming offices show correctly
router.get('/debug/:serviceId', debugOffices);

// Public
router.get('/nearby', getNearbyOffices);
router.get('/:id', getOfficeById);

// Admin
router.post('/',    authMiddleware, createOffice);
router.put('/:id',  authMiddleware, updateOffice);
router.delete('/:id', authMiddleware, deleteOffice);

module.exports = router;