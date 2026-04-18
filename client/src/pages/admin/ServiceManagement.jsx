import API from "../../config/api";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaTimes,
  FaSave, FaBuilding, FaClock, FaMoneyBillWave,
  FaFileAlt, FaPhone, FaCheckCircle, FaExclamationTriangle,
  FaShieldAlt, FaGlobe, FaCity, FaHospital,
  FaSchool, FaBolt, FaRoad, FaFire, FaAmbulance
} from 'react-icons/fa';

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Form state for services
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    department: '',
    cost: '',
    processingTime: '',
    processSteps: [''],
    requiredDocuments: [],
    eligibilityCriteria: '',
    urgency: 'medium',
    helpline: '',
    isActive: true
  });

  // Form state for helplines
  const [helplineForm, setHelplineForm] = useState({
    name: '',
    category: '',
    numbers: [''],
    website: '',
    description: '',
    isEmergency: false,
    available24x7: false
  });

  const departments = [
    'Passport Office',
    'Electricity',
    'Road Maintenance',
    'Waste Management',
    'Health Services',
    'Education',
    'Revenue',
    'Municipal Services',
    'Police',
    'Fire Service',
    'Ambulance'
  ];

  const helplineCategories = [
    'Emergency',
    'Passport',
    'Electricity',
    'Road',
    'Waste',
    'Health',
    'Education',
    'Revenue',
    'Municipal',
    'Police',
    'Fire',
    'Ambulance',
    'Women & Children',
    'Disaster Management'
  ];

  const documentOptions = [
    { value: 'nid', label: 'NID' },
    { value: 'birthCertificate', label: 'Birth Certificate' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivingLicense', label: 'Driving License' },
    { value: 'tin', label: 'TIN' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'educationalCertificate', label: 'Educational Certificate' }
  ];
  // Toggle service active status
  const toggleServiceStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API}/api/admin/services/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Service status updated', 'success');
      fetchServices();
    } catch (err) {
      console.error('Error toggling service status:', err);
      showNotification('Failed to update service status', 'error');
    }
  };

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'emergency', label: 'Emergency', color: 'red' }
  ];

  useEffect(() => {
    fetchServices();
    fetchHelplines();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/admin/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      showNotification('Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHelplines = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/admin/helplines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHelplines(res.data);
    } catch (err) {
      console.error('Error fetching helplines:', err);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingItem
        ? `${API}/api/admin/services/${editingItem._id}`
        : `${API}/api/admin/services`;
{/*IFTI START*/}
      const method = editingItem ? 'put' : 'post';
      const servicePayload = {
        ...serviceForm,
        processSteps: (serviceForm.processSteps || [])
          .map(step => step.trim())
          .filter(Boolean)
          .join('\n')
      };

      await axios[method](url, servicePayload, {
      /*IFTI END*/
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification(
        editingItem ? 'Service updated successfully' : 'Service added successfully',
        'success'
      );
      setShowModal(false);
      setEditingItem(null);
      resetServiceForm();
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      showNotification('Failed to save service', 'error');
    }
  };

  const handleHelplineSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingItem
        ? `${API}/api/admin/helplines/${editingItem._id}`
        : `${API}/api/admin/helplines`;

      const method = editingItem ? 'put' : 'post';

      // Filter out empty numbers
      const formData = {
        ...helplineForm,
        numbers: helplineForm.numbers.filter(num => num.trim() !== '')
      };

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification(
        editingItem ? 'Helpline updated successfully' : 'Helpline added successfully',
        'success'
      );
      setShowModal(false);
      setEditingItem(null);
      resetHelplineForm();
      fetchHelplines();
    } catch (err) {
      console.error('Error saving helpline:', err);
      showNotification('Failed to save helpline', 'error');
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'service' 
        ? `${API}/api/admin/services/${id}`
        : `${API}/api/admin/helplines/${id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification(`${type} deleted successfully`, 'success');
      if (type === 'service') {
        fetchServices();
      } else {
        fetchHelplines();
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      showNotification(`Failed to delete ${type}`, 'error');
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      description: '',
      department: '',
      cost: '',
      processingTime: '',
      processSteps: [''],
      requiredDocuments: [],
      eligibilityCriteria: '',
      urgency: 'medium',
      helpline: ''
    });
  };

  const resetHelplineForm = () => {
    setHelplineForm({
      name: '',
      category: '',
      numbers: [''],
      website: '',
      description: '',
      isEmergency: false,
      available24x7: false
    });
  };
/*IFTI START */
  const editService = (service) => {
    const normalizedSteps = Array.isArray(service.processSteps)
      ? service.processSteps
      : String(service.processSteps || '')
          .split('\n')
          .map(step => step.trim())
          .filter(Boolean);
/*IFTI END*/
    setEditingItem(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      department: service.department,
      cost: service.cost,
      processingTime: service.processingTime,
      processSteps: normalizedSteps.length ? normalizedSteps : [''],
      requiredDocuments: service.requiredDocuments || [],
      eligibilityCriteria: service.eligibilityCriteria,
      urgency: service.urgency,
      helpline: service.helpline,
      isActive: service.isActive
    });
    setShowModal(true);
  };

  const addProcessStepField = () => {
    setServiceForm(prev => ({
      ...prev,
      processSteps: [...(prev.processSteps || []), '']
    }));
  };

  const updateProcessStep = (index, value) => {
    setServiceForm(prev => {
      const nextSteps = [...(prev.processSteps || [''])];
      nextSteps[index] = value;
      return { ...prev, processSteps: nextSteps };
    });
  };

  const removeProcessStepField = (index) => {
    setServiceForm(prev => {
      const nextSteps = (prev.processSteps || []).filter((_, i) => i !== index);
      return { ...prev, processSteps: nextSteps.length ? nextSteps : [''] };
    });
  };
// ...existing code...
// In the services grid, add status indicator and toggle button
// Example usage inside your service list rendering:
// <div className="flex justify-between items-start mb-3">
//   <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
//   <div className="flex items-center gap-2">
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//       service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//     }`}>
//       {service.isActive ? 'Active' : 'Inactive'}
//     </span>
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//       service.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
//       service.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
//       service.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//       'bg-green-100 text-green-800'
//     }`}>
//       {service.urgency}
//     </span>
//   </div>
// </div>

// In the action buttons, add toggle button
// <button
//   onClick={() => toggleServiceStatus(service._id, service.isActive)}
//   className={`p-2 ${
//     service.isActive ? 'text-orange-600 hover:bg-orange-100' : 'text-green-600 hover:bg-green-100'
//   } rounded-lg transition-colors`}
//   title={service.isActive ? 'Deactivate' : 'Activate'}
// >
//   {service.isActive ? <FaBan /> : <FaCheckCircle />}
// </button>

  const editHelpline = (helpline) => {
    setEditingItem(helpline);
    setHelplineForm({
      name: helpline.name,
      category: helpline.category,
      numbers: helpline.numbers.length ? helpline.numbers : [''],
      website: helpline.website || '',
      description: helpline.description || '',
      isEmergency: helpline.isEmergency || false,
      available24x7: helpline.available24x7 || false
    });
    setShowModal(true);
  };

  const addNumberField = () => {
    setHelplineForm({
      ...helplineForm,
      numbers: [...helplineForm.numbers, '']
    });
  };

  const removeNumberField = (index) => {
    const newNumbers = helplineForm.numbers.filter((_, i) => i !== index);
    setHelplineForm({
      ...helplineForm,
      numbers: newNumbers.length ? newNumbers : ['']
    });
  };

  const updateNumber = (index, value) => {
    const newNumbers = [...helplineForm.numbers];
    newNumbers[index] = value;
    setHelplineForm({
      ...helplineForm,
      numbers: newNumbers
    });
  };

  const handleDocumentToggle = (doc) => {
    setServiceForm(prev => {
      const docs = prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter(d => d !== doc)
        : [...prev.requiredDocuments, doc];
      return { ...prev, requiredDocuments: docs };
    });
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHelplines = helplines.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get category icon for helpline
  const getCategoryIcon = (category) => {
    const map = {
      Emergency: FaExclamationTriangle,
      Police: FaShieldAlt,
      Fire: FaFire,
      Ambulance: FaAmbulance,
      Health: FaHospital,
      Education: FaSchool,
      Electricity: FaBolt,
      Road: FaRoad,
      Municipal: FaCity,
      Passport: FaGlobe,
      default: FaPhone
    };
    return map[category] || map.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Service & Helpline Management</h1>
              <p className="text-purple-100 text-lg">Add, edit, or remove services and emergency contacts</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/applications"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 font-semibold"
              >
                Review Applications
              </Link>
              <Link
                to="/iftianlytics"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2 font-semibold"
              >
                Analytics
              </Link>
              <button
                onClick={() => {
                  setEditingItem(null);
                  activeTab === 'services' ? resetServiceForm() : resetHelplineForm();
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 font-semibold"
              >
                <FaPlus />
                Add New {activeTab === 'services' ? 'Service' : 'Helpline'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Services
          </button>
          <button
            onClick={() => setActiveTab('helplines')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'helplines'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Helplines
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            {activeTab === 'services' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                          service.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          service.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {service.urgency}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-purple-500" />
                          <span className="font-medium">Department:</span>
                          <span className="text-gray-600">{service.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-medium">Cost:</span>
                          <span className="text-gray-600">৳{service.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-orange-500" />
                          <span className="font-medium">Processing:</span>
                          <span className="text-gray-600">{service.processingTime}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FaFileAlt className="text-indigo-500 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-medium">Process Steps:</p>
                            {String(service.processSteps || '').split('\n').map(step => step.trim()).filter(Boolean).length ? (
                              <ol className="list-decimal list-inside text-gray-600 max-h-24 overflow-y-auto pr-1 space-y-1">
                                {String(service.processSteps || '')
                                  .split('\n')
                                  .map(step => step.trim())
                                  .filter(Boolean)
                                  .map((step, idx) => (
                                    <li key={`${service._id}-step-${idx}`}>{step}</li>
                                  ))}
                              </ol>
                            ) : (
                              <p className="text-gray-600">N/A</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FaCheckCircle className="text-teal-500 mt-0.5" />
                          <span className="font-medium">Eligibility:</span>
                          <span className="text-gray-600 line-clamp-2">{service.eligibilityCriteria || 'N/A'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FaFileAlt className="text-purple-500 mt-0.5" />
                          <span className="font-medium">Required Docs:</span>
                          <span className="text-gray-600 line-clamp-2">
                            {(service.requiredDocuments || []).length
                              ? service.requiredDocuments
                                  .map(doc => (documentOptions.find(opt => opt.value === doc) || { label: doc }).label)
                                  .join(', ')
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-blue-500" />
                          <span className="font-medium">Helpline:</span>
                          <span className="text-gray-600">{service.helpline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                      <button
                        onClick={() => editService(service)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteItem(service._id, 'service')}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Helplines Grid */}
            {activeTab === 'helplines' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHelplines.map(helpline => {
                  const Icon = getCategoryIcon(helpline.category);
                  return (
                    <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{helpline.name}</h3>
                            <p className="text-sm text-purple-600">{helpline.category}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {helpline.numbers.map((num, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <FaPhone className="text-green-500" />
                              <span>{num}</span>
                            </div>
                          ))}
                          {helpline.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <FaGlobe className="text-blue-500" />
                              <a href={helpline.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Website
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {helpline.isEmergency && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
                              <FaExclamationTriangle /> Emergency
                            </span>
                          )}
                          {helpline.available24x7 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              24/7
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                        <button
                          onClick={() => editHelpline(helpline)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteItem(helpline._id, 'helpline')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {((activeTab === 'services' && filteredServices.length === 0) ||
              (activeTab === 'helplines' && filteredHelplines.length === 0)) && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-500">Try a different search term or add new items</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingItem ? 'Edit' : 'Add New'} {activeTab === 'services' ? 'Service' : 'Helpline'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={activeTab === 'services' ? handleServiceSubmit : handleHelplineSubmit}>
                {activeTab === 'services' ? (
                  // Service Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        required
                        rows="3"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                        <select
                          required
                          value={serviceForm.department}
                          onChange={(e) => setServiceForm({ ...serviceForm, department: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cost (BDT) *</label>
                        <input
                          type="number"
                          required
                          value={serviceForm.cost}
                          onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., 3-5 days"
                          value={serviceForm.processingTime}
                          onChange={(e) => setServiceForm({ ...serviceForm, processingTime: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
                        <select
                          required
                          value={serviceForm.urgency}
                          onChange={(e) => setServiceForm({ ...serviceForm, urgency: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          {urgencyLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Helpline Number *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.helpline}
                        onChange={(e) => setServiceForm({ ...serviceForm, helpline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria *</label>
                      <textarea
                        required
                        rows="2"
                        value={serviceForm.eligibilityCriteria}
                        onChange={(e) => setServiceForm({ ...serviceForm, eligibilityCriteria: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Process Steps</label>
                      <div className="space-y-2">
                        {(serviceForm.processSteps || ['']).map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={step}
                              onChange={(e) => updateProcessStep(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder={`Step ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeProcessStepField(index)}
                              className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addProcessStepField}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100"
                        >
                          <FaPlus /> Add Step
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {documentOptions.map(doc => (
                          <button
                            key={doc.value}
                            type="button"
                            onClick={() => handleDocumentToggle(doc.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                              serviceForm.requiredDocuments.includes(doc.value)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {doc.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Helpline Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={helplineForm.name}
                        onChange={(e) => setHelplineForm({ ...helplineForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          required
                          value={helplineForm.category}
                          onChange={(e) => setHelplineForm({ ...helplineForm, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Category</option>
                          {helplineCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website (optional)</label>
                        <input
                          type="url"
                          value={helplineForm.website}
                          onChange={(e) => setHelplineForm({ ...helplineForm, website: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                      <textarea
                        rows="2"
                        value={helplineForm.description}
                        onChange={(e) => setHelplineForm({ ...helplineForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers *</label>
                      {helplineForm.numbers.map((num, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            required
                            value={num}
                            onChange={(e) => updateNumber(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder={`Phone number ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeNumberField(index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addNumberField}
                        className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      >
                        <FaPlus /> Add Another Number
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={helplineForm.isEmergency}
                          onChange={(e) => setHelplineForm({ ...helplineForm, isEmergency: e.target.checked })}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">Emergency Service</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={helplineForm.available24x7}
                          onChange={(e) => setHelplineForm({ ...helplineForm, available24x7: e.target.checked })}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">Available 24/7</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {editingItem ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}