

// controllers/helplineController.js
// Handles all helpline-related operations.
// Public: read. Admin only: create, update, delete.

const Helpline = require('../models/Helpline');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/helplines
// Returns all helplines. Supports optional ?category= and ?search= filters.
// ─────────────────────────────────────────────────────────────────────────────
exports.getHelplines = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      // Case-insensitive search across name and description
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort: emergency entries first, then by category, then alphabetically
    const helplines = await Helpline.find(filter)
      .sort({ isEmergency: -1, category: 1, name: 1 });

    res.json(helplines);
  } catch (err) {
    console.error('getHelplines error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/helplines  (Admin only)
// Creates a new helpline entry.
// ─────────────────────────────────────────────────────────────────────────────
exports.createHelpline = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const helpline = new Helpline(req.body);
    await helpline.save();
    res.status(201).json(helpline);
  } catch (err) {
    console.error('createHelpline error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/helplines/:id  (Admin only)
// Updates an existing helpline by ID.
// ─────────────────────────────────────────────────────────────────────────────
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
  } catch (err) {
    console.error('updateHelpline error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/helplines/:id  (Admin only)
// Permanently removes a helpline.
// ─────────────────────────────────────────────────────────────────────────────
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
  } catch (err) {
    console.error('deleteHelpline error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};