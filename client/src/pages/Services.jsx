
// // client/src/pages/Services.jsx

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // 👈 Import Link
// import axios from 'axios';
// import {
//   FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
//   FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
//   FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
//   FaShieldAlt, FaBolt, FaRoad, FaHospital,
//   FaSchool, FaCity, FaGlobe, FaExternalLinkAlt,
//   FaInfoCircle, FaTag, FaRegClock, FaDollarSign,
//   FaEnvelope, FaMapMarkerAlt
// } from 'react-icons/fa';

// export default function Services() {
//   const [activeTab, setActiveTab] = useState('services');
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

//   // Available filter options
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

//   // Format currency
//   const formatCost = (cost) => {
//     return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(cost);
//   };

//   // Get urgency color and label
//   const getUrgencyStyle = (urgency) => {
//     const map = {
//       low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
//       medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
//       high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
//       emergency: { bg: 'bg-red-100', text: 'text-red-800', label: 'Emergency' }
//     };
//     return map[urgency] || map.medium;
//   };

//   // Get category icon and color for helpline
//   const getCategoryStyle = (category) => {
//     const map = {
//       Emergency: { icon: FaExclamationTriangle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
//       Police: { icon: FaShieldAlt, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
//       Fire: { icon: FaFire, bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
//       Ambulance: { icon: FaAmbulance, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
//       Electricity: { icon: FaBolt, bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
//       Road: { icon: FaRoad, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
//       Health: { icon: FaHospital, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
//       Education: { icon: FaSchool, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
//       Municipal: { icon: FaCity, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
//       Passport: { icon: FaGlobe, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
//       Revenue: { icon: FaDollarSign, bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
//       default: { icon: FaPhone, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
//     };
//     return map[category] || map.default;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header with gradient */}
//         <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
//           <h1 className="text-4xl font-bold mb-2">Service & Helpline Directory</h1>
//           <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
//         </div>

//         {/* Tabs */}
//         <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
//           <button
//             onClick={() => setActiveTab('services')}
//             className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
//               activeTab === 'services'
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             Government Services
//           </button>
//           <button
//             onClick={() => setActiveTab('helplines')}
//             className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
//               activeTab === 'helplines'
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             Emergency & Departmental Helplines
//           </button>
//         </div>

//         {/* Services Tab */}
//         {activeTab === 'services' && (
//           <>
//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search services by name or description..."
//                     value={filters.search}
//                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
//                       showFilters 
//                         ? 'bg-blue-600 text-white border-blue-600' 
//                         : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
//                     }`}
//                   >
//                     <FaFilter />
//                     <span>Filters</span>
//                     <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                   </button>
//                   <button
//                     onClick={clearFilters}
//                     className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2"
//                   >
//                     <FaTimes />
//                     <span>Clear</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Expanded Filters */}
//               {showFilters && (
//                 <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select
//                       value={filters.department}
//                       onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">All Departments</option>
//                       {departments.map(dept => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
//                     <select
//                       value={filters.urgency}
//                       onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">All</option>
//                       {urgencyLevels.map(level => (
//                         <option key={level} value={level}>
//                           {level.charAt(0).toUpperCase() + level.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
//                     <div className="flex gap-2">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={filters.minCost}
//                         onChange={(e) => setFilters({ ...filters, minCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={filters.maxCost}
//                         onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
//                         className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
//                     <input
//                       type="text"
//                       placeholder="e.g., 3-5 days"
//                       value={filters.processingTime}
//                       onChange={(e) => setFilters({ ...filters, processingTime: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div className="md:col-span-2 lg:col-span-3">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
//                     <div className="flex flex-wrap gap-2">
//                       {documentOptions.map(doc => (
//                         <button
//                           key={doc.value}
//                           onClick={() => handleDocumentToggle(doc.value)}
//                           className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                             filters.requiredDocuments.includes(doc.value)
//                               ? 'bg-blue-600 text-white shadow-md'
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

