

// middleware/upload.js
// Multer configuration for handling file uploads.
// Uses memoryStorage so files are held as a buffer in RAM and piped
// directly into MongoDB GridFS — nothing is ever written to the local disk.

const multer = require('multer');

// Only PDF files are accepted
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // buffer held in req.file.buffer
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter,
});

module.exports = upload;