// // export default function Services() {
// //   return (
// //     <div className="p-10">
// //       <h2 className="text-3xl font-bold">Services</h2>
// //     </div>
// //   );
// // }






// // client/src/pages/Services.jsx

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
//   FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
//   FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
//   FaShieldAlt, FaBolt, FaTrash, FaRoad, FaHospital,
//   FaSchool, FaCity
// } from 'react-icons/fa';

// export default function Services() {
//   const [activeTab, setActiveTab] = useState('services'); // 'services' or 'helplines'
//   const [services, setServices] = useState([]);
//   const [helplines, setHelplines] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     department: '',
//     urgency: '',
//     minCost: '',
//     maxCost: '',
//     processingTime: '',
//     requiredDocuments: [],
//     search: ''
//   });
  
//   const [helplineSearch, setHelplineSearch] = useState('');
//   const [helplineCategory, setHelplineCategory] = useState('');

//   // Fetch services with filters
//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filters.department) params.append('department', filters.department);
//       if (filters.urgency) params.append('urgency', filters.urgency);
//       if (filters.minCost) params.append('minCost', filters.minCost);
//       if (filters.maxCost) params.append('maxCost', filters.maxCost);
//       if (filters.processingTime) params.append('processingTime', filters.processingTime);
//       if (filters.requiredDocuments.length) params.append('requiredDocuments', filters.requiredDocuments.join(','));
//       if (filters.search) params.append('search', filters.search);

//       const res = await axios.get(`http://localhost:5000/api/services?${params.toString()}`);
//       setServices(res.data);
//     } catch (err) {
//       console.error('Error fetching services:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch helplines
//   const fetchHelplines = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (helplineCategory) params.append('category', helplineCategory);
//       if (helplineSearch) params.append('search', helplineSearch);

//       const res = await axios.get(`http://localhost:5000/api/helplines?${params.toString()}`);
//       setHelplines(res.data);
//     } catch (err) {
//       console.error('Error fetching helplines:', err);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'services') {
//       fetchServices();
//     } else {
//       fetchHelplines();
//     }
//   }, [activeTab, filters, helplineSearch, helplineCategory]);

//   // Available filter options (can be fetched from backend later)
//   const departments = [
//     'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
//     'Health Services', 'Education', 'Revenue', 'Municipal Services',
//     'Police', 'Fire Service', 'Ambulance'
//   ];

//   const urgencyLevels = ['low', 'medium', 'high', 'emergency'];

//   const documentOptions = [
//     { value: 'nid', label: 'NID' },
//     { value: 'birthCertificate', label: 'Birth Certificate' },
//     { value: 'passport', label: 'Passport' },
//     { value: 'drivingLicense', label: 'Driving License' },
//     { value: 'tin', label: 'TIN' },
//     { value: 'citizenship', label: 'Citizenship' },
//     { value: 'educationalCertificate', label: 'Educational Certificate' }
//   ];

//   const handleDocumentToggle = (doc) => {
//     setFilters(prev => {
//       const docs = prev.requiredDocuments.includes(doc)
//         ? prev.requiredDocuments.filter(d => d !== doc)
//         : [...prev.requiredDocuments, doc];
//       return { ...prev, requiredDocuments: docs };
//     });
//   };

//   const clearFilters = () => {
//     setFilters({
//       department: '',
//       urgency: '',
//       minCost: '',
//       maxCost: '',
//       processingTime: '',
//       requiredDocuments: [],
//       search: ''
//     });
//   };

//   // Helper to format currency (BDT)
//   const formatCost = (cost) => {
//     return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(cost);
//   };

