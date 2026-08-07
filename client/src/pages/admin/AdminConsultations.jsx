// // pages/admin/AdminConsultations.jsx
// import API from "../../config/api";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaVideo, FaCheckCircle, FaTimesCircle, FaClock,
//   FaSpinner, FaEye, FaCalendarAlt, FaUser,
//   FaEnvelope, FaPhone, FaComment, FaPaperPlane,
//   FaExclamationTriangle, FaReply, FaEdit, FaTrash,
//   FaLink, FaExternalLinkAlt, FaTimes, FaCheck,
//   FaList
// } from "react-icons/fa";

// export default function AdminConsultations() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [actionType, setActionType] = useState(null); // 'reject' or 'reschedule'
//   const [adminNote, setAdminNote] = useState("");
//   const [rescheduleDate, setRescheduleDate] = useState("");
//   const [rescheduleTime, setRescheduleTime] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });
//   const [activeTab, setActiveTab] = useState("all"); // changed default to "all"

//   // Modal state
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchConsultationRequests();
//   }, []);

//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
//   };

//   const fetchConsultationRequests = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(
//         `${API}/api/admin/consultations`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRequests(res.data);
//     } catch (err) {
//       console.error("Error fetching consultations:", err);
//       showNotification("Failed to load consultation requests", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve – no extra fields
//   const handleApprove = async (requestId) => {
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API}/api/admin/consultations/${requestId}/approve`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Consultation approved and meeting link generated", "success");
//       setSelectedRequest(null);
//       fetchConsultationRequests();
//     } catch (err) {
//       console.error("Error approving consultation:", err);
//       showNotification(err.response?.data?.message || "Failed to approve", "error");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Reject – with note
//   const handleReject = async () => {
//     if (!adminNote.trim()) {
//       showNotification("Please provide a reason for rejection", "error");
//       return;
//     }
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API}/api/admin/consultations/${selectedRequest._id}/reject`,
//         { note: adminNote },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Consultation rejected", "success");
//       setAdminNote("");
//       setSelectedRequest(null);
//       setShowModal(false);
//       fetchConsultationRequests();
//     } catch (err) {
//       console.error("Error rejecting consultation:", err);
//       showNotification(err.response?.data?.message || "Failed to reject", "error");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Reschedule – with date, time, and optional note
//   const handleReschedule = async () => {
//     if (!rescheduleDate || !rescheduleTime) {
//       showNotification("Please select new date and time", "error");
//       return;
//     }
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${API}/api/admin/consultations/${selectedRequest._id}/reschedule`,
//         { newDate: rescheduleDate, newTime: rescheduleTime, note: adminNote || "Rescheduled by admin" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Consultation rescheduled", "success");
//       setRescheduleDate("");
//       setRescheduleTime("");
//       setAdminNote("");
//       setSelectedRequest(null);
//       setShowModal(false);
//       fetchConsultationRequests();
//     } catch (err) {
//       console.error("Error rescheduling consultation:", err);
//       showNotification(err.response?.data?.message || "Failed to reschedule", "error");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'Scheduled':
//         return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><FaCheckCircle size={10} /> Approved</span>;
//       case 'Cancelled':
//         return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200"><FaTimesCircle size={10} /> Rejected</span>;
//       case 'Rescheduled':
//         return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200"><FaClock size={10} /> Rescheduled</span>;
//       default:
//         return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200"><FaClock size={10} /> Pending</span>;
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric'
//     });
//   };

//   const formatTime = (time) => time || '';

//   const openActionModal = (request, type) => {
//     setSelectedRequest(request);
//     setActionType(type);
//     setAdminNote("");
//     if (type === 'reschedule') {
//       setRescheduleDate("");
//       setRescheduleTime("");
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedRequest(null);
//     setActionType(null);
//     setAdminNote("");
//     setRescheduleDate("");
//     setRescheduleTime("");
//   };

//   // Filter requests based on active tab
//   const filteredRequests = requests.filter(req => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'pending') return req.status === 'Pending' || req.status === 'Reschedule Requested';
//     if (activeTab === 'approved') return req.status === 'Scheduled' || req.status === 'Rescheduled';
//     if (activeTab === 'rejected') return req.status === 'Cancelled';
//     return true;
//   });

//   const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 'Reschedule Requested').length;
//   const approvedCount = requests.filter(r => r.status === 'Scheduled' || r.status === 'Rescheduled').length;
//   const rejectedCount = requests.filter(r => r.status === 'Cancelled').length;

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
//         <FaSpinner className="animate-spin text-3xl text-purple-600 mr-3" />
//         <span className="text-gray-500">Loading consultation requests...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-lg animate-slideDown text-white ${
//           notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
//         }`}>
//           {notification.message}
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-indigo-100 text-sm font-medium">Total Requests</p>
//               <p className="text-3xl font-bold mt-1">{requests.length}</p>
//             </div>
//             <FaVideo className="text-4xl text-indigo-200/50" />
//           </div>
//         </div>
//         <div
//           onClick={() => setActiveTab("pending")}
//           className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
//             activeTab === "pending"
//               ? 'bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-white ring-offset-2'
//               : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600'
//           } text-white`}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-amber-100 text-sm font-medium">Pending</p>
//               <p className="text-3xl font-bold mt-1">{pendingCount}</p>
//             </div>
//             <FaClock className="text-4xl text-amber-200/50" />
//           </div>
//         </div>
//         <div
//           onClick={() => setActiveTab("approved")}
//           className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
//             activeTab === "approved"
//               ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-white ring-offset-2'
//               : 'bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600'
//           } text-white`}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-emerald-100 text-sm font-medium">Approved</p>
//               <p className="text-3xl font-bold mt-1">{approvedCount}</p>
//             </div>
//             <FaCheckCircle className="text-4xl text-emerald-200/50" />
//           </div>
//         </div>
//         <div
//           onClick={() => setActiveTab("rejected")}
//           className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
//             activeTab === "rejected"
//               ? 'bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-white ring-offset-2'
//               : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
//           } text-white`}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-red-100 text-sm font-medium">Rejected</p>
//               <p className="text-3xl font-bold mt-1">{rejectedCount}</p>
//             </div>
//             <FaTimesCircle className="text-4xl text-red-200/50" />
//           </div>
//         </div>
//       </div>

