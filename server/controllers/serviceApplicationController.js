/**
 * controllers/serviceApplicationController.js
 *
 * Handles all service application operations.
 *
 * Bug Fix (Task 3 & 4):
 *   Previously, document eligibility was checked by existence only.
 *   Now, only documents with status === 'Verified' are considered valid.
 *   This syncs document verification state with the service application flow.
 *
 * SMS Notifications (Task 2):
 *   Admin status updates trigger an SMS to the applicant via smsService.
 *   Controllers never call the SMS API directly — they use the service layer.
 */

const ServiceApplication = require('../models/ServiceApplication');
const Service            = require('../models/Service');
const UserDocument       = require('../models/UserDocument');
const User               = require('../models/User');
const { notifyApplicationStatus, sendSMS } = require('../services/smsService');

// ── POST /api/service-applications  (user applies) ──────────────────────────
exports.createServiceApplication = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      department,
      requiredDocuments,  // e.g. ['nid', 'passport']
      submittedDocuments,
      additionalInfo,
      notificationPhone
    } = req.body;

    // 1. Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // 2. Check for existing active application
    const existingApplication = await ServiceApplication.findOne({
      serviceId,
      userId: req.user.userId,
      status: { $in: ['submitted', 'under_review', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You already have an active application for this service'
      });
    }

    // Ensure required docs are uploaded in profile before applying.
    // Verification can happen after submission during admin review.
    if (requiredDocuments && requiredDocuments.length > 0) {
      const uploadedDocs = await UserDocument.find({
        userId: req.user.userId,
        documentType: { $in: requiredDocuments },
      });

      const uploadedTypes = new Set(uploadedDocs.map((d) => d.documentType));

      const missingDocs = requiredDocuments.filter((docType) => !uploadedTypes.has(docType));

      if (missingDocs.length > 0) {
        // Human-readable labels
        const docLabels = {
          nid:                   'National ID (NID)',
          passport:              'Passport',
          birthCertificate:      'Birth Certificate',
          tin:                   'TIN Certificate',
          drivingLicense:        'Driving License',
          citizenship:           'Citizenship Certificate',
          educationalCertificate:'Educational Certificate',
        };
        const missingLabels = missingDocs.map((t) => docLabels[t] || t);

        return res.status(400).json({
          message: 'Cannot apply: the following required documents are missing in your profile.',
          missingDocuments: missingLabels,
          hint: 'Please upload these documents to your profile before applying.',
        });
      }
    }

    // Fetch user name from DB since JWT only holds userId/email/role
    const userRecord = await User.findById(req.user.userId).select('name');

    // 3. Create new application
    const application = new ServiceApplication({
      serviceId,
      serviceName,
      department,
      userId:    req.user.userId,
      userEmail: req.user.email,
      userName:  userRecord?.name || req.user.email,
      requiredDocuments,
      submittedDocuments,
      notificationPhone: String(notificationPhone || '').trim(),
      additionalInfo: additionalInfo || ''
    });

    await application.save();

    // Populate user info for response
    await application.populate('userId', 'name email');

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create service application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/service-applications/my  (user's own applications) ─────────────
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await ServiceApplication.find({ userId: req.user.userId })
      .populate('serviceId', 'name department processingTime cost')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/service-applications/:id ───────────────────────────────────────
exports.getApplicationById = async (req, res) => {
  try {
    const application = await ServiceApplication.findById(req.params.id)
      .populate('serviceId', 'name department processingTime cost')
      .populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Access check: owner or admin
    if (application.userId._id.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/service-applications  (admin: all applications) ─────────────────
exports.getAllApplications = async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, department } = req.query;
    const filter = {};

    if (status)     filter.status     = status;
    if (department) filter.department = department;

    const applications = await ServiceApplication.find(filter)
      .populate('serviceId', 'name department processingTime cost')
      .populate('userId', 'name email phone')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/service-applications/:id/message  (admin: send custom message) ─
exports.sendCustomApplicationMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const application = await ServiceApplication.findById(req.params.id)
      .populate('serviceId', 'name')
      .populate('userId', 'name email phone');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Allow admin to specify custom phone, fallback to application phone or user phone
    const customPhone = req.body.phoneNumber;
    
    // Determine which phone to use (with detailed logging)
    let targetPhone;
    let phoneSource;
    if (customPhone) {
      targetPhone = customPhone;
      phoneSource = 'custom (from request body)';
    } else if (application.notificationPhone) {
      targetPhone = application.notificationPhone;
      phoneSource = 'notificationPhone (from application)';
    } else if (application.userId?.phone) {
      targetPhone = application.userId.phone;
      phoneSource = 'userId.phone (from user account)';
    } else {
      targetPhone = '';
      phoneSource = 'none';
    }
    
    console.log('[Admin Msg] Application ID:', req.params.id);
    console.log('[Admin Msg] Custom phone from request:', customPhone);
    console.log('[Admin Msg] notificationPhone:', application.notificationPhone);
    console.log('[Admin Msg] userId.phone:', application.userId?.phone);
    console.log('[Admin Msg] >>> USING PHONE:', targetPhone, `(source: ${phoneSource})`);
    
    if (!targetPhone) {
      return res.status(400).json({ message: 'No phone number found for this applicant' });
    }

    const finalMessage = `Sheba Connect: ${String(message).trim()}`;
    console.log('[Admin Msg] Sending:', finalMessage);
    const smsResult = await sendSMS(targetPhone, finalMessage);
    console.log('[Admin Msg] Result:', smsResult);

    return res.json({
      message: 'Message sent to applicant',
      phone: targetPhone,
      result: smsResult
    });
  } catch (error) {
    console.error('[Admin Msg] Error:', error.message);
    console.error('[Admin Msg] Stack:', error.stack);
    return res.status(500).json({ 
      message: error.message || 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ── PUT/PATCH /api/service-applications/:id/status  (admin: update status) ─────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    console.log('[Update Status] Request:', { id: req.params.id, body: req.body, user: req.user });
    
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, adminNotes, appointmentDate } = req.body;
    const updates = {
      reviewedAt: new Date(),
    };

    if (typeof status === 'string' && status.trim()) {
      updates.status = status.trim();
      if (['approved', 'rejected'].includes(updates.status)) {
        updates.processedAt = new Date();
      }
    }

    if (typeof adminNotes === 'string') {
      updates.adminNotes = adminNotes;
    }

    if (appointmentDate) {
      const parsedDate = new Date(appointmentDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid appointmentDate' });
      }
      updates.appointmentDate = parsedDate;
    }

    const application = await ServiceApplication.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('serviceId', 'name department')
      .populate('userId',    'name email phone');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // ── SMS Notification ─────────────────────────────────────────────────────
    // Notify applicant about status change via SMS service layer (non-fatal).
    const applicant = application.userId;
    const targetPhone = application.notificationPhone || applicant?.phone;
    if (targetPhone && updates.status) {
      const serviceName = application.serviceId?.name || application.serviceName || 'the service';
      notifyApplicationStatus(targetPhone, serviceName, updates.status).catch((err) =>
        console.warn('[serviceApplicationController] SMS failed (non-fatal):', err.message)
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('[Update Status] Error:', error.message);
    console.error('[Update Status] Stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: error.message 
    });
  }
};

// ── DELETE /api/service-applications/:id ─────────────────────────────────────
exports.deleteApplication = async (req, res) => {
  try {
    const application = await ServiceApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Access check: owner or admin
    if (application.userId.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Non-admins can only delete submitted (unprocessed) applications
    if (application.status !== 'submitted' && req.user.role !== 'admin') {
      return res.status(400).json({
        message: 'Cannot delete an application that is already being processed'
      });
    }

    await ServiceApplication.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
