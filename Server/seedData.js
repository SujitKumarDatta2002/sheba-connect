const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Complaint = require('./models/Complaint');
const Document = require('./models/Document');
const Recommendation = require('./models/Recommendation');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Complaint.deleteMany({});
    await Document.deleteMany({});
    await Recommendation.deleteMany({});

    // Create sample user
    const user = new User({
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'hashedpassword123'
    });
    await user.save();
    console.log('Sample user created');

    // Create sample services
    const services = [
      {
        name: 'Service 1',
        description: 'This is the first service available for users',
        category: 'General',
        prerequisites: ['Basic Training', 'ID Verification'],
        documentsRequired: ['ID Proof', 'Address Proof']
      },
      {
        name: 'Service 2',
        description: 'Second service with advanced features',
        category: 'Advanced',
        prerequisites: ['Service 1 Completion'],
        documentsRequired: ['Certificate of Completion']
      },
      {
        name: 'Service 3',
        description: 'Third service for specialized needs',
        category: 'Specialized',
        prerequisites: ['Background Check', 'Service 2 Completion'],
        documentsRequired: ['Background Check Report']
      },
      {
        name: 'Service A',
        description: 'Service A with basic requirements',
        category: 'Basic',
        prerequisites: ['Registration'],
        documentsRequired: ['Registration Form']
      },
      {
        name: 'Service B',
        description: 'Service B requiring course completion',
        category: 'Educational',
        prerequisites: ['Course Completion'],
        documentsRequired: ['Course Certificate']
      },
      {
        name: 'Service C',
        description: 'Service C for premium users',
        category: 'Premium',
        prerequisites: ['Premium Subscription'],
        documentsRequired: ['Subscription Proof']
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log('Sample services created');

    // Save some services to user
    user.savedServices = [createdServices[0]._id, createdServices[3]._id, createdServices[4]._id];
    await user.save();

    // Update services with savedBy
    await Service.findByIdAndUpdate(createdServices[0]._id, { $push: { savedBy: user._id } });
    await Service.findByIdAndUpdate(createdServices[3]._id, { $push: { savedBy: user._id } });
    await Service.findByIdAndUpdate(createdServices[4]._id, { $push: { savedBy: user._id } });

    // Create sample complaints
    const complaints = [
      {
        user: user._id,
        subject: 'Complaint History 1',
        description: 'This is the first complaint from the user',
        status: 'Demoted',
        priority: 'Medium'
      },
      {
        user: user._id,
        subject: 'Complaint History 2',
        description: 'Second complaint regarding service issues',
        status: 'In Progress',
        priority: 'High'
      },
      {
        user: user._id,
        subject: 'Complaint History 3',
        description: 'Third complaint about document processing',
        status: 'Demoted',
        priority: 'Low'
      }
    ];

    // Set dates to match the image
    complaints[0].createdAt = new Date('2026-01-03');
    complaints[1].createdAt = new Date('2026-05-20');
    complaints[2].createdAt = new Date('2026-09-25');

    await Complaint.insertMany(complaints);
    console.log('Sample complaints created');

    // Create sample documents
    const documents = [
      {
        user: user._id,
        serviceName: 'Service A',
        documentType: 'ID Proof',
        fileName: 'id_document.pdf',
        filePath: '/uploads/sample_id.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf'
      },
      {
        user: user._id,
        serviceName: 'Service B',
        documentType: 'Course Certificate',
        fileName: 'course_certificate.pdf',
        filePath: '/uploads/sample_certificate.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf'
      }
    ];

    await Document.insertMany(documents);
    console.log('Sample documents created');

    // Create sample recommendations
    const recommendations = [
      {
        user: user._id,
        title: 'Complete Your Profile',
        description: 'Add more information to your profile to get personalized service recommendations',
        category: 'Profile',
        priority: 'High',
        isPersonalized: true
      },
      {
        user: user._id,
        title: 'Upload Required Documents',
        description: 'Make sure all necessary documents are uploaded for your saved services',
        category: 'Documents',
        priority: 'Medium',
        isPersonalized: true
      }
    ];

    await Recommendation.insertMany(recommendations);
    console.log('Sample recommendations created');

    console.log('Database seeded successfully!');
    console.log(`Sample user ID: ${user._id}`);
    console.log('You can now start the application and use this user ID for testing.');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
