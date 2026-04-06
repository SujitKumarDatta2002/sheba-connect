
const Office = require('../models/Office');

// Haversine formula to calculate distance between two points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Get offices for a given service, sorted by distance from user
exports.getNearbyOffices = async (req, res) => {
  try {
    const { serviceId, userLat, userLng } = req.query;

    if (!serviceId || !userLat || !userLng) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const offices = await Office.find({ service: serviceId, isActive: true })
      .populate('service', 'name department');

    // Calculate distance for each office
    const officesWithDistance = offices.map(office => {
      const distance = getDistanceFromLatLonInKm(
        parseFloat(userLat),
        parseFloat(userLng),
        office.latitude,
        office.longitude
      );
      return {
        ...office.toObject(),
        distance: Math.round(distance * 10) / 10 // round to 1 decimal
      };
    });

    // Sort by distance ascending
    officesWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(officesWithDistance);
  } catch (error) {
    console.error('Error fetching nearby offices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('service', 'name department');
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }
    res.json(office);
  } catch (error) {
    console.error('Error fetching office:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create an office
exports.createOffice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const office = new Office(req.body);
    await office.save();
    res.status(201).json(office);
  } catch (error) {
    console.error('Error creating office:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update office
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
  } catch (error) {
    console.error('Error updating office:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete office
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
  } catch (error) {
    console.error('Error deleting office:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
