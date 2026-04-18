const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Service = require("../models/Service");
const User = require("../models/User");

const ACTIVE_STATUSES = ["PENDING_ADMIN_REVIEW", "AWAITING_USER_DOCS"];
const REVIEWABLE_STATUSES = ["PENDING_ADMIN_REVIEW", "AWAITING_USER_DOCS"];

const getUserIdFromRequest = (req) => req.user?.userId || req.user?.id || req.user?._id;

const applyForService = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { serviceId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!serviceId) {
      return res.status(400).json({ message: "serviceId is required" });
    }

    const activeApplication = await Application.findOne({
      userId,
      serviceId,
      status: { $in: ACTIVE_STATUSES }
    });

    if (activeApplication) {
      return res.status(400).json({
        message: "You already have an active application for this specific service."
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const application = await Application.create({
      userId,
      serviceId,
      status: "PENDING_ADMIN_REVIEW"
    });

    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          title: "New Application Received",
          message: `New application received for ${service.name}`,
          category: "APPLICATION"
        }))
      );
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error("applyForService error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const reviewApplication = async (req, res) => {
  try {
    console.log("reviewApplication req.params.id:", req.params.id);
    console.log("reviewApplication req.body:", req.body);

    let { requestedFields, deadlines } = req.body;

    if (typeof requestedFields === "string") {
      requestedFields = requestedFields
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(requestedFields) || requestedFields.length === 0) {
      return res.status(400).json({ message: "requestedFields must be a non-empty array" });
    }

    if (!deadlines && req.body.applicationDate && req.body.documentDate && req.body.appointmentDate) {
      deadlines = {
        applicationDate: req.body.applicationDate,
        documentDate: req.body.documentDate,
        appointmentDate: req.body.appointmentDate
      };
    }

    if (!deadlines || !deadlines.applicationDate || !deadlines.documentDate || !deadlines.appointmentDate) {
      return res.status(400).json({
        message: "deadlines.applicationDate, deadlines.documentDate, and deadlines.appointmentDate are required"
      });
    }

    const applicationDate = new Date(deadlines.applicationDate);
    const documentDate = new Date(deadlines.documentDate);
    const appointmentDate = new Date(deadlines.appointmentDate);

    if (
      Number.isNaN(applicationDate.getTime()) ||
      Number.isNaN(documentDate.getTime()) ||
      Number.isNaN(appointmentDate.getTime())
    ) {
      return res.status(400).json({ message: "One or more deadline dates are invalid" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = 'AWAITING_USER_DOCS';
    application.requestedFields = requestedFields;
    application.deadlines = {
      applicationDate,
      documentDate,
      appointmentDate
    };

    await application.save();

    await Notification.create({
      userId: application.userId,
      title: "Application Reviewed",
      message: "Admin has requested documents and set deadlines for your application.",
      category: "DOCUMENT"
    });

    return res.status(200).json({
      message: "Application reviewed successfully",
      application
    });
  } catch (error) {
    console.error("reviewApplication error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: { $in: REVIEWABLE_STATUSES } })
      .populate("userId", "name email")
      .populate("serviceId", "name requiredDocuments department")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("getPendingApplications error:", error);
    return res.status(500).json({ message: "Failed to fetch pending applications" });
  }
};

const getAdminApplicationsByDepartment = async (req, res) => {
  try {
    const applications = await Application.find({ status: { $ne: "COMPLETED" } })
      .populate("userId", "name email")
      .populate("serviceId", "name department requiredDocuments")
      .sort({ createdAt: -1 });

    const grouped = applications.reduce((acc, app) => {
      const deptName = app.serviceId?.department || "General";
      if (!acc[deptName]) {
        acc[deptName] = [];
      }
      acc[deptName].push(app);
      return acc;
    }, {});

    return res.status(200).json({ groupedData: grouped, total: applications.length });
  } catch (error) {
    console.error("getAdminApplicationsByDepartment error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const applications = await Application.find({ userId })
      .populate("serviceId", "name department")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("getUserApplications error:", error);
    return res.status(500).json({ message: "Failed to fetch user applications" });
  }
};

module.exports = {
  applyForService,
  reviewApplication,
  getPendingApplications,
  getAdminApplicationsByDepartment,
  getUserApplications
};