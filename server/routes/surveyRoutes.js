const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  submitSurvey,
  getSimilarSolutions,
  getSolutionDetails,
  rateSolution,
  addComment,
  setResolutionTime,
  getResolutionStats
} = require("../controllers/surveyController");

// All routes require authentication
router.use(authMiddleware);

// Submit survey for resolved complaint
router.post("/submit", submitSurvey);

// Get similar solutions
router.get("/similar", getSimilarSolutions);

// Get solution details
router.get("/solution/:id", getSolutionDetails);

// Rate solution
router.post("/solution/:id/rate", rateSolution);

// Add comment to solution
router.post("/solution/:id/comment", addComment);

// Admin: Set resolution time
router.post("/resolution-time", setResolutionTime);

// Get resolution statistics
router.get("/stats", getResolutionStats);

module.exports = router;