//             {/* Services Grid */}
//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//               </div>
//             ) : services.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
//                 <p className="text-gray-500">Try adjusting your filters or search term</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {services.map(service => {
//                   const urgencyStyle = getUrgencyStyle(service.urgency);
//                   return (
//                     <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
//                       <div className="p-6 flex-1">
//                         <div className="flex justify-between items-start mb-3">
//                           <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{service.name}</h3>
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyStyle.bg} ${urgencyStyle.text}`}>
//                             {urgencyStyle.label}
//                           </span>
//                         </div>
                        
//                         <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

//                         <div className="space-y-3">
//                           {/* Department */}
//                           <div className="flex items-center gap-2 text-sm">
//                             <FaBuilding className="text-blue-500 w-4 h-4" />
//                             <span className="font-medium text-gray-700">Department:</span>
//                             <span className="text-gray-600">{service.department}</span>
//                           </div>

//                           {/* Cost */}
//                           <div className="flex items-center gap-2 text-sm">
//                             <FaMoneyBillWave className="text-green-500 w-4 h-4" />
//                             <span className="font-medium text-gray-700">Cost:</span>
//                             <span className="text-gray-600">{formatCost(service.cost)}</span>
//                           </div>

//                           {/* Location (NEW) */}
//                           {service.location && (
//                             <div className="flex items-center gap-2 text-sm">
//                               <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
//                               <span className="font-medium text-gray-700">Location:</span>
//                               <span className="text-gray-600">{service.location}</span>
//                             </div>
//                           )}

//                           {/* Processing Time */}
//                           <div className="flex items-center gap-2 text-sm">
//                             <FaClock className="text-orange-500 w-4 h-4" />
//                             <span className="font-medium text-gray-700">Processing:</span>
//                             <span className="text-gray-600">{service.processingTime}</span>
//                           </div>

//                           {/* Required Documents */}
//                           {service.requiredDocuments.length > 0 && (
//                             <div className="flex items-start gap-2 text-sm">
//                               <FaFileAlt className="text-purple-500 w-4 h-4 mt-1" />
//                               <div>
//                                 <span className="font-medium text-gray-700">Documents:</span>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                   {service.requiredDocuments.map(doc => {
//                                     const label = documentOptions.find(d => d.value === doc)?.label || doc;
//                                     return (
//                                       <span key={doc} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
//                                         {label}
//                                       </span>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Eligibility */}
//                           <div className="flex items-start gap-2 text-sm">
//                             <FaCheckCircle className="text-green-500 w-4 h-4 mt-1" />
//                             <div>
//                               <span className="font-medium text-gray-700">Eligibility:</span>
//                               <p className="text-gray-600 line-clamp-2">{service.eligibilityCriteria}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Footer with four action buttons */}
//                       <div className="border-t px-6 py-4 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-2">
//                         {/* Website */}
//                         {service.website ? (
//                           <a
//                             href={service.website}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition text-xs font-medium"
//                           >
//                             <FaGlobe className="w-3 h-3" /> Website
//                           </a>
//                         ) : (
//                           <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-2 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
//                             <FaGlobe className="w-3 h-3" /> Website
//                           </span>
//                         )}

//                         {/* Phone */}
//                         {service.helpline && (
//                           <a
//                             href={`tel:${service.helpline}`}
//                             className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-2 rounded-lg hover:bg-green-700 transition text-xs font-medium"
//                           >
//                             <FaPhone className="w-3 h-3" /> Call
//                           </a>
//                         )}

//                         {/* Email */}
//                         {service.email ? (
//                           <a
//                             href={`mailto:${service.email}`}
//                             className="flex items-center justify-center gap-1 bg-purple-600 text-white px-2 py-2 rounded-lg hover:bg-purple-700 transition text-xs font-medium"
//                           >
//                             <FaEnvelope className="w-3 h-3" /> Email
//                           </a>
//                         ) : (
//                           <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-2 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
//                             <FaEnvelope className="w-3 h-3" /> Email
//                           </span>
//                         )}

//                         {/* Map - now links to internal page */}
//                         <Link
//                           to={`/nearby?serviceId=${service._id}`}
//                           className="flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-700 transition text-xs font-medium"
//                         >
//                           <FaMapMarkerAlt className="w-3 h-3" /> Map
//                         </Link>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* Helplines Tab (unchanged) */}
//         {activeTab === 'helplines' && (
//           <>
//             {/* Search and Category Filter */}
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search helplines by name or description..."
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
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {helplines.map(helpline => {
//                 const style = getCategoryStyle(helpline.category);
//                 const Icon = style.icon;
//                 return (
//                   <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
//                     <div className={`p-6 ${style.bg} border-b ${style.border}`}>
//                       <div className="flex items-center gap-3">
//                         <div className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center ${style.text}`}>
//                           <Icon className="w-6 h-6" />
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-800 text-lg">{helpline.name}</h3>
//                           <p className={`text-sm font-medium ${style.text}`}>{helpline.category}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="p-6">
//                       {/* Phone Numbers */}
//                       <div className="space-y-2 mb-4">
//                         <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Contact Numbers</p>
//                         {helpline.numbers.map((num, idx) => (
//                           <a
//                             key={idx}
//                             href={`tel:${num}`}
//                             className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 transition group"
//                           >
//                             <FaPhone className="w-4 h-4" />
//                             <span className="font-medium flex-1">{num}</span>
//                             <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
//                           </a>
//                         ))}
//                       </div>

//                       {/* Website Link */}
//                       {helpline.website && (
//                         <div className="mb-4">
//                           <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Official Website</p>
//                           <a
//                             href={helpline.website}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 transition group"
//                           >
//                             <FaGlobe className="w-4 h-4" />
//                             <span className="font-medium flex-1 truncate">Visit Website</span>
//                             <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
//                           </a>
//                         </div>
//                       )}

//                       {/* Description */}
//                       {helpline.description && (
//                         <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                           <FaInfoCircle className="inline mr-1 text-gray-400" /> {helpline.description}
//                         </div>
//                       )}

