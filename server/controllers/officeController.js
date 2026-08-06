

// controllers/officeController.js
// Handles nearby office lookups and admin CRUD for offices.
// getNearbyOffices is public. All write operations require admin role.

const Office = require('../models/Office');
const Service = require('../models/Service');
const ServiceFeedback = require('../models/ServiceFeedback');
const { findNearbyOffices, classifyServiceForOfficeSearch } = require('../services/osmOfficeService');

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

async function findRegisteredOffices(serviceId, lat, lng) {
  const offices = await Office.find({
    service: serviceId,
    $or: [{ isActive: true }, { isActive: { $exists: false } }, { isActive: null }]
  });

  return offices.map((office) => ({
    // Use an identifier compatible with the map card even though this office
    // originates from our curated data rather than OpenStreetMap.
    osmType: 'database',
    osmId: String(office._id),
    name: office.name,
    address: office.address,
    latitude: office.latitude,
    longitude: office.longitude,
    phone: office.phone || '',
    openingHours: '',
    website: '',
    distance: Math.round(getDistanceKm(lat, lng, office.latitude, office.longitude) * 10) / 10
  })).sort((a, b) => a.distance - b.distance);
}

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
    const { serviceId, userLat, userLng, radius } = req.query;

    if (!serviceId || !userLat || !userLng) {
      return res.status(400).json({
        message: 'Missing required params: serviceId, userLat, userLng',
      });
    }

    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'userLat and userLng must be valid numbers' });
    }

    const service = await Service.findById(serviceId).select('name department officeSearchKeywords officeSearchCategory');
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    let osmOffices = [];
    let source = 'openstreetmap';
    try {
      osmOffices = await findNearbyOffices({ lat, lng, radius, service });
    } catch (lookupError) {
      // A public map provider may be temporarily overloaded. Keep the map
      // useful by returning offices explicitly registered for this service.
      console.warn('OpenStreetMap nearby lookup failed:', lookupError.message);
      source = 'database';
    }

    if (!osmOffices.length) {
      osmOffices = await findRegisteredOffices(service._id, lat, lng);
      source = osmOffices.length ? 'database' : source;
    }
    const feedback = await ServiceFeedback.aggregate([
      { $match: { serviceId: service._id, 'office.osmId': { $exists: true } } },
      { $group: {
        _id: { osmType: '$office.osmType', osmId: '$office.osmId' },
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        tags: { $push: '$tags' }
      } }
    ]);
    const feedbackByOffice = new Map(feedback.map((entry) => {
      const tagCounts = entry.tags.flat().reduce((counts, tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
        return counts;
      }, {});
      return [`${entry._id.osmType}/${entry._id.osmId}`, {
        averageRating: entry.averageRating ? Math.round(entry.averageRating * 10) / 10 : null,
        reviewCount: entry.reviewCount,
        commonTags: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tag]) => tag)
      }];
    }));
    const enriched = osmOffices.map((office) => {
      const community = feedbackByOffice.get(`${office.osmType}/${office.osmId}`) || { averageRating: null, reviewCount: 0, commonTags: [] };
      const distanceScore = Math.max(0, 1 - office.distance / 25);
      const adjustedRating = community.averageRating === null
        ? 0.5
        : ((community.averageRating * community.reviewCount) + (3.5 * 3)) / ((community.reviewCount + 3) * 5);
      const reviewScore = Math.min(community.reviewCount / 5, 1);
      return { ...office, community, recommendationScore: (distanceScore * 0.45) + (adjustedRating * 0.4) + (reviewScore * 0.15) };
    });
    const best = enriched.reduce((currentBest, office) => !currentBest || office.recommendationScore > currentBest.recommendationScore ? office : currentBest, null);
    const nearest = enriched.reduce((currentNearest, office) => !currentNearest || office.distance < currentNearest.distance ? office : currentNearest, null);
    return res.json({
      source,
      service: {
        id: service._id,
        name: service.name,
        department: service.department,
        officeCategory: classifyServiceForOfficeSearch(service).category
      },
      offices: enriched.map((office) => ({
        ...office,
        isBestNearby: best && office.osmType === best.osmType && office.osmId === best.osmId,
        isNearest: nearest && office.osmType === nearest.osmType && office.osmId === nearest.osmId
      }))
    });

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
    res.json({
      source: 'openstreetmap',
      service: null,
      offices: [],
      warning: 'Nearby office data is temporarily unavailable. Please try again shortly.'
    });
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
