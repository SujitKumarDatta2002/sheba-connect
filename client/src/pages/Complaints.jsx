
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FaClipboardList, FaTrash, FaEye, FaPlus } from "react-icons/fa";

// export default function Complaints() {

//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const [formData, setFormData] = useState({
//     department: "",
//     issueKeyword: "",
//     description: ""
//   });

//   const userId = "64b123456789abcdef123456";

//   const fetchComplaints = async () => {
//     const res = await axios.get("http://localhost:5000/api/complaints");
//     setComplaints(res.data);
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios.post("http://localhost:5000/api/complaints/create", {
//       userId,
//       ...formData
//     });

//     setFormData({
//       department: "",
//       issueKeyword: "",
//       description: ""
//     });

//     fetchComplaints();
//   };

//   const deleteComplaint = async () => {

//     await axios.delete(
//       `http://localhost:5000/api/complaints/${deleteTarget}`
//     );

//     setDeleteTarget(null);
//     fetchComplaints();
//   };

//   const pending = complaints.filter(c => c.status === "Pending").length;
//   const resolved = complaints.filter(c => c.status === "Resolved").length;

//   return (

//     <div className="flex bg-gray-100 min-h-screen">

//       {/* SIDEBAR */}

//       <div className="w-60 bg-blue-900 text-white p-6">

//         <h1 className="text-xl font-bold mb-10">
//           ShebaConnect
//         </h1>

//         <ul className="space-y-4">

//           <li className="hover:text-gray-300 cursor-pointer">
//             Dashboard
//           </li>

//           <li className="font-semibold text-yellow-300">
//             Complaints
//           </li>

//           <li className="hover:text-gray-300 cursor-pointer">
//             Services
//           </li>

//           <li className="hover:text-gray-300 cursor-pointer">
//             Documents
//           </li>

//         </ul>

//       </div>


//       {/* MAIN CONTENT */}

//       <div className="flex-1 p-10">

//         <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
//           <FaClipboardList />
//           Complaint Dashboard
//         </h1>


//         {/* STATS */}

//         <div className="grid md:grid-cols-3 gap-6 mb-10">

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Total Complaints</p>
//             <h2 className="text-3xl font-bold">{complaints.length}</h2>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Pending</p>
//             <h2 className="text-3xl font-bold text-yellow-500">
//               {pending}
//             </h2>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">

//             <p className="text-gray-500">Resolved</p>
//             <h2 className="text-3xl font-bold text-green-600">
//               {resolved}
//             </h2>

//           </div>

//         </div>


//         {/* COMPLAINT FORM */}

//         <div className="bg-white shadow rounded-lg p-6 mb-10">

//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <FaPlus />
//             Submit Complaint
//           </h2>

//           <form onSubmit={handleSubmit}>

//             <div className="grid md:grid-cols-2 gap-4 mb-4">

//               <input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 placeholder="Department"
//                 className="border p-2 rounded"
//                 required
//               />

//               <input
//                 type="text"
//                 name="issueKeyword"
//                 value={formData.issueKeyword}
//                 onChange={handleChange}
//                 placeholder="Issue Keyword"
//                 className="border p-2 rounded"
//                 required
//               />

//             </div>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe your issue"
//               className="border p-2 rounded w-full mb-4"
//               rows="4"
//               required
//             />

//             <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
//               Submit Complaint
//             </button>

//           </form>

//         </div>


//         {/* TABLE */}

//         <div className="bg-white shadow rounded-lg p-6">

//           <h2 className="text-xl font-bold mb-4">
//             Complaint Records
//           </h2>

//           <table className="w-full text-left">

//             <thead className="bg-gray-200">

//               <tr>
//                 <th className="p-3">Department</th>
//                 <th className="p-3">Issue</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>

//             </thead>

//             <tbody>

//               {complaints.map(c => (

//                 <tr key={c._id} className="border-t hover:bg-gray-50">

//                   <td className="p-3">{c.department}</td>
//                   <td className="p-3">{c.issueKeyword}</td>

//                   <td className="p-3">

//                     <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
//                       {c.status}
//                     </span>

//                   </td>

//                   <td className="p-3 flex gap-3">

//                     <button
//                       onClick={() => setSelectedComplaint(c)}
//                       className="text-blue-600"
//                     >
//                       <FaEye />
//                     </button>

//                     <button
//                       onClick={() => setDeleteTarget(c._id)}
//                       className="text-red-600"
//                     >
//                       <FaTrash />
//                     </button>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       </div>


//       {/* VIEW MODAL */}

//       {selectedComplaint && (

//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-lg w-96">

//             <h2 className="text-xl font-bold mb-4">
//               Complaint Description
//             </h2>

//             <p className="mb-4">
//               {selectedComplaint.description}
//             </p>

//             <button
//               onClick={() => setSelectedComplaint(null)}
//               className="bg-gray-700 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>

//           </div>

//         </div>

//       )}


//       {/* DELETE MODAL */}

//       {deleteTarget && (

//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-lg text-center">

//             <h2 className="text-lg font-bold mb-4">
//               Confirm Deletion
//             </h2>

//             <p className="mb-6">
//               Are you sure you want to delete this complaint?
//             </p>

//             <div className="flex justify-center gap-4">

//               <button
//                 onClick={deleteComplaint}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 Delete
//               </button>

//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { 
//   FaClipboardList, 
//   FaTrash, 
//   FaEye, 
//   FaPlus,
//   FaSearch,
//   FaFilter,
//   FaDownload,
//   FaPrint,
//   FaCheckCircle,
//   FaClock,
//   FaExclamationCircle,
//   FaFileAlt,
//   FaUser,
//   FaBell,
//   FaChevronDown
// } from "react-icons/fa";

// export default function Complaints() {
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     department: "",
//     issueKeyword: "",
//     description: "",
//     priority: "medium",
//     citizenName: "",
//     citizenId: "",
//     contactNumber: ""
//   });

//   const userId = "64b123456789abcdef123456";

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/complaints");
//       setComplaints(res.data);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/complaints/create", {
//         userId,
//         ...formData
//       });
      
//       setFormData({
//         department: "",
//         issueKeyword: "",
//         description: "",
//         priority: "medium",
//         citizenName: "",
//         citizenId: "",
//         contactNumber: ""
//       });
      
//       setShowForm(false);
//       fetchComplaints();
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
//     }
//   };

//   const deleteComplaint = async () => {
//     try {
//       await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`);
//       setDeleteTarget(null);
//       fetchComplaints();
//     } catch (error) {
//       console.error("Error deleting complaint:", error);
//     }
//   };

//   // Filter complaints based on search and status
//   const filteredComplaints = complaints.filter(c => {
//     const matchesSearch = 
//       c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    
//     return matchesSearch && matchesFilter;
//   });

//   const pending = complaints.filter(c => c.status === "Pending").length;
//   const resolved = complaints.filter(c => c.status === "Resolved").length;
//   const inProgress = complaints.filter(c => c.status === "In Progress").length;

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'Resolved':
//         return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Resolved</span>;
//       case 'Pending':
//         return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
//       case 'In Progress':
//         return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaExclamationCircle /> In Progress</span>;
//       default:
//         return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
//     }
//   };

//   const getPriorityBadge = (priority) => {
//     switch(priority) {
//       case 'high':
//         return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High</span>;
//       case 'medium':
//         return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium</span>;
//       case 'low':
//         return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low</span>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <FaClipboardList className="text-white text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Complaint Management System</h1>
//                 <p className="text-sm text-gray-500">Government of Bangladesh • Citizen Services</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               {/* Notification Bell */}
//               <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
//                 <FaBell className="text-xl" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
              
//               {/* User Profile */}
//               <div className="flex items-center gap-3 border-l pl-4">
//                 <div className="bg-blue-100 p-2 rounded-full">
//                   <FaUser className="text-blue-600" />
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium">Citizen User</p>
//                   <p className="text-xs text-gray-500">ID: {userId.slice(0, 8)}</p>
//                 </div>
//                 <FaChevronDown className="text-xs text-gray-500" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="p-6">
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Complaints</p>
//                 <h3 className="text-2xl font-bold">{complaints.length}</h3>
//                 <p className="text-xs text-green-600 mt-1">↑ 12% this month</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaClipboardList className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Pending</p>
//                 <h3 className="text-2xl font-bold text-yellow-500">{pending}</h3>
//                 <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-lg">
//                 <FaClock className="text-yellow-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">In Progress</p>
//                 <h3 className="text-2xl font-bold text-blue-500">{inProgress}</h3>
//                 <p className="text-xs text-gray-500 mt-1">Being processed</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaExclamationCircle className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Resolved</p>
//                 <h3 className="text-2xl font-bold text-green-600">{resolved}</h3>
//                 <p className="text-xs text-green-600 mt-1">Successfully closed</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <FaCheckCircle className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Actions Bar */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
//             {/* Search and Filters */}
//             <div className="flex flex-1 items-center gap-4">
//               <div className="relative flex-1">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search complaints by department, issue, or description..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <div className="relative">
//                 <select
//                   className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Resolved">Resolved</option>
//                 </select>
//                 <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Action Buttons - Now on the right */}
//             <div className="flex items-center gap-3">
//               <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Download">
//                 <FaDownload />
//               </button>
//               <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Print">
//                 <FaPrint />
//               </button>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
//               >
//                 <FaPlus />
//                 File New Complaint
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Complaint Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-gray-800">File a New Complaint</h2>
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">Please fill in the details below</p>
//               </div>

//               <form onSubmit={handleSubmit} className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Citizen Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="citizenName"
//                       value={formData.citizenName}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Citizen ID/NID *
//                     </label>
//                     <input
//                       type="text"
//                       name="citizenId"
//                       value={formData.citizenId}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Contact Number *
//                     </label>
//                     <input
//                       type="tel"
//                       name="contactNumber"
//                       value={formData.contactNumber}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Priority
//                     </label>
//                     <select
//                       name="priority"
//                       value={formData.priority}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Department *
//                     </label>
//                     <select
//                       name="department"
//                       value={formData.department}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Select Department</option>
//                       <option value="Water Supply">Water Supply</option>
//                       <option value="Electricity">Electricity</option>
//                       <option value="Road Maintenance">Road Maintenance</option>
//                       <option value="Waste Management">Waste Management</option>
//                       <option value="Health Services">Health Services</option>
//                       <option value="Education">Education</option>
//                       <option value="Revenue">Revenue</option>
//                       <option value="Municipal Services">Municipal Services</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Issue Keyword *
//                     </label>
//                     <input
//                       type="text"
//                       name="issueKeyword"
//                       value={formData.issueKeyword}
//                       onChange={handleChange}
//                       placeholder="e.g., Water leakage, Power cut"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description *
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder="Please provide detailed description of your complaint..."
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows="4"
//                     required
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4 border-t">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                   >
//                     <FaPlus />
//                     Submit Complaint
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Complaints Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="p-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-800">Complaint Records</h2>
//               <p className="text-sm text-gray-500">
//                 Showing {filteredComplaints.length} of {complaints.length} complaints
//               </p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Complaint ID</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Citizen</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Issue</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="p-8 text-center">
//                       <div className="flex justify-center items-center gap-2">
//                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                         <span className="text-gray-500">Loading complaints...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredComplaints.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-8 text-center text-gray-500">
//                       No complaints found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredComplaints.map((c, index) => (
//                     <tr key={c._id} className="border-t hover:bg-gray-50">
//                       <td className="p-4">
//                         <span className="font-mono text-sm text-gray-600">
//                           #{c._id?.slice(-6) || `COMP{index + 1}`}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <p className="font-medium">{c.citizenName || "Citizen User"}</p>
//                           <p className="text-xs text-gray-500">{c.citizenId || "N/A"}</p>
//                         </div>
//                       </td>
//                       <td className="p-4">{c.department}</td>
//                       <td className="p-4">
//                         <div>
//                           <p className="font-medium">{c.issueKeyword}</p>
//                           <p className="text-xs text-gray-500 truncate max-w-xs">
//                             {c.description?.substring(0, 50)}...
//                           </p>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         {getPriorityBadge(c.priority || "medium")}
//                       </td>
//                       <td className="p-4">
//                         {getStatusBadge(c.status)}
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         {c.date ? new Date(c.date).toLocaleDateString() : "2024-03-13"}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => setSelectedComplaint(c)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="View Details"
//                           >
//                             <FaEye />
//                           </button>
//                           <button
//                             onClick={() => setDeleteTarget(c._id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Table Footer */}
//           <div className="p-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 Showing {filteredComplaints.length} entries
//               </p>
//               <div className="flex gap-2">
//                 <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Previous</button>
//                 <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
//                 <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">2</button>
//                 <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">3</button>
//                 <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Next</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       {selectedComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-lg">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
//                 <button
//                   onClick={() => setSelectedComplaint(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Complaint ID</p>
//                   <p className="font-mono">{selectedComplaint._id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Department</p>
//                   <p className="font-medium">{selectedComplaint.department}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Issue</p>
//                   <p className="font-medium">{selectedComplaint.issueKeyword}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Description</p>
//                   <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
//                     {selectedComplaint.description}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status</p>
//                   <div className="mt-1">
//                     {getStatusBadge(selectedComplaint.status)}
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Submitted On</p>
//                   <p>{selectedComplaint.date ? new Date(selectedComplaint.date).toLocaleString() : "2024-03-13 10:30 AM"}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={() => setSelectedComplaint(null)}
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this complaint? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteTarget(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={deleteComplaint}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete Complaint
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaClipboardList, 
  FaTrash, 
  FaEye, 
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFileAlt,
  FaUser,
  FaBell,
  FaChevronDown,
  FaHistory,
  FaComment,
  FaPaperPlane,
  FaSpinner,
  FaFilePdf,
  FaFileWord,
  FaEdit
} from "react-icons/fa";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedForTimeline, setSelectedForTimeline] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    department: "",
    issueKeyword: "",
    description: "",
    priority: "medium",
    citizenName: "",
    citizenId: "",
    contactNumber: "",
    email: "",
    address: ""
  });

  const userId = "64b123456789abcdef123456";

  // Fetch complaints from database