//   // Helper to get urgency color
//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'low': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'high': return 'bg-orange-100 text-orange-800';
//       case 'emergency': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get category icon for helpline
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Emergency': return <FaExclamationTriangle className="text-red-500" />;
//       case 'Police': return <FaShieldAlt className="text-blue-600" />;
//       case 'Fire': return <FaFire className="text-orange-600" />;
//       case 'Ambulance': return <FaAmbulance className="text-green-600" />;
//       case 'Electricity': return <FaBolt className="text-yellow-600" />;
//       case 'Road': return <FaRoad className="text-gray-600" />;
//       case 'Health': return <FaHospital className="text-red-500" />;
//       case 'Education': return <FaSchool className="text-purple-600" />;
//       case 'Municipal': return <FaCity className="text-blue-500" />;
//       default: return <FaPhone className="text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Service & Helpline Directory</h1>
//           <p className="text-gray-600">Find government services and emergency contact numbers</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('services')}
//             className={`px-6 py-3 font-medium transition-all ${
//               activeTab === 'services'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Government Services
//           </button>
//           <button
//             onClick={() => setActiveTab('helplines')}
//             className={`px-6 py-3 font-medium transition-all ${
//               activeTab === 'helplines'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Emergency & Departmental Helplines
//           </button>
//         </div>

//         {/* Services Tab */}
//         {activeTab === 'services' && (
//           <>
//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search services..."
//                     value={filters.search}
//                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100"
//                 >
//                   <FaFilter className={`text-gray-500 ${showFilters ? 'text-blue-600' : ''}`} />
//                   <span>Filters</span>
//                   <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                 </button>
//                 <button
//                   onClick={clearFilters}
//                   className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
//                 >
//                   <FaTimes />
//                   <span>Clear</span>
//                 </button>
//               </div>

//               {/* Expanded Filters */}
//               {showFilters && (
//                 <div className="pt-5 border-t mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {/* Department */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select
//                       value={filters.department}
//                       onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">All Departments</option>
//                       {departments.map(dept => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Urgency */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
//                     <select
//                       value={filters.urgency}
//                       onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">All</option>
//                       {urgencyLevels.map(level => (
//                         <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Cost Range */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
//                     <div className="flex gap-2">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={filters.minCost}
//                         onChange={(e) => setFilters({ ...filters, minCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={filters.maxCost}
//                         onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
//                       />
//                     </div>
//                   </div>

//                   {/* Processing Time */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
//                     <input
//                       type="text"
//                       placeholder="e.g., 3-5 days"
//                       value={filters.processingTime}
//                       onChange={(e) => setFilters({ ...filters, processingTime: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>

