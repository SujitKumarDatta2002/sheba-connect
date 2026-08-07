// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');

// const uploadDir = path.join(__dirname, '..', 'uploads', 'complaints');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const safeName = file.originalname.replace(/\s+/g, '-');
//     cb(null, `${timestamp}-${safeName}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//   if (supportedTypes.includes(file.mimetype)) {
//     cb(null, true);
//     return;
//   }
//   cb(new Error('Only image files are allowed for complaints'), false);
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter
// });

// module.exports = upload;
// middleware/complaintUpload.js
const multer = require('multer');

// Use memory storage so we can stream the buffer directly into GridFS
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (supportedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for complaints'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;