//                       {/* Tags */}
//                       <div className="flex gap-2">
//                         {helpline.isEmergency && (
//                           <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
//                             <FaExclamationTriangle className="w-3 h-3" /> Emergency
//                           </span>
//                         )}
//                         {helpline.available24x7 && (
//                           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
//                             <FaRegClock className="w-3 h-3" /> 24/7
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {helplines.length === 0 && (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
//                 <p className="text-gray-500">Try a different category or search term</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





















// import { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import {
//   FaSearch, FaFilter, FaPhone, FaClock, FaMoneyBillWave,
//   FaBuilding, FaExclamationTriangle, FaFileAlt, FaTimes,
//   FaChevronDown, FaCheckCircle, FaAmbulance, FaFire,
//   FaShieldAlt, FaBolt, FaRoad, FaHospital,
//   FaSchool, FaCity, FaGlobe, FaExternalLinkAlt,
//   FaInfoCircle, FaRegClock, FaDollarSign,
//   FaEnvelope, FaMapMarkerAlt
// } from 'react-icons/fa';

// // ── Constants (outside component — created once, never re-created) ──────────

// const DEPARTMENTS = [
//   'Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management',
//   'Health Services', 'Education', 'Revenue', 'Municipal Services',
//   'Police', 'Fire Service', 'Ambulance'
// ];

// const URGENCY_LEVELS = ['low', 'medium', 'high', 'emergency'];

// const DOCUMENT_OPTIONS = [
//   { value: 'nid',                   label: 'NID' },
//   { value: 'birthCertificate',      label: 'Birth Certificate' },
//   { value: 'passport',              label: 'Passport' },
//   { value: 'drivingLicense',        label: 'Driving License' },
//   { value: 'tin',                   label: 'TIN' },
//   { value: 'citizenship',           label: 'Citizenship' },
//   { value: 'educationalCertificate',label: 'Educational Certificate' },
// ];

// const HELPLINE_CATEGORIES = [
//   'Emergency', 'Police', 'Fire', 'Ambulance', 'Health', 'Education',
//   'Electricity', 'Road', 'Waste', 'Municipal', 'Passport', 'Revenue',
//   'Women & Children', 'Disaster Management'
// ];

// const HELPLINE_CATEGORY_LABELS = {
//   Fire: 'Fire Service', Road: 'Road & Transport', Waste: 'Waste Management',
//   Municipal: 'Municipal Services',
// };

// const URGENCY_STYLES = {
//   low:       { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Low' },
//   medium:    { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
//   high:      { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
//   emergency: { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Emergency' },
// };

// const CATEGORY_STYLES = {
//   Emergency:  { icon: FaExclamationTriangle, bg: 'bg-red-100',     text: 'text-red-600',     border: 'border-red-200' },
//   Police:     { icon: FaShieldAlt,           bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200' },
//   Fire:       { icon: FaFire,                bg: 'bg-orange-100',  text: 'text-orange-600',  border: 'border-orange-200' },
//   Ambulance:  { icon: FaAmbulance,           bg: 'bg-green-100',   text: 'text-green-600',   border: 'border-green-200' },
//   Electricity:{ icon: FaBolt,                bg: 'bg-yellow-100',  text: 'text-yellow-600',  border: 'border-yellow-200' },
//   Road:       { icon: FaRoad,                bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-200' },
//   Health:     { icon: FaHospital,            bg: 'bg-red-100',     text: 'text-red-600',     border: 'border-red-200' },
//   Education:  { icon: FaSchool,              bg: 'bg-purple-100',  text: 'text-purple-600',  border: 'border-purple-200' },
//   Municipal:  { icon: FaCity,                bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200' },
//   Passport:   { icon: FaGlobe,               bg: 'bg-indigo-100',  text: 'text-indigo-600',  border: 'border-indigo-200' },
//   Revenue:    { icon: FaDollarSign,           bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
//   default:    { icon: FaPhone,               bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-200' },
// };

// // Created once — not inside render
// const costFormatter = new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' });

// const EMPTY_FILTERS = {
//   department: '', urgency: '', minCost: '', maxCost: '',
//   processingTime: '', requiredDocuments: [], search: ''
// };

// // ── Small reusable pieces ───────────────────────────────────────────────────

// // Renders an action button OR a greyed-out disabled version
// function ActionBtn({ href, to, color, icon: Icon, label, disabled }) {
//   const base = `flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition`;
//   if (disabled)
//     return <span className={`${base} bg-gray-200 text-gray-500 cursor-not-allowed`}><Icon className="w-3 h-3" /> {label}</span>;
//   if (to)
//     return <Link to={to} className={`${base} ${color} text-white`}><Icon className="w-3 h-3" /> {label}</Link>;
//   return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${base} ${color} text-white hover:opacity-90`}><Icon className="w-3 h-3" /> {label}</a>;
// }

// // ── Main component ──────────────────────────────────────────────────────────

// export default function Services() {
//   const [activeTab, setActiveTab]     = useState('services');
//   const [services, setServices]       = useState([]);
//   const [helplines, setHelplines]     = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters]         = useState(EMPTY_FILTERS);
//   const [helplineSearch, setHelplineSearch]       = useState('');
//   const [helplineCategory, setHelplineCategory]   = useState('');

//   const fetchServices = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([k, v]) => {
//         if (Array.isArray(v) ? v.length : v) params.append(k === 'requiredDocuments' ? k : k, Array.isArray(v) ? v.join(',') : v);
//       });
//       const res = await axios.get(`http://localhost:5000/api/services?${params}`);
//       setServices(res.data);
//     } catch (err) {
//       console.error('Error fetching services:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   const fetchHelplines = useCallback(async () => {
//     try {
//       const params = new URLSearchParams();
//       if (helplineCategory) params.append('category', helplineCategory);
//       if (helplineSearch)   params.append('search', helplineSearch);
//       const res = await axios.get(`http://localhost:5000/api/helplines?${params}`);
//       setHelplines(res.data);
//     } catch (err) {
//       console.error('Error fetching helplines:', err);
//     }
//   }, [helplineCategory, helplineSearch]);

//   useEffect(() => {
//     activeTab === 'services' ? fetchServices() : fetchHelplines();
//   }, [activeTab, fetchServices, fetchHelplines]);

//   const toggleDocument = (doc) =>
//     setFilters(prev => ({
//       ...prev,
//       requiredDocuments: prev.requiredDocuments.includes(doc)
//         ? prev.requiredDocuments.filter(d => d !== doc)
//         : [...prev.requiredDocuments, doc]
//     }));

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
//           <h1 className="text-4xl font-bold mb-2">Service & Helpline Directory</h1>
//           <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
//         </div>

//         {/* Tabs */}
//         <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
//           {[['services', 'Government Services'], ['helplines', 'Emergency & Departmental Helplines']].map(([tab, label]) => (
//             <button key={tab} onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
//                 activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
//               }`}>
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* ── Services Tab ── */}
//         {activeTab === 'services' && (
//           <>
//             {/* Search + Filter bar */}
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input type="text" placeholder="Search services by name or description..."
//                     value={filters.search}
//                     onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <button onClick={() => setShowFilters(s => !s)}
//                     className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
//                       showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
//                     }`}>
//                     <FaFilter /><span>Filters</span>
//                     <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                   </button>
//                   <button onClick={() => setFilters(EMPTY_FILTERS)}
//                     className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2">
//                     <FaTimes /><span>Clear</span>
//                   </button>
//                 </div>
//               </div>

//               {showFilters && (
//                 <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select value={filters.department}
//                       onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
//                       <option value="">All Departments</option>
//                       {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
//                     <select value={filters.urgency}
//                       onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
//                       <option value="">All</option>
//                       {URGENCY_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
//                     <div className="flex gap-2">
//                       {['minCost','maxCost'].map(k => (
//                         <input key={k} type="number" placeholder={k === 'minCost' ? 'Min' : 'Max'}
//                           value={filters[k]}
//                           onChange={e => setFilters(f => ({ ...f, [k]: e.target.value }))}
//                           className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
//                     <input type="text" placeholder="e.g., 3-5 days" value={filters.processingTime}
//                       onChange={e => setFilters(f => ({ ...f, processingTime: e.target.value }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div className="md:col-span-2 lg:col-span-3">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
//                     <div className="flex flex-wrap gap-2">
//                       {DOCUMENT_OPTIONS.map(doc => (
//                         <button key={doc.value} onClick={() => toggleDocument(doc.value)}
//                           className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                             filters.requiredDocuments.includes(doc.value)
//                               ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}>
//                           {doc.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Services grid */}
//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
//               </div>
//             ) : services.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
//                 <p className="text-gray-500">Try adjusting your filters or search term</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {services.map(service => {
//                   const urg = URGENCY_STYLES[service.urgency] || URGENCY_STYLES.medium;
//                   return (
//                     <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
//                       <div className="p-6 flex-1">
//                         <div className="flex justify-between items-start mb-3">
//                           <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{service.name}</h3>
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${urg.bg} ${urg.text}`}>{urg.label}</span>
//                         </div>

//                         <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

//                         <div className="space-y-3 text-sm">
//                           <div className="flex items-center gap-2">
//                             <FaBuilding className="text-blue-500 w-4 h-4 shrink-0" />
//                             <span className="font-medium text-gray-700">Department:</span>
//                             <span className="text-gray-600">{service.department}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <FaMoneyBillWave className="text-green-500 w-4 h-4 shrink-0" />
//                             <span className="font-medium text-gray-700">Cost:</span>
//                             <span className="text-gray-600">{costFormatter.format(service.cost)}</span>
//                           </div>
//                           {service.location && (
//                             <div className="flex items-center gap-2">
//                               <FaMapMarkerAlt className="text-red-500 w-4 h-4 shrink-0" />
//                               <span className="font-medium text-gray-700">Location:</span>
//                               <span className="text-gray-600">{service.location}</span>
//                             </div>
//                           )}
//                           <div className="flex items-center gap-2">
//                             <FaClock className="text-orange-500 w-4 h-4 shrink-0" />
//                             <span className="font-medium text-gray-700">Processing:</span>
//                             <span className="text-gray-600">{service.processingTime}</span>
//                           </div>
//                           {service.requiredDocuments.length > 0 && (
//                             <div className="flex items-start gap-2">
//                               <FaFileAlt className="text-purple-500 w-4 h-4 mt-0.5 shrink-0" />
//                               <div>
//                                 <span className="font-medium text-gray-700">Documents:</span>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                   {service.requiredDocuments.map(doc => (
//                                     <span key={doc} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
//                                       {DOCUMENT_OPTIONS.find(d => d.value === doc)?.label || doc}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                           <div className="flex items-start gap-2">
//                             <FaCheckCircle className="text-green-500 w-4 h-4 mt-0.5 shrink-0" />
//                             <div>
//                               <span className="font-medium text-gray-700">Eligibility:</span>
//                               <p className="text-gray-600 line-clamp-2">{service.eligibilityCriteria}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Action buttons */}
//                       <div className="border-t px-6 py-4 bg-gray-50 grid grid-cols-4 gap-2">
//                         <ActionBtn href={service.website} icon={FaGlobe}        color="bg-blue-600 hover:bg-blue-700"   label="Website" disabled={!service.website} />
//                         <ActionBtn href={service.helpline ? `tel:${service.helpline}` : null} icon={FaPhone} color="bg-green-600 hover:bg-green-700" label="Call" disabled={!service.helpline} />
//                         <ActionBtn href={service.email ? `mailto:${service.email}` : null}    icon={FaEnvelope} color="bg-purple-600 hover:bg-purple-700" label="Email" disabled={!service.email} />
//                         <ActionBtn to={`/nearby?serviceId=${service._id}`} icon={FaMapMarkerAlt} color="bg-red-600 hover:bg-red-700" label="Map" />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* ── Helplines Tab ── */}
//         {activeTab === 'helplines' && (
//           <>
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input type="text" placeholder="Search helplines by name or description..."
//                     value={helplineSearch} onChange={e => setHelplineSearch(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <select value={helplineCategory} onChange={e => setHelplineCategory(e.target.value)}
//                   className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="">All Categories</option>
//                   {HELPLINE_CATEGORIES.map(c => (
//                     <option key={c} value={c}>{HELPLINE_CATEGORY_LABELS[c] || c}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {helplines.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
//                 <p className="text-gray-500">Try a different category or search term</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {helplines.map(helpline => {
//                   const style = CATEGORY_STYLES[helpline.category] || CATEGORY_STYLES.default;
//                   const Icon = style.icon;
//                   return (
//                     <div key={helpline._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
//                       <div className={`p-6 ${style.bg} border-b ${style.border}`}>
//                         <div className="flex items-center gap-3">
//                           <div className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center ${style.text}`}>
//                             <Icon className="w-6 h-6" />
//                           </div>
//                           <div>
//                             <h3 className="font-bold text-gray-800 text-lg">{helpline.name}</h3>
//                             <p className={`text-sm font-medium ${style.text}`}>{helpline.category}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="p-6">
//                         <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Contact Numbers</p>
//                         <div className="space-y-2 mb-4">
//                           {helpline.numbers.map((num, i) => (
//                             <a key={i} href={`tel:${num}`}
//                               className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 transition group">
//                               <FaPhone className="w-4 h-4" />
//                               <span className="font-medium flex-1">{num}</span>
//                               <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
//                             </a>
//                           ))}
//                         </div>