//                   {/* Required Documents */}
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
//                     <div className="flex flex-wrap gap-2">
//                       {documentOptions.map(doc => (
//                         <button
//                           key={doc.value}
//                           onClick={() => handleDocumentToggle(doc.value)}
//                           className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                             filters.requiredDocuments.includes(doc.value)
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           {doc.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Services List */}
//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//               </div>
//             ) : services.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-xl">
//                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-800">No services found</h3>
//                 <p className="text-gray-500">Try adjusting your filters</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {services.map(service => (
//                   <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-100">
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(service.urgency)}`}>
//                         {service.urgency}
//                       </span>
//                     </div>
                    
//                     <p className="text-gray-600 mb-4">{service.description}</p>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <FaBuilding className="text-blue-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Department:</span>
//                         <span className="text-gray-600">{service.department}</span>
//                       </div>

//                       <div className="flex items-center gap-2 text-sm">
//                         <FaMoneyBillWave className="text-green-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Cost:</span>
//                         <span className="text-gray-600">{formatCost(service.cost)}</span>
//                       </div>

//                       <div className="flex items-center gap-2 text-sm">
//                         <FaClock className="text-orange-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Processing Time:</span>
//                         <span className="text-gray-600">{service.processingTime}</span>
//                       </div>

//                       <div className="flex items-start gap-2 text-sm">
//                         <FaFileAlt className="text-purple-600 w-4 h-4 mt-1" />
//                         <div>
//                           <span className="font-medium text-gray-700">Required Documents:</span>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {service.requiredDocuments.map(doc => {
//                               const label = documentOptions.find(d => d.value === doc)?.label || doc;
//                               return (
//                                 <span key={doc} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
//                                   {label}
//                                 </span>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2 text-sm">
//                         <FaCheckCircle className="text-green-600 w-4 h-4 mt-1" />
//                         <div>
//                           <span className="font-medium text-gray-700">Eligibility:</span>
//                           <p className="text-gray-600">{service.eligibilityCriteria}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t pt-4 flex justify-between items-center">
//                       <div className="flex items-center gap-2 text-blue-600">
//                         <FaPhone className="w-4 h-4" />
//                         <span className="font-medium">{service.helpline}</span>
//                       </div>
//                       <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
//                         Contact Department
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* Helplines Tab */}
//         {activeTab === 'helplines' && (
//           <>
//             {/* Search and Category Filter */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search helplines..."
//                     value={helplineSearch}
//                     onChange={(e) => setHelplineSearch(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <select
//                   value={helplineCategory}
//                   onChange={(e) => setHelplineCategory(e.target.value)}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Emergency">Emergency</option>
//                   <option value="Police">Police</option>
//                   <option value="Fire">Fire Service</option>
//                   <option value="Ambulance">Ambulance</option>
//                   <option value="Health">Health</option>
//                   <option value="Education">Education</option>
//                   <option value="Electricity">Electricity</option>
//                   <option value="Road">Road & Transport</option>
//                   <option value="Waste">Waste Management</option>
//                   <option value="Municipal">Municipal Services</option>
//                   <option value="Passport">Passport</option>
//                   <option value="Revenue">Revenue</option>
//                   <option value="Women & Children">Women & Children</option>
//                   <option value="Disaster Management">Disaster Management</option>
//                 </select>
//               </div>
//             </div>

//             {/* Helplines Grid */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {helplines.map(helpline => (
//                 <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
//                       {getCategoryIcon(helpline.category)}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-800">{helpline.name}</h3>
//                       <p className="text-sm text-gray-500">{helpline.category}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     {helpline.numbers.map((num, idx) => (
//                       <div key={idx} className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
//                         <FaPhone className="w-4 h-4" />
//                         <a href={`tel:${num}`} className="font-medium hover:underline">{num}</a>
//                       </div>
//                     ))}
//                   </div>

//                   {helpline.description && (
//                     <p className="mt-4 text-sm text-gray-600 border-t pt-3">{helpline.description}</p>
//                   )}

//                   <div className="mt-4 flex gap-2">
//                     {helpline.isEmergency && (
//                       <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Emergency</span>
//                     )}
//                     {helpline.available24x7 && (
//                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">24/7</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {helplines.length === 0 && (
//               <div className="text-center py-12 bg-white rounded-xl">
//                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-800">No helplines found</h3>
//                 <p className="text-gray-500">Try a different search or category</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }















// // client/src/pages/Services.jsx

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
//   FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
//   FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
//   FaShieldAlt, FaBolt, FaRoad, FaHospital,
//   FaSchool, FaCity, FaGlobe, FaExternalLinkAlt
// } from 'react-icons/fa';

// export default function Services() {
//   const [activeTab, setActiveTab] = useState('services'); // 'services' or 'helplines'
//   const [services, setServices] = useState([]);
//   const [helplines, setHelplines] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     department: '',
//     urgency: '',
//     minCost: '',
//     maxCost: '',
//     processingTime: '',
//     requiredDocuments: [],
//     search: ''
//   });
  
//   const [helplineSearch, setHelplineSearch] = useState('');
//   const [helplineCategory, setHelplineCategory] = useState('');

//   // Fetch services with filters
//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filters.department) params.append('department', filters.department);
//       if (filters.urgency) params.append('urgency', filters.urgency);
//       if (filters.minCost) params.append('minCost', filters.minCost);
//       if (filters.maxCost) params.append('maxCost', filters.maxCost);
//       if (filters.processingTime) params.append('processingTime', filters.processingTime);
//       if (filters.requiredDocuments.length) params.append('requiredDocuments', filters.requiredDocuments.join(','));
//       if (filters.search) params.append('search', filters.search);

//       const res = await axios.get(`http://localhost:5000/api/services?${params.toString()}`);
//       setServices(res.data);
//     } catch (err) {
//       console.error('Error fetching services:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch helplines
//   const fetchHelplines = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (helplineCategory) params.append('category', helplineCategory);
//       if (helplineSearch) params.append('search', helplineSearch);

