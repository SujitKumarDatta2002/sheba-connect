const path = require('path');

const buildComplaintImageRecord = (file, savedPath) => ({
  filename: file?.originalname || '',
  path: savedPath,
  mimetype: file?.mimetype || '',
  uploadedAt: new Date()
});

const isSupportedComplaintImage = (mimetype = '') => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return supportedTypes.includes(mimetype.toLowerCase());
};

module.exports = {
  buildComplaintImageRecord,
  isSupportedComplaintImage
};
