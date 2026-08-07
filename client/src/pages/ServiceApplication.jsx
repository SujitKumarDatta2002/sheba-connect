import { useState, useEffect, useMemo } from 'react';
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
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
  const [smsNotificationStatus, setSmsNotificationStatus] = useState(null);
  const [sendingSms, setSendingSms] = useState(false);
  const [customSmsMessage, setCustomSmsMessage] = useState('');
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const [offices, setOffices] = useState([]);
  const [officeLoading, setOfficeLoading] = useState(true);
  const [officeError, setOfficeError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showManualLocation, setShowManualLocation] = useState(false);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  // Fetch service details and user documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service details (public, no auth needed)
        const serviceRes = await axiosAuth.get(`/api/services/${serviceId}`);
        setService(serviceRes.data);

        // Fetch user documents (requires auth — token auto-attached)
        const docsRes = await axiosAuth.get('/api/documents');
        setUserDocuments(docsRes.data);

        // Analyze document readiness
        analyzeDocumentReadiness(serviceRes.data.requiredDocuments, docsRes.data);
        
        // Fetch resolution analytics
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

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }

    setLocLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocLoading(false);
      },
      (err) => {
        console.warn('Location error:', err);
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please allow location access or enter coordinates manually.'
            : 'Unable to determine your location. Please enter coordinates manually.'
        );
        setLocLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const fetchNearbyOffices = async (lat, lng) => {
    setOfficeLoading(true);
    setOfficeError(null);

    try {
      const res = await axiosAuth.get('/api/offices/nearby', {
        params: {
          serviceId,
          userLat: lat,
          userLng: lng
        }
      });
      setOffices(res.data.offices || []);
    } catch (error) {
      console.error('Failed to load nearby offices:', error);
      setOfficeError('Could not load nearby offices. Please try again later.');
      setOffices([]);
    } finally {
      setOfficeLoading(false);
    }
  };

  useEffect(() => {
    if (!serviceId) return;
    requestUserLocation();
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !userLocation) return;
    fetchNearbyOffices(userLocation.lat, userLocation.lng);
  }, [serviceId, userLocation]);

  const handleManualLocationSubmit = (event) => {
    event.preventDefault();
    const parsedLat = parseFloat(manualLat);
    const parsedLng = parseFloat(manualLng);

    if (isNaN(parsedLat) || isNaN(parsedLng) || parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      setLocationError('Please enter valid coordinates. Latitude must be -90 to 90 and longitude must be -180 to 180.');
      return;
    }

    setLocationError(null);
    setUserLocation({ lat: parsedLat, lng: parsedLng });
    setShowManualLocation(false);
  };

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
          // Map API status string to display status
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
      
      // Re-analyze document readiness
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

  const sendSmsNotification = async (phoneNumber, message, type) => {
    setSendingSms(true);
    try {
      const res = await axiosAuth.post('/api/sms/send', { phone: phoneNumber, message });
      const data = res.data;

      if (data.success) {
        setSmsNotificationStatus({
          type: 'success',
          message: `✅ SMS sent to ${phoneNumber}`,
          details: data.result
        });
      } else {
        // SMS failed (e.g. no balance) but it's non-fatal
        setSmsNotificationStatus({
          type: 'warning',
          message: `⚠️ SMS not sent: ${data.smsError || 'Check your sms.net.bd balance'}`,
        });
      }

      return data;
    } catch (error) {
      // Network or unexpected error — still non-fatal
      const errMsg = error.response?.data?.smsError || error.message || 'SMS sending failed';
      console.warn('[SMS] Failed:', errMsg);
      setSmsNotificationStatus({
        type: 'warning',
        message: `⚠️ SMS unavailable: ${errMsg}`,
      });
      // Don't rethrow — application flow must continue
    } finally {
      setSendingSms(false);
    }
  };

