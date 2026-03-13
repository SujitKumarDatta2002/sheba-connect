const express = require("express");
const router = express.Router();

const {
  saveDocuments,
  getDocuments
} = require("../controllers/documentController");

const upload = require("../middleware/upload");

router.post("/", saveDocuments);
router.get("/", getDocuments);

/*
Upload document file
Example:
POST /api/documents/upload/passport
*/

router.post("/upload/:type", upload.single("file"), async (req, res) => {

  try {

    const documentType = req.params.type;

    const filePath = req.file.path;

    res.status(200).json({
      message: "File uploaded successfully",
      documentType,
      path: filePath
    });

  } catch (error) {

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });

  }

});

module.exports = router;