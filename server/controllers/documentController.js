const UserDocument = require("../models/UserDocument");

exports.saveDocuments = async (req, res) => {
  try {
    const doc = new UserDocument(req.body);
    await doc.save();

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
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