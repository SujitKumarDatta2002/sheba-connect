const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const Service = require('../models/Service');
const ServiceApplication = require('../models/ServiceApplication');

const getDeadlineEndOfDay = (value) => {
  if (!value) return null;

  // Normalize to YYYY-MM-DD first so timezone offsets do not shift the intended deadline day.
  if (value instanceof Date) {
    return new Date(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
      23,
      59,
      59,
      999
    );
  }

  const raw = String(value);
  const datePart = raw.includes('T') ? raw.slice(0, 10) : raw;
  const [year, month, day] = datePart.split('-').map(Number);

  if (year && month && day) {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  const fallback = new Date(value);
  if (Number.isNaN(fallback.getTime())) return null;
  fallback.setHours(23, 59, 59, 999);
  return fallback;
};

const isDocumentSubmissionDatePassed = (application) => {
  const submissionDeadline = getDeadlineEndOfDay(application?.documentSubmissionDate);
  if (!submissionDeadline) return false;

  return Date.now() > submissionDeadline.getTime();
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      serviceId,
      applicantName,
      email,
      phone,
      nid,
      address,
      documentDetails = [],
      additionalInfo = ''
    } = req.body;

    if (!serviceId || !applicantName || !email || !phone || !nid || !address) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    const existingApplication = await ServiceApplication.findOne({
      userId: req.user.userId,
      serviceId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this service. One application per service is allowed.'
      });
    }

    const requiredDocTypes = service.requiredDocuments || [];
    const submittedDocTypes = documentDetails.map((d) => d.documentType);
    const missingDocs = requiredDocTypes.filter((doc) => !submittedDocTypes.includes(doc));

    if (missingDocs.length > 0) {
      return res.status(400).json({
        message: 'Missing required document details',
        missingDocs
      });
    }

    const application = await ServiceApplication.create({
      userId: req.user.userId,
      serviceId,
      applicantName,
      email,
      phone,
      nid,
      address,
      documentDetails,
      additionalInfo,
      adminRequestedDocuments: [],
      submittedRequestedDocuments: [],
      // Deadlines and appointments are set by admin after review.
      applicationDeadline: null,
      documentSubmissionDate: null,
      appointmentDate: null,
      reminderEnabled: true,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Service application submitted successfully',
      application
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        message: 'You have already applied for this service. One application per service is allowed.'
      });
    }
    console.error('Create service application error:', error);
    res.status(500).json({ message: 'Server error while submitting application' });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const applications = await ServiceApplication.find({ userId: req.user.userId })
      .populate('serviceId', 'name department processingTime')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get my service applications error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const applications = await ServiceApplication.find()
      .populate('serviceId', 'name department')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get all applications (admin) error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

router.get('/admin/count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      ServiceApplication.countDocuments(),
      ServiceApplication.countDocuments({ reviewedAt: null }),
      ServiceApplication.countDocuments({ status: 'approved' }),
      ServiceApplication.countDocuments({ status: 'rejected' })
    ]);

    res.json({ total, pending, approved, rejected });
  } catch (error) {
    console.error('Get applications count (admin) error:', error);
    res.status(500).json({ message: 'Server error while fetching application count' });
  }
});

