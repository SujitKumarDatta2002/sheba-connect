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
const { notifyApplicationStatus } = require('../services/smsService');

// ── POST /api/service-applications  (user applies) ──────────────────────────
exports.createServiceApplication = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      department,
      requiredDocuments,  // e.g. ['nid', 'passport']
      submittedDocuments,
      additionalInfo
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

    // ── Task 3 & 4 FIX: Check verified documents ──────────────────────────
    // Only documents with status === 'Verified' count toward eligibility.
    if (requiredDocuments && requiredDocuments.length > 0) {
      // Fetch the user's verified documents for the required types
      const verifiedDocs = await UserDocument.find({
        userId: req.user.userId,
        documentType: { $in: requiredDocuments },
        status: 'Verified',
      });

      // Build a set of verified document types for quick lookup
      const verifiedTypes = new Set(verifiedDocs.map((d) => d.documentType));

      // Identify any required document types that are missing or unverified
      const missingDocs = requiredDocuments.filter((docType) => !verifiedTypes.has(docType));

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
          message: 'Cannot apply: the following required documents are missing or not yet verified.',
          missingDocuments: missingLabels,
          hint: 'Please upload and wait for admin verification before applying.',
        });
      }
    }
    // ── END FIX ───────────────────────────────────────────────────────────

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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, department } = req.query;
    const filter = {};

    if (status)     filter.status     = status;
    if (department) filter.department = department;

    const applications = await ServiceApplication.find(filter)
      .populate('serviceId', 'name department processingTime cost')
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── PUT /api/service-applications/:id/status  (admin: update status) ─────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, adminNotes } = req.body;

    const application = await ServiceApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes:  adminNotes || '',
        reviewedAt:  new Date(),
        processedAt: (status === 'approved' || status === 'rejected') ? new Date() : undefined,
      },
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
    if (applicant?.phone) {
      const serviceName = application.serviceId?.name || application.serviceName || 'the service';
      notifyApplicationStatus(applicant.phone, serviceName, status).catch((err) =>
        console.warn('[serviceApplicationController] SMS failed (non-fatal):', err.message)
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
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