//                         {helpline.website && (
//                           <div className="mb-4">
//                             <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Official Website</p>
//                             <a href={helpline.website} target="_blank" rel="noopener noreferrer"
//                               className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 transition group">
//                               <FaGlobe className="w-4 h-4" />
//                               <span className="font-medium flex-1 truncate">Visit Website</span>
//                               <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
//                             </a>
//                           </div>
//                         )}

//                         {helpline.description && (
//                           <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                             <FaInfoCircle className="inline mr-1 text-gray-400" /> {helpline.description}
//                           </div>
//                         )}

//                         <div className="flex gap-2">
//                           {helpline.isEmergency && (
//                             <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
//                               <FaExclamationTriangle className="w-3 h-3" /> Emergency
//                             </span>
//                           )}
//                           {helpline.available24x7 && (
//                             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
//                               <FaRegClock className="w-3 h-3" /> 24/7
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




















import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaFilter, FaPhone, FaTimes, FaChevronDown,
  FaExclamationTriangle, FaAmbulance, FaFire, FaShieldAlt,
  FaBolt, FaRoad, FaHospital, FaSchool, FaCity, FaGlobe,
  FaExternalLinkAlt, FaInfoCircle, FaRegClock, FaDollarSign,
  FaEnvelope, FaMapMarkerAlt
} from 'react-icons/fa';