//       {/* Tab buttons including "All" */}
//       <div className="flex space-x-2 border-b border-gray-200 pb-2">
//         <button
//           onClick={() => setActiveTab("all")}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//             activeTab === "all" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           <FaList className="inline mr-2" /> All
//         </button>
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//             activeTab === "pending" ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           <FaClock className="inline mr-2" /> Pending
//         </button>
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//             activeTab === "approved" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           <FaCheckCircle className="inline mr-2" /> Approved
//         </button>
//         <button
//           onClick={() => setActiveTab("rejected")}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//             activeTab === "rejected" ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           <FaTimesCircle className="inline mr-2" /> Rejected
//         </button>
//       </div>

//       {/* Requests List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
//           <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//             <FaVideo /> Consultation Requests
//           </h3>
//           <p className="text-sm text-white/80">
//             {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
//           </p>
//         </div>

//         <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//           {filteredRequests.length === 0 ? (
//             <div className="p-12 text-center text-gray-500">
//               <FaVideo className="text-5xl text-gray-300 mx-auto mb-4" />
//               <p className="text-lg font-medium">No consultations in this category</p>
//             </div>
//           ) : (
//             filteredRequests.map((req) => {
//               const isPending = req.status === 'Pending' || req.status === 'Reschedule Requested';
//               const isApproved = req.status === 'Scheduled' || req.status === 'Rescheduled';

//               return (
//                 <div key={req._id} className="p-5 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2 flex-wrap">
//                         <h4 className="font-semibold text-gray-800 text-base">
//                           {req.serviceName || 'Consultation Request'}
//                         </h4>
//                         {getStatusBadge(req.status)}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <FaUser className="text-purple-500" />
//                           <span>{req.userId?.name || 'Unknown'}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FaEnvelope className="text-blue-500" />
//                           <span>{req.alternateEmail || req.userId?.email || 'N/A'}</span>
//                         </div>
//                         {req.consultationReason && (
//                           <div className="col-span-2 flex items-start gap-2">
//                             <FaComment className="text-green-500 mt-1" />
//                             <span className="text-sm text-gray-700">{req.consultationReason}</span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-2">
//                           <FaCalendarAlt className="text-orange-500" />
//                           <span>{formatDate(req.appointmentDate)} at {formatTime(req.appointmentTime)}</span>
//                         </div>
//                         {req.meetingLink && (
//                           <div className="flex items-center gap-2 col-span-2">
//                             <FaLink className="text-indigo-500" />
//                             <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
//                               Meeting Link <FaExternalLinkAlt size={10} />
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons for Pending */}
//                     {isPending && (
//                       <div className="flex flex-col gap-2 ml-4">
//                         <button
//                           onClick={() => handleApprove(req._id)}
//                           disabled={updating}
//                           className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 font-semibold text-sm disabled:opacity-50"
//                         >
//                           {updating ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Approve
//                         </button>
//                         <button
//                           onClick={() => openActionModal(req, 'reject')}
//                           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-semibold text-sm"
//                         >
//                           <FaTimesCircle /> Reject
//                         </button>
//                         <button
//                           onClick={() => openActionModal(req, 'reschedule')}
//                           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold text-sm"
//                         >
//                           <FaClock /> Reschedule
//                         </button>
//                       </div>
//                     )}

