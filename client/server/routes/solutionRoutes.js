const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  submitSolution,
  getMySolutions,
  getPublicSolutions,
  getSolutionById,
  getPendingSolutions,
  getAllSolutions,
  verifySolution,
  rateSolution,
  updateSolution,
  deleteSolution
} = require("../controllers/solutionController");

// All routes require authentication
router.use(authMiddleware);

// Public routes (visible solutions)
router.get("/public", getPublicSolutions);

// User's own solutions
router.get("/my", getMySolutions);

// Submit new solution
router.post("/", submitSolution);

// Get single solution
router.get("/:id", getSolutionById);

// Rate solution
router.post("/:id/rate", rateSolution);

// Update solution (own, pending only)
router.put("/:id", updateSolution);

// Delete solution (own)
router.delete("/:id", deleteSolution);

// Admin routes
router.get("/admin/pending", getPendingSolutions);
router.get("/admin/all", getAllSolutions);
router.put("/admin/:id/verify", verifySolution);

module.exports = router;