// ── Constants ───────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Passport Office','Electricity','Road Maintenance','Waste Management',
  'Health Services','Education','Revenue','Municipal Services',
  'Police','Fire Service','Ambulance'
];
const URGENCY_LEVELS = ['low','medium','high','emergency'];
const DOCUMENT_OPTIONS = [
  { value:'nid',                    label:'NID' },
  { value:'birthCertificate',       label:'Birth Certificate' },
  { value:'passport',               label:'Passport' },
  { value:'drivingLicense',         label:'Driving License' },
  { value:'tin',                    label:'TIN' },
  { value:'citizenship',            label:'Citizenship' },
  { value:'educationalCertificate', label:'Educational Certificate' },
];
const HELPLINE_CATEGORIES = [
  'Emergency','Police','Fire','Ambulance','Health','Education',
  'Electricity','Road','Waste','Municipal','Passport','Revenue',
  'Women & Children','Disaster Management'
];
const HELPLINE_CATEGORY_LABELS = {
  Fire:'Fire Service', Road:'Road & Transport',
  Waste:'Waste Management', Municipal:'Municipal Services',
};
const EMPTY_FILTERS = {
  department:'', urgency:'', minCost:'', maxCost:'',
  processingTime:'', requiredDocuments:[], search:''
};
const costFormatter = new Intl.NumberFormat('bn-BD', { style:'currency', currency:'BDT' });