//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/complaints");
//       // Ensure we have all required fields
//       const complaintsWithDefaults = res.data.map(complaint => ({
//         ...complaint,
//         citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided",
//         citizenId: complaint.citizenId || "N/A",
//         contactNumber: complaint.contactNumber || "N/A",
//         priority: complaint.priority || "medium",
//         status: complaint.status || "Pending",
//         timeline: complaint.timeline || [
//           {
//             status: "Submitted",
//             date: complaint.createdAt || new Date().toISOString(),
//             comment: "Complaint submitted successfully",
//             updatedBy: "System"
//           }
//         ]
//       }));
//       setComplaints(complaintsWithDefaults);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//     setLoading(false);
//   };
const fetchComplaints = async () => {
  setLoading(true);
  try {
    const res = await axios.get("http://localhost:5000/api/complaints");
    
    // Map the data to ensure all fields are present
    const complaintsWithDetails = res.data.map(complaint => ({
      ...complaint,
      // If citizenName exists in the complaint, use it; otherwise try to get from userId
      citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided",
      citizenId: complaint.citizenId || "N/A",
      contactNumber: complaint.contactNumber || "N/A",
      email: complaint.email || "N/A",
      address: complaint.address || "N/A",
      priority: complaint.priority || "medium",
      complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`,
      timeline: complaint.timeline || [
        {
          status: "Submitted",
          date: complaint.createdAt || new Date().toISOString(),
          comment: "Complaint submitted successfully",
          updatedBy: "System"
        }
      ]
    }));
    
    setComplaints(complaintsWithDetails);
  } catch (error) {
    console.error("Error fetching complaints:", error);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchComplaints();
  }, []);

  // Generate formal complaint template based on department and issue
  const generateComplaintTemplate = (department, keyword) => {
    const templates = {
      "Passport Office": {
        delay: `FORMAL COMPLAINT: Passport Delay Issue

To,
The Regional Passport Officer,
Dhaka.

Subject: Complaint regarding delay in passport issuance

Respected Sir/Madam,

I am writing to formally complain about the delay in my passport application. Despite submitting all required documents on time, the passport has not been issued within the stipulated timeframe.

Application Details:
- Application Date: [Date]
- Tracking Number: [Number]
- Type of Service: [Service Type]

This delay is causing significant inconvenience as I have urgent travel plans. I request you to look into this matter urgently and expedite the process.

Thanking you,
[Citizen Name]
Contact: [Phone Number]
Application ID: [ID]`,
        tracking: `FORMAL COMPLAINT: Passport Tracking Issue

To,
The Regional Passport Officer,
Dhaka.

Subject: Unable to track passport application status

Dear Sir/Madam,

I am writing to report that I am unable to track the status of my passport application online. The tracking system shows no update for the past [X] days.

Application Reference: [Number]
Date of Application: [Date]

Please provide an update on my application status and resolve this tracking issue.

Sincerely,
[Citizen Name]
Contact: [Phone Number]`
      },
      "Electricity": {
        bill: `FORMAL COMPLAINT: Incorrect Electricity Bill

To,
The General Manager,
Dhaka Electric Supply Company (DESCO).

Subject: Complaint regarding incorrect electricity bill

Dear Sir/Madam,

I am writing to dispute my electricity bill for the month of [Month]. The bill amount of [Amount] is unusually high compared to my average consumption.

Account Details:
- Customer ID: [ID]
- Meter Number: [Number]
- Previous Bill: [Amount]
- Current Bill: [Amount]

I request you to review my bill and send a corrected version at the earliest.

Sincerely,
[Citizen Name]
Contact: [Phone Number]`,
        outage: `FORMAL COMPLAINT: Frequent Power Outage

To,
The General Manager,
Dhaka Electric Supply Company (DESCO).

Subject: Complaint regarding frequent power outages in our area

Respected Sir/Madam,

I am writing to bring to your attention the frequent power outages in our locality over the past [X] days. These outages are occurring multiple times a day, lasting for [X] hours each time.

Location Details:
- Area: [Area Name]
- Road/Block: [Details]
- Duration of Issue: [Timeline]

This is causing severe disruption to daily life and business operations. Please address this issue urgently.

Thanking you,
[Citizen Name]
Contact: [Phone Number]`
      },
      "Road Maintenance": {
        pothole: `FORMAL COMPLAINT: Road Maintenance Required

To,
The Executive Engineer,
Roads and Highways Department.

Subject: Urgent repair of potholes on [Road Name]

Respected Sir/Madam,

I am writing to report dangerous potholes on [Road Name] that have been causing accidents and traffic congestion.

Location Details:
- Road Name: [Name]
- Specific Location: [Details]
- Approximate Size: [Details]

These potholes have been present for [X] weeks and are getting worse. Please arrange for immediate repair.

Thanking you,
[Citizen Name]
Contact: [Phone Number]`
      },
      "Waste Management": {
        garbage: `FORMAL COMPLAINT: Irregular Garbage Collection

To,
The Chief Waste Management Officer,
Dhaka City Corporation.

Subject: Complaint regarding irregular garbage collection in our area

Dear Sir/Madam,

I am writing to complain about the irregular garbage collection in our locality. Waste has been accumulating for [X] days, causing health hazards and unpleasant odor.

Location Details:
- Area: [Area Name]
- Street: [Street Name]
- Collection Day: [Day]

Please ensure regular garbage collection and maintain cleanliness in our area.

Sincerely,
[Citizen Name]
Contact: [Phone Number]`
      }
    };

    // Find matching template
    const deptTemplates = templates[department];
    if (deptTemplates) {
      // Find template that matches keywords in the issue
      const matchingKey = Object.keys(deptTemplates).find(key => 
        keyword.toLowerCase().includes(key.toLowerCase())
      );
      if (matchingKey) {
        return deptTemplates[matchingKey];
      }
    }
    
    // Default template
    return `FORMAL COMPLAINT

To,
The Department Head,
${department || "[Department Name]"}

Subject: Complaint regarding ${keyword || "[Issue]"}

Respected Sir/Madam,

I am writing to formally complain about ${keyword || "[Issue description]"}. 

Details of Complaint:
- Department: ${department || "[Department]"}
- Issue: ${keyword || "[Issue Keyword]"}
- Date of Issue: [Date]
- Location: [Location]

I request you to look into this matter and take appropriate action at the earliest.

Thanking you,
[Citizen Name]
Contact: [Phone Number]
[Citizen ID/NID]`;
  };

  // Handle department or keyword change to generate template
  useEffect(() => {
    if (formData.department && formData.issueKeyword) {
      const template = generateComplaintTemplate(formData.department, formData.issueKeyword);
      setGeneratedTemplate(template);
    }
  }, [formData.department, formData.issueKeyword]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//       // Create timeline entry
//       const timeline = [
//         {
//           status: "Submitted",
//           date: new Date().toISOString(),
//           comment: "Complaint submitted successfully",
//           updatedBy: "Citizen"
//         }
//       ];

//       const complaintData = {
//         ...formData,
//         userId,
//         timeline,
//         status: "Pending",
//         createdAt: new Date().toISOString(),
//         complaintNumber: `CMP${Date.now().toString().slice(-8)}`
//       };

//       const res = await axios.post("http://localhost:5000/api/complaints/create", complaintData);
      
//       // Add the new complaint to state immediately without refresh
//       const newComplaint = {
//         ...complaintData,
//         _id: res.data._id || `temp_${Date.now()}`,
//         citizenName: formData.citizenName || "Not Provided",
//         timeline
//       };
      
//       setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
      
//       // Reset form
//       setFormData({
//         department: "",
//         issueKeyword: "",
//         description: "",
//         priority: "medium",
//         citizenName: "",
//         citizenId: "",
//         contactNumber: "",
//         email: "",
//         address: ""
//       });
      
//       setShowForm(false);
//       setGeneratedTemplate("");
      
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
//     }
//     setSubmitting(false);
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    // Validate required fields first
    if (!formData.citizenName || !formData.citizenId || !formData.contactNumber || 
        !formData.department || !formData.issueKeyword || !formData.description) {
      alert("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    // Create complaint data explicitly matching your schema
    const complaintData = {
      userId: userId,
      citizenName: formData.citizenName,
      citizenId: formData.citizenId,
      contactNumber: formData.contactNumber,
      email: formData.email || "",
      address: formData.address || "",
      department: formData.department,
      issueKeyword: formData.issueKeyword,
      description: formData.description,
      priority: formData.priority || "medium",
      timeline: [
        {
          status: "Pending",
          comment: "Complaint submitted successfully",
          updatedBy: formData.citizenName || "Citizen",
          date: new Date()
        }
      ]
      // Don't include status here - it will default to "Pending" in schema
    };

    console.log("Sending data:", complaintData);

    const res = await axios.post("http://localhost:5000/api/complaints/create", complaintData);
    
    console.log("Response:", res.data);
    
    // Add the new complaint to state immediately
    setComplaints(prevComplaints => [res.data, ...prevComplaints]);
    
    // Reset form
    setFormData({
      department: "",
      issueKeyword: "",
      description: "",
      priority: "medium",
      citizenName: "",
      citizenId: "",
      contactNumber: "",
      email: "",
      address: ""
    });
    
    setShowForm(false);
    setGeneratedTemplate("");
    
  } catch (error) {
    console.error("Error details:", error);
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Server is not responding. Please check if the backend is running on port 5000");
    } else {
      console.error("Error message:", error.message);
      alert(`Error: ${error.message}`);
    }
  }
  setSubmitting(false);
};


  const deleteComplaint = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`);
      // Remove from state immediately
      setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  // Update complaint status with timeline
  const updateComplaintStatus = async (complaintId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const timelineEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        comment: adminComment || `Status updated to ${newStatus}`,
        updatedBy: "Admin"
      };

      const res = await axios.put(`http://localhost:5000/api/complaints/${complaintId}`, {
        status: newStatus,
        timeline: [...(selectedForTimeline?.timeline || []), timelineEntry]
      });

      // Update in state
      setComplaints(prevComplaints => 
        prevComplaints.map(c => 
          c._id === complaintId 
            ? { ...c, status: newStatus, timeline: [...(c.timeline || []), timelineEntry] }
            : c
        )
      );

      setAdminComment("");
      setSelectedForTimeline(null);
      setShowTimeline(false);
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setUpdatingStatus(false);
  };

  // Filter complaints based on search
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === "" || 
      c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const inProgress = complaints.filter(c => c.status === "In Progress" || c.status === "Processing").length;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Resolved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
      case 'In Progress':
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaExclamationCircle /> Processing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High</span>;
      case 'medium':
        return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium</span>;
      case 'low':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low</span>;
      default:
        return null;
    }
  };

  // Export complaint as PDF (simulated)
  const exportAsPDF = (complaint) => {
    alert(`Exporting complaint #${complaint._id?.slice(-6)} as PDF...\nThis would download a formal complaint document.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaClipboardList className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Complaint Management System</h1>
                <p className="text-sm text-gray-500">Government of Bangladesh • Citizen Services</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUser className="text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <FaChevronDown className="text-xs text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Complaints</p>
                <h3 className="text-2xl font-bold">{complaints.length}</h3>
                <p className="text-xs text-green-600 mt-1">↑ {complaints.length > 0 ? 'Active' : 'No data'}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <h3 className="text-2xl font-bold text-yellow-500">{pending}</h3>
                <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Processing</p>
                <h3 className="text-2xl font-bold text-blue-500">{inProgress}</h3>
                <p className="text-xs text-gray-500 mt-1">Being processed</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaExclamationCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <h3 className="text-2xl font-bold text-green-600">{resolved}</h3>
                <p className="text-xs text-green-600 mt-1">Successfully closed</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by complaint ID, citizen name, department, or issue..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaPlus />
                File New Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Complaint Form Modal with Template Generation */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">File a New Complaint</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to generate a formal complaint</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Citizen Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Citizen Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="citizenName"
                        value={formData.citizenName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NID/Passport Number *
                      </label>
                      <input
                        type="text"
                        name="citizenId"
                        value={formData.citizenId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Column - Complaint Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Complaint Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Passport Office">Passport Office</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Road Maintenance">Road Maintenance</option>
                        <option value="Waste Management">Waste Management</option>
                        <option value="Health Services">Health Services</option>
                        <option value="Education">Education</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Municipal Services">Municipal Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Keyword *
                      </label>
                      <input
                        type="text"
                        name="issueKeyword"
                        value={formData.issueKeyword}
                        onChange={handleChange}
                        placeholder="e.g., passport delay, power outage, bill issue"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please provide detailed description of your complaint..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Generated Template Preview */}
                {generatedTemplate && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <FaFileAlt className="text-blue-600" />
                        Generated Formal Complaint Template
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(generatedTemplate)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                      {generatedTemplate}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Complaint Records</h2>
              <p className="text-sm text-gray-500">
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Complaint #</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Citizen</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Issue</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500">Loading complaints...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm text-gray-600">
                          {c.complaintNumber || `#${c._id?.slice(-6)}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{c.citizenName}</p>
                          <p className="text-xs text-gray-500">{c.contactNumber}</p>
                        </div>
                      </td>
                      <td className="p-4">{c.department}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{c.issueKeyword}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {c.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(c.priority)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedForTimeline(c);
                              setShowTimeline(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Timeline"
                          >
                            <FaHistory />
                          </button>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => exportAsPDF(c)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Export as PDF"
                          >
                            <FaFilePdf />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimeline && selectedForTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Complaint Timeline</h2>
                <button
                  onClick={() => {
                    setShowTimeline(false);
                    setSelectedForTimeline(null);
                    setAdminComment("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Complaint #{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}
              </p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Timeline entries */}
              <div className="space-y-4">
                {selectedForTimeline.timeline?.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                      {index < (selectedForTimeline.timeline?.length - 1) && (
                        <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">Updated by: {entry.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin update section */}
              {selectedForTimeline.status !== "Resolved" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={adminComment.split('|')[0] || "Processing"}
                      onChange={(e) => setAdminComment(e.target.value)}
                    >
                      <option value="Processing">Mark as Processing</option>
                      <option value="Resolved">Mark as Resolved</option>
                    </select>
                    <button
                      onClick={() => updateComplaintStatus(
                        selectedForTimeline._id, 
                        adminComment.split('|')[0] || "Processing"
                      )}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                      Update
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Add comment (optional)"
                    className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminComment.split('|')[1] || ""}
                    onChange={(e) => setAdminComment(
                      adminComment.split('|')[0] + '|' + e.target.value
                    )}
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowTimeline(false);
                  setSelectedForTimeline(null);
                  setAdminComment("");
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Complaint Number</p>
                  <p className="font-mono">{selectedComplaint.complaintNumber || selectedComplaint._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Citizen Name</p>
                  <p className="font-medium">{selectedComplaint.citizenName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p>{selectedComplaint.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedComplaint.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue</p>
                  <p className="font-medium">{selectedComplaint.issueKeyword}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p>{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setSelectedForTimeline(selectedComplaint);
                  setShowTimeline(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FaHistory />
                View Timeline
              </button>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this complaint? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteComplaint}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}