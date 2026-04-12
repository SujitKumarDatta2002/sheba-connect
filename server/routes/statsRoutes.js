const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const UserDocument = require('../models/UserDocument');
const Solution = require('../models/Solution');
const Service = require('../models/Service');
const ServiceApplication = require('../models/ServiceApplication');

const publicDatasetCache = {
  updatedAt: 0,
  ttlMs: 10 * 60 * 1000,
  data: null
};

const getDayWindow = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = String(dateString).split('-').map(Number);
  if (!year || !month || !day) return null;

  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return { start, end };
};

const extractEstimatedProcessingDays = (processingTime) => {
  if (!processingTime || typeof processingTime !== 'string') return null;
  const matches = processingTime.match(/\d+/g);
  if (!matches || matches.length === 0) return null;
  return Number(matches[matches.length - 1]);
};

// Get system-wide statistics (public)
router.get('/system', async (req, res) => {
  try {
    const [
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalDocuments,
      totalSolutions
    ] = await Promise.all([
      User.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      UserDocument.countDocuments(),
      Solution.countDocuments()
    ]);

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    res.json({
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalDocuments,
      totalSolutions,
      resolutionRate
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get recent complaints (public)
router.get('/complaints/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('department issueKeyword status createdAt');
    
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching recent complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get official service-related dataset (ShebaConnect service registry)
router.get('/public-datasets', async (req, res) => {
  try {
    const selectedDate = req.query.date;
    const dayWindow = getDayWindow(selectedDate);
    if (selectedDate && !dayWindow) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const now = Date.now();
    const isUnfilteredRequest = !selectedDate;
    if (isUnfilteredRequest && publicDatasetCache.data && now - publicDatasetCache.updatedAt < publicDatasetCache.ttlMs) {
      return res.json(publicDatasetCache.data);
    }

    const applicationFilter = dayWindow
      ? { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } }
      : {};

    const complaintFilter = dayWindow
      ? { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } }
      : {};

    const userFilter = dayWindow
      ? { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } }
      : {};

    const documentFilter = dayWindow
      ? { uploadedAt: { $gte: dayWindow.start, $lte: dayWindow.end } }
      : {};

    const matchStage = dayWindow
      ? [{ $match: { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } } }]
      : [];

    const complaintMatchStage = dayWindow
      ? [{ $match: { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } } }]
      : [];

    const userMatchStage = dayWindow
      ? [{ $match: { createdAt: { $gte: dayWindow.start, $lte: dayWindow.end } } }]
      : [];

    const documentMatchStage = dayWindow
      ? [{ $match: { uploadedAt: { $gte: dayWindow.start, $lte: dayWindow.end } } }]
      : [];

    const [
      totalServices,
      activeServices,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      topAppliedServices,
      departmentLoad,
      requiredDocumentDemand,
      processingTimeBands,
      monthlyApplications,
      totalUsers,
      totalComplaints,
      pendingComplaints,
      processingComplaints,
      resolvedComplaints,
      totalDocuments,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      ServiceApplication.countDocuments(applicationFilter),
      ServiceApplication.countDocuments({ ...applicationFilter, status: 'pending' }),
      ServiceApplication.countDocuments({ ...applicationFilter, status: 'approved' }),
      ServiceApplication.countDocuments({ ...applicationFilter, status: 'rejected' }),
      ServiceApplication.aggregate([
        ...matchStage,
        { $group: { _id: '$serviceId', applications: { $sum: 1 } } },
        { $sort: { applications: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            serviceId: '$_id',
            name: { $ifNull: ['$service.name', 'Unknown Service'] },
            department: { $ifNull: ['$service.department', 'Unknown'] },
            applications: 1
          }
        }
      ]),
      ServiceApplication.aggregate([
        ...matchStage,
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ['$service.department', 'Unknown'] },
            applications: { $sum: 1 }
          }
        },
        { $sort: { applications: -1 } },
        {
          $project: {
            _id: 0,
            department: '$_id',
            applications: 1
          }
        }
      ]),
      Service.aggregate([
        { $unwind: { path: '$requiredDocuments', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$requiredDocuments', servicesUsing: { $sum: 1 } } },
        { $sort: { servicesUsing: -1 } },
        { $limit: 7 },
        {
          $project: {
            _id: 0,
            documentType: '$_id',
            servicesUsing: 1
          }
        }
      ]),
      Service.find().select('processingTime'),
      ServiceApplication.aggregate([
        ...matchStage,
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            applications: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            applications: 1
          }
        }
      ]),
      User.countDocuments(userFilter),
      Complaint.countDocuments(complaintFilter),
      Complaint.countDocuments({ ...complaintFilter, status: 'Pending' }),
      Complaint.countDocuments({ ...complaintFilter, status: 'Processing' }),
      Complaint.countDocuments({ ...complaintFilter, status: 'Resolved' }),
      UserDocument.countDocuments(documentFilter),
      UserDocument.countDocuments({ ...documentFilter, status: 'Pending' }),
      UserDocument.countDocuments({ ...documentFilter, status: 'Verified' }),
      UserDocument.countDocuments({ ...documentFilter, status: 'Rejected' })
    ]);

    const [
      complaintStatusBreakdown,
      complaintTrend,
      userRoleBreakdown,
      userTrend,
      documentStatusBreakdown,
      documentTypeBreakdown,
      documentTrend
    ] = await Promise.all([
      Complaint.aggregate([
        ...complaintMatchStage,
        { $group: { _id: { $ifNull: ['$status', 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, label: '$_id', value: '$count' } }
      ]),
      Complaint.aggregate([
        ...complaintMatchStage,
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', value: '$count' } }
      ]),
      User.aggregate([
        ...userMatchStage,
        { $group: { _id: { $ifNull: ['$role', 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, label: '$_id', value: '$count' } }
      ]),
      User.aggregate([
        ...userMatchStage,
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            value: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', value: '$value' } }
      ]),
      UserDocument.aggregate([
        ...documentMatchStage,
        { $group: { _id: { $ifNull: ['$status', 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, label: '$_id', value: '$count' } }
      ]),
      UserDocument.aggregate([
        ...documentMatchStage,
        { $group: { _id: { $ifNull: ['$documentType', 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, label: '$_id', value: '$count' } }
      ]),
      UserDocument.aggregate([
        ...documentMatchStage,
        {
          $group: {
            _id: {
              year: { $year: '$uploadedAt' },
              month: { $month: '$uploadedAt' }
            },
            value: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', value: '$value' } }
      ])
    ]);

    const serviceApprovalRate = totalApplications > 0
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    const processingTimeDistribution = {
      fast: 0,
      standard: 0,
      extended: 0,
      unknown: 0
    };

    processingTimeBands.forEach((service) => {
      const days = extractEstimatedProcessingDays(service.processingTime);
      if (days === null) {
        processingTimeDistribution.unknown += 1;
      } else if (days <= 3) {
        processingTimeDistribution.fast += 1;
      } else if (days <= 7) {
        processingTimeDistribution.standard += 1;
      } else {
        processingTimeDistribution.extended += 1;
      }
    });

    const documentLabels = {
      nid: 'NID',
      birthCertificate: 'Birth Certificate',
      passport: 'Passport',
      drivingLicense: 'Driving License',
      tin: 'TIN',
      citizenship: 'Citizenship',
      educationalCertificate: 'Educational Certificate'
    };

    const additionalDatasets = {
      source: {
        name: 'ShebaConnect Internal Analytics',
        country: 'Bangladesh',
        scope: 'Complaint, user, and document operations'
      },
      complaintInsights: {
        summary: {
          totalComplaints,
          pendingComplaints,
          processingComplaints,
          resolvedComplaints
        },
        statusBreakdown: complaintStatusBreakdown,
        trend: complaintTrend
      },
      userInsights: {
        summary: {
          totalUsers
        },
        roleBreakdown: userRoleBreakdown,
        trend: userTrend
      },
      documentInsights: {
        summary: {
          totalDocuments,
          pendingDocuments,
          verifiedDocuments,
          rejectedDocuments
        },
        statusBreakdown: documentStatusBreakdown,
        typeBreakdown: documentTypeBreakdown,
        trend: documentTrend
      }
    };

    const dataset = {
      source: {
        name: 'ShebaConnect Official Service Registry',
        country: 'Bangladesh',
        scope: 'Service catalog and application activity'
      },
      filters: {
        date: selectedDate || null
      },
      serviceInsights: {
        totalServices,
        activeServices,
        inactiveServices: Math.max(totalServices - activeServices, 0),
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        approvalRate: serviceApprovalRate,
        topAppliedServices,
        departmentLoad,
        requiredDocumentDemand: requiredDocumentDemand.map((item) => ({
          ...item,
          label: documentLabels[item.documentType] || item.documentType
        })),
        processingTimeDistribution,
        monthlyApplications
      },
      additionalDatasets,
      fetchedAt: new Date().toISOString()
    };

    if (isUnfilteredRequest) {
      publicDatasetCache.data = dataset;
      publicDatasetCache.updatedAt = now;
    }

    res.json(dataset);
  } catch (error) {
    console.error('Error fetching public datasets:', error);
    res.status(500).json({ message: 'Failed to fetch official service dataset' });
  }
});

module.exports = router;