// Per-department color palette
const DEPT_COLOR = {
  'Passport Office':    { bg:'#EEEDFE', stroke:'#534AB7', text:'#534AB7' },
  'Electricity':        { bg:'#FAEEDA', stroke:'#BA7517', text:'#854F0B' },
  'Road Maintenance':   { bg:'#F1EFE8', stroke:'#5F5E5A', text:'#444441' },
  'Waste Management':   { bg:'#EAF3DE', stroke:'#3B6D11', text:'#27500A' },
  'Health Services':    { bg:'#FCEBEB', stroke:'#A32D2D', text:'#791F1F' },
  'Education':          { bg:'#EEEDFE', stroke:'#534AB7', text:'#3C3489' },
  'Revenue':            { bg:'#E1F5EE', stroke:'#0F6E56', text:'#085041' },
  'Municipal Services': { bg:'#E6F1FB', stroke:'#185FA5', text:'#0C447C' },
  'Police':             { bg:'#E6F1FB', stroke:'#185FA5', text:'#0C447C' },
  'Fire Service':       { bg:'#FAECE7', stroke:'#993C1D', text:'#712B13' },
  'Ambulance':          { bg:'#FCEBEB', stroke:'#A32D2D', text:'#791F1F' },
  default:              { bg:'#F1EFE8', stroke:'#5F5E5A', text:'#444441' },
};
const URGENCY_PILL = {
  low:       { bg:'#EAF3DE', text:'#27500A', label:'Low' },
  medium:    { bg:'#FAEEDA', text:'#633806', label:'Medium' },
  high:      { bg:'#FAECE7', text:'#712B13', label:'High' },
  emergency: { bg:'#FCEBEB', text:'#791F1F', label:'Emergency' },
};
// Rotating palette for document tags
const DOC_TAG_COLORS = [
  { bg:'#EEEDFE', text:'#3C3489' },
  { bg:'#E1F5EE', text:'#085041' },
  { bg:'#FAEEDA', text:'#412402' },
  { bg:'#E6F1FB', text:'#0C447C' },
  { bg:'#FAECE7', text:'#712B13' },
  { bg:'#EAF3DE', text:'#27500A' },
  { bg:'#FBEAF0', text:'#72243E' },
];
// Per-category helpline styles
const CATEGORY_STYLES = {
  Emergency:   { icon:FaExclamationTriangle, hdrBg:'#FCEBEB', iconBg:'#A32D2D', catText:'#791F1F', numBg:'#FCEBEB', numText:'#791F1F', numStroke:'#A32D2D' },
  Police:      { icon:FaShieldAlt,           hdrBg:'#E6F1FB', iconBg:'#185FA5', catText:'#0C447C', numBg:'#E6F1FB', numText:'#0C447C', numStroke:'#185FA5' },
  Fire:        { icon:FaFire,                hdrBg:'#FAECE7', iconBg:'#993C1D', catText:'#712B13', numBg:'#FAECE7', numText:'#712B13', numStroke:'#993C1D' },
  Ambulance:   { icon:FaAmbulance,           hdrBg:'#EAF3DE', iconBg:'#3B6D11', catText:'#27500A', numBg:'#EAF3DE', numText:'#27500A', numStroke:'#3B6D11' },
  Electricity: { icon:FaBolt,                hdrBg:'#FAEEDA', iconBg:'#BA7517', catText:'#854F0B', numBg:'#FAEEDA', numText:'#633806', numStroke:'#BA7517' },
  Road:        { icon:FaRoad,                hdrBg:'#F1EFE8', iconBg:'#5F5E5A', catText:'#444441', numBg:'#F1EFE8', numText:'#444441', numStroke:'#5F5E5A' },
  Health:      { icon:FaHospital,            hdrBg:'#FCEBEB', iconBg:'#A32D2D', catText:'#791F1F', numBg:'#FCEBEB', numText:'#791F1F', numStroke:'#A32D2D' },
  Education:   { icon:FaSchool,              hdrBg:'#EEEDFE', iconBg:'#534AB7', catText:'#3C3489', numBg:'#EEEDFE', numText:'#26215C', numStroke:'#534AB7' },
  Municipal:   { icon:FaCity,                hdrBg:'#E6F1FB', iconBg:'#185FA5', catText:'#0C447C', numBg:'#E6F1FB', numText:'#0C447C', numStroke:'#185FA5' },
  Passport:    { icon:FaGlobe,               hdrBg:'#EEEDFE', iconBg:'#534AB7', catText:'#3C3489', numBg:'#EEEDFE', numText:'#26215C', numStroke:'#534AB7' },
  Revenue:     { icon:FaDollarSign,           hdrBg:'#E1F5EE', iconBg:'#0F6E56', catText:'#085041', numBg:'#E1F5EE', numText:'#085041', numStroke:'#0F6E56' },
  default:     { icon:FaPhone,               hdrBg:'#F1EFE8', iconBg:'#5F5E5A', catText:'#444441', numBg:'#F1EFE8', numText:'#444441', numStroke:'#5F5E5A' },
};

