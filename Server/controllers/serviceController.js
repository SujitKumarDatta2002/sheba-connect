
const Service = require('../models/Service');

// Get all services with filtering
exports.getServices = async (req, res) => {
  try {
    const {
      department,
      urgency,
      minCost,
      maxCost,
      processingTime,
      requiredDocuments,
      search
    } = req.query;

    let filter = { isActive: true };

    if (department) filter.department = department;
    if (urgency) filter.urgency = urgency;
    if (minCost || maxCost) {
      filter.cost = {};
      if (minCost) filter.cost.$gte = Number(minCost);
      if (maxCost) filter.cost.$lte = Number(maxCost);
    }
    if (processingTime) {
      // Simple text match – for demo; in production you might store days as number
      filter.processingTime = { $regex: processingTime, $options: 'i' };
    }
    if (requiredDocuments) {
      const docs = requiredDocuments.split(',');
      filter.requiredDocuments = { $all: docs };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(filter).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create new service
exports.createService = async (req, res) => {
  try {
    // Check admin role (you can add middleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update service
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
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete service (soft delete by setting isActive false)
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
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

