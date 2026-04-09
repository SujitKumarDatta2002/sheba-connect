

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   FaUpload, FaDownload, FaTrash, FaSearch, FaEye,
//   FaFilePdf, FaFileImage, FaFileAlt,
//   FaChevronDown, FaFilter, FaSortAmountDown,
//   FaCheckCircle, FaTimesCircle, FaClock, FaIdCard,
//   FaMoneyBill, FaCar, FaBirthdayCake, FaPassport,
//   FaCertificate, FaGraduationCap  // new icons
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function Documents() {
//   const navigate = useNavigate();
//   const [documents, setDocuments] = useState([]);
//   const [profileStatus, setProfileStatus] = useState(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sort, setSort] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });
//   const [previewDocument, setPreviewDocument] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   // Check authentication on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const documentTypes = [
//     { type: "passport", name: "Passport", category: "Identity", icon: FaPassport, color: "blue" },
//     { type: "nid", name: "National ID", category: "Identity", icon: FaIdCard, color: "purple" },
//     { type: "birthCertificate", name: "Birth Certificate", category: "Identity", icon: FaBirthdayCake, color: "pink" },
//     { type: "tin", name: "TIN Certificate", category: "Financial", icon: FaMoneyBill, color: "green" },
//     { type: "drivingLicense", name: "Driving License", category: "Transport", icon: FaCar, color: "orange" },
//     // New document types
//     { type: "citizenship", name: "Citizenship Certificate", category: "Identity", icon: FaCertificate, color: "indigo" },
//     { type: "educationalCertificate", name: "Educational Certificate", category: "Education", icon: FaGraduationCap, color: "teal" }
//   ];

//   const categories = ["all", "Identity", "Financial", "Transport", "Education"]; // added Education

//   // Helper function to get auth headers
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     return {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     };
//   };

//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
//   };

//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const res = await axios.get("http://localhost:5000/api/documents", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDocuments(res.data);
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//       } else {
//         showNotification("Failed to fetch documents", "error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfileStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await axios.get('http://localhost:5000/api/users/profile/status', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setProfileStatus(res.data);
//     } catch (err) {
//       console.error('Failed to fetch profile status', err);
//       if (err.response?.status === 401) {
//         navigate('/login');
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//     fetchProfileStatus();
//   }, []);

//   const getDocument = (type) => {
//     return documents.find(doc => doc.documentType === type);
//   };

//   const deleteDocument = async (id, docName) => {
//     if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       await axios.delete(`http://localhost:5000/api/documents/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchDocuments();
//       fetchProfileStatus();
//       showNotification("Document deleted successfully", "success");
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 401) {
//         navigate('/login');
//       } else {
//         showNotification("Failed to delete document", "error");
//       }
//     }
//   };

//   const viewDocument = async (doc) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       await axios.get(`http://localhost:5000/api/documents/${doc._id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const response = await axios.get(`http://localhost:5000/api/documents/${doc._id}/download`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       setPreviewDocument({ ...doc, url });
//       setShowPreview(true);
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 401) {
//         navigate('/login');
//       } else {
//         showNotification("Failed to view document", "error");
//       }
//     }
//   };

//   const downloadDocument = async (doc) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`http://localhost:5000/api/documents/${doc._id}/download`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', doc.fileName || 'document.pdf');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 401) {
//         navigate('/login');
//       } else {
//         showNotification("Failed to download document", "error");
//       }
//     }
//   };

//   const getFileIcon = (filename) => {
//     const ext = filename?.split('.').pop()?.toLowerCase();
//     if (ext === 'pdf') return <FaFilePdf className="text-red-500" />;
//     if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaFileImage className="text-green-500" />;
//     return <FaFileAlt className="text-gray-500" />;
//   };

//   const filteredDocs = documentTypes
//     .filter(doc =>
//       doc.name.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(doc => {
//       const uploaded = getDocument(doc.type);
//       if (statusFilter === "uploaded") return uploaded;
//       if (statusFilter === "missing") return !uploaded;
//       return true;
//     })
//     .filter(doc => {
//       if (selectedCategory === "all") return true;
//       return doc.category === selectedCategory;
//     });

//   const sortedDocs = [...filteredDocs].sort((a, b) => {
//     const docA = getDocument(a.type);
//     const docB = getDocument(b.type);

//     if (sort === "name") return a.name.localeCompare(b.name);
//     if (sort === "newest") return new Date(docB?.createdAt || 0) - new Date(docA?.createdAt || 0);
//     if (sort === "oldest") return new Date(docA?.createdAt || 0) - new Date(docB?.createdAt || 0);
//     return 0;
//   });

//   const getStatusColor = (status) => {
//     return status === "uploaded" 
//       ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
//       : "bg-rose-50 text-rose-700 border-rose-200";
//   };

//   const theme = {
//     primary: "from-blue-600 to-indigo-600",
//     primaryLight: "from-blue-50 to-indigo-50",
//     accent: "from-purple-500 to-pink-500",
//     success: "emerald",
//     danger: "rose",
//     warning: "amber"
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
//           notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
//         } text-white`}>
//           {notification.message}
//         </div>
//       )}

//       {/* Document Preview Modal */}
//       {showPreview && previewDocument && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//                   {getFileIcon(previewDocument.fileName)}
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {documentTypes.find(dt => dt.type === previewDocument.documentType)?.name || 'Document'} Preview
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Uploaded on {new Date(previewDocument.uploadedAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowPreview(false)}
//                 className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//               >
//                 <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="p-6 bg-gray-50 max-h-[calc(90vh-200px)] overflow-auto">
//               <iframe
//                 src={previewDocument.url}
//                 className="w-full h-[600px] rounded-xl border border-gray-200"
//                 title="Document Preview"
//               />
//             </div>
            
//             <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => downloadDocument(previewDocument)}
//                 className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
//               >
//                 <FaDownload className="w-4 h-4" />
//                 Download
//               </button>
//               <button
//                 onClick={() => setShowPreview(false)}
//                 className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Header */}
//         <div className="mb-8 animate-slideUp">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Center</h1>
//           <p className="text-gray-600">Manage and organize your important documents</p>
//         </div>

//         {/* Profile Completion Card */}
//         {profileStatus ? (
//           <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden animate-slideUp border border-gray-100">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-800">Profile Readiness</h2>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Complete your profile by uploading all required documents
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <span
//                     className="px-4 py-2 rounded-full text-sm font-bold shadow-md"
//                     style={{
//                       backgroundColor: profileStatus.currentBadge.color,
//                       color: 'white',
//                       textShadow: '0 1px 2px rgba(0,0,0,0.2)'
//                     }}
//                   >
//                     {profileStatus.currentBadge.name}
//                   </span>

//                   <div className="relative">
//                     <svg className="w-20 h-20 transform -rotate-90">
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r="36"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         className="text-gray-200"
//                       />
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r="36"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         strokeDasharray={2 * Math.PI * 36}
//                         strokeDashoffset={2 * Math.PI * 36 * (1 - profileStatus.completionPercentage / 100)}
//                         className="text-blue-600 transition-all duration-1000"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-800">
//                       {profileStatus.completionPercentage}%
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-600">Progress</span>
//                   <span className="font-medium text-gray-800">
//                     {profileStatus.documentsStatus.filter(d => d.status !== 'Not Uploaded').length} of {profileStatus.documentsStatus.length} uploaded
//                   </span>
//                 </div>

//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-1000"
//                     style={{ width: `${profileStatus.completionPercentage}%` }}
//                   />
//                 </div>

//                 {profileStatus.missingDocuments.length > 0 && (
//                   <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
//                     <p className="font-medium text-amber-800 mb-2 flex items-center gap-2">
//                       <span>⚠️</span> Missing documents to reach next badge:
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {profileStatus.missingDocuments.map(doc => (
//                         <button
//                           key={doc.type}
//                           onClick={() => navigate(`/upload/${doc.type}`)}
//                           className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition-colors flex items-center gap-1"
//                         >
//                           <span>📄</span> {doc.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-lg mb-8 p-6 animate-pulse">
//             <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
//             <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
//             <div className="flex justify-between items-center mb-4">
//               <div className="h-8 bg-gray-200 rounded w-24"></div>
//               <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full w-full mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           </div>
//         )}

//         {/* Search and Filters */}
//         <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 animate-slideUp border border-gray-100" style={{ animationDelay: '0.1s' }}>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search documents..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               />
//             </div>
            
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors text-gray-700"
//             >
//               <FaFilter className={`text-gray-500 transition-colors ${showFilters ? 'text-blue-600' : ''}`} />
//               <span>Filters</span>
//               <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//             </button>

//             <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
//               <FaSortAmountDown className="text-gray-500" />
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="bg-transparent outline-none cursor-pointer text-gray-700"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="name">Name</option>
//               </select>
//             </div>
//           </div>

//           {/* Filter Panel */}
//           {showFilters && (
//             <div className="pt-5 border-t mt-5 animate-slideDown">
//               <div className="flex flex-wrap gap-6">
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
//                   <div className="flex flex-wrap gap-2">
//                     {categories.map((category) => (
//                       <button
//                         key={category}
//                         onClick={() => setSelectedCategory(category)}
//                         className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
//                           selectedCategory === category
//                             ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         {category === 'all' ? 'All Categories' : category}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setStatusFilter('all')}
//                       className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
//                         statusFilter === 'all'
//                           ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       All
//                     </button>
//                     <button
//                       onClick={() => setStatusFilter('uploaded')}
//                       className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
//                         statusFilter === 'uploaded'
//                           ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       Uploaded
//                     </button>
//                     <button
//                       onClick={() => setStatusFilter('missing')}
//                       className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
//                         statusFilter === 'missing'
//                           ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       Missing
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Document Grid/Table */}
//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-slideUp" style={{ animationDelay: '0.2s' }}>
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="hidden md:block">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Document</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Uploaded</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {sortedDocs.map((docType, index) => {
//                     const doc = getDocument(docType.type);
//                     const Icon = docType.icon;
                    
//                     return (
//                       <tr 
//                         key={docType.type}
//                         className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all hover:shadow-sm animate-slideUp"
//                         style={{ animationDelay: `${0.3 + index * 0.05}s` }}
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${docType.color}-50 to-${docType.color}-100 group-hover:scale-110 transition-transform flex items-center justify-center shadow-sm`}>
//                               <Icon className={`w-6 h-6 text-${docType.color}-600`} />
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-800">{docType.name}</div>
//                               {doc && (
//                                 <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
//                                   {getFileIcon(doc.fileName)}
//                                   <span className="truncate max-w-[150px]">{doc.fileName}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <span className="text-sm text-gray-600">{docType.category}</span>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border ${getStatusColor(doc ? 'uploaded' : 'missing')}`}>
//                             {doc ? (
//                               <>
//                                 <FaCheckCircle className="mr-1.5 w-3 h-3" />
//                                 Uploaded
//                                 {doc.status !== 'Pending' && (
//                                   <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
//                                     doc.status === 'Verified' ? 'bg-green-200 text-green-800' :
//                                     doc.status === 'Rejected' ? 'bg-red-200 text-red-800' :
//                                     'bg-yellow-200 text-yellow-800'
//                                   }`}>
//                                     {doc.status}
//                                   </span>
//                                 )}
//                               </>
//                             ) : (
//                               <>
//                                 <FaTimesCircle className="mr-1.5 w-3 h-3" />
//                                 Missing
//                               </>
//                             )}
//                           </span>
//                         </td>
                        
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {doc ? (
//                             <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
//                               <FaClock className="text-gray-400 w-3 h-3" />
//                               {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400">—</span>
//                           )}
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="flex gap-2">
//                             {doc ? (
//                               <>
//                                 <button
//                                   onClick={() => viewDocument(doc)}
//                                   className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
//                                   title="View Document"
//                                 >
//                                   <FaEye className="w-4 h-4" />
//                                   <span className="hidden lg:inline">View</span>
//                                 </button>
//                                 <button
//                                   onClick={() => downloadDocument(doc)}
//                                   className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
//                                   title="Download"
//                                 >
//                                   <FaDownload className="w-4 h-4" />
//                                   <span className="hidden lg:inline">Download</span>
//                                 </button>
//                                 <button
//                                   onClick={() => deleteDocument(doc._id, docType.name)}
//                                   className="px-3 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
//                                   title="Delete"
//                                 >
//                                   <FaTrash className="w-4 h-4" />
//                                   <span className="hidden lg:inline">Delete</span>
//                                 </button>
//                               </>
//                             ) : (
//                               <button
//                                 onClick={() => navigate(`/upload/${docType.type}`)}
//                                 className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
//                               >
//                                 <FaUpload className="w-4 h-4" />
//                                 Upload
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {sortedDocs.length === 0 && !loading && (
//             <div className="text-center py-20 animate-fadeIn">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
//                 <FaSearch className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents found</h3>
//               <p className="text-gray-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
        
//         .animate-slideUp {
//           animation: slideUp 0.5s ease-out;
//         }
        
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }



















// Documents.jsx — only Profile Readiness card section replaced
// Everything else (state, API calls, table, modal) is unchanged

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUpload, FaDownload, FaTrash, FaSearch, FaEye,
  FaFilePdf, FaFileImage, FaFileAlt,
  FaChevronDown, FaFilter, FaSortAmountDown,
  FaCheckCircle, FaTimesCircle, FaClock, FaIdCard,
  FaMoneyBill, FaCar, FaBirthdayCake, FaPassport,
  FaCertificate, FaGraduationCap
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Badge config mirrors BADGES in userController.js
// Replace only the BADGES constant and ProfileBadge component
// Everything else in Documents.jsx stays identical

const BADGES = [
  { threshold: 0,  name: "Starter",  icon: "○", ring: "#888780", bar: "#B4B2A9", bg: "#F1EFE8", txt: "#444441", node: "#D3D1C7", nodeTxt: "#5F5E5A" },
  { threshold: 20, name: "Bronze",   icon: "◆", ring: "#CD7F32", bar: "#CD7F32", bg: "#FFF3E8", txt: "#7A4F28", node: "#CD7F32", nodeTxt: "#ffffff" },
  { threshold: 40, name: "Silver",   icon: "◈", ring: "#6B7280", bar: "#6B7280", bg: "#F3F4F6", txt: "#374151", node: "#6B7280", nodeTxt: "#ffffff" },
  { threshold: 60, name: "Gold",     icon: "★", ring: "#BA7517", bar: "#EF9F27", bg: "#FAEEDA", txt: "#633806", node: "#EF9F27", nodeTxt: "#412402" },
  { threshold: 80, name: "Platinum", icon: "❋", ring: "#185FA5", bar: "#378ADD", bg: "#E6F1FB", txt: "#0C447C", node: "#378ADD", nodeTxt: "#ffffff" },
];

function ProfileBadge({ profileStatus, onDocClick }) {
  const { completionPercentage: pct, currentBadge, missingDocuments, documentsStatus } = profileStatus;

  const badge = [...BADGES].reverse().find(b => pct >= b.threshold) || BADGES[0];
  const nextBadge = BADGES.find(b => b.threshold > pct);
  const uploaded = documentsStatus.filter(d => d.status !== "Not Uploaded").length;
  const total = documentsStatus.length;

  const R = 37;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-base font-medium text-gray-800">Profile Readiness</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload documents to unlock higher badges</p>
        </div>
        {/* Badge pill */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500"
          style={{ background: badge.bg, color: badge.txt }}
        >
          <span>{badge.icon}</span>
          {currentBadge.name}
        </span>
      </div>

      {/* Ring + tiers */}
      <div className="flex items-center gap-5">
        {/* Animated SVG ring */}
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={R} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            {/* Pulse arc behind main arc */}
            <circle
              cx="44" cy="44" r={R} fill="none"
              stroke={badge.ring} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`12 ${C - 12}`}
              strokeDashoffset={offset}
              transform="rotate(-90 44 44)"
              opacity="0.3"
              style={{ transition: "stroke-dashoffset 1s ease, stroke .4s" }}
            />
            {/* Main arc */}
            <circle
              cx="44" cy="44" r={R} fill="none"
              stroke={badge.ring} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              transform="rotate(-90 44 44)"
              style={{ transition: "stroke-dashoffset 1s ease, stroke .4s" }}
            />
          </svg>
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium transition-colors duration-500"
            style={{ color: badge.ring }}
          >
            {pct}%
          </span>
        </div>

        {/* Tiers + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-3 flex-wrap">
            {BADGES.map((b) => {
              const achieved = pct >= b.threshold;
              const active = badge.threshold === b.threshold;
              return (
                <div key={b.name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300"
                    style={{
                      background: achieved ? b.node : "#e5e7eb",
                      color: achieved ? b.nodeTxt : "#9ca3af",
                      border: active ? `2px solid ${b.ring}` : "2px solid transparent",
                      transform: active ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {b.icon}
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{ color: active ? badge.ring : "#9ca3af", fontWeight: active ? 500 : 400 }}
                  >
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: badge.bar }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-gray-400">{uploaded} of {total} uploaded</span>
            <span style={{ color: badge.ring }}>
              {nextBadge ? `Next: ${nextBadge.name} (${nextBadge.threshold}%)` : "Max level reached!"}
            </span>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-lg font-medium text-blue-600">{uploaded}</div>
          <div className="text-xs text-blue-400 mt-0.5">Uploaded</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-3 text-center">
          <div className="text-lg font-medium text-rose-500">{total - uploaded}</div>
          <div className="text-xs text-rose-300 mt-0.5">Missing</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <div className="text-lg font-medium text-emerald-600">{pct}%</div>
          <div className="text-xs text-emerald-400 mt-0.5">Complete</div>
        </div>
      </div>

      {/* Missing documents */}
      {missingDocuments.length > 0 && (
        <div className="mt-4 p-3 rounded-xl border" style={{ background: "#FAEEDA", borderColor: "#EF9F27" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "#633806" }}>
            Still needed to reach next badge:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingDocuments.map(doc => (
              <button
                key={doc.type}
                onClick={() => onDocClick(doc.type)}
                className="px-3 py-1 rounded-lg text-xs transition-colors"
                style={{ background: "#FAC775", color: "#412402" }}
                onMouseEnter={e => e.target.style.background = "#EF9F27"}
                onMouseLeave={e => e.target.style.background = "#FAC775"}
              >
                + {doc.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Loading skeleton for the badge card ────────────────────────────────────
function ProfileBadgeSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-5" />
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-1.5 bg-gray-200 rounded-full w-full" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [profileStatus, setProfileStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const documentTypes = [
    { type: "passport",              name: "Passport",                category: "Identity",   icon: FaPassport,     color: "blue"   },
    { type: "nid",                   name: "National ID",             category: "Identity",   icon: FaIdCard,       color: "purple" },
    { type: "birthCertificate",      name: "Birth Certificate",       category: "Identity",   icon: FaBirthdayCake, color: "pink"   },
    { type: "tin",                   name: "TIN Certificate",         category: "Financial",  icon: FaMoneyBill,    color: "green"  },
    { type: "drivingLicense",        name: "Driving License",         category: "Transport",  icon: FaCar,          color: "orange" },
    { type: "citizenship",           name: "Citizenship Certificate", category: "Identity",   icon: FaCertificate,  color: "indigo" },
    { type: "educationalCertificate",name: "Educational Certificate", category: "Education",  icon: FaGraduationCap,color: "teal"   },
  ];

  const categories = ["all", "Identity", "Financial", "Transport", "Education"];

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return null; }
    return token;
  };

  const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = getToken(); if (!token) return;
      const res = await axios.get("http://localhost:5000/api/documents", authHeader(token));
      setDocuments(res.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }
      else showNotification("Failed to fetch documents", "error");
    } finally { setLoading(false); }
  };

  const fetchProfileStatus = async () => {
    try {
      const token = getToken(); if (!token) return;
      const res = await axios.get("http://localhost:5000/api/users/profile/status", authHeader(token));
      setProfileStatus(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => { fetchDocuments(); fetchProfileStatus(); }, []);

  const getDocument = (type) => documents.find(doc => doc.documentType === type);

  const deleteDocument = async (id, docName) => {
    if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return;
    try {
      const token = getToken(); if (!token) return;
      await axios.delete(`http://localhost:5000/api/documents/${id}`, authHeader(token));
      fetchDocuments(); fetchProfileStatus();
      showNotification("Document deleted successfully", "success");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else showNotification("Failed to delete document", "error");
    }
  };

  const viewDocument = async (doc) => {
    try {
      const token = getToken(); if (!token) return;
      await axios.get(`http://localhost:5000/api/documents/${doc._id}`, authHeader(token));
      const res = await axios.get(`http://localhost:5000/api/documents/${doc._id}/download`, { ...authHeader(token), responseType: "blob" });
      setPreviewDocument({ ...doc, url: window.URL.createObjectURL(new Blob([res.data])) });
      setShowPreview(true);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else showNotification("Failed to view document", "error");
    }
  };

  const downloadDocument = async (doc) => {
    try {
      const token = getToken(); if (!token) return;
      const res = await axios.get(`http://localhost:5000/api/documents/${doc._id}/download`, { ...authHeader(token), responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url; a.setAttribute("download", doc.fileName || "document.pdf");
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else showNotification("Failed to download document", "error");
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-500" />;
    if (["jpg","jpeg","png","gif"].includes(ext)) return <FaFileImage className="text-green-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const sortedDocs = documentTypes
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter(d => {
      const up = getDocument(d.type);
      if (statusFilter === "uploaded") return up;
      if (statusFilter === "missing") return !up;
      return true;
    })
    .filter(d => selectedCategory === "all" || d.category === selectedCategory)
    .sort((a, b) => {
      const da = getDocument(a.type), db = getDocument(b.type);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return new Date(db?.createdAt || 0) - new Date(da?.createdAt || 0);
      if (sort === "oldest") return new Date(da?.createdAt || 0) - new Date(db?.createdAt || 0);
      return 0;
    });

  const getStatusColor = (status) =>
    status === "uploaded"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown text-white ${
          notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"
        }`}>
          {notification.message}
        </div>
      )}

      {/* Preview Modal — unchanged */}
      {showPreview && previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  {getFileIcon(previewDocument.fileName)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {documentTypes.find(dt => dt.type === previewDocument.documentType)?.name || "Document"} Preview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(previewDocument.uploadedAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 bg-gray-50 max-h-[calc(90vh-200px)] overflow-auto">
              <iframe src={previewDocument.url} className="w-full h-[600px] rounded-xl border border-gray-200" title="Document Preview" />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => downloadDocument(previewDocument)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
                <FaDownload className="w-4 h-4" /> Download
              </button>
              <button onClick={() => setShowPreview(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Document Center</h1>
          <p className="text-gray-500">Manage and organize your important documents</p>
        </div>

        {/* ── Profile Badge ── */}
        {profileStatus
          ? <ProfileBadge profileStatus={profileStatus} onDocClick={(type) => navigate(`/upload/${type}`)} />
          : <ProfileBadgeSkeleton />
        }

        {/* Search and Filters — unchanged */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search documents..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100 text-gray-700">
              <FaFilter className={showFilters ? "text-blue-600" : "text-gray-500"} />
              <span>Filters</span>
              <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl">
              <FaSortAmountDown className="text-gray-500" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none text-gray-700">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="pt-5 border-t mt-5">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === cat ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {cat === "all" ? "All Categories" : cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="flex gap-2">
                    {[["all","blue"],["uploaded","emerald"],["missing","rose"]].map(([val, color]) => (
                      <button key={val} onClick={() => setStatusFilter(val)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          statusFilter === val ? `bg-${color}-600 text-white shadow-md` : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Table — unchanged */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600" />
            </div>
          ) : (
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {["Document","Category","Status","Uploaded","Actions"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedDocs.map((docType) => {
                    const doc = getDocument(docType.type);
                    const Icon = docType.icon;
                    return (
                      <tr key={docType.type} className="group hover:bg-blue-50/40 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-${docType.color}-50 group-hover:scale-110 transition-transform flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 text-${docType.color}-600`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{docType.name}</div>
                              {doc && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  {getFileIcon(doc.fileName)}
                                  <span className="truncate max-w-[150px]">{doc.fileName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{docType.category}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border ${getStatusColor(doc ? "uploaded" : "missing")}`}>
                            {doc ? (
                              <>
                                <FaCheckCircle className="mr-1.5 w-3 h-3" /> Uploaded
                                {doc.status !== "Pending" && (
                                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                    doc.status === "Verified" ? "bg-green-200 text-green-800" :
                                    doc.status === "Rejected" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"
                                  }`}>{doc.status}</span>
                                )}
                              </>
                            ) : <><FaTimesCircle className="mr-1.5 w-3 h-3" /> Missing</>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {doc ? (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                              <FaClock className="text-gray-400 w-3 h-3" />
                              {new Date(doc.uploadedAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {doc ? (
                              <>
                                <button onClick={() => viewDocument(doc)} className="px-3 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2 text-sm">
                                  <FaEye className="w-4 h-4" /><span className="hidden lg:inline">View</span>
                                </button>
                                <button onClick={() => downloadDocument(doc)} className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm">
                                  <FaDownload className="w-4 h-4" /><span className="hidden lg:inline">Download</span>
                                </button>
                                <button onClick={() => deleteDocument(doc._id, docType.name)} className="px-3 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 flex items-center gap-2 text-sm">
                                  <FaTrash className="w-4 h-4" /><span className="hidden lg:inline">Delete</span>
                                </button>
                              </>
                            ) : (
                              <button onClick={() => navigate(`/upload/${docType.type}`)} className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm">
                                <FaUpload className="w-4 h-4" /> Upload
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {sortedDocs.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}