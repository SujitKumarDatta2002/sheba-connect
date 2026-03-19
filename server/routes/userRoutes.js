// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getProfileStatus } = require('../controllers/userController');

// All user routes are protected
router.use(authMiddleware);

router.get('/profile/status', getProfileStatus);

module.exports = router;
