

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUpload, FaDownload, FaTrash, FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function Documents() {

//   const navigate = useNavigate();

//   const [documents, setDocuments] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sort, setSort] = useState("newest");

//   const documentTypes = [
//     { type: "passport", name: "Passport", category: "Identity" },
//     { type: "nid", name: "National ID", category: "Identity" },
//     { type: "birthCertificate", name: "Birth Certificate", category: "Identity" },
//     { type: "tin", name: "TIN Certificate", category: "Financial" },
//     { type: "drivingLicense", name: "Driving License", category: "Transport" }
//   ];

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/documents");
//       setDocuments(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getDocument = (type) => {
//     return documents.find(doc => doc.documentType === type);
//   };

//   const deleteDocument = async (id) => {
//     if (!window.confirm("Delete this document?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/documents/${id}`);
//       fetchDocuments();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* ----------------------------
//      FIXED PROFILE COMPLETION
//   -----------------------------*/

//   const uploadedCount = documentTypes.filter(docType =>
//     documents.some(doc => doc.documentType === docType.type)
//   ).length;

//   const completion = Math.round(
//     (uploadedCount / documentTypes.length) * 100
//   );

//   /* ----------------------------
//      SEARCH / FILTER / SORT
//   -----------------------------*/

//   const filteredDocs = documentTypes
//     .filter(doc =>
//       doc.name.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(doc => {
//       const uploaded = getDocument(doc.type);

//       if (statusFilter === "uploaded") return uploaded;
//       if (statusFilter === "missing") return !uploaded;

//       return true;
//     });

//   const sortedDocs = [...filteredDocs].sort((a, b) => {

//     const docA = getDocument(a.type);
//     const docB = getDocument(b.type);

//     if (sort === "name")
//       return a.name.localeCompare(b.name);

//     if (sort === "newest")
//       return new Date(docB?.createdAt || 0) -
//              new Date(docA?.createdAt || 0);

//     if (sort === "oldest")
//       return new Date(docA?.createdAt || 0) -
//              new Date(docB?.createdAt || 0);

//     return 0;
//   });

//   return (

//     <div className="p-10">

//       {/* Header */}

//       <div className="flex justify-between items-center mb-6">

//         <h1 className="text-3xl font-bold">
//           Document Center
//         </h1>

//       </div>

//       {/* Profile Completion */}

//       <div className="bg-white shadow rounded-lg p-6 mb-8">

//         <h2 className="font-semibold mb-2">
//           Profile Completion
//         </h2>

//         <p className="text-sm text-gray-500 mb-3">
//           {uploadedCount} of {documentTypes.length} documents uploaded ({completion}%)
//         </p>

//         <div className="w-full bg-gray-200 rounded h-3">

//           <div
//             className="bg-blue-600 h-3 rounded"
//             style={{ width: `${completion}%` }}
//           />

//         </div>

//       </div>

//       {/* Search + Filters */}

//       <div className="flex gap-4 mb-6">

//         <div className="flex items-center border rounded px-3 py-2 bg-white">

//           <FaSearch className="text-gray-400 mr-2" />

//           <input
//             type="text"
//             placeholder="Search documents..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="outline-none"
//           />

//         </div>

//         <select
//           className="border rounded px-3 py-2 bg-white"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >

//           <option value="all">All Status</option>
//           <option value="uploaded">Uploaded</option>
//           <option value="missing">Missing</option>

//         </select>

//         <select
//           className="border rounded px-3 py-2 bg-white"
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//         >

//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//           <option value="name">Name</option>

//         </select>

//       </div>

//       {/* Document Table */}

//       <div className="bg-white shadow rounded-lg overflow-hidden">

//         <table className="w-full text-left">

//           <thead className="bg-gray-100">

//             <tr>

//               <th className="p-4">Document</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Uploaded</th>
//               <th className="p-4">Actions</th>

//             </tr>

//           </thead>

//           <tbody>

//             {sortedDocs.map((docType) => {

//               const doc = getDocument(docType.type);

//               return (

//                 <tr key={docType.type} className="border-t">

//                   <td className="p-4 font-medium">
//                     {docType.name}
//                   </td>

//                   <td className="p-4">
//                     {docType.category}
//                   </td>

//                   <td className="p-4">

//                     {doc ? (

//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
//                         Uploaded
//                       </span>

//                     ) : (

//                       <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
//                         Missing
//                       </span>

//                     )}

//                   </td>

//                   <td className="p-4 text-sm text-gray-500">

//                     {doc
//                       ? new Date(doc.createdAt).toLocaleDateString()
//                       : "-"}

//                   </td>

//                   <td className="p-4 flex gap-3">

//                     {doc ? (

//                       <>

//                         <a
//                           href={`http://localhost:5000/${doc.filePath}`}
//                           download
//                           className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
//                         >
//                           <FaDownload />
//                           Download
//                         </a>

//                         <button
//                           onClick={() => deleteDocument(doc._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
//                         >
//                           <FaTrash />
//                           Delete
//                         </button>

//                       </>

//                     ) : (

//                       <button
//                         onClick={() => navigate(`/upload/${docType.type}`)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
//                       >
//                         <FaUpload />
//                         Upload
//                       </button>

//                     )}

//                   </td>

//                 </tr>

//               );

//             })}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }










// import { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   FaUpload, FaDownload, FaTrash, FaSearch, 
//   FaFilePdf, FaFileImage, FaFileAlt, FaUser,
//   FaBell, FaChevronDown, FaFilter, FaSortAmountDown,
//   FaCheckCircle, FaTimesCircle, FaClock, FaIdCard,
//   FaMoneyBill, FaCar, FaBirthdayCake, FaPassport
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Documents() {
//   const navigate = useNavigate();
//   const [documents, setDocuments] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sort, setSort] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//   const documentTypes = [
//     { type: "passport", name: "Passport", category: "Identity", icon: FaPassport, color: "blue" },
//     { type: "nid", name: "National ID", category: "Identity", icon: FaIdCard, color: "purple" },
//     { type: "birthCertificate", name: "Birth Certificate", category: "Identity", icon: FaBirthdayCake, color: "pink" },
//     { type: "tin", name: "TIN Certificate", category: "Financial", icon: FaMoneyBill, color: "green" },
//     { type: "drivingLicense", name: "Driving License", category: "Transport", icon: FaCar, color: "orange" }
//   ];

//   const categories = ["all", "Identity", "Financial", "Transport"];

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
//   };

//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/documents");
//       setDocuments(res.data);
//     } catch (err) {
//       console.log(err);
//       showNotification("Failed to fetch documents", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDocument = (type) => {
//     return documents.find(doc => doc.documentType === type);
//   };

//   const deleteDocument = async (id, docName) => {
//     if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/documents/${id}`);
//       fetchDocuments();
//       showNotification("Document deleted successfully", "success");
//     } catch (err) {
//       console.log(err);
//       showNotification("Failed to delete document", "error");
//     }
//   };

//   const getFileIcon = (filename) => {
//     const ext = filename?.split('.').pop()?.toLowerCase();
//     if (ext === 'pdf') return <FaFilePdf className="text-red-500" />;
//     if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaFileImage className="text-green-500" />;
//     return <FaFileAlt className="text-gray-500" />;
//   };

//   const uploadedCount = documentTypes.filter(docType =>
//     documents.some(doc => doc.documentType === docType.type)
//   ).length;

//   const completion = Math.round((uploadedCount / documentTypes.length) * 100);

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
//       ? "bg-green-100 text-green-800 border-green-200" 
//       : "bg-red-100 text-red-800 border-red-200";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Notification */}
//       <AnimatePresence>
//         {notification.show && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
//               notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//             } text-white`}
//           >
//             {notification.message}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white shadow-sm border-b"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-8">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 ShebaConnect
//               </h1>
//               <nav className="hidden md:flex space-x-6">
//                 {['Home', 'Complaints', 'Services', 'Documents'].map((item) => (
//                   <a
//                     key={item}
//                     href="#"
//                     className={`text-sm font-medium ${
//                       item === 'Documents' 
//                         ? 'text-blue-600 border-b-2 border-blue-600' 
//                         : 'text-gray-600 hover:text-gray-900'
//                     } px-1 py-4 transition-colors`}
//                   >
//                     {item}
//                   </a>
//                 ))}
//               </nav>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-gray-400 hover:text-gray-600">
//                 <FaBell className="w-5 h-5" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
              
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                   <FaUser className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium text-gray-700">anto</p>
//                   <p className="text-xs text-gray-500">muntaka.mubarrat.antorik@g.bracu.ac.bd</p>
//                 </div>
//                 <FaChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Completion Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden"
//         >
//           <div className="px-6 py-6">
//             <div className="flex items-center justify-between text-white mb-4">
//               <h2 className="text-lg font-semibold">Profile Completion</h2>
//               <span className="text-2xl font-bold">{completion}%</span>
//             </div>
            
//             <div className="w-full bg-white/30 rounded-full h-3 mb-4">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${completion}%` }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="bg-white h-3 rounded-full"
//               />
//             </div>
            
//             <div className="flex items-center justify-between text-white/90 text-sm">
//               <span>{uploadedCount} of {documentTypes.length} documents uploaded</span>
//               <span>{documentTypes.length - uploadedCount} remaining</span>
//             </div>
//           </div>
//         </motion.div>

//         {/* Search and Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-xl shadow-sm p-4 mb-6"
//         >
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search documents..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
//             >
//               <FaFilter className="text-gray-500" />
//               <span>Filters</span>
//               <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//             </button>

//             <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
//               <FaSortAmountDown className="text-gray-500" />
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="bg-transparent outline-none"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="name">Name</option>
//               </select>
//             </div>
//           </div>

//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="pt-4 border-t mt-4">
//                   <div className="flex flex-wrap gap-4">
//                     <div className="flex-1 min-w-[200px]">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                       <div className="flex flex-wrap gap-2">
//                         {categories.map((category) => (
//                           <button
//                             key={category}
//                             onClick={() => setSelectedCategory(category)}
//                             className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                               selectedCategory === category
//                                 ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                           >
//                             {category.charAt(0).toUpperCase() + category.slice(1)}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 min-w-[200px]">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => setStatusFilter('all')}
//                           className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                             statusFilter === 'all'
//                               ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           All
//                         </button>
//                         <button
//                           onClick={() => setStatusFilter('uploaded')}
//                           className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                             statusFilter === 'uploaded'
//                               ? 'bg-green-100 text-green-800 border-2 border-green-300'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           Uploaded
//                         </button>
//                         <button
//                           onClick={() => setStatusFilter('missing')}
//                           className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                             statusFilter === 'missing'
//                               ? 'bg-red-100 text-red-800 border-2 border-red-300'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                         >
//                           Missing
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Document Grid/Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-xl shadow-sm overflow-hidden"
//         >
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <div className="hidden md:block">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   <AnimatePresence>
//                     {sortedDocs.map((docType, index) => {
//                       const doc = getDocument(docType.type);
//                       const Icon = docType.icon;
                      
//                       return (
//                         <motion.tr
//                           key={docType.type}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className={`w-10 h-10 rounded-lg bg-${docType.color}-100 flex items-center justify-center`}>
//                                 <Icon className={`w-5 h-5 text-${docType.color}-600`} />
//                               </div>
//                               <div>
//                                 <div className="font-medium text-gray-900">{docType.name}</div>
//                                 {doc && (
//                                   <div className="flex items-center gap-1 text-xs text-gray-500">
//                                     {getFileIcon(doc.filePath)}
//                                     <span>{doc.filePath?.split('/').pop()}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
                          
//                           <td className="px-6 py-4">
//                             <span className="text-sm text-gray-600">{docType.category}</span>
//                           </td>
                          
//                           <td className="px-6 py-4">
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc ? 'uploaded' : 'missing')}`}>
//                               {doc ? (
//                                 <>
//                                   <FaCheckCircle className="mr-1" />
//                                   Uploaded
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaTimesCircle className="mr-1" />
//                                   Missing
//                                 </>
//                               )}
//                             </span>
//                           </td>
                          
//                           <td className="px-6 py-4 text-sm text-gray-500">
//                             {doc ? (
//                               <div className="flex items-center gap-1">
//                                 <FaClock className="text-gray-400" />
//                                 {new Date(doc.createdAt).toLocaleDateString('en-US', {
//                                   year: 'numeric',
//                                   month: 'short',
//                                   day: 'numeric'
//                                 })}
//                               </div>
//                             ) : '-'}
//                           </td>
                          
//                           <td className="px-6 py-4">
//                             <div className="flex gap-2">
//                               {doc ? (
//                                 <>
//                                   <a
//                                     href={`http://localhost:5000/${doc.filePath}`}
//                                     download
//                                     className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
//                                     title="Download"
//                                   >
//                                     <FaDownload className="w-4 h-4" />
//                                     <span className="hidden lg:inline">Download</span>
//                                   </a>
//                                   <button
//                                     onClick={() => deleteDocument(doc._id, docType.name)}
//                                     className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
//                                     title="Delete"
//                                   >
//                                     <FaTrash className="w-4 h-4" />
//                                     <span className="hidden lg:inline">Delete</span>
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   onClick={() => navigate(`/upload/${docType.type}`)}
//                                   className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md"
//                                 >
//                                   <FaUpload className="w-4 h-4" />
//                                   Upload
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </motion.tr>
//                       );
//                     })}
//                   </AnimatePresence>
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {sortedDocs.length === 0 && !loading && (
//             <div className="text-center py-20">
//               <div className="text-gray-400 mb-4">
//                 <FaSearch className="w-12 h-12 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
//               <p className="text-gray-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



















import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaUpload, FaDownload, FaTrash, FaSearch, FaEye,
  FaFilePdf, FaFileImage, FaFileAlt,
  FaChevronDown, FaFilter, FaSortAmountDown,
  FaCheckCircle, FaTimesCircle, FaClock, FaIdCard,
  FaMoneyBill, FaCar, FaBirthdayCake, FaPassport
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const documentTypes = [
    { type: "passport", name: "Passport", category: "Identity", icon: FaPassport, color: "blue" },
    { type: "nid", name: "National ID", category: "Identity", icon: FaIdCard, color: "purple" },
    { type: "birthCertificate", name: "Birth Certificate", category: "Identity", icon: FaBirthdayCake, color: "pink" },
    { type: "tin", name: "TIN Certificate", category: "Financial", icon: FaMoneyBill, color: "green" },
    { type: "drivingLicense", name: "Driving License", category: "Transport", icon: FaCar, color: "orange" }
  ];

  const categories = ["all", "Identity", "Financial", "Transport"];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
      showNotification("Failed to fetch documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const getDocument = (type) => {
    return documents.find(doc => doc.documentType === type);
  };

  const deleteDocument = async (id, docName) => {
    if (!window.confirm(`Are you sure you want to delete ${docName}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`);
      fetchDocuments();
      showNotification("Document deleted successfully", "success");
    } catch (err) {
      console.log(err);
      showNotification("Failed to delete document", "error");
    }
  };

  const viewDocument = (doc) => {
    setPreviewDocument(doc);
    setShowPreview(true);
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className="text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaFileImage className="text-green-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const getFileType = (filename) => {
    return filename?.split('.').pop()?.toLowerCase();
  };

  const uploadedCount = documentTypes.filter(docType =>
    documents.some(doc => doc.documentType === docType.type)
  ).length;

  const completion = Math.round((uploadedCount / documentTypes.length) * 100);

  const filteredDocs = documentTypes
    .filter(doc =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(doc => {
      const uploaded = getDocument(doc.type);
      if (statusFilter === "uploaded") return uploaded;
      if (statusFilter === "missing") return !uploaded;
      return true;
    })
    .filter(doc => {
      if (selectedCategory === "all") return true;
      return doc.category === selectedCategory;
    });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const docA = getDocument(a.type);
    const docB = getDocument(b.type);

    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "newest") return new Date(docB?.createdAt || 0) - new Date(docA?.createdAt || 0);
    if (sort === "oldest") return new Date(docA?.createdAt || 0) - new Date(docB?.createdAt || 0);
    return 0;
  });

  const getStatusColor = (status) => {
    return status === "uploaded" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
      : "bg-rose-50 text-rose-700 border-rose-200";
  };

  // Theme colors - match these with your website's theme
  const theme = {
    primary: "from-blue-600 to-indigo-600",
    primaryLight: "from-blue-50 to-indigo-50",
    accent: "from-purple-500 to-pink-500",
    success: "emerald",
    danger: "rose",
    warning: "amber"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Document Preview Modal */}
      {showPreview && previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  {getFileIcon(previewDocument.filePath)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {documentTypes.find(dt => dt.type === previewDocument.documentType)?.name || 'Document'} Preview
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(previewDocument.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 max-h-[calc(90vh-200px)] overflow-auto">
              {getFileType(previewDocument.filePath) === 'pdf' ? (
                <iframe
                  src={`http://localhost:5000/${previewDocument.filePath}#toolbar=0`}
                  className="w-full h-[600px] rounded-xl border border-gray-200"
                  title="Document Preview"
                />
              ) : ['jpg', 'jpeg', 'png', 'gif'].includes(getFileType(previewDocument.filePath)) ? (
                <img
                  src={`http://localhost:5000/${previewDocument.filePath}`}
                  alt="Document Preview"
                  className="max-w-full max-h-[600px] mx-auto rounded-xl shadow-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaFileAlt className="w-24 h-24 text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <p className="text-sm text-gray-500 mt-2">You can download the file to view it</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <a
                href={`http://localhost:5000/${previewDocument.filePath}`}
                download
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <FaDownload className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-slideUp">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Center</h1>
          <p className="text-gray-600">Manage and organize your important documents</p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden animate-slideUp border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Profile Completion</h2>
                <p className="text-sm text-gray-500 mt-1">Complete your profile by uploading all required documents</p>
              </div>
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 * (1 - completion / 100)}
                    className={`text-${theme.primary.split('-')[1]}-600 transition-all duration-1000`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-800">
                  {completion}%
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-800">{uploadedCount} of {documentTypes.length} uploaded</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`bg-gradient-to-r ${theme.primary} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600 font-medium">{uploadedCount} completed</span>
                <span className="text-gray-400">•</span>
                <span className="text-rose-600 font-medium">{documentTypes.length - uploadedCount} pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 animate-slideUp border border-gray-100" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors text-gray-700"
            >
              <FaFilter className={`text-gray-500 transition-colors ${showFilters ? 'text-blue-600' : ''}`} />
              <span>Filters</span>
              <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <FaSortAmountDown className="text-gray-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-5 border-t mt-5 animate-slideDown">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                        statusFilter === 'all'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter('uploaded')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                        statusFilter === 'uploaded'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Uploaded
                    </button>
                    <button
                      onClick={() => setStatusFilter('missing')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                        statusFilter === 'missing'
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Missing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Grid/Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedDocs.map((docType, index) => {
                    const doc = getDocument(docType.type);
                    const Icon = docType.icon;
                    
                    return (
                      <tr 
                        key={docType.type}
                        className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all hover:shadow-sm animate-slideUp"
                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${docType.color}-50 to-${docType.color}-100 group-hover:scale-110 transition-transform flex items-center justify-center shadow-sm`}>
                              <Icon className={`w-6 h-6 text-${docType.color}-600`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{docType.name}</div>
                              {doc && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  {getFileIcon(doc.filePath)}
                                  <span className="truncate max-w-[150px]">{doc.filePath?.split('/').pop()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{docType.category}</span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border ${getStatusColor(doc ? 'uploaded' : 'missing')}`}>
                            {doc ? (
                              <>
                                <FaCheckCircle className="mr-1.5 w-3 h-3" />
                                Uploaded
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="mr-1.5 w-3 h-3" />
                                Missing
                              </>
                            )}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {doc ? (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                              <FaClock className="text-gray-400 w-3 h-3" />
                              {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {doc ? (
                              <>
                                <button
                                  onClick={() => viewDocument(doc)}
                                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
                                  title="View Document"
                                >
                                  <FaEye className="w-4 h-4" />
                                  <span className="hidden lg:inline">View</span>
                                </button>
                                <a
                                  href={`http://localhost:5000/${doc.filePath}`}
                                  download
                                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
                                  title="Download"
                                >
                                  <FaDownload className="w-4 h-4" />
                                  <span className="hidden lg:inline">Download</span>
                                </a>
                                <button
                                  onClick={() => deleteDocument(doc._id, docType.name)}
                                  className="px-3 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
                                  title="Delete"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  <span className="hidden lg:inline">Delete</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => navigate(`/upload/${docType.type}`)}
                                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg text-sm font-medium"
                              >
                                <FaUpload className="w-4 h-4" />
                                Upload
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
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add these styles to your global CSS file */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
