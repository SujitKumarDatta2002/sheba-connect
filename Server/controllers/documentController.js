

// const UserDocument = require("../models/UserDocument");
// const fs = require('fs');

// // Upload document
// const saveDocuments = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const { documentType } = req.body;
//     const userId = req.user.userId; // Get from auth middleware

//     // Check if document already exists for this user
//     const existingDoc = await UserDocument.findOne({ userId, documentType });
    
//     if (existingDoc) {
//       // Delete old file if exists
//       if (fs.existsSync(existingDoc.filePath)) {
//         fs.unlinkSync(existingDoc.filePath);
//       }
//       // Delete old document
//       await UserDocument.findByIdAndDelete(existingDoc._id);
//     }

//     // Create new document
//     const document = new UserDocument({
//       userId,
//       documentType,
//       fileName: req.file.originalname,
//       filePath: req.file.path,
//       fileSize: req.file.size,
//       status: "Pending"
//     });

//     const savedDocument = await document.save();
    
//     // Return document without sensitive info
//     res.status(201).json({
//       _id: savedDocument._id,
//       documentType: savedDocument.documentType,
//       fileName: savedDocument.fileName,
//       status: savedDocument.status,
//       uploadedAt: savedDocument.uploadedAt
//     });

//   } catch (error) {
//     console.error("Upload error:", error);
    
//     // Delete uploaded file if database save fails
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
    
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Document already exists' });
//     }
    
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get user's documents
// const getDocuments = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const documents = await UserDocument.find({ userId })
//       .select('-__v')
//       .sort({ uploadedAt: -1 });
    
//     res.json(documents);
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get single document
// const getDocument = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const document = await UserDocument.findOne({ 
//       _id: req.params.id,
//       userId 
//     });

//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     res.json(document);
//   } catch (error) {
//     console.error("Error fetching document:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Download document
// const downloadDocument = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const document = await UserDocument.findOne({ 
//       _id: req.params.id,
//       userId 
//     });

//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     if (!fs.existsSync(document.filePath)) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     res.download(document.filePath, document.fileName);
//   } catch (error) {
//     console.error("Error downloading document:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Verify/Reject document (Admin only)
// const verifyDocument = async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     // Check if user is admin (you can add role check here)
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Only admins can verify documents' });
//     }

//     const doc = await UserDocument.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!doc) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     res.json(doc);
//   } catch (error) {
//     console.error("Error verifying document:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete document
// const deleteDocument = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const document = await UserDocument.findOne({ 
//       _id: req.params.id,
//       userId 
//     });

//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     // Delete file from filesystem
//     if (fs.existsSync(document.filePath)) {
//       fs.unlinkSync(document.filePath);
//     }

//     await UserDocument.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Document deleted successfully' });
//   } catch (error) {
//     console.error("Error deleting document:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   saveDocuments,
//   getDocuments,
//   getDocument,
//   downloadDocument,
//   verifyDocument,
//   deleteDocument
// };














/**
 * controllers/documentController.js
 *
 * All files are stored in MongoDB via GridFS.
 * No local filesystem writes — works identically on every device / deployment.
 *
 * GridFS collections used:
 *   uploads.files   — file metadata
 *   uploads.chunks  — binary chunks
 *
 * The UserDocument model stores the GridFS fileId so we can stream
 * the file back on demand.
 */

const mongoose   = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const UserDocument = require('../models/UserDocument');
const User         = require('../models/User');
const { notifyDocumentVerified } = require('../services/smsService');

// ── Helper: get a GridFSBucket from the current connection ──────────────────
function getBucket() {
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
}

