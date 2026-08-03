// import API from "../config/api";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { 
//   FaCheckCircle, FaTimesCircle, FaSpinner,
//   FaEye, FaCheck, FaTimes, FaComment
// } from "react-icons/fa";

// export default function AdminSolutions() {
//   const [solutions, setSolutions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSolution, setSelectedSolution] = useState(null);
//   const [adminFeedback, setAdminFeedback] = useState("");

//   useEffect(() => {
//     fetchPendingSolutions();
//   }, []);

//   const fetchPendingSolutions = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(
//         `${API}/api/solutions/admin/pending`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setSolutions(res.data);
//     } catch (err) {
//       console.error("Error fetching pending solutions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async (id, status) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API}/api/solutions/admin/${id}/verify`,
//         { status, adminFeedback },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setAdminFeedback("");
//       setSelectedSolution(null);
//       fetchPendingSolutions();
//     } catch (err) {
//       console.error("Error verifying solution:", err);
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
//         <h3 className="text-lg font-semibold text-white">Pending Solution Reviews</h3>
//         <p className="text-sm text-purple-100">
//           {solutions.length} solutions awaiting verification
//         </p>
//       </div>

//       <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
//         {loading ? (
//           <div className="p-8 text-center">
//             <FaSpinner className="animate-spin text-3xl text-purple-600 mx-auto mb-3" />
//             <p className="text-gray-500">Loading...</p>
//           </div>
//         ) : solutions.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
//             <p>No pending solutions</p>
//           </div>
//         ) : (
//           solutions.map((solution) => (
//             <div key={solution._id} className="p-4 hover:bg-gray-50">
//               <div className="flex items-start justify-between mb-2">
//                 <div>
//                   <h4 className="font-semibold text-gray-800">{solution.title}</h4>
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                     {solution.description}
//                   </p>
//                   <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                     <span>By: {solution.userId?.name}</span>
//                     <span>•</span>
//                     <span>Dept: {solution.department}</span>
//                     <span>•</span>
//                     <span>{formatDate(solution.createdAt)}</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedSolution(
//                     selectedSolution?._id === solution._id ? null : solution
//                   )}
//                   className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
//                 >
//                   <FaEye /> Review
//                 </button>
//               </div>

//               {selectedSolution?._id === solution._id && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   {/* Steps preview */}
//                   {solution.steps && solution.steps.length > 0 && (
//                     <div className="mb-4">
//                       <p className="text-xs font-medium text-gray-500 mb-2">Steps:</p>
//                       <div className="space-y-1">
//                         {solution.steps.slice(0, 3).map((step) => (
//                           <p key={step.stepNumber} className="text-sm text-gray-600">
//                             {step.stepNumber}. {step.description}
//                           </p>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Admin feedback input */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Feedback (optional)
//                     </label>
//                     <textarea
//                       value={adminFeedback}
//                       onChange={(e) => setAdminFeedback(e.target.value)}
//                       placeholder="Add feedback for the user..."
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                       rows="2"
//                     />
//                   </div>

