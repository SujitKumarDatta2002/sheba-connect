

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  saveDocuments,
  getDocuments,
  getDocument,
  downloadDocument,
  verifyDocument,
  deleteDocument
} = require("../controllers/documentController");

// All routes require authentication
router.use(authMiddleware);

// Upload document
router.post("/", upload.single("file"), saveDocuments);

// Get all user documents
router.get("/", getDocuments);

// Get single document
router.get("/:id", getDocument);

// Download document
router.get("/:id/download", downloadDocument);

// Verify/Reject document (Admin only)
router.put("/:id/verify", verifyDocument);

// Delete document
router.delete("/:id", deleteDocument);

module.exports = router;