import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosAuth from '../config/axiosInstance';
import API from '../config/api';
import {
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFileUpload,
  FaArrowLeft, FaClock, FaUser, FaMapMarkerAlt, FaFileAlt, FaDollarSign,
  FaShieldAlt, FaInfoCircle, FaPaperPlane, FaDownload, FaEye, FaIdCard,
  FaBirthdayCake, FaPassport, FaCar, FaMoneyBill, FaGraduationCap, FaSpinner,
  FaChartLine, FaHistory, FaCalendarCheck, FaSms, FaBell, FaMobile,
  FaCheck, FaTimes, FaEnvelope, FaPhoneAlt
} from 'react-icons/fa';

const DOCUMENT_LABELS = {
  nid: 'National ID',
  birthCertificate: 'Birth Certificate',
  passport: 'Passport',
  drivingLicense: 'Driving License',
  tin: 'TIN Certificate',
  citizenship: 'Citizenship Certificate',
  educationalCertificate: 'Educational Certificate'
};

const DOCUMENT_ICONS = {
  nid: FaIdCard,
  birthCertificate: FaBirthdayCake,
  passport: FaPassport,
  drivingLicense: FaCar,
  tin: FaMoneyBill,
  citizenship: FaShieldAlt,
  educationalCertificate: FaGraduationCap
};

