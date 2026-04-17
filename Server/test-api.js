const mongoose = require('mongoose');
require('dotenv').config();

// Test database connection
const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    
    // Test basic models
    const User = require('./models/User');
    const Service = require('./models/Service');
    
    // Create a test user
    const testUser = new User({
      username: 'test_user',
      email: 'test@example.com',
      password: 'hashedpassword123'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully');
    
    // Create a test service
    const testService = new Service({
      name: 'Test Service',
      description: 'A test service for verification',
      category: 'Test',
      prerequisites: ['Test Prerequisite'],
      documentsRequired: ['Test Document']
    });
    
    await testService.save();
    console.log('✅ Test service created successfully');
    
    // Test saving service to user
    testUser.savedServices.push(testService._id);
    await testUser.save();
    
    testService.savedBy.push(testUser._id);
    await testService.save();
    
    console.log('✅ Service-user relationship created successfully');
    
    // Clean up test data
    await User.deleteMany({ username: 'test_user' });
    await Service.deleteMany({ name: 'Test Service' });
    
    console.log('✅ Test data cleaned up');
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

testConnection();
