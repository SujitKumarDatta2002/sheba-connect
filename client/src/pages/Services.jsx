
// client/src/pages/Services.jsx

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
  FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
  FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
  FaShieldAlt, FaBolt, FaRoad, FaHospital,
  FaSchool, FaCity, FaGlobe, FaExternalLinkAlt,
  FaInfoCircle, FaTag, FaRegClock, FaDollarSign,
  FaEnvelope, FaMapMarkerAlt, FaBell
} from 'react-icons/fa';

export default function Services() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showScheduleBar, setShowScheduleBar] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  const [loadingMyApplications, setLoadingMyApplications] = useState(false);
  const [requestedDocInputs, setRequestedDocInputs] = useState({});
  const [submittingRequestedDocsId, setSubmittingRequestedDocsId] = useState('');

  const [filters, setFilters] = useState({
    department: '',
    urgency: '',
    minCost: '',
    maxCost: '',
    processingTime: '',
    requiredDocuments: [],
    search: ''
  });

  const [helplineSearch, setHelplineSearch] = useState('');
  const [helplineCategory, setHelplineCategory] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    nid: '',
    address: '',
    additionalInfo: '',
    documentReferences: {}
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.minCost) params.append('minCost', filters.minCost);
      if (filters.maxCost) params.append('maxCost', filters.maxCost);
      if (filters.processingTime) params.append('processingTime', filters.processingTime);
      if (filters.requiredDocuments.length) params.append('requiredDocuments', filters.requiredDocuments.join(','));
      if (filters.search) params.append('search', filters.search);

      const res = await axios.get(`http://localhost:5000/api/services?${params.toString()}`);
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch helplines
  const fetchHelplines = async () => {
    try {
      const params = new URLSearchParams();
      if (helplineCategory) params.append('category', helplineCategory);
      if (helplineSearch) params.append('search', helplineSearch);

      const res = await axios.get(`http://localhost:5000/api/helplines?${params.toString()}`);
      setHelplines(res.data);
    } catch (err) {
      console.error('Error fetching helplines:', err);
    }
  };

  const fetchReminders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setReminders([]);
      return;
    }

    setLoadingReminders(true);
    try {
      const res = await axios.get('http://localhost:5000/api/service-applications/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(res.data || []);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setReminders([]);
    } finally {
      setLoadingReminders(false);
    }
  };

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMyApplications([]);
      return;
    }

    setLoadingMyApplications(true);
    try {
      const res = await axios.get('http://localhost:5000/api/service-applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apps = res.data || [];
      setMyApplications(apps);

      const inputs = {};
      apps.forEach((app) => {
        const valueMap = {};
        (app.adminRequestedDocuments || []).forEach((docType) => {
          const existing = (app.submittedRequestedDocuments || []).find((d) => d.documentType === docType);
          valueMap[docType] = existing?.reference || '';
        });
        inputs[app._id] = valueMap;
      });
      setRequestedDocInputs(inputs);
    } catch (err) {
      console.error('Error fetching my applications:', err);
      setMyApplications([]);
    } finally {
      setLoadingMyApplications(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
      fetchReminders();
      fetchMyApplications();
    } else {
      fetchHelplines();
    }
  }, [activeTab, filters, helplineSearch, helplineCategory]);

  // Available filter options
  const departments = [
    'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
    'Health Services', 'Education', 'Revenue', 'Municipal Services',
    'Police', 'Fire Service', 'Ambulance'
  ];

  const urgencyLevels = ['low', 'medium', 'high', 'emergency'];

  const documentOptions = [
    { value: 'nid', label: 'NID' },
    { value: 'birthCertificate', label: 'Birth Certificate' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivingLicense', label: 'Driving License' },
    { value: 'tin', label: 'TIN' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'educationalCertificate', label: 'Educational Certificate' }
  ];

  const handleDocumentToggle = (doc) => {
    setFilters(prev => {
      const docs = prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter(d => d !== doc)
        : [...prev.requiredDocuments, doc];
      return { ...prev, requiredDocuments: docs };
    });
  };

  const getDocumentLabel = (docValue) => {
    return documentOptions.find((doc) => doc.value === docValue)?.label || docValue;
  };

  const notificationCount = reminders.length;

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reminders]);

  const formatReminderDate = (date) => {
    return new Date(date).toLocaleString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSubmissionDatePassed = (dateValue) => {
    if (!dateValue) return false;

    const raw = String(dateValue);
    const datePart = raw.includes('T') ? raw.slice(0, 10) : raw;
    const [year, month, day] = datePart.split('-').map(Number);

    if (year && month && day) {
      const deadline = new Date(year, month - 1, day, 23, 59, 59, 999);
      return Date.now() > deadline.getTime();
    }

    const fallback = new Date(dateValue);
    if (Number.isNaN(fallback.getTime())) return false;
    fallback.setHours(23, 59, 59, 999);
    return Date.now() > fallback.getTime();
  };

  const getReminderStyle = (daysLeft) => {
    if (daysLeft < 0) return 'bg-red-50 border-red-200 text-red-700';
    if (daysLeft <= 2) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  const getReminderIcon = (reminder) => {
    if (reminder.type === 'statusChange') {
      if (reminder.status === 'approved') {
        return { Icon: FaCheckCircle, iconClass: 'text-green-600' };
      }

      if (reminder.status === 'rejected') {
        return { Icon: FaTimes, iconClass: 'text-red-600' };
      }

      return { Icon: FaInfoCircle, iconClass: 'text-blue-600' };
    }

    if (reminder.type === 'documentSubmission') {
      return { Icon: FaFileAlt, iconClass: 'text-amber-600' };
    }

    if (reminder.type === 'appointment') {
      return { Icon: FaRegClock, iconClass: 'text-indigo-600' };
    }

    return { Icon: FaClock, iconClass: 'text-sky-600' };
  };

  const scheduleNotifications = sortedReminders
    .filter((r) => ['appointment', 'applicationDeadline', 'documentSubmission'].includes(r.type))
    .slice(0, 3);

  const openApplyModal = (service) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const shouldLogin = window.confirm('Please login first to apply for this service. Go to login page now?');
      if (shouldLogin) navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const initialDocRefs = {};
    (service.requiredDocuments || []).forEach((doc) => {
      initialDocRefs[doc] = '';
    });

    setSelectedService(service);
    setApplicationForm({
      applicantName: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      nid: userData.nid || '',
      address: userData.address || '',
      additionalInfo: '',
      documentReferences: initialDocRefs
    });
    setApplicationSuccess('');
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedService(null);
    setApplicationSuccess('');
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      setSubmittingApplication(true);
      const token = localStorage.getItem('token');

      const documentDetails = (selectedService.requiredDocuments || []).map((docType) => ({
        documentType: docType,
        reference: applicationForm.documentReferences[docType] || ''
      }));

      await axios.post(
        'http://localhost:5000/api/service-applications',
        {
          serviceId: selectedService._id,
          applicantName: applicationForm.applicantName,
          email: applicationForm.email,
          phone: applicationForm.phone,
          nid: applicationForm.nid,
          address: applicationForm.address,
          additionalInfo: applicationForm.additionalInfo,
          documentDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setApplicationSuccess('Application submitted successfully. We will contact you soon.');
      fetchReminders();
      fetchMyApplications();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit application';
      alert(errorMessage);
    } finally {
      setSubmittingApplication(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      urgency: '',
      minCost: '',
      maxCost: '',
      processingTime: '',
      requiredDocuments: [],
      search: ''
    });
  };

  const handleRequestedDocInput = (appId, docType, value) => {
    setRequestedDocInputs((prev) => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        [docType]: value
      }
    }));
  };

  const submitRequestedDocuments = async (app) => {
    try {
      setSubmittingRequestedDocsId(app._id);
      const token = localStorage.getItem('token');

      const documentDetails = (app.adminRequestedDocuments || []).map((docType) => ({
        documentType: docType,
        reference: requestedDocInputs[app._id]?.[docType] || ''
      }));

      await axios.patch(
        `http://localhost:5000/api/service-applications/${app._id}/documents`,
        { documentDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Requested documents submitted successfully');
      fetchMyApplications();
    } catch (error) {
      console.error('Error submitting requested documents:', error);
      const message = error.response?.data?.message || 'Failed to submit requested documents';

      if (message.includes('Request admin permission before submitting requested documents')) {
        try {
          await requestDocumentEditPermission(app._id);
          return;
        } catch (permissionError) {
          console.error('Error auto-requesting permission:', permissionError);
        }
      }

      alert(message);
    } finally {
      setSubmittingRequestedDocsId('');
    }
  };

  const requestDocumentEditPermission = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/service-applications/${appId}/documents/request-edit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Permission request sent to admin');
      fetchMyApplications();
    } catch (error) {
      console.error('Error requesting edit permission:', error);
      alert(error.response?.data?.message || 'Failed to request edit permission');
    }
  };

  // Format currency
  const formatCost = (cost) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(cost);
  };

  // Get urgency color and label
  const getUrgencyStyle = (urgency) => {
    const map = {
      low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
      emergency: { bg: 'bg-red-100', text: 'text-red-800', label: 'Emergency' }
    };
    return map[urgency] || map.medium;
  };

  // Get category icon and color for helpline
  const getCategoryStyle = (category) => {
    const map = {
      Emergency: { icon: FaExclamationTriangle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      Police: { icon: FaShieldAlt, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      Fire: { icon: FaFire, bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      Ambulance: { icon: FaAmbulance, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      Electricity: { icon: FaBolt, bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      Road: { icon: FaRoad, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      Health: { icon: FaHospital, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      Education: { icon: FaSchool, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      Municipal: { icon: FaCity, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      Passport: { icon: FaGlobe, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
      Revenue: { icon: FaDollarSign, bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      default: { icon: FaPhone, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
    };
    return map[category] || map.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Service & Helpline Directory</h1>
          <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Government Services
          </button>
          <button
            onClick={() => setActiveTab('helplines')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'helplines'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Emergency & Departmental Helplines
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <>
            {showScheduleBar && scheduleNotifications.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">Schedule Notifications</p>
                    <div className="space-y-1">
                      {scheduleNotifications.map((item) => (
                        <div key={`${item.applicationId}-${item.type}-${item.date}`} className="text-sm text-blue-800 flex items-center gap-2">
                          {(() => {
                            const { Icon, iconClass } = getReminderIcon(item);
                            return <Icon className={iconClass} />;
                          })()}
                          <p>
                            {item.title} for <span className="font-medium">{item.serviceName}</span> on {formatReminderDate(item.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScheduleBar(false)}
                    className="text-blue-700 hover:text-blue-900 text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6 flex justify-end relative">
              <button
                type="button"
                onClick={() => setShowNotificationPanel((prev) => !prev)}
                className="relative inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50"
              >
                <FaBell className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotificationPanel && (
                <div className="absolute top-14 right-0 w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>

                  {loadingReminders ? (
                    <p className="text-sm text-gray-500">Loading reminders...</p>
                  ) : sortedReminders.length === 0 ? (
                    <p className="text-sm text-gray-500">No reminder notifications yet. Admin will assign dates after reviewing your application.</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {sortedReminders.map((reminder) => {
                        const { Icon, iconClass } = getReminderIcon(reminder);

                        return (
                        <div
                          key={`${reminder.applicationId}-${reminder.type}-${reminder.date}`}
                          className={`border rounded-lg p-3 ${getReminderStyle(reminder.daysLeft)}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm inline-flex items-center gap-2">
                              <Icon className={iconClass} />
                              {reminder.title}
                            </p>
                            <span className="text-xs font-semibold">
                              {reminder.daysLeft < 0
                                ? `${Math.abs(reminder.daysLeft)} day(s) overdue`
                                : reminder.daysLeft === 0
                                  ? 'Today'
                                  : `${reminder.daysLeft} day(s) left`}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{reminder.serviceName}</p>
                          <p className="text-xs mt-1">{formatReminderDate(reminder.date)}</p>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin Requested Documents</h3>
              {loadingMyApplications ? (
                <p className="text-sm text-gray-500">Loading your applications...</p>
              ) : myApplications.filter((a) => (a.adminRequestedDocuments || []).length > 0).length === 0 ? (
                <p className="text-sm text-gray-500">No additional document request from admin yet.</p>
              ) : (
                <div className="space-y-4">
                  {myApplications
                    .filter((a) => (a.adminRequestedDocuments || []).length > 0)
                    .map((app) => (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                        {(() => {
                          const alreadySubmitted = (app.submittedRequestedDocuments || []).length > 0;
                          const canUpdate = app.documentEditPermissionGranted === true;
                          const waitingApproval = app.documentEditRequested === true;
                          const submissionDatePassed = isSubmissionDatePassed(app.documentSubmissionDate);
                          const needsLateSubmissionApproval = !alreadySubmitted && submissionDatePassed;
                          const needsAdminApproval = (alreadySubmitted || needsLateSubmissionApproval) && !canUpdate;
                          return (
                            <>
                        <p className="font-medium text-gray-800">{app.serviceId?.name || 'Service'}</p>
                        <p className="text-xs text-gray-500 mb-3">Status: {app.status}</p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {(app.adminRequestedDocuments || []).map((docType) => (
                            <div key={`${app._id}-${docType}`}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getDocumentLabel(docType)} *
                              </label>
                              <input
                                type="text"
                                value={requestedDocInputs[app._id]?.[docType] || ''}
                                onChange={(e) => handleRequestedDocInput(app._id, docType, e.target.value)}
                                readOnly={needsAdminApproval}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder={`Enter ${getDocumentLabel(docType)} reference`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (needsAdminApproval) {
                                requestDocumentEditPermission(app._id);
                              } else {
                                submitRequestedDocuments(app);
                              }
                            }}
                            disabled={submittingRequestedDocsId === app._id || waitingApproval}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                          >
                            {waitingApproval
                              ? 'Waiting Admin Approval'
                              : needsAdminApproval
                                ? 'Request Admin Permission'
                                : (submittingRequestedDocsId === app._id ? 'Submitting...' : 'Submit Requested Documents')}
                          </button>
                        </div>
                        {alreadySubmitted && !canUpdate && !waitingApproval && (
                          <p className="text-xs text-amber-700 mt-2 text-right">
                            Already submitted. If you made a mistake, request admin permission to update.
                          </p>
                        )}
                        {needsLateSubmissionApproval && !canUpdate && !waitingApproval && (
                          <p className="text-xs text-amber-700 mt-2 text-right">
                            Submission date has passed. Request admin permission before submitting requested documents.
                          </p>
                        )}
                        {canUpdate && (
                          <p className="text-xs text-green-700 mt-2 text-right">
                            Admin permission approved. You can submit requested documents now.
                          </p>
                        )}
                        {waitingApproval && (
                          <p className="text-xs text-blue-700 mt-2 text-right">
                            Permission request sent. Wait for admin approval.
                          </p>
                        )}
                            </>
                          );
                        })()}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services by name or description..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
                      showFilters 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <FaFilter />
                    <span>Filters</span>
                    <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
                  >
                    <FaTimes />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <select
                      value={filters.urgency}
                      onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      {urgencyLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minCost}
                        onChange={(e) => setFilters({ ...filters, minCost: e.target.value })}
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxCost}
                        onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 3-5 days"
                      value={filters.processingTime}
                      onChange={(e) => setFilters({ ...filters, processingTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {documentOptions.map(doc => (
                        <button
                          key={doc.value}
                          onClick={() => handleDocumentToggle(doc.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filters.requiredDocuments.includes(doc.value)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => {
                  const urgencyStyle = getUrgencyStyle(service.urgency);
                  return (
                    <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{service.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                            {urgencyStyle.label}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                        <div className="space-y-3">
                          {/* Department */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaBuilding className="text-blue-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Department:</span>
                            <span className="text-gray-600">{service.department}</span>
                          </div>

                          {/* Cost */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaMoneyBillWave className="text-green-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Cost:</span>
                            <span className="text-gray-600">{formatCost(service.cost)}</span>
                          </div>

                          {/* Location (NEW) */}
                          {service.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
                              <span className="font-medium text-gray-700">Location:</span>
                              <span className="text-gray-600">{service.location}</span>
                            </div>
                          )}

                          {/* Processing Time */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaClock className="text-orange-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Processing:</span>
                            <span className="text-gray-600">{service.processingTime}</span>
                          </div>

                          {/* Required Documents */}
                          {service.requiredDocuments.length > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                              <FaFileAlt className="text-purple-500 w-4 h-4 mt-1" />
                              <div>
                                <span className="font-medium text-gray-700">Documents:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {service.requiredDocuments.map(doc => {
                                    const label = getDocumentLabel(doc);
                                    return (
                                      <span key={doc} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                        {label}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Eligibility */}
                          <div className="flex items-start gap-2 text-sm">
                            <FaCheckCircle className="text-green-500 w-4 h-4 mt-1" />
                            <div>
                              <span className="font-medium text-gray-700">Eligibility:</span>
                              <p className="text-gray-600 line-clamp-2">{service.eligibilityCriteria}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer with actions */}
                      <div className="border-t px-6 py-4 bg-gray-50 space-y-2">
                        <button
                          onClick={() => openApplyModal(service)}
                          className="w-full flex items-center justify-center gap-1 bg-indigo-600 text-white px-2 py-2 rounded-lg hover:bg-indigo-700 transition text-xs font-medium"
                        >
                          Apply
                        </button>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {/* Website */}
                          {service.website ? (
                            <a
                              href={service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition text-xs font-medium"
                            >
                              <FaGlobe className="w-3 h-3" /> Website
                            </a>
                          ) : (
                            <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-2 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
                              <FaGlobe className="w-3 h-3" /> Website
                            </span>
                          )}

                          {/* Phone */}
                          {service.helpline ? (
                            <a
                              href={`tel:${service.helpline}`}
                              className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-2 rounded-lg hover:bg-green-700 transition text-xs font-medium"
                            >
                              <FaPhone className="w-3 h-3" /> Call
                            </a>
                          ) : (
                            <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-2 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
                              <FaPhone className="w-3 h-3" /> Call
                            </span>
                          )}

                          {/* Email */}
                          {service.email ? (
                            <a
                              href={`mailto:${service.email}`}
                              className="flex items-center justify-center gap-1 bg-purple-600 text-white px-2 py-2 rounded-lg hover:bg-purple-700 transition text-xs font-medium"
                            >
                              <FaEnvelope className="w-3 h-3" /> Email
                            </a>
                          ) : (
                            <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-2 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
                              <FaEnvelope className="w-3 h-3" /> Email
                            </span>
                          )}

                          {/* Map - now links to internal page */}
                          <Link
                            to={`/nearby?serviceId=${service._id}`}
                            className="flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 transition text-xs font-medium"
                          >
                            <FaMapMarkerAlt className="w-3 h-3" /> Map
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Helplines Tab (unchanged) */}
        {activeTab === 'helplines' && (
          <>
            {/* Search and Category Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search helplines by name or description..."
                    value={helplineSearch}
                    onChange={(e) => setHelplineSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={helplineCategory}
                  onChange={(e) => setHelplineCategory(e.target.value)}
                  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Police">Police</option>
                  <option value="Fire">Fire Service</option>
                  <option value="Ambulance">Ambulance</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Road">Road & Transport</option>
                  <option value="Waste">Waste Management</option>
                  <option value="Municipal">Municipal Services</option>
                  <option value="Passport">Passport</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Women & Children">Women & Children</option>
                  <option value="Disaster Management">Disaster Management</option>
                </select>
              </div>
            </div>

            {/* Helplines Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helplines.map(helpline => {
                const style = getCategoryStyle(helpline.category);
                const Icon = style.icon;
                return (
                  <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className={`p-6 ${style.bg} border-b ${style.border}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center ${style.text}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{helpline.name}</h3>
                          <p className={`text-sm font-medium ${style.text}`}>{helpline.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Phone Numbers */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Contact Numbers</p>
                        {helpline.numbers.map((num, idx) => (
                          <a
                            key={idx}
                            href={`tel:${num}`}
                            className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 transition group"
                          >
                            <FaPhone className="w-4 h-4" />
                            <span className="font-medium flex-1">{num}</span>
                            <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                        ))}
                      </div>

                      {/* Website Link */}
                      {helpline.website && (
                        <div className="mb-4">
                          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Official Website</p>
                          <a
                            href={helpline.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 transition group"
                          >
                            <FaGlobe className="w-4 h-4" />
                            <span className="font-medium flex-1 truncate">Visit Website</span>
                            <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {helpline.description && (
                        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <FaInfoCircle className="inline mr-1 text-gray-400" /> {helpline.description}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex gap-2">
                        {helpline.isEmergency && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" /> Emergency
                          </span>
                        )}
                        {helpline.available24x7 && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" /> 24/7
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {helplines.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
                <p className="text-gray-500">Try a different category or search term</p>
              </div>
            )}
          </>
        )}
      </div>

      {showApplyModal && selectedService && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Apply For Service</h3>
                <p className="text-blue-100 text-sm">{selectedService.name}</p>
              </div>
              <button
                onClick={closeApplyModal}
                className="p-2 rounded-full hover:bg-white/20 transition"
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-5">
              {applicationSuccess && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  {applicationSuccess}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.applicantName}
                    onChange={(e) => setApplicationForm({ ...applicationForm, applicantName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NID *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.nid}
                    onChange={(e) => setApplicationForm({ ...applicationForm, nid: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  rows="2"
                  value={applicationForm.address}
                  onChange={(e) => setApplicationForm({ ...applicationForm, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(selectedService.requiredDocuments || []).length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Document Details Required</h4>
                  <div className="space-y-3">
                    {selectedService.requiredDocuments.map((docType) => (
                      <div key={docType}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {getDocumentLabel(docType)} Reference / Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={applicationForm.documentReferences[docType] || ''}
                          onChange={(e) =>
                            setApplicationForm({
                              ...applicationForm,
                              documentReferences: {
                                ...applicationForm.documentReferences,
                                [docType]: e.target.value
                              }
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                <textarea
                  rows="3"
                  value={applicationForm.additionalInfo}
                  onChange={(e) => setApplicationForm({ ...applicationForm, additionalInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Anything else you want to share for this application"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeApplyModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApplication}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {submittingApplication ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

