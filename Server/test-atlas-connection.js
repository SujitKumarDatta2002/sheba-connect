const mongoose = require('mongoose');
require('dotenv').config();

const testAtlasConnection = async () => {
  console.log('🔗 Testing MongoDB Atlas Connection...');
  console.log('📍 Connection String:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@'));
  
  try {
    // Test basic connection
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database`);
    
    // Test write operation
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    await testCollection.deleteMany({ test: 'connection' });
    console.log('✅ Database read/write operations successful');
    
    console.log('🎉 MongoDB Atlas is ready for use!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Provide specific guidance based on error
    if (error.message.includes('IP')) {
      console.log('\n💡 Solution: Whitelist your IP in MongoDB Atlas');
      console.log('   1. Go to: https://cloud.mongodb.com/');
      console.log('   2. Navigate to Network Access');
      console.log('   3. Add your current IP address');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Solution: Check username/password');
      console.log('   1. Verify user "ShebaConnect" exists');
      console.log('   2. Check password in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Solution: Check connection string');
      console.log('   1. Verify cluster name "cluster0"');
      console.log('   2. Check MongoDB Atlas URL format');
    }
    
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

testAtlasConnection();
