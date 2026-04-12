

// controllers/documentController.js
// Handles document upload, retrieval, download, and deletion.
// All files are stored in MongoDB via GridFS — no local filesystem.
// This means files are accessible from any device or server instance.
//
// GridFS collections created in MongoDB:
//   uploads.files   → metadata (filename, size, contentType, etc.)
//   uploads.chunks  → the actual file data split into chunks

const mongoose      = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable }  = require('stream');
const UserDocument  = require('../models/UserDocument');

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Returns a GridFSBucket connected to the current DB connection.
// Called fresh each time so it always uses the active connection.
// ─────────────────────────────────────────────────────────────────────────────
function getBucket() {
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Deletes a file from GridFS by its ObjectId.
// Logs a warning if the file is already gone (doesn't throw).
// ─────────────────────────────────────────────────────────────────────────────
async function deleteGridFSFile(fileId) {
  if (!fileId) return;
  try {
    const bucket = getBucket();
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch (err) {
    console.warn('GridFS delete warning (fileId=%s):', fileId, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/documents
// Uploads a document (PDF) for the authenticated user.
// If a document of the same type already exists, the old one is replaced.
// File goes into GridFS; a UserDocument record stores the GridFS file ID.
// ─────────────────────────────────────────────────────────────────────────────
const saveDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    const userId = req.user.userId;

    // If a previous document of this type exists, delete it from GridFS and the DB
    const existingDoc = await UserDocument.findOne({ userId, documentType });
    if (existingDoc) {
      await deleteGridFSFile(existingDoc.gridFSFileId);
      await UserDocument.findByIdAndDelete(existingDoc._id);
    }

    // Upload the in-memory buffer to GridFS
    const bucket   = getBucket();
    const filename = `${userId}-${Date.now()}-${req.file.originalname}`;

    const gridFSFileId = await new Promise((resolve, reject) => {
      const readable     = Readable.from(req.file.buffer);
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
        metadata: { userId, documentType, originalName: req.file.originalname },
      });

      readable.pipe(uploadStream);
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error',  reject);
    });

    // Save the document record with the GridFS file ID
    const saved = await new UserDocument({
      userId,
      documentType,
      fileName:     req.file.originalname,
      fileSize:     req.file.size,
      gridFSFileId, // references the file in GridFS
      status:       'Pending',
    }).save();

    res.status(201).json({
      _id:          saved._id,
      documentType: saved.documentType,
      fileName:     saved.fileName,
      fileSize:     saved.fileSize,
      status:       saved.status,
      uploadedAt:   saved.uploadedAt,
    });

  } catch (err) {
    console.error('saveDocuments error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Document already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents
// Returns a list of all documents for the authenticated user.
// gridFSFileId is excluded — it's an internal reference, not needed by the UI.
// ─────────────────────────────────────────────────────────────────────────────
const getDocuments = async (req, res) => {
  try {
    const documents = await UserDocument.find({ userId: req.user.userId })
      .select('-__v -gridFSFileId')
      .sort({ uploadedAt: -1 });

    res.json(documents);
  } catch (err) {
    console.error('getDocuments error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/:id
// Returns metadata for a single document (not the file itself).
// ─────────────────────────────────────────────────────────────────────────────
const getDocument = async (req, res) => {
  try {
    const document = await UserDocument.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).select('-__v -gridFSFileId');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (err) {
    console.error('getDocument error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/documents/:id/download
// Streams the actual PDF file from GridFS back to the client.
// Used by both the View (iframe) and Download buttons on the frontend.
// ─────────────────────────────────────────────────────────────────────────────
const downloadDocument = async (req, res) => {
  try {
    const document = await UserDocument.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.gridFSFileId) {
      return res.status(404).json({ message: 'File data not found in database' });
    }

    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(document.gridFSFileId);

    // Confirm the GridFS file actually exists before opening a stream
    const filesArray = await bucket.find({ _id: fileId }).toArray();
    if (!filesArray || filesArray.length === 0) {
      return res.status(404).json({ message: 'File not found in storage' });
    }

    // Set headers so the browser renders the PDF inline (for View) or saves it (for Download)
    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `inline; filename="${document.fileName}"`,
    });

    // Stream the file from GridFS directly to the HTTP response
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', (err) => {
      console.error('GridFS stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });
    downloadStream.pipe(res);

  } catch (err) {
    console.error('downloadDocument error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/documents/:id/verify  (Admin only)
// Updates a document's verification status (Pending / Verified / Rejected).
// ─────────────────────────────────────────────────────────────────────────────
const verifyDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can verify documents' });
    }

    const doc = await UserDocument.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(doc);
  } catch (err) {
    console.error('verifyDocument error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/documents/:id
// Deletes the file from GridFS first, then removes the DB record.
// Both steps are needed — skipping GridFS deletion would leave orphaned data.
// ─────────────────────────────────────────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    const document = await UserDocument.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await deleteGridFSFile(document.gridFSFileId); // remove file from GridFS
    await UserDocument.findByIdAndDelete(req.params.id); // remove metadata record

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('deleteDocument error:', err);
    res.status(500).json({ message: err.message });
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