

// server/controllers/userController.js

const UserDocument = require('../models/UserDocument');

const REQUIRED_DOCUMENTS = [
  'nid',
  'birthCertificate',
  'passport',
  'drivingLicense',
  'tin',
  'citizenship',
  'educationalCertificate'
];

const BADGES = [
  { threshold: 0, name: 'Starter', color: 'gray' },
  { threshold: 20, name: 'Bronze', color: 'brown' },
  { threshold: 40, name: 'Silver', color: 'silver' },
  { threshold: 60, name: 'Gold', color: 'gold' },
  { threshold: 80, name: 'Platinum', color: 'blue' }
];

exports.getProfileStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDocs = await UserDocument.find({ userId });

    const uploadedTypes = userDocs.map(doc => doc.documentType);
    const presentCount = REQUIRED_DOCUMENTS.filter(type => uploadedTypes.includes(type)).length;
    const percentage = Math.round((presentCount / REQUIRED_DOCUMENTS.length) * 100);

    let currentBadge = BADGES[0];
    for (let i = BADGES.length - 1; i >= 0; i--) {
      if (percentage >= BADGES[i].threshold) {
        currentBadge = BADGES[i];
        break;
      }
    }

    const missingDocuments = REQUIRED_DOCUMENTS.filter(type => !uploadedTypes.includes(type));

    const documentLabels = {
      nid: 'NID',
      birthCertificate: 'Birth Certificate',
      passport: 'Passport',
      drivingLicense: 'Driving License',
      tin: 'TIN',
      citizenship: 'Citizenship Certificate',
      educationalCertificate: 'Educational Certificate'
    };

    res.json({
      completionPercentage: percentage,
      currentBadge: {
        name: currentBadge.name,
        color: currentBadge.color
      },
      missingDocuments: missingDocuments.map(type => ({
        type,
        label: documentLabels[type]
      })),
      documentsStatus: REQUIRED_DOCUMENTS.map(type => ({
        type,
        label: documentLabels[type],
        status: userDocs.find(d => d.documentType === type)?.status || 'Not Uploaded'
      }))
    });
  } catch (error) {
    console.error('Profile status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};