

// const express = require("express");
// const router = express.Router();

// const {
//   saveDocuments,
//   getDocuments
// } = require("../controllers/documentController");

// const upload = require("../middleware/upload"); // multer middleware
// const UserDocument = require("../models/UserDocument");


// // Upload document
// router.post("/", upload.single("file"), saveDocuments);


// // Get all documents
// router.get("/", getDocuments);


// // Verify / Reject document
// router.put("/:id/verify", async (req, res) => {

//   const { status } = req.body;

//   try {

//     const doc = await UserDocument.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     res.json(doc);

//   } catch (error) {
//     res.status(500).json(error);
//   }

// });


// // Delete document
// router.delete("/:id", async (req, res) => {

//   try {

//     await UserDocument.findByIdAndDelete(req.params.id);

//     res.json({ message: "Document deleted" });

//   } catch (error) {

//     res.status(500).json(error);

//   }

// });

// module.exports = router;




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