//       const res = await axios.get(`http://localhost:5000/api/helplines?${params.toString()}`);
//       setHelplines(res.data);
//     } catch (err) {
//       console.error('Error fetching helplines:', err);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'services') {
//       fetchServices();
//     } else {
//       fetchHelplines();
//     }
//   }, [activeTab, filters, helplineSearch, helplineCategory]);

//   // Available filter options (can be fetched from backend later)
//   const departments = [
//     'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
//     'Health Services', 'Education', 'Revenue', 'Municipal Services',
//     'Police', 'Fire Service', 'Ambulance'
//   ];

//   const urgencyLevels = ['low', 'medium', 'high', 'emergency'];

//   const documentOptions = [
//     { value: 'nid', label: 'NID' },
//     { value: 'birthCertificate', label: 'Birth Certificate' },
//     { value: 'passport', label: 'Passport' },
//     { value: 'drivingLicense', label: 'Driving License' },
//     { value: 'tin', label: 'TIN' },
//     { value: 'citizenship', label: 'Citizenship' },
//     { value: 'educationalCertificate', label: 'Educational Certificate' }
//   ];

//   const handleDocumentToggle = (doc) => {
//     setFilters(prev => {
//       const docs = prev.requiredDocuments.includes(doc)
//         ? prev.requiredDocuments.filter(d => d !== doc)
//         : [...prev.requiredDocuments, doc];
//       return { ...prev, requiredDocuments: docs };
//     });
//   };

//   const clearFilters = () => {
//     setFilters({
//       department: '',
//       urgency: '',
//       minCost: '',
//       maxCost: '',
//       processingTime: '',
//       requiredDocuments: [],
//       search: ''
//     });
//   };

//   // Helper to format currency (BDT)
//   const formatCost = (cost) => {
//     return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(cost);
//   };

//   // Helper to get urgency color
//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'low': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'high': return 'bg-orange-100 text-orange-800';
//       case 'emergency': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get category icon for helpline
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Emergency': return <FaExclamationTriangle className="text-red-500" />;
//       case 'Police': return <FaShieldAlt className="text-blue-600" />;
//       case 'Fire': return <FaFire className="text-orange-600" />;
//       case 'Ambulance': return <FaAmbulance className="text-green-600" />;
//       case 'Electricity': return <FaBolt className="text-yellow-600" />;
//       case 'Road': return <FaRoad className="text-gray-600" />;
//       case 'Health': return <FaHospital className="text-red-500" />;
//       case 'Education': return <FaSchool className="text-purple-600" />;
//       case 'Municipal': return <FaCity className="text-blue-500" />;
//       default: return <FaPhone className="text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Service & Helpline Directory</h1>
//           <p className="text-gray-600">Find government services and emergency contact numbers</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('services')}
//             className={`px-6 py-3 font-medium transition-all ${
//               activeTab === 'services'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Government Services
//           </button>
//           <button
//             onClick={() => setActiveTab('helplines')}
//             className={`px-6 py-3 font-medium transition-all ${
//               activeTab === 'helplines'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Emergency & Departmental Helplines
//           </button>
//         </div>

//         {/* Services Tab */}
//         {activeTab === 'services' && (
//           <>
//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search services..."
//                     value={filters.search}
//                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100"
//                 >
//                   <FaFilter className={`text-gray-500 ${showFilters ? 'text-blue-600' : ''}`} />
//                   <span>Filters</span>
//                   <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                 </button>
//                 <button
//                   onClick={clearFilters}
//                   className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
//                 >
//                   <FaTimes />
//                   <span>Clear</span>
//                 </button>
//               </div>

