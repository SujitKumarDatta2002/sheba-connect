// Demo script to test API endpoints
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Service = require('./models/Service');
const Complaint = require('./models/Complaint');
const Document = require('./models/Document');
const Recommendation = require('./models/Recommendation');

const app = express();
app.use(cors());
app.use(express.json());

// Demo endpoints for testing
app.get('/demo/test', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const stats = {
      users: await User.countDocuments(),
      services: await Service.countDocuments(),
      complaints: await Complaint.countDocuments(),
      documents: await Document.countDocuments(),
      recommendations: await Recommendation.countDocuments()
    };
    
    res.json({
      message: '✅ Service Portal API is working!',
      database: '🗄️ Connected to MongoDB',
      stats: stats,
      endpoints: {
        services: '/api/services',
        complaints: '/api/complaints',
        documents: '/api/documents',
        recommendations: '/api/recommendations',
        users: '/api/users'
      }
    });
    
  } catch (error) {
    res.status(500).json({
      message: '❌ API test failed',
      error: error.message
    });
  }
});

app.get('/demo/sample-data', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const services = await Service.find().limit(3);
    const complaints = await Complaint.find().limit(3);
    const recommendations = await Recommendation.find().limit(3);
    
    res.json({
      message: '📊 Sample data from database',
      services: services,
      complaints: complaints,
      recommendations: recommendations
    });
    
  } catch (error) {
    res.status(500).json({
      message: '❌ Failed to fetch sample data',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Demo API running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET http://localhost:${PORT}/demo/test`);
  console.log(`   GET http://localhost:${PORT}/demo/sample-data`);
});
