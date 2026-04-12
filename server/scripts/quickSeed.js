const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '../.env' });

async function seedData() {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/sheba-connect';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const ServiceAnalysis = require('../models/ServiceAnalysis');
    const Service = require('../models/Service');

    // Get services
    const services = await Service.find().limit(5);
    console.log(`Found ${services.length} services`);

    if (services.length === 0) {
      console.log('⚠️  No services found in database');
      await mongoose.connection.close();
      return;
    }

    // Clear existing data
    await ServiceAnalysis.deleteMany({});
    console.log('Cleared existing analytics');

    // Create sample analytics
    const analytics = [
      {
        serviceId: services[0]._id,
        serviceName: services[0].name || 'Service 1',
        category: 'Licensing & Permits',
        whyNeeded: {
          title: 'Legal Requirement',
          description: 'This service is required by law for proper registration and compliance.',
          keyPoints: ['Proof of legal status', 'Required for official purposes', 'Necessary for transactions']
        },
        surveyData: {
          totalResponses: 245,
          needRating: 5,
          satisfactionRate: 82,
          commonComplaints: ['Long wait times', 'Complex procedures'],
          improvements: ['Online system', 'Better guidance']
        },
        mlInsights: {
          predictedDemand: 'High',
          seasonalTrends: [
            { month: 'January', demand: 'Medium' },
            { month: 'June', demand: 'High' }
          ]
        },
        statistics: {
          averageResolutionTime: '10-12 days',
          successRate: 96,
          totalApplications: 2450,
          yearOverYearGrowth: 15,
          costEstimate: '100-200 BDT'
        }
      },
      {
        serviceId: services[1]._id,
        serviceName: services[1].name || 'Service 2',
        category: 'Electrician',
        whyNeeded: {
          title: 'Essential Utility',
          description: 'Critical service for household and business operations.',
          keyPoints: ['Power for daily needs', 'Business requirement', 'Safety services']
        },
        surveyData: {
          totalResponses: 512,
          needRating: 5,
          satisfactionRate: 71,
          commonComplaints: ['High costs', 'Unreliable service'],
          improvements: ['Better grid infrastructure', 'Cost reduction']
        },
        mlInsights: {
          predictedDemand: 'High',
          seasonalTrends: [
            { month: 'April', demand: 'Very High' },
            { month: 'July', demand: 'Very High' }
          ]
        },
        statistics: {
          averageResolutionTime: '5-7 days',
          successRate: 93,
          totalApplications: 5600,
          yearOverYearGrowth: 22,
          costEstimate: '1000-5000 BDT'
        }
      },
      {
        serviceId: services[2]._id,
        serviceName: services[2].name || 'Service 3',
        category: 'Tax & Finance',
        whyNeeded: {
          title: 'Financial Compliance',
          description: 'Essential for legal business operations and government compliance.',
          keyPoints: ['Legal requirement', 'Bank loan eligibility', 'Government contracts']
        },
        surveyData: {
          totalResponses: 189,
          needRating: 4,
          satisfactionRate: 65,
          commonComplaints: ['Complex rules', 'Poor guidance'],
          improvements: ['Simplified system', 'Better support staff']
        },
        mlInsights: {
          predictedDemand: 'Medium',
          seasonalTrends: [
            { month: 'May', demand: 'Very High' },
            { month: 'June', demand: 'Very High' }
          ]
        },
        statistics: {
          averageResolutionTime: '15-20 days',
          successRate: 88,
          totalApplications: 1200,
          yearOverYearGrowth: 8,
          costEstimate: '500-2000 BDT'
        }
      },
      {
        serviceId: services[3]._id,
        serviceName: services[3].name || 'Service 4',
        category: 'Health & Sanitation',
        whyNeeded: {
          title: 'Public Health',
          description: 'Ensures community health and disease prevention.',
          keyPoints: ['Disease prevention', 'Food safety', 'Environmental protection']
        },
        surveyData: {
          totalResponses: 156,
          needRating: 4,
          satisfactionRate: 74,
          commonComplaints: ['Inconsistent standards', 'Poor communication'],
          improvements: ['Training programs', 'Clear guidelines']
        },
        mlInsights: {
          predictedDemand: 'Medium',
          seasonalTrends: [
            { month: 'March', demand: 'High' },
            { month: 'June', demand: 'High' }
          ]
        },
        statistics: {
          averageResolutionTime: '7-10 days',
          successRate: 91,
          totalApplications: 890,
          yearOverYearGrowth: 12,
          costEstimate: '200-1000 BDT'
        }
      }
    ];

    const inserted = await ServiceAnalysis.insertMany(analytics);
    console.log(`✅ Inserted ${inserted.length} analytics records`);

    // Verify insertion
    const count = await ServiceAnalysis.countDocuments();
    console.log(`✅ Total analytics in database: ${count}`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