const sendApplicationReminder = async () => {
  if (!smsPhoneNumber) {
    return;
  }

    const defaultMsg = `Sheba Connect: Reminder - Your application for ${service?.name} is ready to submit. Expected completion: ${resolutionAnalytics?.expectedResolution?.mostLikely || 12} days. Reply STOP to unsubscribe.`;
    const message = customSmsMessage.trim() !== '' ? customSmsMessage : defaultMsg;
    
    await sendSmsNotification(smsPhoneNumber, message, 'reminder');
    
    if (customSmsMessage.trim() !== '') {
      setCustomSmsMessage('');
    }
  };

  const sendStatusUpdate = async (status) => {
    if (!smsPhoneNumber) {
      return;
    }
    rejected: `Sheba Connect: Your application requires attention. Please check your account for details.`,
    completed: `Sheba Connect: Your application for ${service?.name} has been completed successfully!`
  };

  const message = statusMessages[status] || `Sheba Connect: Update on your application for ${service?.name}: ${status}`;
  
  await sendSmsNotification(smsPhoneNumber, message, 'status_update');
};

const sendDocumentAlert = async (docType, status) => {
  if (!smsPhoneNumber) {
    return;
  }

  const message = `Sheba Connect: Document ${DOCUMENT_LABELS[docType]} is now ${status}. Application progress updated.`;
  
  await sendSmsNotification(smsPhoneNumber, message, 'document_alert');
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
        serviceId:          serviceId,
        serviceName:        service.name,          // controller expects serviceName
        department:         service.department,
        requiredDocuments:  service.requiredDocuments, // array of doc type keys
        submittedDocuments: uploadedDocuments,     // controller expects submittedDocuments
        notificationPhone:  smsPhoneNumber,
        additionalInfo:     document.querySelector('textarea')?.value || '',
      };

      const response = await axiosAuth.post('/api/service-applications', applicationData);
      
      // Send SMS notification for successful submission
      if (smsPhoneNumber) {
        await sendStatusUpdate('submitted');
      }
      
      // Redirect back with a toast notification on service page
      navigate('/services', {
        state: {
          toast: {
            type: 'success',
            message: 'Application submitted successfully'
          }
        }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      const backendMessage = error.response?.data?.message;
      const missingDocs = error.response?.data?.missingDocuments;
      
      let alertMsg = backendMessage || 'Failed to submit application. Please try again.';
      if (missingDocs && missingDocs.length > 0) {
        alertMsg += '\n\nMissing/Unverified:\n- ' + missingDocs.join('\n- ');
      }
      setToast({ show: true, type: 'error', message: alertMsg });
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
        return <FaTimesCircle className="text-gray-400" />;
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

  const formatDistanceLabel = (distance) => {
    if (distance === null || distance === undefined) return '—';
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
  };

  const buildDirectionsUrl = (office) => {
    if (!userLocation) return `https://www.openstreetmap.org/?mlat=${office.latitude}&mlon=${office.longitude}#map=17/${office.latitude}/${office.longitude}`;
    return 'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' +
      `${userLocation.lat}%2C${userLocation.lng}%3B${office.latitude}%2C${office.longitude}`;
  };

  const getReadinessAlert = () => {
    switch (readinessStatus) {
      case 'ready':
        return {
          type: 'success',
          title: 'Ready to Apply!',
          message: 'All required documents are uploaded in your profile. You can proceed with your application.',
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'partial':
        return {
          type: 'warning',
          title: 'Partially Ready',
          message: `You have uploaded ${uploadedDocuments.length} of ${service?.requiredDocuments.length} required documents.`,
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
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md px-4 py-2 rounded-lg text-white shadow-lg ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'
        }`}>
          {toast.message}
        </div>
      )}
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
              <div className="bg-gradient-to-br from-[#2B5053] to-[#3E5758] rounded-lg p-4 border border-[#CCE3DE]/40 text-[#FBF2C0]">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarCheck className="text-blue-600" />
                  <span className="text-sm font-medium text-[#CCE3DE]">Expected Timeline</span>
                </div>
                <div className="text-2xl font-bold text-[#FBF2C0]">
                  {resolutionAnalytics.expectedResolution.mostLikely} days
                </div>
                <div className="text-xs text-[#E5D4C0] mt-1">
                  {resolutionAnalytics.expectedResolution.minDays}-{resolutionAnalytics.expectedResolution.maxDays} days range
                </div>
                <div className="text-xs text-[#CCE3DE] mt-2">
                  {resolutionAnalytics.expectedResolution.confidence}% confidence
                </div>
              </div>

              {/* Department Average */}
              <div className="bg-gradient-to-br from-[#21464B] to-[#3E5758] rounded-lg p-4 border border-[#E5D4C0]/35 text-[#FBF2C0]">
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
              <div className="bg-gradient-to-br from-[#2B5053] to-[#21464B] rounded-lg p-4 border border-[#CCE3DE]/40 text-[#FBF2C0]">
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
                        <button
                          onClick={() => window.open(`${API}/api/documents/${status.document._id}/download`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => window.open(`${API}/api/documents/${status.document._id}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <FaEye />
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

        {/* Nearby Office Lookup */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Nearby Offices for {service.name}</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Find the closest service office for this application
            </span>
          </div>

          <div className="space-y-4 mb-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Your current location</p>
                <p className="text-base font-semibold text-gray-800">
                  {userLocation ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}` : 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {locLoading ? 'Detecting your location…' : locationError || 'Using your device location to find nearby offices.'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Nearest office</p>
                <p className="text-base font-semibold text-gray-800">
                  {officeLoading ? 'Loading offices…' : offices.length ? offices[0].name : 'No nearby offices found'}
                </p>
                {offices.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{formatDistanceLabel(offices[0].distance)} away</p>
                )}
              </div>
            </div>

            {!userLocation && !locLoading && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                <p>Please allow location access or enter coordinates manually to see nearby offices.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={requestUserLocation}
                className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                type="button"
              >
                {locLoading ? 'Detecting Location…' : 'Refresh Location'}
              </button>
              <button
                onClick={() => setShowManualLocation(!showManualLocation)}
                type="button"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
              >
                {showManualLocation ? 'Hide Manual Entry' : 'Enter Coordinates Manually'}
              </button>
            </div>

            {showManualLocation && (
              <form onSubmit={handleManualLocationSubmit} className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="23.7806"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="90.2794"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Use These Coordinates
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
            {officeError && (
              <p className="text-sm text-red-600">{officeError}</p>
            )}
            {officeLoading && !officeError && (
              <p className="text-sm text-gray-500">Loading nearby offices…</p>
            )}
            {!officeLoading && !officeError && offices.length === 0 && (
              <p className="text-sm text-gray-500">No nearby offices were found for this service. Try a different location or refresh.</p>
            )}
            {!officeLoading && offices.length > 0 && (
              <div className="space-y-4">
                {offices.slice(0, 4).map((office, index) => (
                  <div key={office.osmType + '/' + office.osmId} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-500">{index === 0 ? 'Best nearby office' : `Option ${index + 1}`}</div>
                        <h4 className="text-lg font-semibold text-gray-900">{office.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{office.address}</p>
                      </div>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                        {formatDistanceLabel(office.distance)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={buildDirectionsUrl(office)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View directions
                      </a>
                      {office.phone && (
                        <a
                          href={`tel:${office.phone}`}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Call office
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <input
                type="tel"
                placeholder="+8801XXXXXXXXX"
                value={smsPhoneNumber}
                onChange={(e) => setSmsPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Test SMS */}
            {smsPhoneNumber && (
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send a demo message to {smsPhoneNumber}
                  </label>
                  <textarea
                    className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Type your own custom message here to test SMS delivery..."
                    rows="2"
                    value={customSmsMessage}
                    onChange={(e) => setCustomSmsMessage(e.target.value)}
                  />
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
                        {customSmsMessage.trim() ? "Send Custom SMS" : "Send Default Test SMS"}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    {customSmsMessage.trim() ? "This will send the exact text you typed above." : "Send a default test SMS to verify your number and notification settings."}
                  </p>
                </div>
              </div>
            )}

            {/* SMS Status */}
            {smsNotificationStatus && (
              <div className={`p-3 rounded-lg ${
                smsNotificationStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : smsNotificationStatus.type === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {smsNotificationStatus.type === 'success' ? <FaCheck /> :
                   smsNotificationStatus.type === 'warning' ? <FaExclamationTriangle /> :
                   <FaTimes />}
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
                  ? 'bg-gradient-to-r from-[#EAB29F] to-[#D99A85] text-[#293B2C] hover:brightness-110 shadow-lg font-bold'
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