//               {/* Expanded Filters */}
//               {showFilters && (
//                 <div className="pt-5 border-t mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {/* Department */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select
//                       value={filters.department}
//                       onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">All Departments</option>
//                       {departments.map(dept => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Urgency */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
//                     <select
//                       value={filters.urgency}
//                       onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">All</option>
//                       {urgencyLevels.map(level => (
//                         <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Cost Range */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
//                     <div className="flex gap-2">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={filters.minCost}
//                         onChange={(e) => setFilters({ ...filters, minCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={filters.maxCost}
//                         onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
//                       />
//                     </div>
//                   </div>

//                   {/* Processing Time */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
//                     <input
//                       type="text"
//                       placeholder="e.g., 3-5 days"
//                       value={filters.processingTime}
//                       onChange={(e) => setFilters({ ...filters, processingTime: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>

//                   {/* Required Documents */}
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
//                     <div className="flex flex-wrap gap-2">
//                       {documentOptions.map(doc => (
//                         <button
//                           key={doc.value}
//                           onClick={() => handleDocumentToggle(doc.value)}
//                           className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                             filters.requiredDocuments.includes(doc.value)
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           {doc.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Services List */}
//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//               </div>
//             ) : services.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-xl">
//                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-800">No services found</h3>
//                 <p className="text-gray-500">Try adjusting your filters</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {services.map(service => (
//                   <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-100">
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(service.urgency)}`}>
//                         {service.urgency}
//                       </span>
//                     </div>
                    
//                     <p className="text-gray-600 mb-4">{service.description}</p>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <FaBuilding className="text-blue-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Department:</span>
//                         <span className="text-gray-600">{service.department}</span>
//                       </div>

//                       <div className="flex items-center gap-2 text-sm">
//                         <FaMoneyBillWave className="text-green-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Cost:</span>
//                         <span className="text-gray-600">{formatCost(service.cost)}</span>
//                       </div>

//                       <div className="flex items-center gap-2 text-sm">
//                         <FaClock className="text-orange-600 w-4 h-4" />
//                         <span className="font-medium text-gray-700">Processing Time:</span>
//                         <span className="text-gray-600">{service.processingTime}</span>
//                       </div>

//                       <div className="flex items-start gap-2 text-sm">
//                         <FaFileAlt className="text-purple-600 w-4 h-4 mt-1" />
//                         <div>
//                           <span className="font-medium text-gray-700">Required Documents:</span>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {service.requiredDocuments.map(doc => {
//                               const label = documentOptions.find(d => d.value === doc)?.label || doc;
//                               return (
//                                 <span key={doc} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
//                                   {label}
//                                 </span>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-2 text-sm">
//                         <FaCheckCircle className="text-green-600 w-4 h-4 mt-1" />
//                         <div>
//                           <span className="font-medium text-gray-700">Eligibility:</span>
//                           <p className="text-gray-600">{service.eligibilityCriteria}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t pt-4 flex justify-between items-center">
//                       <div className="flex items-center gap-2 text-blue-600">
//                         <FaPhone className="w-4 h-4" />
//                         <span className="font-medium">{service.helpline}</span>
//                       </div>
//                       <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
//                         Contact Department
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* Helplines Tab */}
//         {activeTab === 'helplines' && (
//           <>
//             {/* Search and Category Filter */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search helplines..."
//                     value={helplineSearch}
//                     onChange={(e) => setHelplineSearch(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <select
//                   value={helplineCategory}
//                   onChange={(e) => setHelplineCategory(e.target.value)}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Emergency">Emergency</option>
//                   <option value="Police">Police</option>
//                   <option value="Fire">Fire Service</option>
//                   <option value="Ambulance">Ambulance</option>
//                   <option value="Health">Health</option>
//                   <option value="Education">Education</option>
//                   <option value="Electricity">Electricity</option>
//                   <option value="Road">Road & Transport</option>
//                   <option value="Waste">Waste Management</option>
//                   <option value="Municipal">Municipal Services</option>
//                   <option value="Passport">Passport</option>
//                   <option value="Revenue">Revenue</option>
//                   <option value="Women & Children">Women & Children</option>
//                   <option value="Disaster Management">Disaster Management</option>
//                 </select>
//               </div>
//             </div>

//             {/* Helplines Grid */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {helplines.map(helpline => (
//                 <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-100">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
//                       {getCategoryIcon(helpline.category)}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-800">{helpline.name}</h3>
//                       <p className="text-sm text-gray-500">{helpline.category}</p>
//                     </div>
//                   </div>

//                   {/* Phone Numbers */}
//                   <div className="space-y-3">
//                     {helpline.numbers.map((num, idx) => (
//                       <div key={idx} className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
//                         <FaPhone className="w-4 h-4" />
//                         <a href={`tel:${num}`} className="font-medium hover:underline">{num}</a>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Website Link */}
//                   {helpline.website && (
//                     <div className="mt-3">
//                       <a
//                         href={helpline.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg hover:bg-green-100 transition"
//                       >
//                         <FaGlobe className="w-4 h-4" />
//                         <span className="font-medium">Official Website</span>
//                         <FaExternalLinkAlt className="w-3 h-3 ml-auto" />
//                       </a>
//                     </div>
//                   )}

//                   {helpline.description && (
//                     <p className="mt-4 text-sm text-gray-600 border-t pt-3">{helpline.description}</p>
//                   )}

//                   <div className="mt-4 flex gap-2">
//                     {helpline.isEmergency && (
//                       <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Emergency</span>
//                     )}
//                     {helpline.available24x7 && (
//                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">24/7</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {helplines.length === 0 && (
//               <div className="text-center py-12 bg-white rounded-xl">
//                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-800">No helplines found</h3>
//                 <p className="text-gray-500">Try a different search or category</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }












// client/src/pages/Services.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
  FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
  FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
  FaShieldAlt, FaBolt, FaRoad, FaHospital,
  FaSchool, FaCity, FaGlobe, FaExternalLinkAlt,
  FaInfoCircle, FaTag, FaRegClock, FaDollarSign
} from 'react-icons/fa';

export default function Services() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
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

  // Fetch services with filters
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

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
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

        {/* Tabs with better styling */}
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
            {/* Search and Filter Bar - improved */}
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
                    <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{service.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                            {urgencyStyle.label}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <FaBuilding className="text-blue-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Department:</span>
                            <span className="text-gray-600">{service.department}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <FaMoneyBillWave className="text-green-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Cost:</span>
                            <span className="text-gray-600">{formatCost(service.cost)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <FaClock className="text-orange-500 w-4 h-4" />
                            <span className="font-medium text-gray-700">Processing:</span>
                            <span className="text-gray-600">{service.processingTime}</span>
                          </div>

                          {service.requiredDocuments.length > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                              <FaFileAlt className="text-purple-500 w-4 h-4 mt-1" />
                              <div>
                                <span className="font-medium text-gray-700">Documents:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {service.requiredDocuments.map(doc => {
                                    const label = documentOptions.find(d => d.value === doc)?.label || doc;
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

                          <div className="flex items-start gap-2 text-sm">
                            <FaCheckCircle className="text-green-500 w-4 h-4 mt-1" />
                            <div>
                              <span className="font-medium text-gray-700">Eligibility:</span>
                              <p className="text-gray-600 line-clamp-2">{service.eligibilityCriteria}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-blue-600">
                          <FaPhone className="w-4 h-4" />
                          <a href={`tel:${service.helpline}`} className="font-medium hover:underline">{service.helpline}</a>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                          Contact
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Helplines Tab */}
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
    </div>
  );
}