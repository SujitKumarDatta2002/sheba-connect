// const UserDocument = require("../models/UserDocument");

// exports.saveDocuments = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const { documentType } = req.body;

//     const newDoc = new UserDocument({
//       documentType,
//       filePath: req.file.path,
//     });

//     await newDoc.save();

//     res.json(newDoc);

//   } catch (error) {

//     console.log("UPLOAD ERROR:", error);

//     res.status(500).json({
//       message: "Upload failed",
//       error
//     });

//   }
// };

// exports.getDocuments = async (req, res) => {
//   try {
//     const docs = await UserDocument.find();
//     res.json(docs);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




const UserDocument = require("../models/UserDocument");
const fs = require('fs');

// Upload document
const saveDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    const userId = req.user.userId; // Get from auth middleware

    // Check if document already exists for this user
    const existingDoc = await UserDocument.findOne({ userId, documentType });
    
    if (existingDoc) {
      // Delete old file if exists
      if (fs.existsSync(existingDoc.filePath)) {
        fs.unlinkSync(existingDoc.filePath);
      }
      // Delete old document
      await UserDocument.findByIdAndDelete(existingDoc._id);
    }

    // Create new document
    const document = new UserDocument({
      userId,
      documentType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      status: "Pending"
    });

    const savedDocument = await document.save();
    
    // Return document without sensitive info
    res.status(201).json({
      _id: savedDocument._id,
      documentType: savedDocument.documentType,
      fileName: savedDocument.fileName,
      status: savedDocument.status,
      uploadedAt: savedDocument.uploadedAt
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Document already exists' });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Get user's documents
const getDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const documents = await UserDocument.find({ userId })
      .select('-__v')
      .sort({ uploadedAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single document
const getDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const document = await UserDocument.findOne({ 
      _id: req.params.id,
      userId 
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: error.message });
  }
};

// Download document
const downloadDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const document = await UserDocument.findOne({ 
      _id: req.params.id,
      userId 
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(document.filePath, document.fileName);
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify/Reject document (Admin only)
const verifyDocument = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check if user is admin (you can add role check here)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can verify documents' });
    }

    const doc = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(doc);
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const document = await UserDocument.findOne({ 
      _id: req.params.id,
      userId 
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await UserDocument.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveDocuments,
  getDocuments,
  getDocument,
  downloadDocument,
  verifyDocument,
  deleteDocument
};