const express = require("express");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  applyForService,
  reviewApplication,
  getPendingApplications,
  getAdminApplicationsByDepartment,
  getUserApplications
} = require("../controllers/applicationController");

const router = express.Router();

router.use(authMiddleware);

router.post("/apply", applyForService);
router.get("/user", getUserApplications);
router.get("/pending", adminMiddleware, getPendingApplications);
router.get("/by-department", adminMiddleware, getAdminApplicationsByDepartment);
router.patch("/:id/review", adminMiddleware, reviewApplication);

module.exports = router;