export default function ServiceApplication() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [documentStatus, setDocumentStatus] = useState({});
  const [readinessStatus, setReadinessStatus] = useState('loading');
  const [missingDocuments, setMissingDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(new Set());
  const [checkingDocuments, setCheckingDocuments] = useState(false);
  const [resolutionAnalytics, setResolutionAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [smsPreferences, setSmsPreferences] = useState({
    enabled: true,
    phoneNumber: '',
    reminders: true,
    statusUpdates: true,
    documentAlerts: true,
    completionNotice: true
  });
  const [smsNotificationStatus, setSmsNotificationStatus] = useState(null);
  const [sendingSms, setSendingSms] = useState(false);

  // Fetch service details and user documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await axiosAuth.get(`/api/services/${serviceId}`);
        setService(serviceRes.data);

        const docsRes = await axiosAuth.get('/api/documents');
        setUserDocuments(docsRes.data);

        analyzeDocumentReadiness(serviceRes.data.requiredDocuments, docsRes.data);
        fetchResolutionAnalytics(serviceId);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchData();
    }
  }, [serviceId]);

  const analyzeDocumentReadiness = (requiredDocs, userDocs) => {
    const status = {};
    const missing = [];
    const uploaded = [];

    requiredDocs.forEach(docType => {
      // API returns `documentType` field (not `type`) and `status` string (not a `verified` boolean)
      const userDoc = userDocs.find(doc => doc.documentType === docType);
      
      if (userDoc) {
        const isVerified = userDoc.status === 'Verified';
        status[docType] = {
          exists: true,
          verified: isVerified,
          document: userDoc,
          status: isVerified ? 'verified' : (userDoc.status === 'Rejected' ? 'rejected' : 'pending')
        };
        uploaded.push(docType);
      } else {
        status[docType] = {
          exists: false,
          verified: false,
          document: null,
          status: 'missing'
        };
        missing.push(docType);
      }
    });

    setDocumentStatus(status);
    setMissingDocuments(missing);
    setUploadedDocuments(uploaded);

    // Determine overall readiness: ALL required docs must be Verified
    const allVerified = requiredDocs.length > 0 &&
      requiredDocs.every(docType => status[docType]?.status === 'verified');
    
    if (allVerified) {
      setReadinessStatus('ready');
    } else if (uploaded.length > 0) {
      setReadinessStatus('partial');
    } else {
      setReadinessStatus('incomplete');
    }
  };

  const handleDocumentUpload = (docType) => {
    // Mark this document as being uploaded
    setUploadingDocs(prev => new Set(prev).add(docType));
    
    // Navigate to upload page with return URL
    navigate(`/upload/${docType}?returnTo=/apply-service/${serviceId}`);
  };

  const refreshDocuments = async () => {
    setCheckingDocuments(true);
    try {
      const docsRes = await axiosAuth.get('/api/documents');
      const freshDocs = docsRes.data;
      setUserDocuments(freshDocs);
      if (service) {
        analyzeDocumentReadiness(service.requiredDocuments, freshDocs);
      }
    } catch (error) {
      console.error('Error refreshing documents:', error);
    } finally {
      setCheckingDocuments(false);
    }
  };

  // Fetch resolution analytics
  const fetchResolutionAnalytics = async (serviceId) => {
    setLoadingAnalytics(true);
    try {
      // Mock analytics data - in real implementation, this would come from API
      const mockAnalytics = {
        serviceId,
        totalApplications: 1247,
        averageResolutionTime: 12, // days
        resolutionDistribution: {
          '0-7 days': 35,
          '8-14 days': 40,
          '15-21 days': 20,
          '22+ days': 5
        },
        departmentAverage: 15, // department-wide average
        userLocationFactor: 1.1, // location-based adjustment factor
        seasonFactor: 0.9, // seasonal adjustment
        expectedResolution: {
          minDays: 8,
          maxDays: 18,
          mostLikely: 12,
          confidence: 85 // percentage confidence
        },
        trends: {
          direction: 'decreasing', // 'increasing', 'stable', 'decreasing'
          changePercent: -12, // percentage change from last month
          monthlyData: [
            { month: 'Jan', avgDays: 15 },
            { month: 'Feb', avgDays: 14 },
            { month: 'Mar', avgDays: 13 },
            { month: 'Apr', avgDays: 12 }
          ]
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setResolutionAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching resolution analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // SMS API Integration Functions
  const sendSmsNotification = async (phoneNumber, message, type) => {
    setSendingSms(true);
    try {
      // Mock SMS API call - in real implementation, this would call your SMS service
      const smsPayload = {
        to: phoneNumber,
        message: message,
        serviceId: serviceId,
        type: type, // 'reminder', 'status_update', 'document_alert', 'completion'
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const response = {
        success: true,
        messageId: `SMS_${Date.now()}`,
        delivered: true,
        cost: 0.05
      };

      setSmsNotificationStatus({
        type: 'success',
        message: `SMS sent successfully to ${phoneNumber}`,
        details: response
      });

      return response;
    } catch (error) {
      console.error('SMS sending failed:', error);
      setSmsNotificationStatus({
        type: 'error',
        message: 'Failed to send SMS notification',
        details: error.message
      });
      throw error;
    } finally {
      setSendingSms(false);
    }
  };

  const sendApplicationReminder = async () => {
    if (!smsPreferences.enabled || !smsPreferences.phoneNumber) {
      return;
    }

    const message = `Sheba Connect: Reminder - Your application for ${service?.name} is ready to submit. Expected completion: ${resolutionAnalytics?.expectedResolution?.mostLikely || 12} days. Reply STOP to unsubscribe.`;
    
    await sendSmsNotification(smsPreferences.phoneNumber, message, 'reminder');
  };

  // Check for return from upload page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justUploaded = urlParams.get('justUploaded');
    
    if (justUploaded) {
      // Remove the parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Refresh documents to check newly uploaded ones
      refreshDocuments();
    }
  }, []);

  const handleApply = async () => {
    if (readinessStatus !== 'ready') {
      setShowDetails(true);
      return;
    }

    setSubmitting(true);
    try {
      // Create service application
      const applicationData = {
        serviceId: serviceId,
        serviceType: service.name,
        department: service.department,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        documents: uploadedDocuments,
        additionalInfo: document.querySelector('textarea')?.value || '',
        smsNotifications: smsPreferences
      };

      const response = await axios.post(`${API}/api/applications`, applicationData);
      
      // Send SMS notification for successful submission
      if (smsPreferences.enabled && smsPreferences.phoneNumber && smsPreferences.statusUpdates) {
        await sendSmsNotification(smsPreferences.phoneNumber, 
          `Sheba Connect: Your application for ${service.name} has been submitted successfully. Reference: APP${Date.now().toString().slice(-6)}`, 
          'status_update');
      }
      
      // Show success message
      alert('Application submitted successfully! You will receive updates on your application status.');
      
      // Navigate back to services
      navigate('/services');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'missing':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaTimesCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'missing':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getReadinessAlert = () => {
    switch (readinessStatus) {
      case 'ready':
        return {
          type: 'success',
          title: 'Ready to Apply!',
          message: 'All required documents are verified. You can proceed with your application.',
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'partial':
        return {
          type: 'warning',
          title: 'Documents Pending Verification',
          message: `You have uploaded ${uploadedDocuments.length} of ${service?.requiredDocuments.length} required documents. Some documents are still pending verification.`,
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800'
        };
      case 'incomplete':
        return {
          type: 'error',
          title: 'Documents Missing',
          message: `You need to upload ${missingDocuments.length} required documents before applying.`,
          icon: <FaTimesCircle className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      default:
        return null;
    }
  };

  const updateSmsPreferences = async (preferences) => {
    try {
      // Mock API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSmsPreferences(preferences);
      setSmsNotificationStatus({
        type: 'success',
        message: 'SMS preferences updated successfully'
      });
    } catch (error) {
      console.error('Failed to update SMS preferences:', error);
      setSmsNotificationStatus({
        type: 'error',
        message: 'Failed to update SMS preferences'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Service not found</h2>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const readinessAlert = getReadinessAlert();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft />
            <span>Back to Services</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h1>
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                <span className="text-sm text-gray-600">Processing: {service.processingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-green-500" />
                <span className="text-sm text-gray-600">Cost:  {new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(service.cost)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="text-sm text-gray-600">Location: {service.location || 'Various locations'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Alert */}
        {readinessAlert && (
          <div className={`mb-6 p-4 rounded-xl border ${readinessAlert.bgColor} ${readinessAlert.borderColor}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {readinessAlert.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${readinessAlert.textColor}`}>{readinessAlert.title}</h3>
                <p className={`text-sm mt-1 ${readinessAlert.textColor}`}>{readinessAlert.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Analytics */}
        {loadingAnalytics ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Expected Resolution Time</h2>
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Analyzing resolution data...</span>
            </div>
          </div>
        ) : resolutionAnalytics && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Expected Resolution Time</h2>
              <span className="text-sm text-gray-500 ml-auto">
                Based on {resolutionAnalytics.totalApplications.toLocaleString()} applications
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Expected Timeline */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarCheck className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Expected Timeline</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {resolutionAnalytics.expectedResolution.mostLikely} days
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {resolutionAnalytics.expectedResolution.minDays}-{resolutionAnalytics.expectedResolution.maxDays} days range
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  {resolutionAnalytics.expectedResolution.confidence}% confidence
                </div>
              </div>

              {/* Department Average */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaHistory className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">Department Average</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {resolutionAnalytics.departmentAverage} days
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  All services in {service?.department}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {resolutionAnalytics.expectedResolution.mostLikely < resolutionAnalytics.departmentAverage ? (
                    <span className="text-green-600">Faster than average</span>
                  ) : (
                    <span className="text-orange-600">Similar to average</span>
                  )}
                </div>
              </div>

              {/* Trend */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartLine className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">Recent Trend</span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {resolutionAnalytics.trends.direction === 'decreasing' ? 'Improving' : 
                   resolutionAnalytics.trends.direction === 'increasing' ? 'Slowing' : 'Stable'}
                </div>
                <div className="text-xs text-green-700 mt-1">
                  {Math.abs(resolutionAnalytics.trends.changePercent)}% {resolutionAnalytics.trends.direction === 'decreasing' ? 'faster' : 'slower'} than last month
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Processing time {resolutionAnalytics.trends.direction === 'decreasing' ? 'reduced' : 'increased'}
                </div>
              </div>
            </div>

            {/* Resolution Distribution */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Resolution Distribution</h3>
              <div className="space-y-2">
                {Object.entries(resolutionAnalytics.resolutionDistribution).map(([range, percentage]) => (
                  <div key={range} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">{range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          range === '0-7 days' ? 'bg-green-500' :
                          range === '8-14 days' ? 'bg-blue-500' :
                          range === '15-21 days' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Document Status Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Document Requirements</h2>
            <span className="text-sm text-gray-500">
              {uploadedDocuments.length} of {service.requiredDocuments.length} documents ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.requiredDocuments.map(docType => {
              const status = documentStatus[docType];
              const Icon = DOCUMENT_ICONS[docType];
              
              return (
                <div
                  key={docType}
                  className={`p-4 rounded-lg border ${getStatusColor(status?.status || 'missing')}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(status?.status || 'missing')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon className="text-gray-600" />
                          <span className="font-medium">{DOCUMENT_LABELS[docType]}</span>
                        </div>
                        <span className="text-sm text-gray-500 capitalize">
                          {status?.status || 'missing'}
                        </span>
                      </div>
                    </div>
                    
                    {status?.exists && (
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <FaEye className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <FaDownload className="text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Documents Action */}
        {missingDocuments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Upload Missing Documents</h3>
              {checkingDocuments && (
                <div className="flex items-center gap-2 text-blue-600">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">Checking documents...</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {missingDocuments.map(docType => {
                const Icon = DOCUMENT_ICONS[docType];
                const isUploading = uploadingDocs.has(docType);
                
                return (
                  <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="text-gray-600" />
                      <div>
                        <span className="font-medium">{DOCUMENT_LABELS[docType]}</span>
                        {isUploading && (
                          <p className="text-xs text-blue-600 mt-1">Upload in progress...</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDocumentUpload(docType)}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        isUploading 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaFileUpload />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            {missingDocuments.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong> Upload all required documents above. After uploading, you'll be automatically redirected back here to continue with your application.
                </p>
              </div>
            )}
          </div>
        )}

        {/* SMS Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaSms className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">SMS Notifications</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Get real-time updates on your phone
            </span>
          </div>

          <div className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhoneAlt className="inline mr-2" />
                Phone Number for SMS Alerts
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  value={smsPreferences.phoneNumber}
                  onChange={(e) => setSmsPreferences(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => updateSmsPreferences(smsPreferences)}
                  disabled={!smsPreferences.phoneNumber || sendingSms}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingSms ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaBell className="inline mr-2" />
                Notification Types
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={smsPreferences.reminders}
                    onChange={(e) => setSmsPreferences(prev => ({ ...prev, reminders: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">Application Reminders</span>
                    <p className="text-xs text-gray-600">Get reminded to complete your application</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={smsPreferences.statusUpdates}
                    onChange={(e) => setSmsPreferences(prev => ({ ...prev, statusUpdates: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">Status Updates</span>
                    <p className="text-xs text-gray-600">Receive updates when your application status changes</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={smsPreferences.documentAlerts}
                    onChange={(e) => setSmsPreferences(prev => ({ ...prev, documentAlerts: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">Document Alerts</span>
                    <p className="text-xs text-gray-600">Get notified when documents are verified</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={smsPreferences.completionNotice}
                    onChange={(e) => setSmsPreferences(prev => ({ ...prev, completionNotice: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">Completion Notice</span>
                    <p className="text-xs text-gray-600">Final notification when your service is completed</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Test SMS */}
            {smsPreferences.phoneNumber && (
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={sendApplicationReminder}
                  disabled={sendingSms}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingSms ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaSms />
                      Send Test SMS
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Send a test SMS to verify your number and notification settings
                </p>
              </div>
            )}

            {/* SMS Status */}
            {smsNotificationStatus && (
              <div className={`p-3 rounded-lg ${
                smsNotificationStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {smsNotificationStatus.type === 'success' ? <FaCheck /> : <FaTimes />}
                  <span className="font-medium">{smsNotificationStatus.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{service.eligibilityCriteria}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Provide any additional information relevant to your application..."
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={submitting || readinessStatus !== 'ready'}
              className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                readinessStatus === 'ready'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  {readinessStatus === 'ready' ? 'Submit Application' : 'Complete Documents First'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
