
const Helpline = require('../models/Helpline');

// Get all helplines, optionally filter by category
exports.getHelplines = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const helplines = await Helpline.find(filter).sort({ isEmergency: -1, category: 1, name: 1 });
    res.json(helplines);
  } catch (error) {
    console.error('Get helplines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create helpline
exports.createHelpline = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const helpline = new Helpline(req.body);
    await helpline.save();
    res.status(201).json(helpline);
  } catch (error) {
    console.error('Create helpline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update helpline
exports.updateHelpline = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const helpline = await Helpline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!helpline) {
      return res.status(404).json({ message: 'Helpline not found' });
    }
    res.json(helpline);
  } catch (error) {
    console.error('Update helpline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete helpline
exports.deleteHelpline = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const helpline = await Helpline.findByIdAndDelete(req.params.id);
    if (!helpline) {
      return res.status(404).json({ message: 'Helpline not found' });
    }
    res.json({ message: 'Helpline deleted successfully' });
  } catch (error) {
    console.error('Delete helpline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

