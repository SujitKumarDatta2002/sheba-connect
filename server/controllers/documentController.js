const UserDocument = require("../models/UserDocument");

exports.saveDocuments = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { documentType } = req.body;

    const newDoc = new UserDocument({
      documentType,
      filePath: req.file.path,
    });

    await newDoc.save();

    res.json(newDoc);

  } catch (error) {

    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      message: "Upload failed",
      error
    });

  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await UserDocument.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};