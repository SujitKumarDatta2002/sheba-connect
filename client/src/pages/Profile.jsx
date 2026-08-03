import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosAuth from '../config/axiosInstance';
import API from '../config/api';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaFileAlt, FaEdit,
  FaSearch, FaFilter, FaTimes, FaChevronDown, FaExclamationTriangle,
  FaAmbulance, FaFire, FaShieldAlt, FaBolt, FaRoad, FaHospital,
  FaSchool, FaCity, FaGlobe, FaExternalLinkAlt, FaInfoCircle,
  FaDollarSign, FaClock, FaUserCheck, FaMapMarkerAlt, FaCheck,
  FaIdCard, FaBirthdayCake, FaPassport, FaCar, FaMoneyBill, FaGraduationCap
} from 'react-icons/fa';

// Constants
const DEPARTMENTS = [
  'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
  'Health Services', 'Education', 'Revenue', 'Municipal Services',
  'Police', 'Fire Service', 'Ambulance'
];
const URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'];
const DOCUMENT_OPTIONS = [
  { value: 'nid', label: 'NID' },
  { value: 'birthCertificate', label: 'Birth Certificate' },
  { value: 'passport', label: 'Passport' },
  { value: 'drivingLicense', label: 'Driving License' },
  { value: 'tin', label: 'TIN' },
  { value: 'citizenship', label: 'Citizenship' },
  { value: 'educationalCertificate', label: 'Educational Certificate' },
];

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