// ── Inline SVG icons (removes react-icons dependency for card body) ──────────

const IconClock    = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v2.8l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const IconPerson   = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const IconPin      = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><path d="M7 1.5a3.5 3.5 0 00-3.5 3.5c0 3 3.5 7.5 3.5 7.5s3.5-4.5 3.5-7.5A3.5 3.5 0 007 1.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.1"/></svg>;
const IconDoc      = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const IconCheck    = () => <svg viewBox="0 0 14 14" fill="none" width="11" height="11"><path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconWeb      = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 2.5c-1.5 1.5-2.5 3.5-2.5 5.5s1 4 2.5 5.5M8 2.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5M2 8h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const IconPhone    = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 3h3.5l1.2 3.5-1.7 1.2a8 8 0 003.3 3.3l1.2-1.7L14 10.5V13c0 .8-.8 1.5-1.5 1.5C5.5 14.5 1.5 10.5 1.5 4.5 1.5 3.8 2.2 3 3 3z" stroke="currentColor" strokeWidth="1.3"/></svg>;
const IconMail     = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const IconMap      = () => <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 1.5a4 4 0 00-4 4c0 3.5 4 9 4 9s4-5.5 4-9a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const IconArrow    = () => <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

// ── MetaRow — one info row inside a service card ────────────────────────────

function MetaRow({ iconBg, icon: IconComp, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg, color: 'inherit' }}>
        <IconComp />
      </span>
      <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 min-w-0 pt-0.5">{children}</div>
    </div>
  );
}

// ── ActionBtn — footer button for service card ──────────────────────────────