router.patch('/admin/:id/review', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      status,
      applicationDeadline,
      documentSubmissionDate,
      appointmentDate,
      reminderEnabled,
      adminRequestedDocuments
    } = req.body;

    if (
      status === undefined ||
      reminderEnabled === undefined ||
      adminRequestedDocuments === undefined
    ) {
      return res.status(400).json({
        message: 'Required review fields: status, reminderEnabled, adminRequestedDocuments'
      });
    }

    if (!Array.isArray(adminRequestedDocuments)) {
      return res.status(400).json({ message: 'adminRequestedDocuments must be an array' });
    }

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const allowedDocTypes = ['nid', 'birthCertificate', 'passport', 'drivingLicense', 'tin', 'citizenship', 'educationalCertificate'];
    const normalizedRequestedDocs = adminRequestedDocuments.filter((doc) => doc && doc !== 'none');
    const hasInvalidDocType = normalizedRequestedDocs.some((doc) => !allowedDocTypes.includes(doc));

    if (hasInvalidDocType) {
      return res.status(400).json({ message: 'Invalid requested document type provided' });
    }

    const hasAnyScheduleField = Boolean(applicationDeadline || documentSubmissionDate || appointmentDate);
    const hasAllScheduleFields = Boolean(applicationDeadline && documentSubmissionDate && appointmentDate);

    if (hasAnyScheduleField && !hasAllScheduleFields) {
      return res.status(400).json({
        message: 'If scheduling is used, set application deadline, document submission date, and appointment date together'
      });
    }

    const existingApplication = await ServiceApplication.findById(req.params.id);
    if (!existingApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status === 'approved') {
      const previouslyRequestedDocs = existingApplication.adminRequestedDocuments || [];
      const requiredDocsForApproval = normalizedRequestedDocs.length > 0
        ? normalizedRequestedDocs
        : previouslyRequestedDocs;

      if (requiredDocsForApproval.length > 0) {
        const submittedDocTypes = (existingApplication.submittedRequestedDocuments || []).map((doc) => doc.documentType);
        const missingRequestedDocs = requiredDocsForApproval.filter((docType) => !submittedDocTypes.includes(docType));

        if (missingRequestedDocs.length > 0) {
          return res.status(400).json({
            message: 'User must submit all admin-requested documents before approval. Permission or extension requests do not replace document submission.',
            missingDocs: missingRequestedDocs
          });
        }
      }
    }

    const updateData = {};
    if (status) updateData.status = status;
    updateData.applicationDeadline = hasAllScheduleFields ? applicationDeadline : null;
    updateData.documentSubmissionDate = hasAllScheduleFields ? documentSubmissionDate : null;
    updateData.appointmentDate = hasAllScheduleFields ? appointmentDate : null;
    updateData.reminderEnabled = hasAllScheduleFields ? reminderEnabled : false;
    updateData.adminRequestedDocuments = normalizedRequestedDocs;
    updateData.reviewedAt = new Date();

    const application = await ServiceApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('serviceId', 'name department')
      .populate('userId', 'name email phone');

    res.json({ message: 'Application reviewed successfully', application });
  } catch (error) {
    console.error('Review application (admin) error:', error);
    res.status(500).json({ message: 'Server error while reviewing application' });
  }
});

router.patch('/:id/documents', authMiddleware, async (req, res) => {
  try {
    const { documentDetails = [] } = req.body;

    if (!Array.isArray(documentDetails)) {
      return res.status(400).json({ message: 'documentDetails must be an array' });
    }

    const application = await ServiceApplication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const hasSubmittedBefore = (application.submittedRequestedDocuments || []).length > 0;
    const hasPermission = application.documentEditPermissionGranted === true;
    const deadlinePassed = isDocumentSubmissionDatePassed(application);

    if (!hasSubmittedBefore && deadlinePassed && !hasPermission) {
      return res.status(400).json({
        message: 'Document submission date has passed. Request admin permission before submitting requested documents.'
      });
    }

    if (hasSubmittedBefore && !hasPermission) {
      return res.status(400).json({
        message: 'Requested documents already submitted. Ask admin for update permission.'
      });
    }

    const requestedDocs = application.adminRequestedDocuments || [];
    if (!requestedDocs.length) {
      return res.status(400).json({ message: 'Admin has not requested additional documents for this application yet' });
    }

    const submittedTypes = documentDetails.map((d) => d.documentType);
    const missingDocs = requestedDocs.filter((doc) => !submittedTypes.includes(doc));

    if (missingDocs.length > 0) {
      return res.status(400).json({ message: 'Missing requested document details', missingDocs });
    }

    application.submittedRequestedDocuments = documentDetails.map((d) => ({
      documentType: d.documentType,
      reference: d.reference
    }));

    // Allow only one correction cycle per admin approval.
    application.documentEditPermissionGranted = false;
    application.documentEditRequested = false;

    await application.save();

    res.json({ message: 'Requested documents submitted successfully', application });
  } catch (error) {
    console.error('Submit requested documents error:', error);
    res.status(500).json({ message: 'Server error while submitting requested documents' });
  }
});

