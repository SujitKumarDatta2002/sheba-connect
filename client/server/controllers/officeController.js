
// const Office = require('../models/Office');

// // Haversine formula to calculate distance between two points in km
// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Earth's radius in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// // Get offices for a given service, sorted by distance from user
// exports.getNearbyOffices = async (req, res) => {
//   try {
//     const { serviceId, userLat, userLng } = req.query;

//     if (!serviceId || !userLat || !userLng) {
//       return res.status(400).json({ message: 'Missing required parameters' });
//     }

//     const offices = await Office.find({ service: serviceId, isActive: true })
//       .populate('service', 'name department');

//     // Calculate distance for each office
//     const officesWithDistance = offices.map(office => {
//       const distance = getDistanceFromLatLonInKm(
//         parseFloat(userLat),
//         parseFloat(userLng),
//         office.latitude,
//         office.longitude
//       );
//       return {
//         ...office.toObject(),
//         distance: Math.round(distance * 10) / 10 // round to 1 decimal
//       };
//     });

//     // Sort by distance ascending
//     officesWithDistance.sort((a, b) => a.distance - b.distance);

//     res.json(officesWithDistance);
//   } catch (error) {
//     console.error('Error fetching nearby offices:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get a single office by ID
// exports.getOfficeById = async (req, res) => {
//   try {
//     const office = await Office.findById(req.params.id).populate('service', 'name department');
//     if (!office) {
//       return res.status(404).json({ message: 'Office not found' });
//     }
//     res.json(office);
//   } catch (error) {
//     console.error('Error fetching office:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Admin: Create an office
// exports.createOffice = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }
//     const office = new Office(req.body);
//     await office.save();
//     res.status(201).json(office);
//   } catch (error) {
//     console.error('Error creating office:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Admin: Update office
// exports.updateOffice = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }
//     const office = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!office) {
//       return res.status(404).json({ message: 'Office not found' });
//     }
//     res.json(office);
//   } catch (error) {
//     console.error('Error updating office:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Admin: Delete office
// exports.deleteOffice = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }
//     const office = await Office.findByIdAndDelete(req.params.id);
//     if (!office) {
//       return res.status(404).json({ message: 'Office not found' });
//     }
//     res.json({ message: 'Office deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting office:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };















const Office = require('../models/Office');
const Service = require('../models/Service');
const ServiceFeedback = require('../models/ServiceFeedback');
const { findNearbyOffices } = require('../services/osmOfficeService');

// ── Haversine distance (km) ───────────────────────────────────────────────────
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function toRad(deg) { return deg * (Math.PI / 180); }

// ── GET /api/offices/nearby ───────────────────────────────────────────────────
// Returns ALL offices for the service sorted nearest-first. No radius cap.
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
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'userLat / userLng must be valid numbers' });
    }

    const service = await Service.findById(serviceId).select('name department');
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    const osmOffices = await findNearbyOffices({ lat, lng, radius, service });
    const groupedFeedback = await ServiceFeedback.aggregate([
      { $match: { serviceId: service._id, 'office.osmId': { $exists: true } } },
      { $group: { _id: { osmType: '$office.osmType', osmId: '$office.osmId' }, averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 }, tags: { $push: '$tags' } } }
    ]);
    const feedbackByOffice = new Map(groupedFeedback.map((entry) => {
      const counts = entry.tags.flat().reduce((all, tag) => ({ ...all, [tag]: (all[tag] || 0) + 1 }), {});
      return [`${entry._id.osmType}/${entry._id.osmId}`, { averageRating: entry.averageRating ? Math.round(entry.averageRating * 10) / 10 : null, reviewCount: entry.reviewCount, commonTags: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tag]) => tag) }];
    }));
    const enriched = osmOffices.map((office) => {
      const community = feedbackByOffice.get(`${office.osmType}/${office.osmId}`) || { averageRating: null, reviewCount: 0, commonTags: [] };
      const distanceScore = Math.max(0, 1 - office.distance / 25);
      const ratingScore = community.averageRating === null ? 0.5 : ((community.averageRating * community.reviewCount) + 10.5) / ((community.reviewCount + 3) * 5);
      return { ...office, community, recommendationScore: distanceScore * 0.45 + ratingScore * 0.4 + Math.min(community.reviewCount / 5, 1) * 0.15 };
    });
    const nearest = enriched.reduce((best, office) => !best || office.distance < best.distance ? office : best, null);
    const best = enriched.reduce((winner, office) => !winner || office.recommendationScore > winner.recommendationScore ? office : winner, null);
    return res.json({ source: 'openstreetmap', service: { id: service._id, name: service.name, department: service.department }, offices: enriched.map((office) => ({ ...office, isNearest: nearest && office.osmType === nearest.osmType && office.osmId === nearest.osmId, isBestNearby: best && office.osmType === best.osmType && office.osmId === best.osmId })) });

    // Match offices even if isActive field is missing (common when added via Compass)
    const offices = await Office.find({
      service: serviceId,
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
        { isActive: null },
      ],
    }).populate('service', 'name department');

    console.log('[NearbyOffices] serviceId=%s → %d offices', serviceId, offices.length);

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

// ── DEBUG: GET /api/offices/debug/:serviceId ─────────────────────────────────
// Remove this route once your data is confirmed correct.
exports.debugOffices = async (req, res) => {
  try {
    const sid      = req.params.serviceId;
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
        _id: o._id, name: o.name, service: o.service, isActive: o.isActive,
        lat: o.latitude, lng: o.longitude,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/offices/:id ──────────────────────────────────────────────────────
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('service', 'name department');
    if (!office) return res.status(404).json({ message: 'Office not found' });
    res.json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Admin: create ─────────────────────────────────────────────────────────────
exports.createOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const office = new Office({ isActive: true, ...req.body });
    await office.save();
    res.status(201).json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Admin: update ─────────────────────────────────────────────────────────────
exports.updateOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const office = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!office) return res.status(404).json({ message: 'Office not found' });
    res.json(office);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Admin: delete ─────────────────────────────────────────────────────────────
exports.deleteOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const office = await Office.findByIdAndDelete(req.params.id);
    if (!office) return res.status(404).json({ message: 'Office not found' });
    res.json({ message: 'Office deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
