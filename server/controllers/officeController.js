

// controllers/officeController.js
// Handles nearby office lookups and admin CRUD for offices.
// getNearbyOffices is public. All write operations require admin role.

const Office = require('../models/Office');

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Haversine formula
// Calculates straight-line distance between two lat/lng points in kilometres.
// ─────────────────────────────────────────────────────────────────────────────
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R    = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * (Math.PI / 180); }

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/offices/nearby?serviceId=&userLat=&userLng=
// Returns ALL offices for the service, sorted nearest-first.
// No radius cap — the frontend handles how many to display.
//
// The $or in the query also catches offices where isActive was never set
// (common when documents are added manually via MongoDB Compass).
// ─────────────────────────────────────────────────────────────────────────────
exports.getNearbyOffices = async (req, res) => {
  try {
    const { serviceId, userLat, userLng } = req.query;

    if (!serviceId || !userLat || !userLng) {
      return res.status(400).json({
        message: 'Missing required params: serviceId, userLat, userLng',
      });
    }

    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'userLat and userLng must be valid numbers' });
    }

    const offices = await Office.find({
      service: serviceId,
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
        { isActive: null },
      ],
    }).populate('service', 'name department');

    console.log('[NearbyOffices] serviceId=%s → %d offices found', serviceId, offices.length);

    // Add distance to each result, then sort nearest-first
    const withDistance = offices.map(o => ({
      ...o.toObject(),
      distance: Math.round(getDistanceKm(lat, lng, o.latitude, o.longitude) * 10) / 10,
    }));

    withDistance.sort((a, b) => a.distance - b.distance);

    res.json(withDistance);
  } catch (err) {
    console.error('getNearbyOffices error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/offices/debug/:serviceId
// Diagnostic tool — shows what the DB contains for a serviceId.
// Helps debug why offices are missing (wrong ObjectId, isActive=false, etc.)
// REMOVE THIS ROUTE once your data is confirmed correct.
// ─────────────────────────────────────────────────────────────────────────────
exports.debugOffices = async (req, res) => {
  try {
    const sid = req.params.serviceId;

    const all      = await Office.find({}).populate('service', 'name');
    const matching = await Office.find({ service: sid });
    const active   = await Office.find({ service: sid, isActive: true });
    const noField  = await Office.find({ service: sid, isActive: { $exists: false } });

    res.json({
      serviceIdQueried: sid,
      summary: {
        totalInDB:         all.length,
        matchingServiceId: matching.length,
        withIsActiveTrue:  active.length,
        missingIsActive:   noField.length,
      },
      allOffices: all.map(o => ({
        _id: o._id, name: o.name, service: o.service,
        isActive: o.isActive, lat: o.latitude, lng: o.longitude,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/offices/:id
// Returns a single office by ID with its service info populated.
// ─────────────────────────────────────────────────────────────────────────────
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id)
      .populate('service', 'name department');

    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    res.json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/offices  (Admin only)
// Creates a new office. isActive defaults to true.
// ─────────────────────────────────────────────────────────────────────────────
exports.createOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const office = new Office({ isActive: true, ...req.body });
    await office.save();
    res.status(201).json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/offices/:id  (Admin only)
// Updates an office record by ID.
// ─────────────────────────────────────────────────────────────────────────────
exports.updateOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const office = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    res.json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/offices/:id  (Admin only)
// Permanently removes an office record from the database.
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const office = await Office.findByIdAndDelete(req.params.id);

    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    res.json({ message: 'Office deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};