router.patch('/:id/documents/request-edit', authMiddleware, async (req, res) => {
  try {
    const application = await ServiceApplication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const hasSubmittedBefore = (application.submittedRequestedDocuments || []).length > 0;
    const deadlinePassed = isDocumentSubmissionDatePassed(application);

    if ((application.adminRequestedDocuments || []).length === 0) {
      return res.status(400).json({ message: 'Admin has not requested additional documents for this application yet' });
    }

    if (!hasSubmittedBefore && !deadlinePassed) {
      return res.status(400).json({
        message: 'You can still submit requested documents directly before the submission date.'
      });
    }

    if (application.documentEditPermissionGranted) {
      return res.status(400).json({ message: 'Document submission permission already granted by admin' });
    }

    if (application.documentEditRequested) {
      return res.status(400).json({ message: 'Document permission request already sent to admin' });
    }

    application.documentEditRequested = true;
    await application.save();

    res.json({ message: 'Document permission request sent to admin', application });
  } catch (error) {
    console.error('Request document edit permission error:', error);
    res.status(500).json({ message: 'Server error while requesting edit permission' });
  }
});

router.patch('/admin/:id/document-edit-permission', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { allow } = req.body;

    if (typeof allow !== 'boolean') {
      return res.status(400).json({ message: 'allow must be boolean' });
    }

    const application = await ServiceApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.documentEditPermissionGranted = allow;
    if (allow) {
      application.documentEditRequested = false;
    }

    await application.save();

    res.json({ message: allow ? 'Document permission granted' : 'Document permission removed', application });
  } catch (error) {
    console.error('Update document edit permission (admin) error:', error);
    res.status(500).json({ message: 'Server error while updating edit permission' });
  }
});

router.get('/reminders', authMiddleware, async (req, res) => {
  try {
    const applications = await ServiceApplication.find({
      userId: req.user.userId,
      reviewedAt: { $ne: null }
    })
      .populate('serviceId', 'name department')
      .sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = [];

    applications.forEach((app) => {
      const serviceName = app.serviceId?.name || 'Service';
      const notificationArrivedAt = app.reviewedAt || app.updatedAt || app.createdAt;

      // Always notify user when admin reviews/changes application status.
      reminders.push({
        applicationId: app._id,
        serviceId: app.serviceId?._id,
        serviceName,
        type: 'statusChange',
        title: `Admin changed your status to ${app.status}`,
        date: app.reviewedAt,
        arrivedAt: notificationArrivedAt,
        daysLeft: 0,
        status: app.status
      });

      if (app.reminderEnabled === false) {
        return;
      }

      const reminderItems = [
        {
          date: app.applicationDeadline,
          type: 'applicationDeadline',
          title: 'Application Deadline'
        },
        {
          date: app.documentSubmissionDate,
          type: 'documentSubmission',
          title: 'Document Submission Date'
        },
        {
          date: app.appointmentDate,
          type: 'appointment',
          title: 'Appointment Schedule'
        }
      ];

      reminderItems.forEach((item) => {
        if (!item.date) return;

        const reminderDate = new Date(item.date);
        const reminderDay = new Date(reminderDate);
        reminderDay.setHours(0, 0, 0, 0);

        const diffMs = reminderDay.getTime() - today.getTime();
        const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        reminders.push({
          applicationId: app._id,
          serviceId: app.serviceId?._id,
          serviceName,
          type: item.type,
          title: item.title,
          date: reminderDate,
          arrivedAt: notificationArrivedAt,
          daysLeft,
          status: app.status
        });
      });
    });

    reminders.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error while fetching reminders' });
  }
});

module.exports = router;