//                   {/* Action buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleVerify(solution._id, "Approved")}
//                       className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
//                     >
//                       <FaCheck /> Approve
//                     </button>
//                     <button
//                       onClick={() => handleVerify(solution._id, "Rejected")}
//                       className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
//                     >
//                       <FaTimes /> Reject
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaCheckCircle, FaTimesCircle, FaSpinner, FaClock,
  FaEye, FaCheck, FaTimes, FaComment, FaLightbulb,
  FaUser, FaBuilding, FaCalendarAlt, FaSearch,
  FaThumbsUp, FaThumbsDown, FaHistory
} from "react-icons/fa";

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("pending"); // "pending" or "all"
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchSolutions();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch ALL solutions (not just pending) so filtering works
      const res = await axios.get(
        `${API}/api/solutions/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSolutions(res.data);
    } catch (err) {
      console.error("Error fetching solutions:", err);
      showNotification("Failed to load solutions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    if (status === 'Rejected' && !adminFeedback.trim()) {
      showNotification("Please provide feedback for rejection", "error");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/solutions/admin/${id}/verify`,
        { status, adminFeedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification(`Solution ${status.toLowerCase()} successfully`, "success");
      setAdminFeedback("");
      setSelectedSolution(null);
      fetchSolutions(); // Refresh the list
    } catch (err) {
      console.error("Error verifying solution:", err);
      showNotification("Failed to update solution", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status || 'Pending';
    switch(normalizedStatus) {
      case 'Approved':
      case 'Verified':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><FaCheckCircle size={10} /> Verified</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200"><FaTimesCircle size={10} /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200"><FaClock size={10} /> Pending</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHelpfulnessInfo = (solution) => {
    const helpful = solution.helpfulCount || 0;
    const notHelpful = solution.notHelpfulCount || 0;
    const total = helpful + notHelpful;
    if (total === 0) return null;
    const percentage = (helpful / total) * 100;
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FaThumbsUp className="text-emerald-500 text-xs" />
          <span className="text-xs font-semibold text-emerald-700">{helpful}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaThumbsDown className="text-red-500 text-xs" />
          <span className="text-xs font-semibold text-red-700">{notHelpful}</span>
        </div>
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  // Calculate stats from the solutions
  const pendingCount = solutions.filter(s => !s.status || s.status === 'Pending').length;
  const approvedCount = solutions.filter(s => s.status === 'Approved' || s.status === 'Verified').length;
  const rejectedCount = solutions.filter(s => s.status === 'Rejected').length;

  // Get filtered solutions based on view mode
  const getFilteredSolutions = () => {
    let filtered = [...solutions];
    
    // Filter by view mode
    if (viewMode === "pending") {
      filtered = filtered.filter(s => !s.status || s.status === 'Pending');
    } else if (viewMode === "approved") {
      filtered = filtered.filter(s => s.status === 'Approved' || s.status === 'Verified');
    } else if (viewMode === "rejected") {
      filtered = filtered.filter(s => s.status === 'Rejected');
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter(s => s.department === departmentFilter);
    }
    
    // Filter by status (for all view)
    if (viewMode === "all" && statusFilter !== "all") {
      filtered = filtered.filter(s => {
        const solutionStatus = s.status || 'Pending';
        if (statusFilter === "pending") return solutionStatus === 'Pending';
        if (statusFilter === "approved") return solutionStatus === 'Approved' || solutionStatus === 'Verified';
        if (statusFilter === "rejected") return solutionStatus === 'Rejected';
        return true;
      });
    }
    
    return filtered;
  };

  const filteredSolutions = getFilteredSolutions();
  const departments = [...new Set(solutions.map(s => s.department).filter(Boolean))];

  // Stats for display
  const stats = {
    total: solutions.length,
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading solutions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-lg animate-slideDown text-white ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Solutions</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <FaLightbulb className="text-4xl text-blue-200/50" />
          </div>
        </div>
        <div 
          onClick={() => setViewMode("pending")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            viewMode === "pending" 
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
            <FaClock className="text-4xl text-amber-200/50" />
          </div>
        </div>
        <div 
          onClick={() => setViewMode("approved")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            viewMode === "approved" 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold mt-1">{stats.approved}</p>
            </div>
            <FaCheckCircle className="text-4xl text-emerald-200/50" />
          </div>
        </div>
        <div 
          onClick={() => setViewMode("rejected")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            viewMode === "rejected" 
              ? 'bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-1">{stats.rejected}</p>
            </div>
            <FaTimesCircle className="text-4xl text-red-200/50" />
          </div>
        </div>
      </div>

      {/* View Mode Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Current View:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            viewMode === "pending" ? 'bg-amber-100 text-amber-700' :
            viewMode === "approved" ? 'bg-emerald-100 text-emerald-700' :
            'bg-red-100 text-red-700'
          }`}>
            {viewMode === "pending" ? 'Pending Solutions' : viewMode === "approved" ? 'Approved Solutions' : 'Rejected Solutions'}
          </span>
        </div>
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            viewMode === "all"
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaHistory size={12} /> View All Solutions
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, description, or citizen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Solutions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-6 py-4 ${
          viewMode === "pending" ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
          viewMode === "approved" ? 'bg-gradient-to-r from-emerald-600 to-green-600' :
          viewMode === "rejected" ? 'bg-gradient-to-r from-red-600 to-rose-600' :
          'bg-gradient-to-r from-purple-600 to-indigo-600'
        }`}>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {viewMode === "pending" && <FaClock />}
            {viewMode === "approved" && <FaCheckCircle />}
            {viewMode === "rejected" && <FaTimesCircle />}
            {viewMode === "all" && <FaHistory />}
            {viewMode === "pending" && 'Pending Solution Reviews'}
            {viewMode === "approved" && 'Approved Solutions'}
            {viewMode === "rejected" && 'Rejected Solutions'}
            {viewMode === "all" && 'All Solutions'}
          </h3>
          <p className="text-sm text-white/80">
            {filteredSolutions.length} solution{filteredSolutions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredSolutions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {viewMode === "pending" ? (
                <>
                  <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No pending solutions</p>
                  <p className="text-sm mt-1">All solutions have been reviewed</p>
                </>
              ) : viewMode === "approved" ? (
                <>
                  <FaCheckCircle className="text-5xl text-emerald-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No approved solutions yet</p>
                  <p className="text-sm mt-1">Solutions will appear here once approved</p>
                </>
              ) : viewMode === "rejected" ? (
                <>
                  <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No rejected solutions</p>
                  <p className="text-sm mt-1">Rejected solutions will appear here</p>
                </>
              ) : (
                <>
                  <FaLightbulb className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium">No solutions found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </>
              )}
            </div>
          ) : (
            filteredSolutions.map((solution) => {
              const isPending = !solution.status || solution.status === 'Pending';
              
              return (
                <div key={solution._id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-semibold text-gray-800 text-base">{solution.title}</h4>
                        {getStatusBadge(solution.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {solution.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-purple-500" size={11} />
                          <span>{solution.userId?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaBuilding className="text-blue-500" size={11} />
                          <span>{solution.department || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-green-500" size={11} />
                          <span>{formatDate(solution.createdAt)}</span>
                        </div>
                        {getHelpfulnessInfo(solution)}
                      </div>
                      
                      {/* Steps preview */}
                      {solution.steps && solution.steps.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Steps:</p>
                          <div className="flex flex-wrap gap-2">
                            {solution.steps.slice(0, 2).map((step) => (
                              <span key={step.stepNumber} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Step {step.stepNumber}
                              </span>
                            ))}
                            {solution.steps.length > 2 && (
                              <span className="text-xs text-gray-400">+{solution.steps.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Show review button only for pending solutions */}
                    {isPending && viewMode !== "rejected" && viewMode !== "approved" && (
                      <button
                        onClick={() => setSelectedSolution(
                          selectedSolution?._id === solution._id ? null : solution
                        )}
                        className="ml-4 px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition flex items-center gap-2 font-medium"
                      >
                        <FaEye size={12} />
                        {selectedSolution?._id === solution._id ? 'Close' : 'Review'}
                      </button>
                    )}
                    
                    {/* Show view details button for non-pending solutions */}
                    {!isPending && (
                      <button
                        onClick={() => setSelectedSolution(
                          selectedSolution?._id === solution._id ? null : solution
                        )}
                        className="ml-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 font-medium"
                      >
                        <FaEye size={12} />
                        {selectedSolution?._id === solution._id ? 'Close' : 'View Details'}
                      </button>
                    )}
                  </div>

                  {/* Expanded Review/View Section */}
                  {selectedSolution?._id === solution._id && (
                    <div className="mt-5 pt-5 border-t border-gray-200">
                      {/* Full Description */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Description</p>
                        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
                          {solution.description}
                        </div>
                      </div>

                      {/* All Steps */}
                      {solution.steps && solution.steps.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Solution Steps</p>
                          <div className="space-y-2">
                            {solution.steps.map((step) => (
                              <div key={step.stepNumber} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {step.stepNumber}
                                </div>
                                <p className="text-sm text-gray-700">{step.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources */}
                      {solution.resources && solution.resources.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resources</p>
                          <div className="flex flex-wrap gap-2">
                            {solution.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg"
                              >
                                {resource.title || resource.url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Admin Review Section - Only show for pending solutions */}
                      {isPending && viewMode !== "rejected" && viewMode !== "approved" && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <FaComment className="text-purple-500" /> Feedback (required for rejection)
                            </label>
                            <textarea
                              value={adminFeedback}
                              onChange={(e) => setAdminFeedback(e.target.value)}
                              placeholder="Add feedback for the citizen about their solution..."
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                              rows="3"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleVerify(solution._id, "Approved")}
                              disabled={updating}
                              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                              Approve & Verify
                            </button>
                            <button
                              onClick={() => handleVerify(solution._id, "Rejected")}
                              disabled={updating}
                              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                              Reject
                            </button>
                          </div>
                        </>
                      )}

                      {/* Show existing feedback if any */}
                      {solution.adminFeedback && (
                        <div className={`mt-4 p-3 rounded-xl border ${
                          solution.status === 'Approved' || solution.status === 'Verified'
                            ? 'bg-emerald-50 border-emerald-200'
                            : solution.status === 'Rejected'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}>
                          <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                            {solution.status === 'Approved' || solution.status === 'Verified' ? (
                              <><FaCheckCircle className="text-emerald-600" size={12} /> Admin Feedback (when approved):</>
                            ) : solution.status === 'Rejected' ? (
                              <><FaTimesCircle className="text-red-600" size={12} /> Admin Feedback (when rejected):</>
                            ) : (
                              <><FaComment className="text-amber-600" size={12} /> Admin Feedback:</>
                            )}
                          </p>
                          <p className="text-sm text-gray-700">{solution.adminFeedback}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Reviewed on: {formatDate(solution.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}