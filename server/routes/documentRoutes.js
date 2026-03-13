// const express = require("express");
// const router = express.Router();

// const {
//   saveDocuments,
//   getDocuments
// } = require("../controllers/documentController");

// const upload = require("../middleware/upload");

// router.post("/", saveDocuments);
// router.get("/", getDocuments);

// /*
// Upload document file
// Example:
// POST /api/documents/upload/passport
// */

// router.post("/upload/:type", upload.single("file"), async (req, res) => {

//   try {

//     const documentType = req.params.type;

//     const filePath = req.file.path;

//     res.status(200).json({
//       message: "File uploaded successfully",
//       documentType,
//       path: filePath
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: "Upload failed",
//       error: error.message
//     });

//   }

// });

// module.exports = router;









// const express = require("express");
// const router = express.Router();

// const {
//   saveDocuments,
//   getDocuments
// } = require("../controllers/documentController");

// const UserDocument = require("../models/UserDocument");

// router.post("/", saveDocuments);
// router.get("/", getDocuments);

// // verify / reject document

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

// router.delete("/:id", async (req, res) => {

//   await UserDocument.findByIdAndDelete(req.params.id);

//   res.json({ message: "Document deleted" });

// });

// module.exports = router;






const express = require("express");
const router = express.Router();

const {
  saveDocuments,
  getDocuments
} = require("../controllers/documentController");

const upload = require("../middleware/upload"); // multer middleware
const UserDocument = require("../models/UserDocument");


// Upload document
router.post("/", upload.single("file"), saveDocuments);


// Get all documents
router.get("/", getDocuments);


// Verify / Reject document
router.put("/:id/verify", async (req, res) => {

  const { status } = req.body;

  try {

    const doc = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(doc);

  } catch (error) {
    res.status(500).json(error);
  }

});


// Delete document
router.delete("/:id", async (req, res) => {

  try {

    await UserDocument.findByIdAndDelete(req.params.id);

    res.json({ message: "Document deleted" });

  } catch (error) {

    res.status(500).json(error);

  }

});

module.exports = router;