//                     {isApproved && (
//                       <button
//                         onClick={() => window.open(req.meetingLink, '_blank')}
//                         className="ml-4 px-4 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition flex items-center gap-2 font-medium"
//                       >
//                         <FaVideo size={12} /> Join
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Action Modal (Reject / Reschedule) */}
//       {showModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//             <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
//               <h3 className="font-bold text-lg flex items-center gap-2">
//                 {actionType === 'reject' ? <FaTimesCircle /> : <FaClock />}
//                 {actionType === 'reject' ? ' Reject Consultation' : ' Reschedule Consultation'}
//               </h3>
//               <button onClick={closeModal} className="text-white/70 hover:text-white p-2 rounded-full">
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               {actionType === 'reject' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection *</label>
//                   <textarea
//                     value={adminNote}
//                     onChange={(e) => setAdminNote(e.target.value)}
//                     placeholder="Explain why this consultation is rejected..."
//                     rows="3"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
//                   />
//                 </div>
//               )}

//               {actionType === 'reschedule' && (
//                 <>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
//                       <input
//                         type="date"
//                         value={rescheduleDate}
//                         onChange={(e) => setRescheduleDate(e.target.value)}
//                         min={new Date().toISOString().split('T')[0]}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
//                       <input
//                         type="time"
//                         value={rescheduleTime}
//                         onChange={(e) => setRescheduleTime(e.target.value)}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
//                     <textarea
//                       value={adminNote}
//                       onChange={(e) => setAdminNote(e.target.value)}
//                       placeholder="Add a note for the user..."
//                       rows="2"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={closeModal}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={actionType === 'reject' ? handleReject : handleReschedule}
//                   disabled={updating}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
//                   {actionType === 'reject' ? 'Confirm Reject' : 'Confirm Reschedule'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// pages/admin/AdminConsultations.jsx
import API from "../../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaVideo, FaCheckCircle, FaTimesCircle, FaClock,
  FaSpinner, FaCalendarAlt, FaUser,
  FaEnvelope, FaComment,
  FaLink, FaExternalLinkAlt, FaTimes, FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";

export default function AdminConsultations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchConsultationRequests();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const fetchConsultationRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API}/api/admin/consultations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching consultations:", err);
      showNotification("Failed to load consultation requests", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check if appointment time is in the past
  const isAppointmentPast = (appointmentDate, appointmentTime) => {
    if (!appointmentDate || !appointmentTime) return false;
    const dateTime = new Date(appointmentDate + 'T' + appointmentTime + ':00');
    return Date.now() > dateTime.getTime();
  };

  // Approve – no extra fields
  const handleApprove = async (requestId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/admin/consultations/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Consultation approved and meeting link generated", "success");
      fetchConsultationRequests();
    } catch (err) {
      console.error("Error approving consultation:", err);
      showNotification(err.response?.data?.message || "Failed to approve", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Reject – with note
  const handleReject = async () => {
    if (!adminNote.trim()) {
      showNotification("Please provide a reason for rejection", "error");
      return;
    }
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/admin/consultations/${selectedRequest._id}/reject`,
        { note: adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Consultation rejected", "success");
      setAdminNote("");
      setSelectedRequest(null);
      setShowModal(false);
      fetchConsultationRequests();
    } catch (err) {
      console.error("Error rejecting consultation:", err);
      showNotification(err.response?.data?.message || "Failed to reject", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Reschedule – with date, time, and optional note
  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      showNotification("Please select new date and time", "error");
      return;
    }
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/admin/consultations/${selectedRequest._id}/reschedule`,
        { newDate: rescheduleDate, newTime: rescheduleTime, note: adminNote || "Rescheduled by admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Consultation rescheduled", "success");
      setRescheduleDate("");
      setRescheduleTime("");
      setAdminNote("");
      setSelectedRequest(null);
      setShowModal(false);
      fetchConsultationRequests();
    } catch (err) {
      console.error("Error rescheduling consultation:", err);
      showNotification(err.response?.data?.message || "Failed to reschedule", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Scheduled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><FaCheckCircle size={10} /> Approved</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200"><FaTimesCircle size={10} /> Rejected</span>;
      case 'Rescheduled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200"><FaClock size={10} /> Rescheduled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200"><FaClock size={10} /> Pending</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (time) => time || '';

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setAdminNote("");
    if (type === 'reschedule') {
      setRescheduleDate("");
      setRescheduleTime("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setActionType(null);
    setAdminNote("");
    setRescheduleDate("");
    setRescheduleTime("");
  };

  // Handle dropdown selection
  const handleActionSelect = (e, request) => {
    const value = e.target.value;
    if (!value) return;
    if (value === 'approve') {
      handleApprove(request._id);
    } else if (value === 'reject') {
      openActionModal(request, 'reject');
    } else if (value === 'reschedule') {
      openActionModal(request, 'reschedule');
    }
    // Reset dropdown to default placeholder
    e.target.value = '';
  };

  // Filter requests based on active tab
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return req.status === 'Pending' || req.status === 'Reschedule Requested';
    if (activeTab === 'approved') return req.status === 'Scheduled' || req.status === 'Rescheduled';
    if (activeTab === 'rejected') return req.status === 'Cancelled';
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 'Reschedule Requested').length;
  const approvedCount = requests.filter(r => r.status === 'Scheduled' || r.status === 'Rescheduled').length;
  const rejectedCount = requests.filter(r => r.status === 'Cancelled').length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-purple-600 mr-3" />
        <span className="text-gray-500">Loading consultation requests...</span>
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
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold mt-1">{requests.length}</p>
            </div>
            <FaVideo className="text-4xl text-indigo-200/50" />
          </div>
        </div>
        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            activeTab === "pending"
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1">{pendingCount}</p>
            </div>
            <FaClock className="text-4xl text-amber-200/50" />
          </div>
        </div>
        <div
          onClick={() => setActiveTab("approved")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            activeTab === "approved"
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold mt-1">{approvedCount}</p>
            </div>
            <FaCheckCircle className="text-4xl text-emerald-200/50" />
          </div>
        </div>
        <div
          onClick={() => setActiveTab("rejected")}
          className={`cursor-pointer transition-all rounded-xl p-5 shadow-lg ${
            activeTab === "rejected"
              ? 'bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-white ring-offset-2'
              : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-1">{rejectedCount}</p>
            </div>
            <FaTimesCircle className="text-4xl text-red-200/50" />
          </div>
        </div>
      </div>

      {/* Tab buttons including "All" */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "all" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "pending" ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "approved" ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "rejected" ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaVideo /> Consultation Requests
          </h3>
          <p className="text-sm text-white/80">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FaVideo className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No consultations in this category</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isPending = req.status === 'Pending' || req.status === 'Reschedule Requested';
              const isApproved = req.status === 'Scheduled' || req.status === 'Rescheduled';
              const past = isAppointmentPast(req.appointmentDate, req.appointmentTime);

              return (
                <div key={req._id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-semibold text-gray-800 text-base">
                          {req.serviceName || 'Consultation Request'}
                        </h4>
                        {getStatusBadge(req.status)}
                        {past && isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <FaExclamationTriangle size={10} /> Expired
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-purple-500" />
                          <span>{req.userId?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-blue-500" />
                          <span>{req.alternateEmail || req.userId?.email || 'N/A'}</span>
                        </div>
                        {req.consultationReason && (
                          <div className="col-span-2 flex items-start gap-2">
                            <FaComment className="text-green-500 mt-1" />
                            <span className="text-sm text-gray-700">{req.consultationReason}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-orange-500" />
                          <span>{formatDate(req.appointmentDate)} at {formatTime(req.appointmentTime)}</span>
                        </div>
                        {req.meetingLink && (
                          <div className="flex items-center gap-2 col-span-2">
                            <FaLink className="text-indigo-500" />
                            <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                              Meeting Link <FaExternalLinkAlt size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Dropdown or Join Button */}
                    <div className="ml-4 flex-shrink-0">
                      {isPending && !past && (
                        <select
                          onChange={(e) => handleActionSelect(e, req)}
                          disabled={updating}
                          className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          defaultValue=""
                        >
                          <option value="">Select action</option>
                          <option value="approve">✅ Approve</option>
                          <option value="reject">❌ Reject</option>
                          <option value="reschedule">⏰ Reschedule</option>
                        </select>
                      )}
                      {isPending && past && (
                        <span className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                          <FaTimesCircle className="mr-2" /> No action available
                        </span>
                      )}
                      {isApproved && (
                        <button
                          onClick={() => window.open(req.meetingLink, '_blank')}
                          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center gap-2 font-medium text-sm"
                        >
                          <FaVideo size={12} /> Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Modal (Reject / Reschedule) */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {actionType === 'reject' ? <FaTimesCircle /> : <FaClock />}
                {actionType === 'reject' ? ' Reject Consultation' : ' Reschedule Consultation'}
              </h3>
              <button onClick={closeModal} className="text-white/70 hover:text-white p-2 rounded-full">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {actionType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection *</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Explain why this consultation is rejected..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              {actionType === 'reschedule' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add a note for the user..."
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={actionType === 'reject' ? handleReject : handleReschedule}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {actionType === 'reject' ? 'Confirm Reject' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}