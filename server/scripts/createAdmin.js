const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Import your connectDB function (adjust the path as needed)
const connectDB = require('../config/db');

const createAdmin = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    // Use your existing connectDB function
    await connectDB();
    
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gov.bd' });
    if (existingAdmin) {
      console.log('✅ Admin already exists:');
      console.log(`📧 Email: admin@gov.bd`);
      console.log(`🔑 Password: [hidden - already set]`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create admin user
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@gov.bd',
      password: hashedPassword,
      phone: '01700000000',
      nid: 'ADMIN000001',
      address: 'Government Secretariat, Dhaka',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@gov.bd');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️ Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:');
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();