function ActionBtn({ href, to, bg, color, IconComp, label, disabled }) {
  const cls = "flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all";
  const style = disabled
    ? { background:'var(--color-background-secondary)', color:'var(--color-text-tertiary)', opacity:0.38, cursor:'not-allowed' }
    : { background: bg, color };

  if (disabled) return <span className={cls} style={style}><IconComp />{label}</span>;
  if (to) return <Link to={to} className={`${cls} hover:-translate-y-0.5`} style={style}><IconComp />{label}</Link>;
  return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${cls} hover:-translate-y-0.5`} style={style}><IconComp />{label}</a>;
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Services() {
  const [activeTab, setActiveTab]   = useState('services');
  const [services, setServices]     = useState([]);
  const [helplines, setHelplines]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]       = useState(EMPTY_FILTERS);
  const [helplineSearch, setHelplineSearch]     = useState('');
  const [helplineCategory, setHelplineCategory] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (Array.isArray(v) ? v.length : v)
          params.append(k, Array.isArray(v) ? v.join(',') : v);
      });
      const res = await axios.get(`http://localhost:5000/api/services?${params}`);
      setServices(res.data);
    } catch (err) { console.error('Error fetching services:', err); }
    finally { setLoading(false); }
  }, [filters]);

  const fetchHelplines = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (helplineCategory) params.append('category', helplineCategory);
      if (helplineSearch)   params.append('search',   helplineSearch);
      const res = await axios.get(`http://localhost:5000/api/helplines?${params}`);
      setHelplines(res.data);
    } catch (err) { console.error('Error fetching helplines:', err); }
  }, [helplineCategory, helplineSearch]);

  useEffect(() => {
    activeTab === 'services' ? fetchServices() : fetchHelplines();
  }, [activeTab, fetchServices, fetchHelplines]);

  const toggleDocument = (doc) =>
    setFilters(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter(d => d !== doc)
        : [...prev.requiredDocuments, doc]
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Service & Helpline Directory</h1>
          <p className="text-blue-100 text-lg">Find government services and emergency contact numbers easily</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          {[['services','Government Services'],['helplines','Emergency & Departmental Helplines']].map(([tab, lbl]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ════════════════ SERVICES TAB ════════════════ */}
        {activeTab === 'services' && (
          <>
            {/* Search + filter bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search services by name or description..."
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowFilters(s => !s)}
                    className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition ${
                      showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}>
                    <FaFilter /><span>Filters</span>
                    <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => setFilters(EMPTY_FILTERS)}
                    className="px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center gap-2">
                    <FaTimes /><span>Clear</span>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select value={filters.department}
                      onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <select value={filters.urgency}
                      onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">All</option>
                      {URGENCY_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BDT)</label>
                    <div className="flex gap-2">
                      {['minCost','maxCost'].map(k => (
                        <input key={k} type="number" placeholder={k==='minCost'?'Min':'Max'}
                          value={filters[k]}
                          onChange={e => setFilters(f => ({ ...f, [k]: e.target.value }))}
                          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                    <input type="text" placeholder="e.g., 3-5 days" value={filters.processingTime}
                      onChange={e => setFilters(f => ({ ...f, processingTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_OPTIONS.map(doc => (
                        <button key={doc.value} onClick={() => toggleDocument(doc.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filters.requiredDocuments.includes(doc.value)
                              ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}>
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Service cards ── */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(service => {
                  const dept = DEPT_COLOR[service.department] || DEPT_COLOR.default;
                  const urg  = URGENCY_PILL[service.urgency]  || URGENCY_PILL.medium;

                  return (
                    <div key={service._id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                      style={{ height: '420px' }}        // ← fixed height — all cards same size
                    >
                      {/* Header */}
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: dept.bg }}>
                            {/* Department icon */}
                            <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                              <rect x="1.5" y="2" width="11" height="10" rx="1.2" stroke={dept.stroke} strokeWidth="1.2"/>
                              <path d="M4.5 6.5h5M4.5 9h3" stroke={dept.stroke} strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                          </span>
                          <span className="text-xs font-medium truncate" style={{ color: dept.text }}>{service.department}</span>
                          <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: urg.bg, color: urg.text }}>{urg.label}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate">{service.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{service.description}</p>
                      </div>

                      {/* Body — fixed rows, overflow hidden so layout never breaks */}
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
                                  return (
                                    <span key={doc} className="px-1.5 py-px rounded text-xs font-medium"
                                      style={{ background: c.bg, color: c.text }}>
                                      {DOCUMENT_OPTIONS.find(d => d.value === doc)?.label || doc}
                                    </span>
                                  );
                                })
                              : <span className="text-xs text-gray-400">None required</span>
                            }
                          </div>
                        </MetaRow>
                        <MetaRow iconBg="#E1F5EE" icon={IconCheck} label="Cost">
                          <span className="text-sm font-semibold" style={{ color:'#0F6E56' }}>
                            {costFormatter.format(service.cost)}
                          </span>
                        </MetaRow>
                      </div>

                      {/* Footer actions */}
                      <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 flex-shrink-0">
                        <ActionBtn href={service.website} bg="#E6F1FB" color="#0C447C" IconComp={IconWeb}   label="Website" disabled={!service.website} />
                        <ActionBtn href={service.helpline ? `tel:${service.helpline}` : null} bg="#EAF3DE" color="#27500A" IconComp={IconPhone} label="Call" disabled={!service.helpline} />
                        <ActionBtn href={service.email ? `mailto:${service.email}` : null} bg="#EEEDFE" color="#26215C" IconComp={IconMail} label="Email" disabled={!service.email} />
                        <ActionBtn to={`/nearby?serviceId=${service._id}`} bg="#FCEBEB" color="#791F1F" IconComp={IconMap} label="Map" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ════════════════ HELPLINES TAB ════════════════ */}
        {activeTab === 'helplines' && (
          <>
            {/* Search + category */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search helplines by name or description..."
                    value={helplineSearch} onChange={e => setHelplineSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select value={helplineCategory} onChange={e => setHelplineCategory(e.target.value)}
                  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                  {HELPLINE_CATEGORIES.map(c => (
                    <option key={c} value={c}>{HELPLINE_CATEGORY_LABELS[c] || c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Helpline cards ── */}
            {helplines.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FaPhone className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No helplines found</h3>
                <p className="text-gray-500">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {helplines.map(helpline => {
                  const s = CATEGORY_STYLES[helpline.category] || CATEGORY_STYLES.default;
                  const Icon = s.icon;
                  return (
                    <div key={helpline._id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                    >
                      {/* Colored header */}
                      <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
                        style={{ background: s.hdrBg }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: s.iconBg }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{helpline.name}</h3>
                          <p className="text-xs font-medium mt-0.5" style={{ color: s.catText }}>{helpline.category}</p>
                        </div>
                        {/* Emergency / 24x7 badges in header */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          {helpline.isEmergency && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background:'#FCEBEB', color:'#791F1F' }}>Emergency</span>
                          )}
                          {helpline.available24x7 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background:'#EAF3DE', color:'#27500A' }}>24/7</span>
                          )}
                        </div>
                      </div>

                      {/* Numbers */}
                      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
                        <p className="text-xs font-medium tracking-widest text-gray-400">CONTACT</p>
                        {helpline.numbers.map((num, i) => (
                          <a key={i} href={`tel:${num}`}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80 group"
                            style={{ background: s.numBg }}>
                            <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink:0 }}>
                              <path d="M2.5 2.5h3l1 3-1.5 1A7 7 0 008.5 10l1-1.5 3 1V12c0 .6-.5 1-1 1C4 13 1 10 1 5.5c0-.5.5-1 1-1l.5-2z"
                                stroke={s.numStroke} strokeWidth="1.2"/>
                            </svg>
                            <span className="text-sm font-semibold flex-1" style={{ color: s.numText }}>{num}</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: s.numText }}/>
                          </a>
                        ))}
                      </div>

                      {/* Website */}
                      {helpline.website && (
                        <div className="px-4 pb-2">
                          <a href={helpline.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition group">
                            <FaGlobe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-gray-600 flex-1 truncate">Visit official website</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {helpline.description && (
                        <div className="px-4 pb-3">
                          <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg leading-relaxed line-clamp-2">
                            <FaInfoCircle className="inline mr-1 text-gray-400" />{helpline.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
