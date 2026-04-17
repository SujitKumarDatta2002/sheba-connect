import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboardList, FaSearch, FaFilter, FaEdit, FaHistory,
  FaComment, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaSpinner, FaCalendarAlt, FaTextHeight, FaReply, FaTimes,
  FaTimesCircle, FaChevronDown, FaUser, FaBell, FaArrowRight,
  FaEye
} from "react-icons/fa";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Edit form state
  const [editForm, setEditForm] = useState({
    description: "",
    formalTemplate: "",
    editReason: ""
  });

  // Feedback response state
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [sendingResponse, setSendingResponse] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      showNotification("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredComplaints = () => {
    return complaints.filter(complaint => {
      const matchesSearch = complaint.complaintNumber?.includes(searchTerm) ||
                           complaint.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const handleEditComplaint = async (e) => {
    e.preventDefault();

    if (!editForm.description.trim() && !editForm.formalTemplate.trim()) {
      showNotification("Please make at least one change", "error");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/complaints/${selectedComplaint._id}/edit`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Complaint updated successfully", "success");
      setShowEditModal(false);
      fetchComplaints();
    } catch (err) {
      console.error("Error editing complaint:", err);
      showNotification(err.response?.data?.message || "Failed to update complaint", "error");
    }
  };

  const handleRespondToFeedback = async (feedbackId) => {
    if (!feedbackResponse.trim()) {
      showNotification("Please enter a response", "error");
      return;
    }

    setSendingResponse(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/complaints/${selectedComplaint._id}/respond`,
        { feedbackId, response: feedbackResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Response sent successfully", "success");
      setFeedbackResponse("");
      setSelectedFeedback(null);
      fetchComplaints();
    } catch (err) {
      console.error("Error sending response:", err);
      showNotification("Failed to send response", "error");
    } finally {
      setSendingResponse(false);
    }
  };

  const openEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setEditForm({
      description: complaint.description,
      formalTemplate: complaint.formalTemplate || "",
      editReason: ""
    });
    setShowEditModal(true);
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Priority Badge Component
  const PriorityBadge = ({ priority }) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded ${colors[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  // Complaint Card Component
  const ComplaintCard = ({ complaint }) => {
    const unreadFeedback = complaint.adminFeedback?.filter(f => !f.response) || [];
    const hasUnreviewedEdits = complaint.editHistory?.some(e => !e.reviewedByAdmin) || false;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-bold text-lg text-gray-900">{complaint.complaintNumber}</p>
            <p className="text-sm text-gray-600 mt-1">{complaint.department}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{complaint.description}</p>

        {/* Alerts */}
        <div className="space-y-2 mb-4">
          {unreadFeedback.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
              <FaBell className="text-blue-500 text-sm" />
              <p className="text-xs text-blue-800 font-medium">{unreadFeedback.length} pending response(s)</p>
            </div>
          )}
          {hasUnreviewedEdits && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
              <FaExclamationTriangle className="text-orange-500 text-sm" />
              <p className="text-xs text-orange-800 font-medium">Admin has reviewed your edits</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openDetailModal(complaint)}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition font-medium flex items-center justify-center gap-1"
          >
            <FaEye /> View
          </button>
          {complaint.status !== 'Resolved' && (
            <button
              onClick={() => openEditModal(complaint)}
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition font-medium flex items-center justify-center gap-1"
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  // Detail Modal Component
  const DetailModal = () => {
    if (!showDetailModal || !selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-96 overflow-auto mt-20 mb-20">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{selectedComplaint.complaintNumber}</h2>
              <p className="text-blue-100 mt-1">{selectedComplaint.department}</p>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-white hover:bg-blue-800 p-2 rounded transition"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-600">Citizen Name</p>
                <p className="text-sm text-gray-900">{selectedComplaint.citizenName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600">Status</p>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600">Contact</p>
                <p className="text-sm text-gray-900">{selectedComplaint.contactNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600">Priority</p>
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FaTextHeight /> Description
              </p>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{selectedComplaint.description}</p>
              </div>
            </div>

            {/* Official Format */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Official Government Format</p>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{selectedComplaint.formalTemplate || 'Not provided'}</p>
              </div>
            </div>

            {/* Edit History */}
            {selectedComplaint.editHistory && selectedComplaint.editHistory.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHistory /> Edit History
                </p>
                <div className="space-y-3">
                  {selectedComplaint.editHistory.map((edit, idx) => (
                    <div key={idx} className={`p-3 rounded border-2 ${
                      edit.reviewedByAdmin
                        ? 'bg-green-50 border-green-200'
                        : 'bg-orange-50 border-orange-300'
                    }`}>
                      <p className="text-xs font-bold text-gray-700">
                        {new Date(edit.editedAt).toLocaleString()}
                        {edit.reviewedByAdmin && ' ✓ Reviewed'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Reason: {edit.editReason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Feedback */}
            {selectedComplaint.adminFeedback && selectedComplaint.adminFeedback.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaComment /> Admin Feedback
                </p>
                <div className="space-y-3">
                  {selectedComplaint.adminFeedback.map((feedback, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="text-sm text-gray-900 font-medium">{feedback.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Asked: {new Date(feedback.askedAt).toLocaleString()}
                      </p>

                      {feedback.response?.text ? (
                        <div className="mt-2 bg-green-50 p-2 rounded border border-green-200">
                          <p className="text-xs font-bold text-green-800">Your Response:</p>
                          <p className="text-xs text-gray-700 mt-1">{feedback.response.text}</p>
                        </div>
                      ) : feedback.isQuestion ? (
                        <div className="mt-2">
                          <textarea
                            placeholder="Your response..."
                            value={selectedFeedback === feedback._id ? feedbackResponse : ""}
                            onChange={(e) => {
                              setSelectedFeedback(feedback._id);
                              setFeedbackResponse(e.target.value);
                            }}
                            className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                            rows="2"
                          />
                          <button
                            onClick={() => handleRespondToFeedback(feedback._id)}
                            disabled={sendingResponse}
                            className="mt-2 w-full bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition disabled:opacity-50"
                          >
                            {sendingResponse ? 'Sending...' : 'Send Response'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditModal = () => {
    if (!showEditModal || !selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaEdit /> Edit Complaint
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-white hover:bg-green-800 p-2 rounded transition"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleEditComplaint} className="p-6 space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-bold text-blue-900 mb-1">Note</p>
              <p className="text-sm text-blue-800">
                Your changes will be visible to the admin. If the complaint is still in processing, the admin will review these edits separately.
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition resize-none"
                rows="4"
              />
              <p className="text-xs text-gray-500 mt-1">Current word count: {editForm.description.split(/\s+/).filter(w => w).length}</p>
            </div>

            {/* Format Field */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Official Government Format
              </label>
              <textarea
                value={editForm.formalTemplate}
                onChange={(e) => setEditForm({ ...editForm, formalTemplate: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition resize-none"
                rows="4"
              />
            </div>

            {/* Reason Field */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Reason for Edit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.editReason}
                onChange={(e) => setEditForm({ ...editForm, editReason: e.target.value })}
                placeholder="Why are you editing this complaint?"
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center justify-center gap-2"
              >
                <FaCheckCircle /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4 mx-auto" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaClipboardList /> My Complaints
          </h1>
          <p className="text-blue-100 mt-1">View, edit, and manage your submitted complaints</p>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search by complaint number or department..."
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
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {getFilteredComplaints().length > 0 ? (
            getFilteredComplaints().map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
              <FaClipboardList className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No complaints found</p>
              <p className="text-gray-500 text-sm mt-2">
                {complaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DetailModal />
      <EditModal />
    </div>
  );
}
