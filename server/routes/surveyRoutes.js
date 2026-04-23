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

// Check if survey exists for a complaint
router.get("/check/:complaintId", async (req, res) => {
  try {
    const survey = await require("../models/Survey").findOne({ 
      complaintId: req.params.complaintId 
    });
    
    res.json({ 
      exists: !!survey,
      survey: survey || null
    });
  } catch (error) {
    console.error("Error checking survey:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;