// ── Helper: delete a GridFS file by its ObjectId ────────────────────────────
async function deleteGridFSFile(fileId) {
  if (!fileId) return;
  try {
    const bucket = getBucket();
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch (err) {
    // File may already be gone — log but don't throw
    console.warn('GridFS delete warning (fileId=%s):', fileId, err.message);
  }
}

// ── POST /api/documents  (upload) ───────────────────────────────────────────
const saveDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    const userId = req.user.userId;

    // If a document of this type already exists, delete old GridFS file + record
    const existingDoc = await UserDocument.findOne({ userId, documentType });
    if (existingDoc) {
      await deleteGridFSFile(existingDoc.gridFSFileId);
      await UserDocument.findByIdAndDelete(existingDoc._id);
    }

    // Upload buffer → GridFS
    const bucket   = getBucket();
    const filename = `${userId}-${Date.now()}-${req.file.originalname}`;

    const gridFSFileId = await new Promise((resolve, reject) => {
      const readableStream = Readable.from(req.file.buffer);
      const uploadStream   = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
        metadata: { userId, documentType, originalName: req.file.originalname },
      });

      readableStream.pipe(uploadStream);
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error',  reject);
    });

    // Save document record
    const document = new UserDocument({
      userId,
      documentType,
      fileName:     req.file.originalname,
      fileSize:     req.file.size,
      gridFSFileId, // GridFS ObjectId — replaces local filePath
      status:       'Pending',
    });

    const saved = await document.save();

    res.status(201).json({
      _id:          saved._id,
      documentType: saved.documentType,
      fileName:     saved.fileName,
      fileSize:     saved.fileSize,
      status:       saved.status,
      uploadedAt:   saved.uploadedAt,
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Document already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/documents  (list user's documents) ─────────────────────────────
const getDocuments = async (req, res) => {
  try {
    const userId   = req.user.userId;
    const documents = await UserDocument.find({ userId })
      .select('-__v -gridFSFileId') // don't expose internal GridFS id
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error('getDocuments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/documents/:id  (single document metadata) ──────────────────────
const getDocument = async (req, res) => {
  try {
    const userId   = req.user.userId;
    const document = await UserDocument.findOne({ _id: req.params.id, userId })
      .select('-__v -gridFSFileId');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('getDocument error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/documents/:id/download  (stream file from GridFS) ──────────────
const downloadDocument = async (req, res) => {
  try {
    const userId   = req.user.userId;
    const document = await UserDocument.findOne({ _id: req.params.id, userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (!document.gridFSFileId) {
      return res.status(404).json({ message: 'File data not found in database' });
    }

    const bucket     = getBucket();
    const fileId     = new mongoose.Types.ObjectId(document.gridFSFileId);

    // Verify file exists in GridFS
    const filesArray = await bucket.find({ _id: fileId }).toArray();
    if (!filesArray || filesArray.length === 0) {
      return res.status(404).json({ message: 'File not found in storage' });
    }

    // Stream file back to client
    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `inline; filename="${document.fileName}"`,
    });

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', (err) => {
      console.error('GridFS stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('downloadDocument error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/documents/:id/verify  (admin only) ─────────────────────────────
const verifyDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can verify documents' });
    }

    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Verified', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    // Update document status
    const doc = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // ── SMS Notification ────────────────────────────────────────────────────
    // Only notify on Verified or Rejected — not on Pending resets
    if (status === 'Verified' || status === 'Rejected') {
      try {
        const user = await User.findById(doc.userId);
        if (user?.phone) {
          // Human-readable document type label
          const docLabels = {
            nid:                   'National ID (NID)',
            passport:              'Passport',
            birthCertificate:      'Birth Certificate',
            tin:                   'TIN Certificate',
            drivingLicense:        'Driving License',
            citizenship:           'Citizenship Certificate',
            educationalCertificate:'Educational Certificate',
          };
          const docLabel = docLabels[doc.documentType] || doc.documentType;

          if (status === 'Verified') {
            await notifyDocumentVerified(user.phone, docLabel);
          } else {
            // Rejected — use sendSMS directly for a different message
            const { sendSMS } = require('../services/smsService');
            await sendSMS(
              user.phone,
              `[ShebaConnect] Your ${docLabel} verification was rejected. Please re-upload a clear, valid document.`
            );
          }
        }
      } catch (smsErr) {
        // SMS failure must NEVER fail the main operation
        console.warn('[documentController] SMS notification failed (non-fatal):', smsErr.message);
      }
    }

    res.json(doc);
  } catch (error) {
    console.error('verifyDocument error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE /api/documents/:id ───────────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    const userId   = req.user.userId;
    const document = await UserDocument.findOne({ _id: req.params.id, userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove from GridFS first, then remove the record
    await deleteGridFSFile(document.gridFSFileId);
    await UserDocument.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('deleteDocument error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveDocuments,
  getDocuments,
  getDocument,
  downloadDocument,
  verifyDocument,
  deleteDocument,
};