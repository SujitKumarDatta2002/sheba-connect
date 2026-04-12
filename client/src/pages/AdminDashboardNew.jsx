import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaClipboardList, FaLightbulb, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
  FaChartBar, FaCog, FaShieldAlt, FaUserCheck, FaUserTimes,
  FaCheckDouble, FaHourglassHalf, FaDownload, FaEye,
  FaTrash, FaEdit, FaSearch, FaFilter, FaChevronDown,
  FaBan, FaUnlock, FaLock, FaUserCog, FaBuilding,
  FaCalendarAlt, FaComment, FaCheck, FaTimes, FaPlus,
  FaUpload, FaPaperPlane, FaStar, FaRegStar,
  FaFilePdf, FaSpinner, FaUserCircle, FaEnvelope, FaPhone,
  FaIdCard, FaMapMarkerAlt, FaChartLine, FaHistory,
  FaAlertCircle, FaBell, FaArrowRight, FaTextHeight,
  FaArrowUp, FaArrowDown
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    processingComplaints: 0,
    resolvedComplaints: 0,
    pendingSolutions: 0,
    totalDocuments: 0,
    unreviewedEdits: 0
  });
  
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Modals
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingComplaintDetail, setLoadingComplaintDetail] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unreviewedEditsOnly, setUnreviewedEditsOnly] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, complaintsRes, usersRes, docsRes, appointmentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/complaints", { headers }),
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/admin/documents", { headers }),
        axios.get("http://localhost:5000/api/admin/appointments", { headers })
      ]);

      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
      setUsers(usersRes.data);
      setDocuments(docsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredComplaints = () => {
    return complaints.filter(complaint => {
      const matchesSearch = complaint.complaintNumber?.includes(searchTerm) ||
                           complaint.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
      const matchesEdits = !unreviewedEditsOnly || (complaint.editHistory && 
                          complaint.editHistory.some(edit => !edit.reviewedByAdmin));
      
      return matchesSearch && matchesStatus && matchesEdits;
    });
  };

  const handleComplaintClick = async (complaint) => {
    setLoadingComplaintDetail(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/complaints/${complaint._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedComplaint(res.data);
      setShowComplaintDetail(true);
    } catch (err) {
      console.error("Error fetching complaint detail:", err);
      showNotification("Failed to load complaint details", "error");
    } finally {
      setLoadingComplaintDetail(false);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Complaint status updated", "success");
      fetchDashboardData();
    } catch (err) {
      showNotification("Failed to update complaint", "error");
    }
  };

  const markEditAsReviewed = async (complaintId, editId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/complaints/${complaintId}/edits/${editId}/review`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Edit marked as reviewed", "success");
      fetchDashboardData();
    } catch (err) {
      showNotification("Failed to mark edit as reviewed", "error");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/appointments/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Appointment deleted", "success");
      fetchDashboardData();
    } catch (err) {
      showNotification("Failed to delete appointment", "error");
    }
  };

  // ============================================
  // UI COMPONENTS
  // ============================================

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className={`${color} text-4xl opacity-20`} />
      </div>
    </div>
  );

  // Tab Navigation Component
  const TabButton = ({ name, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
        activeTab === name
          ? 'border-blue-500 text-blue-600'
          : 'border-gray-300 text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="text-lg" />
      {label}
      {count > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">{count}</span>}
    </button>
  );

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  // Complaint List Item Component
  const ComplaintListItem = ({ complaint }) => {
    const unreviewed = complaint.editHistory?.filter(e => !e.reviewedByAdmin).length || 0;
    
    return (
      <div
        onClick={() => handleComplaintClick(complaint)}
        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md cursor-pointer transition-all hover:border-blue-400"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{complaint.complaintNumber}</p>
            <p className="text-sm text-gray-600 mt-1">{complaint.citizenName}</p>
            <p className="text-sm text-gray-700 font-medium mt-2">{complaint.department}</p>
            <p className="text-xs text-gray-500 mt-1">{complaint.issueKeyword}</p>
            {unreviewed > 0 && (
              <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs text-orange-700 flex items-center gap-1">
                  <FaAlertCircle /> {unreviewed} unreviewed edit(s)
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={complaint.status} />
            {complaint.priority && (
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {complaint.priority.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Appointment Card Component
  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-900">{appointment.userId?.name || 'Unknown User'}</p>
          <p className="text-sm text-gray-600">{appointment.complaintId?.complaintNumber}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          {new Date(appointment.appointmentDate).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <FaClock className="text-blue-500" />
          {appointment.appointmentTime}
        </p>
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500" />
          {appointment.location}
        </p>
      </div>
      {appointment.userResponse?.status && (
        <div className="mt-3 p-2 bg-blue-50 rounded">
          <p className="text-xs font-medium text-blue-900">
            User Response: {appointment.userResponse.status}
          </p>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            setSelectedComplaint(appointment);
            setShowAppointmentModal(true);
          }}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition"
        >
          <FaEdit className="inline mr-1" /> Edit
        </button>
        <button
          onClick={() => deleteAppointment(appointment._id)}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  // Edit History Component
  const EditHistorySection = ({ complaint }) => {
    if (!complaint.editHistory || complaint.editHistory.length === 0) {
      return <p className="text-gray-500 text-sm">No edits made to this complaint</p>;
    }

    return (
      <div className="space-y-3">
        {complaint.editHistory.map((edit, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-2 ${
              edit.reviewedByAdmin
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-900">
                {edit.editedAt ? new Date(edit.editedAt).toLocaleString() : 'Date unknown'}
              </p>
              {!edit.reviewedByAdmin && (
                <button
                  onClick={() => markEditAsReviewed(complaint._id, edit._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                >
                  <FaCheck className="inline mr-1" /> Mark Reviewed
                </button>
              )}
            </div>

            {edit.previousDescription && (
              <div className="mt-3">
                <p className="text-xs font-bold text-gray-700 mb-1">Description Changed:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-100 p-3 rounded text-xs">
                    <p className="font-bold text-red-700 mb-1">Before:</p>
                    <p className="text-gray-700">{edit.previousDescription}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded text-xs">
                    <p className="font-bold text-green-700 mb-1">After:</p>
                    <p className="text-gray-700">{edit.newDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {edit.previousTemplate && (
              <div className="mt-3">
                <p className="text-xs font-bold text-gray-700 mb-1">Format Changed:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-100 p-3 rounded text-xs">
                    <p className="font-bold text-red-700 mb-1">Before:</p>
                    <p className="text-gray-700">{edit.previousTemplate?.substring(0, 100)}...</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded text-xs">
                    <p className="font-bold text-green-700 mb-1">After:</p>
                    <p className="text-gray-700">{edit.newTemplate?.substring(0, 100)}...</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-2">Reason: {edit.editReason || 'Not provided'}</p>
            <p className="text-xs text-gray-600">Status at edit: {edit.statusAtEdit}</p>
            {edit.reviewedByAdmin && (
              <p className="text-xs text-green-700 font-bold mt-2 flex items-center gap-1">
                <FaCheck /> Reviewed by admin
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Complaint Detail Modal
  const ComplaintDetailModal = () => {
    if (!showComplaintDetail || !selectedComplaint) return null;

    const [activeTab, setActiveTab] = useState("details");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [isQuestion, setIsQuestion] = useState(false);

    const addFeedback = async () => {
      if (!feedbackMsg.trim()) {
        showNotification("Please enter feedback message", "error");
        return;
      }

      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:5000/api/admin/complaints/${selectedComplaint._id}/feedback`,
          { message: feedbackMsg, isQuestion, requiresResponse: isQuestion },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Feedback added successfully", "success");
        setFeedbackMsg("");
        setIsQuestion(false);
        fetchDashboardData();
      } catch (err) {
        showNotification("Failed to add feedback", "error");
      }
    };

    const relatedAppointments = appointments.filter((appointment) => {
      const appointmentComplaintId =
        typeof appointment.complaintId === "string"
          ? appointment.complaintId
          : appointment.complaintId?._id;
      return appointmentComplaintId === selectedComplaint._id;
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-96 overflow-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Complaint Details</h2>
            <button
              onClick={() => setShowComplaintDetail(false)}
              className="text-white hover:bg-blue-800 p-2 rounded transition"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-600">Complaint Number</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.complaintNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">Citizen Name</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.citizenName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">Department</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.department}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">Status</p>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-600">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-1">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-600">Official Government Format</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-1">
                    {selectedComplaint.formalTemplate || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-2">
                    <FaCalendarAlt /> Related Appointments
                  </p>
                  {relatedAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {relatedAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-blue-50 p-3 rounded border border-blue-200">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs font-bold text-blue-900">Appointment Date</p>
                              <p className="text-gray-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-900">Appointment Time</p>
                              <p className="text-gray-900">{appointment.appointmentTime}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-900">Location</p>
                              <p className="text-gray-900">{appointment.location}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-900">Status</p>
                              <p className="text-gray-900">{appointment.status}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs font-bold text-blue-900">Purpose</p>
                              <p className="text-gray-900">{appointment.purpose || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">No appointment linked to this complaint yet.</p>
                  )}
                </div>

                {/* Edit History Section */}
                <div>
                  <p className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-2">
                    <FaHistory /> Edit History
                  </p>
                  <EditHistorySection complaint={selectedComplaint} />
                </div>

                {/* Feedback Section */}
                <div className="border-t-2 pt-4">
                  <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaComment /> Admin Feedback
                  </p>
                  
                  {selectedComplaint.adminFeedback && selectedComplaint.adminFeedback.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedComplaint.adminFeedback.map((fb, idx) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-sm text-gray-900 font-medium">{fb.message}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Asked: {new Date(fb.askedAt).toLocaleString()}
                          </p>
                          {fb.response?.text && (
                            <div className="mt-2 bg-green-50 p-2 rounded border border-green-200">
                              <p className="text-xs font-bold text-green-800">User Response:</p>
                              <p className="text-xs text-gray-700 mt-1">{fb.response.text}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mb-4">No feedback yet</p>
                  )}

                  <div className="space-y-2">
                    <textarea
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      placeholder="Enter feedback message..."
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isQuestion}
                        onChange={(e) => setIsQuestion(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">This is a question (requires response)</span>
                    </label>
                    <button
                      onClick={addFeedback}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm font-medium"
                    >
                      <FaPaperPlane className="inline mr-2" /> Send Feedback
                    </button>
                  </div>
                </div>

                {/* Status Change */}
                <div className="border-t-2 pt-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">Change Status</p>
                  <div className="flex gap-2">
                    {['Pending', 'Processing', 'Resolved'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          updateComplaintStatus(selectedComplaint._id, status);
                          setShowComplaintDetail(false);
                        }}
                        className="flex-1 px-3 py-2 rounded text-sm font-medium transition"
                        style={{
                          backgroundColor: selectedComplaint.status === status ? '#3b82f6' : '#e5e7eb',
                          color: selectedComplaint.status === status ? 'white' : '#1f2937'
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100 mt-1">Manage complaints, appointments, and user feedback</p>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mx-4 mt-4 p-4 rounded-lg text-white ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {notification.message}
        </div>
      )}

      {loadingComplaintDetail && (
        <div className="mx-4 mt-4 p-4 rounded-lg bg-blue-50 text-blue-800">
          Loading complaint details...
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Stats */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FaUsers} label="Total Users" value={stats.totalUsers} color="text-blue-500" bgColor="bg-blue-50" />
            <StatCard icon={FaClipboardList} label="Total Complaints" value={stats.totalComplaints} color="text-purple-500" bgColor="bg-purple-50" />
            <StatCard icon={FaClock} label="In Processing" value={stats.processingComplaints} color="text-yellow-500" bgColor="bg-yellow-50" />
            <StatCard icon={FaCheckCircle} label="Resolved" value={stats.resolvedComplaints} color="text-green-500" bgColor="bg-green-50" />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            <TabButton name="overview" label="Overview" icon={FaChartBar} count={0} />
            <TabButton name="complaints" label="Complaints" icon={FaClipboardList} count={unreviewedEditsOnly ? 0 : stats.unreviewedEdits} />
            <TabButton name="appointments" label="Appointments" icon={FaCalendarAlt} count={appointments.filter(a => a.userResponse?.status === 'Requested Reschedule').length} />
            <TabButton name="users" label="Users" icon={FaUsers} count={0} />
          </div>
        </div>

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex gap-4 mb-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Search by complaint number, citizen name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={() => setUnreviewedEditsOnly(!unreviewedEditsOnly)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    unreviewedEditsOnly
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <FaAlertCircle className="inline mr-2" />
                  Unreviewed Edits
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getFilteredComplaints().map((complaint) => (
                  <ComplaintListItem key={complaint._id} complaint={complaint} />
                ))}
              </div>

              {getFilteredComplaints().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No complaints found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Appointments</h3>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <FaPlus /> New Appointment
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment._id} appointment={appointment} />
                ))}
              </div>

              {appointments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments scheduled</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ComplaintDetailModal />
    </div>
  );
}
