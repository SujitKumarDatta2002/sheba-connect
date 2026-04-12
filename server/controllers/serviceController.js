

// controllers/serviceController.js
// Handles all government service operations.
// Public: read with filtering. Admin only: create, update, soft-delete.

const Service = require('../models/Service');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/services
// Returns all active services. Supports multiple query filters:
//   ?department=   ?urgency=   ?minCost=   ?maxCost=
//   ?processingTime=   ?requiredDocuments=nid,passport   ?search=
// ─────────────────────────────────────────────────────────────────────────────
exports.getServices = async (req, res) => {
  try {
    const {
      department, urgency, minCost, maxCost,
      processingTime, requiredDocuments, search,
    } = req.query;

    // Only return active services by default
    const filter = { isActive: true };

    if (department) {
      filter.department = department;
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    // Cost range — build the $gte / $lte object only when at least one bound is provided
    if (minCost || maxCost) {
      filter.cost = {};
      if (minCost) filter.cost.$gte = Number(minCost);
      if (maxCost) filter.cost.$lte = Number(maxCost);
    }

    // processingTime is stored as a string (e.g. "3-5 days"), so we use a regex match
    if (processingTime) {
      filter.processingTime = { $regex: processingTime, $options: 'i' };
    }

    // requiredDocuments comes as a comma-separated string; match services that require ALL of them
    if (requiredDocuments) {
      filter.requiredDocuments = { $all: requiredDocuments.split(',') };
    }

    // Full-text search across service name and description
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(filter).sort({ name: 1 });
    res.json(services);
  } catch (err) {
    console.error('getServices error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/services/:id
// Returns a single service by its MongoDB ID.
// ─────────────────────────────────────────────────────────────────────────────
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error('getServiceById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/services  (Admin only)
// Creates a new service entry.
// ─────────────────────────────────────────────────────────────────────────────
exports.createService = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error('createService error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/services/:id  (Admin only)
// Updates an existing service by ID.
// ─────────────────────────────────────────────────────────────────────────────
exports.updateService = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error('updateService error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/services/:id  (Admin only)
// Soft-deletes by setting isActive = false.
// The record stays in MongoDB but won't appear in public listings.
// Use this instead of hard-deleting so historical data is preserved.
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteService = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deactivated successfully' });
  } catch (err) {
    console.error('deleteService error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};