const DEPT_COLOR = {
  'Passport Office':    { bg: '#EEEDFE', stroke: '#534AB7', text: '#534AB7' },
  'Electricity':        { bg: '#FAEEDA', stroke: '#BA7517', text: '#854F0B' },
  'Road Maintenance':   { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
  'Waste Management':   { bg: '#EAF3DE', stroke: '#3B6D11', text: '#27500A' },
  'Health Services':    { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
  'Education':          { bg: '#EEEDFE', stroke: '#534AB7', text: '#3C3489' },
  'Revenue':            { bg: '#E1F5EE', stroke: '#0F6E56', text: '#085041' },
  'Municipal Services': { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
  'Police':             { bg: '#E6F1FB', stroke: '#185FA5', text: '#0C447C' },
  'Fire Service':       { bg: '#FAECE7', stroke: '#993C1D', text: '#712B13' },
  'Ambulance':          { bg: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
  default:              { bg: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
};

const URGENCY_PILL = {
  low:       { bg: '#EAF3DE', text: '#27500A', label: 'Low' },
  medium:    { bg: '#FAEEDA', text: '#633806', label: 'Medium' },
  high:      { bg: '#FAECE7', text: '#712B13', label: 'High' },
  emergency: { bg: '#FCEBEB', text: '#791F1F', label: 'Emergency' },
};

const DOC_TAG_COLORS = [
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#FAEEDA', text: '#412402' },
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#FAECE7', text: '#712B13' },
  { bg: '#EAF3DE', text: '#27500A' },
  { bg: '#FBEAF0', text: '#72243E' },
];

// Helper Icons
function IconClock() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 4.5v2.8l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IconPerson() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <path d="M7 1.5a3.5 3.5 0 00-3.5 3.5c0 3 3.5 7.5 3.5 7.5s3.5-4.5 3.5-7.5A3.5 3.5 0 007 1.5z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  );
}

function IconDoc() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
      <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconApply() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function MetaRow({ iconBg, icon: IconComp, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: iconBg, color: 'inherit' }}
      >
        <IconComp />
      </span>
      <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 min-w-0 pt-0.5">{children}</div>
    </div>
  );
}

function ActionBtn({ href, to, bg, color, IconComp, label, disabled }) {
  const baseCls = 'flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all';
  const disabledStyle = { background: '#f3f4f6', color: '#9ca3af', opacity: '0.5', cursor: 'not-allowed' };
  const activeStyle = { background: bg, color: color };

  if (disabled) {
    return (
      <span className={baseCls} style={disabledStyle}>
        <IconComp />
        {label}
      </span>
    );
  }

  if (to) {
    return (
      <Link to={to} className={baseCls} style={activeStyle}>
        <IconComp />
        {label}
      </Link>
    );
  }

  const linkTarget = href && href.indexOf('http') === 0 ? '_blank' : '_self';

  return (
    <a href={href} target={linkTarget} rel="noopener noreferrer" className={baseCls} style={activeStyle}>
      <IconComp />
      {label}
    </a>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '', urgency: '', minCost: '', maxCost: '',
    processingTime: '', requiredDocuments: [], search: ''
  });

  const costFormatter = new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);

        // Fetch user documents (token auto-attached by axiosAuth)
        const docsRes = await axiosAuth.get('/api/documents');
        setUserDocuments(docsRes.data);

        // Fetch services
        const servicesRes = await axiosAuth.get('/api/services');
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (Array.isArray(v) ? v.length : v)
          params.append(k, Array.isArray(v) ? v.join(',') : v);
      });
      const res = await axiosAuth.get(`/api/services?${params}`);
      setServices(res.data);
    } catch (err) { console.error('Error fetching services:', err); }
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab, fetchServices]);

  const toggleDocument = (doc) =>
    setFilters(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter(d => d !== doc)
        : [...prev.requiredDocuments, doc]
    }));

  const getDocumentStatus = (docType) => {
    // API returns documents with `documentType` field and `status` string ('Pending'/'Verified'/'Rejected')
    const doc = userDocuments.find(d => d.documentType === docType);
    if (!doc) return { status: 'missing', color: 'text-red-500', icon: <FaTimes /> };
    if (doc.status === 'Verified') return { status: 'verified', color: 'text-green-500', icon: <FaCheck /> };
    if (doc.status === 'Rejected') return { status: 'rejected', color: 'text-red-400', icon: <FaTimes /> };
    return { status: 'pending', color: 'text-yellow-500', icon: <FaExclamationTriangle /> };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">User Profile</h1>
          <p className="text-blue-100 text-lg">Manage your profile and services</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          {[
            ['profile', 'Profile Information'],
            ['documents', 'My Documents'],
            ['services', 'Available Services']
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaUser className="text-4xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User Name'}</h2>
                <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
                <p className="text-sm text-gray-500 mt-1">Member since: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Documents</p>
                  <p className="font-medium">{userDocuments.length} uploaded</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaEdit />
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOCUMENT_OPTIONS.map(docType => {
                const status = getDocumentStatus(docType.value);
                const Icon = DOCUMENT_ICONS[docType.value];
                // API returns documentType field, not type
                const doc = userDocuments.find(d => d.documentType === docType.value);
                
                return (
                  <div key={docType.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="text-gray-600" />
                        <span className="font-medium">{docType.label}</span>
                      </div>
                      <span className={status.color}>{status.icon}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2 capitalize">
                      Status: {status.status}
                    </div>
                    {doc ? (
                      <div className="text-xs text-gray-400">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <Link
                        to={`/upload/${docType.value}`}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Upload Document →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            {/* Search + filter bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services by name or description..."
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(s => !s)}
                    className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
                      showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <FaFilter />
                    <span>Filters</span>
                    <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => setFilters({ department: '', urgency: '', minCost: '', maxCost: '', processingTime: '', requiredDocuments: [], search: '' })}
                    className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
                  >
                    <FaTimes />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <select
                      value={filters.urgency}
                      onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      {URGENCY_LEVELS.map(l => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_OPTIONS.map(doc => (
                        <button
                          key={doc.value}
                          onClick={() => toggleDocument(doc.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filters.requiredDocuments.includes(doc.value)
                              ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            {/* Service cards */}
            {services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(service => {
                  const dept = DEPT_COLOR[service.department] || DEPT_COLOR.default;
                  const urg = URGENCY_PILL[service.urgency] || URGENCY_PILL.medium;
                  const applyTo = `/apply-service/${service._id}`;

                  return (
                    <div
                      key={service._id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                      style={{ height: '420px' }}
                    >
                      {/* Card header */}
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: dept.bg }}>
                            <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                              <rect x="1.5" y="2" width="11" height="10" rx="1.2" stroke={dept.stroke} strokeWidth="1.2"/>
                              <path d="M4.5 6.5h5M4.5 9h3" stroke={dept.stroke} strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                          </span>
                          <span className="text-xs font-medium truncate" style={{ color: dept.text }}>{service.department}</span>
                          <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 overflow-hidden">
                        <MetaRow iconBg="#EAF3DE" icon={IconClock} label="Processing">
                          <span className="text-xs font-medium text-gray-700">{service.processingTime}</span>
                        </MetaRow>
                        <MetaRow iconBg="#E1F5EE" icon={IconPerson} label="Eligibility">
                          <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.eligibilityCriteria}</span>
                        </MetaRow>
                        {service.location && (
                          <MetaRow iconBg="#FBEAF0" icon={IconPin} label="Location">
                            <span className="text-xs font-medium text-gray-700 line-clamp-1">{service.location}</span>
                          </MetaRow>
                        )}
                        <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
                        <MetaRow iconBg="#EEEDFE" icon={IconDoc} label="Documents">
                          <div className="flex flex-wrap gap-1">
                            {service.requiredDocuments.length > 0
                              ? service.requiredDocuments.map((doc, i) => {
                                  const c = DOC_TAG_COLORS[i % DOC_TAG_COLORS.length];
                                  const found = DOCUMENT_OPTIONS.find(d => d.value === doc);
                                  const docLabel = found ? found.label : doc;
                                  return (
                                    <span key={doc} className="px-1.5 py-px rounded text-xs font-medium" style={{ background: c.bg, color: c.text }}>
                                      {docLabel}
                                    </span>
                                  );
                                })
                              : <span className="text-xs text-gray-400">None required</span>
                            }
                          </div>
                        </MetaRow>
                        <MetaRow iconBg="#E1F5EE" icon={IconCheck} label="Cost">
                          <span className="text-sm font-semibold" style={{ color: '#0F6E56' }}>
                            {costFormatter.format(service.cost)}
                          </span>
                        </MetaRow>
                      </div>

                      {/* Prominent Apply Button */}
                      <div className="px-4 pb-3 flex-shrink-0">
                        <Link
                          to={applyTo}
                          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <IconApply />
                          <span>Apply Now</span>
                        </Link>
                      </div>

                      {/* Other actions */}
                      <div className="grid grid-cols-2 gap-1.5 px-3 pb-3 flex-shrink-0">
                        <ActionBtn to={`/services`} bg="#E6F1FB" color="#0C447C" IconComp={FaInfoCircle} label="Details" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
