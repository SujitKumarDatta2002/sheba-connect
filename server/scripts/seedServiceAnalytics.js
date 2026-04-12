const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '../.env' });

const ServiceAnalysis = require('../models/ServiceAnalysis');
const Service = require('../models/Service');

async function seedServiceAnalytics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sheba-connect');
    console.log('Connected to MongoDB');

    // Get all services
    const services = await Service.find().limit(10);
    console.log(`Found ${services.length} services`);

    const sampleAnalytics = [
      {
        serviceName: 'Birth Certificate Application',
        serviceId: services[0]?._id,
        category: 'Licensing & Permits',
        whyNeeded: {
          title: 'Legal Identity Document',
          description: 'Birth certificates are fundamental identity documents needed for education, employment, passport, and other legal purposes.',
          keyPoints: [
            'Proof of citizenship',
            'Required for school enrollment',
            'Essential for passport application',
            'Needed for employment'
          ]
        },
        regulations: {
          country: 'Bangladesh',
          rules: [
            'Birth must be registered within 45 days',
            'Late registration allowed up to age 18',
            'Required documents: Parent ID, witness',
            'Process takes 7-15 working days'
          ],
          penalties: [
            'Late registration fee: 50 BDT',
            'Very late registration: 500 BDT',
            'Non-compliance: Legal action possible'
          ]
        },
        commonIssues: [
          {
            issue: 'Lost original certificate',
            solution: 'Apply for duplicate certificate from Union Parishad',
            frequency: 'Medium'
          },
          {
            issue: 'Name spelling errors',
            solution: 'Submit correction form with supporting documents',
            frequency: 'High'
          },
          {
            issue: 'Missing parent information',
            solution: 'Provide affidavit and witness statements',
            frequency: 'Medium'
          }
        ],
        surveyData: {
          totalResponses: 245,
          needRating: 5,
          satisfactionRate: 82,
          commonComplaints: [
            'Long processing time',
            'Need to visit office multiple times',
            'Unclear documentation requirements'
          ],
          improvements: [
            'Online application system',
            'SMS updates on status',
            'Home service option',
            'Multi-language support'
          ]
        },
        mlInsights: {
          predictedDemand: 'High',
          seasonalTrends: [
            { month: 'January', demand: 'Medium' },
            { month: 'June', demand: 'High' },
            { month: 'December', demand: 'Very High' }
          ],
          relatedServices: [services[1]?._id, services[2]?._id]
        },
        statistics: {
          averageResolutionTime: '10-12 working days',
          successRate: 96,
          totalApplications: 2450,
          yearOverYearGrowth: 15,
          costEstimate: '100-200 BDT'
        },
        countrySpecificData: {
          country: 'Bangladesh',
          regulations: [
            'Registration with Union Parishad',
            'Certified copy from Deputy Commissioner',
            'National ID required for parent'
          ],
          requiredDocuments: ['Parental NID', 'Witness statement', 'Birth notification form'],
          estimatedCost: '150-200 BDT',
          processingTime: '10-15 days'
        }
      },
      {
        serviceName: 'Electricity Connection',
        serviceId: services[1]?._id,
        category: 'Electrician',
        whyNeeded: {
          title: 'Essential Utility Service',
          description: 'Electricity connection is critical for household activities, businesses, and emergency services.',
          keyPoints: [
            'Power for lighting and appliances',
            'Required for business operations',
            'Safety during emergencies',
            'Educational access for students'
          ]
        },
        regulations: {
          country: 'Bangladesh',
          rules: [
            'Electricity provided by DESCO in urban areas',
            'Consumer registration required',
            'Safety inspection mandatory',
            'Meter installation by certified technician'
          ],
          penalties: [
            'Illegal connection: 5000 BDT fine',
            'Non-payment: Service disconnection',
            'Wiring violations: Safety hazards'
          ]
        },
        commonIssues: [
          {
            issue: 'High electricity bills',
            solution: 'Meter verification and appliance audit',
            frequency: 'High'
          },
          {
            issue: 'Frequent disconnections',
            solution: 'Better load management and wiring upgrade',
            frequency: 'Medium'
          },
          {
            issue: 'Faulty wiring',
            solution: 'Professional rewiring and safety check',
            frequency: 'Medium'
          }
        ],
        surveyData: {
          totalResponses: 512,
          needRating: 5,
          satisfactionRate: 71,
          commonComplaints: [
            'High bills',
            'Frequent power cuts',
            'Poor customer service',
            'Frequent meter issues'
          ],
          improvements: [
            'Real-time bill tracking app',
            'Better fault reporting system',
            'More reliable grid',
            'Better customer support'
          ]
        },
        mlInsights: {
          predictedDemand: 'High',
          seasonalTrends: [
            { month: 'April', demand: 'Very High' },
            { month: 'July', demand: 'Very High' },
            { month: 'January', demand: 'Medium' }
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
        serviceName: 'Tax Information Service',
        serviceId: services[2]?._id,
        category: 'Tax & Finance',
        whyNeeded: {
          title: 'Financial Compliance',
          description: 'Tax information is essential for legal business operations, loan applications, and government benefits.',
          keyPoints: [
            'Legal business requirement',
            'Needed for bank loans',
            'Government contract eligibility',
            'Business credibility'
          ]
        },
        regulations: {
          country: 'Bangladesh',
          rules: [
            'Annual tax filing required for businesses and professionals',
            'VAT registration for large businesses',
            'Income tax for salaried individuals',
            'Tax deadline: June 30 each year'
          ],
          penalties: [
            'Late filing: 5% penalty on tax',
            'Non-compliance: Legal action',
            'False declaration: Imprisonment possible'
          ]
        },
        commonIssues: [
          {
            issue: 'Complex tax calculations',
            solution: 'Professional tax advisor consultation',
            frequency: 'High'
          },
          {
            issue: 'Missing documentation',
            solution: 'Proper bookkeeping and record maintenance',
            frequency: 'High'
          },
          {
            issue: 'TIN certificate confusion',
            solution: 'Clear TIN registration process guidance',
            frequency: 'Medium'
          }
        ],
        surveyData: {
          totalResponses: 189,
          needRating: 4,
          satisfactionRate: 65,
          commonComplaints: [
            'Complex procedures',
            'Unhelpful staff',
            'Long queues',
            'Unclear requirements'
          ],
          improvements: [
            'Online tax filing system',
            'Clear guidance materials',
            'Mobile service centers',
            'Simplified processes'
          ]
        },
        mlInsights: {
          predictedDemand: 'Medium',
          seasonalTrends: [
            { month: 'May', demand: 'Very High' },
            { month: 'June', demand: 'Very High' },
            { month: 'January', demand: 'Medium' }
          ]
        },
        statistics: {
          averageResolutionTime: '15-20 working days',
          successRate: 88,
          totalApplications: 1200,
          yearOverYearGrowth: 8,
          costEstimate: '500-2000 BDT'
        }
      },
      {
        serviceName: 'Health Sanitation Inspection',
        serviceId: services[3]?._id,
        category: 'Health & Sanitation',
        whyNeeded: {
          title: 'Public Health Protection',
          description: 'Sanitation inspections ensure safe food, clean water, and disease prevention in communities.',
          keyPoints: [
            'Disease prevention',
            'Food safety assurance',
            'Environmental protection',
            'Community health standards'
          ]
        },
        regulations: {
          country: 'Bangladesh',
          rules: [
            'Regular inspections of food establishments',
            'Waste disposal standards must be met',
            'Water quality testing required',
            'Staff health certificates needed'
          ],
          penalties: [
            'Non-compliance fine: 1000-5000 BDT',
            'Operation closure for severe violations',
            'Re-inspection fee: 200 BDT'
          ]
        },
        commonIssues: [
          {
            issue: 'Bad odor from waste',
            solution: 'Proper waste management system installation',
            frequency: 'High'
          },
          {
            issue: 'Contaminated water supply',
            solution: 'Water purification system upgrade',
            frequency: 'High'
          },
          {
            issue: 'Pest infestation',
            solution: 'Professional pest control and prevention',
            frequency: 'Medium'
          }
        ],
        surveyData: {
          totalResponses: 156,
          needRating: 4,
          satisfactionRate: 74,
          commonComplaints: [
            'Improper guidance',
            'Inconsistent standards',
            'Expensive compliance',
            'Difficult processes'
          ],
          improvements: [
            'Training workshops',
            'Clear compliance guide',
            'Subsidized equipment',
            'Better communication'
          ]
        },
        mlInsights: {
          predictedDemand: 'Medium',
          seasonalTrends: [
            { month: 'March', demand: 'High' },
            { month: 'June', demand: 'High' },
            { month: 'September', demand: 'Medium' }
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

    // Insert analytics data
    await ServiceAnalysis.deleteMany({});
    const inserted = await ServiceAnalysis.insertMany(sampleAnalytics.filter(a => a.serviceId));
    console.log(`✅ Inserted ${inserted.length} service analytics records`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedServiceAnalytics();
