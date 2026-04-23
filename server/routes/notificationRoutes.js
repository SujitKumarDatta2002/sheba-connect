const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

module.exports = router;