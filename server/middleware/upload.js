// // const multer = require("multer");

// // const storage = multer.diskStorage({

// //   destination: function (req, file, cb) {
// //     cb(null, "uploads/");
// //   },

// //   filename: function (req, file, cb) {
// //     cb(null, Date.now() + "-" + file.originalname);
// //   }

// // });

// // const upload = multer({
// //   storage: storage
// // });

// // module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Get userId from the authenticated request
//     const userId = req.user?.userId || 'anonymous';
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, `${userId}-${uniqueSuffix}${ext}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: fileFilter
// });

// module.exports = upload;













/**
 * middleware/upload.js
 *
 * Uses memoryStorage so the file buffer is passed directly to GridFS.
 * No files are ever written to the local filesystem.
 */

const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Store in memory — we'll pipe the buffer into GridFS in the controller
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

module.exports = upload;