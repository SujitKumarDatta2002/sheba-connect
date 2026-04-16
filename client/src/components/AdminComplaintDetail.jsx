import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaTimes, FaEdit, FaComment, FaQuestion,
  FaCalendarAlt, FaClock, FaUser,
  FaHistory, FaCheckCircle, FaSpinner,
  FaEye, FaFileAlt, FaReply, FaPaperPlane,
  FaExclamationTriangle, FaStamp, FaCheck
} from "react-icons/fa";

export default function AdminComplaintDetail({ complaint, onClose, onUpdate, showNotification }) {
  const [complaintData, setComplaintData] = useState(complaint);
  const [appointments, setAppointments] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [activeSection, setActiveSection] = useState("details");
  const [loading, setLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentPurpose, setAppointmentPurpose] = useState("");
  const [schedulingAppointment, setSchedulingAppointment] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
    fetchAppointments();
  }, [complaint._id]);

  const fetchComplaintDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API}/api/admin/complaints/${complaint._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaintData(res.data);
    } catch (err) {
      console.error("Error fetching complaint details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/admin/complaints/${complaint._id}/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching complaint appointments:", err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Sending status update:', { id: complaint._id, status: newStatus });
      
      const response = await axios.put(
        `${API}/api/admin/complaints/${complaint._id}/status`,
        { status: newStatus, comment: `Status updated to ${newStatus} by admin` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Status update response:', response.data);
      await fetchComplaintDetails();
      
      // Show notification using parent function if available
      if (showNotification) {
        showNotification(`Complaint status updated to ${newStatus}`, 'success');
      } else {
        alert("Status updated successfully!");
      }
      
      // Call onUpdate only for dashboard refresh, but don't close modal
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error updating status:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.details || "Failed to update status. Please try again.";
      
      if (showNotification) {
        showNotification(errorMsg, 'error');
      } else {
        alert(errorMsg);
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/admin/complaints/${complaint._id}/feedback`,
        {
          message: feedbackMessage,
          isQuestion,
          requiresResponse
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackMessage("");
      setIsQuestion(false);
      setRequiresResponse(false);
      await fetchComplaintDetails();
      
      if (showNotification) {
        showNotification("Feedback sent successfully", 'success');
      } else {
        alert("Feedback sent successfully");
      }
    } catch (err) {
      console.error("Error sending feedback:", err);
      const errorMsg = err.response?.data?.message || "Failed to send feedback. Please try again.";
      if (showNotification) {
        showNotification(errorMsg, 'error');
      } else {
        alert(errorMsg);
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendResponse = async (feedbackId) => {
    if (!adminResponse.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/admin/complaints/${complaint._id}/feedback/${feedbackId}/respond`,
        {
          response: adminResponse
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdminResponse("");
      setSelectedFeedback(null);
      await fetchComplaintDetails();
    } catch (err) {
      console.error("Error sending response:", err);
      alert(err.response?.data?.message || "Failed to send response. Please try again.");
    }
  };

  const markEditAsReviewed = async (editId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/admin/complaints/${complaint._id}/edits/${editId}/review`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchComplaintDetails();
    } catch (err) {
      console.error("Error marking edit as reviewed:", err);
    }
  };

  const scheduleAppointment = async () => {
    if (!appointmentDate || !appointmentTime || !appointmentLocation) {
      const msg = "Please fill in all required fields";
      if (showNotification) {
        showNotification(msg, 'error');
      } else {
        alert(msg);
      }
      return;
    }

    setSchedulingAppointment(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/api/admin/appointments`,
        {
          complaintId: complaint._id,
          userId: complaintData.userId,
          appointmentDate,
          appointmentTime,
          location: appointmentLocation,
          purpose: appointmentPurpose || "Complaint Resolution Discussion"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const msg = "Appointment scheduled successfully!";
      if (showNotification) {
        showNotification(msg, 'success');
      } else {
        alert(msg);
      }
      
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentLocation("");
      setAppointmentPurpose("");
      await fetchComplaintDetails();
      await fetchAppointments();
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      const errorMsg = err.response?.data?.message || "Failed to schedule appointment. Please try again.";
      if (showNotification) {
        showNotification(errorMsg, 'error');
      } else {
        alert(errorMsg);
      }
    } finally {
      setSchedulingAppointment(false);
    }
  };

  const sections = [
    { id: "details", name: "Complaint Details", icon: FaFileAlt },
    { id: "edits", name: "Edit History", icon: FaHistory, badge: complaintData.editHistory?.filter(e => !e.reviewedByAdmin).length || 0 },
    { id: "communication", name: "Communication", icon: FaComment },
    { id: "appointment", name: "Appointment", icon: FaCalendarAlt }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Resolved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaSpinner /> Processing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  const unreviewedEdits = complaintData.editHistory?.filter(e => !e.reviewedByAdmin) || [];
  const formatAppointmentDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Complaint Details</h2>
              <p className="text-purple-100 mt-1">#{complaintData.complaintNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b bg-gray-50 px-6">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all relative ${
                activeSection === section.id
                  ? 'border-purple-600 text-purple-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <section.icon />
              {section.name}
              {section.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {section.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Complaint Details Section */}
          {activeSection === "details" && (
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus('Pending')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      complaintData.status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus('Processing')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      complaintData.status === 'Processing'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateStatus('Resolved')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      complaintData.status === 'Resolved'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Citizen Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FaUser /> Citizen Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Name</p><p className="font-medium">{complaintData.citizenName}</p></div>
                  <div><p className="text-gray-500">NID</p><p className="font-medium">{complaintData.citizenId}</p></div>
                  <div><p className="text-gray-500">Contact</p><p className="font-medium">{complaintData.contactNumber}</p></div>
                  <div><p className="text-gray-500">Email</p><p className="font-medium">{complaintData.email}</p></div>
                  <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium">{complaintData.address}</p></div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaFileAlt /> Complaint Details
                </h3>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-medium">{complaintData.department}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Issue Keyword</p>
                  <p className="font-medium">{complaintData.issueKeyword}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    complaintData.priority === 'high' ? 'bg-red-100 text-red-800' :
                    complaintData.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaintData.priority?.toUpperCase()}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">{complaintData.description}</p>
                  </div>
                </div>
                
                {/* Official Government Format */}
                {complaintData.formalTemplate && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <FaStamp className="text-blue-600" />
                      Official Government Complaint Format
                    </p>
                    <div className="bg-white p-3 rounded-lg border max-h-64 overflow-y-auto">
                      <pre className="text-gray-700 text-sm whitespace-pre-wrap font-mono">
                        {complaintData.formalTemplate}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <FaHistory /> Timeline
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {complaintData.timeline?.map((entry, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          entry.status === 'Resolved' ? 'bg-green-500' :
                          entry.status === 'Processing' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                        {index < (complaintData.timeline?.length - 1) && (
                          <div className="absolute top-3 left-1 w-0.5 h-full bg-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{entry.status}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                        <p className="text-xs text-gray-400">By: {entry.updatedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Edit History Section */}
          {activeSection === "edits" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaHistory /> Edit History
              </h3>
              
              {unreviewedEdits.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 font-medium flex items-center gap-2">
                    <FaExclamationTriangle />
                    {unreviewedEdits.length} unreviewed edit{unreviewedEdits.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
              
              {complaintData.editHistory && complaintData.editHistory.length > 0 ? (
                <div className="space-y-4">
                  {complaintData.editHistory.map((edit, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg border ${
                        !edit.reviewedByAdmin ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FaEdit className="text-gray-500" />
                          <span className="text-sm font-medium">
                            Edited on {new Date(edit.editedAt).toLocaleString()}
                          </span>
                          {!edit.reviewedByAdmin && (
                            <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            Status at edit: {edit.statusAtEdit}
                          </span>
                          {!edit.reviewedByAdmin && (
                            <button
                              onClick={() => markEditAsReviewed(edit._id)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                            >
                              <FaCheck /> Mark Reviewed
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Reason:</span> {edit.editReason}
                      </p>
                      
                      {edit.previousDescription && edit.newDescription && (
                        <div className="space-y-2">
                          <div className="bg-red-50 p-3 rounded border border-red-200">
                            <p className="text-xs text-red-600 font-medium mb-1">Previous Description:</p>
                            <p className="text-sm text-gray-700">{edit.previousDescription}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded border border-green-200">
                            <p className="text-xs text-green-600 font-medium mb-1">New Description:</p>
                            <p className="text-sm text-gray-700">{edit.newDescription}</p>
                          </div>
                        </div>
                      )}
                      
                      {edit.previousTemplate && edit.newTemplate && (
                        <div className="space-y-2 mt-3">
                          <details className="bg-gray-100 rounded">
                            <summary className="p-2 cursor-pointer text-sm font-medium">
                              View Template Changes
                            </summary>
                            <div className="p-3 space-y-2">
                              <div className="bg-red-50 p-2 rounded">
                                <p className="text-xs text-red-600 font-medium">Previous Template:</p>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{edit.previousTemplate.substring(0, 500)}...</pre>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <p className="text-xs text-green-600 font-medium">New Template:</p>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{edit.newTemplate.substring(0, 500)}...</pre>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No edits have been made to this complaint.</p>
              )}
            </div>
          )}

          {/* Communication Section */}
          {activeSection === "communication" && (
            <div className="space-y-6">
              {/* Existing feedback */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-3">Message History</h3>
                {complaintData.adminFeedback && complaintData.adminFeedback.length > 0 ? (
                  complaintData.adminFeedback.map((feedback, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${feedback.isQuestion ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {feedback.isQuestion && <FaQuestion className="text-purple-500" />}
                          <span className="font-medium text-sm">
                            {feedback.isQuestion ? 'Question from Admin' : 'Feedback'}
                          </span>
                          <span className="text-xs text-gray-400">by {feedback.askedBy?.name || 'Admin'}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.askedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{feedback.message}</p>
                      
                      {feedback.response ? (
                        <div className="mt-2 pl-4 border-l-2 border-green-300">
                          <p className="text-xs text-green-600 font-medium">Citizen Response:</p>
                          <p className="text-sm text-gray-600">{feedback.response.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Responded on {new Date(feedback.response.respondedAt).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        feedback.requiresResponse && (
                          <button
                            onClick={() => setSelectedFeedback(feedback._id)}
                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                          >
                            <FaReply /> Respond as Admin
                          </button>
                        )
                      )}
                      
                      {selectedFeedback === feedback._id && (
                        <div className="mt-2">
                          <textarea
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder="Type your response to the citizen..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                            rows="2"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => setSelectedFeedback(null)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendResponse(feedback._id)}
                              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              Send Response
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No messages yet</p>
                )}
              </div>
              
              {/* New feedback form */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-3">Send New Message</h3>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Send feedback or ask a question to the citizen..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isQuestion}
                        onChange={(e) => setIsQuestion(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span className="text-sm">Mark as Question</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requiresResponse}
                        onChange={(e) => setRequiresResponse(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span className="text-sm">Requires Response</span>
                    </label>
                  </div>
                  <button
                    onClick={handleSendFeedback}
                    disabled={sending || !feedbackMessage.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Section */}
          {activeSection === "appointment" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaCalendarAlt /> Appointment Management
              </h3>

              <div className="bg-white border rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Scheduled Appointments</h4>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {appointments.length} total
                  </span>
                </div>

                {appointmentsLoading ? (
                  <div className="py-6 text-center text-gray-500">
                    <FaSpinner className="animate-spin mx-auto mb-2" />
                    Loading appointments...
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((item) => (
                      <div key={item._id} className="border rounded-lg p-4 bg-blue-50/40">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <p className="font-medium text-gray-900">
                            {formatAppointmentDate(item.appointmentDate)} at {item.appointmentTime}
                          </p>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border text-gray-700">
                            {item.status}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">{item.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Citizen Response</p>
                            <p className="font-medium text-gray-900">{item.userResponse?.status || "Pending response"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-gray-500">Purpose</p>
                            <p className="font-medium text-gray-900">{item.purpose || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No appointment has been scheduled for this complaint yet.</p>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-4">Schedule New Appointment</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={appointmentLocation}
                      onChange={(e) => setAppointmentLocation(e.target.value)}
                      placeholder="e.g., Office Room 201, Government Building"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose (Optional)
                    </label>
                    <textarea
                      value={appointmentPurpose}
                      onChange={(e) => setAppointmentPurpose(e.target.value)}
                      placeholder="Purpose of the appointment..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                  </div>

                  <button
                    onClick={scheduleAppointment}
                    disabled={schedulingAppointment || !appointmentDate || !appointmentTime || !appointmentLocation}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {schedulingAppointment ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <FaCalendarAlt />
                        Schedule Appointment
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <FaUser /> Citizen Details For Appointment
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{complaintData.citizenName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium">{complaintData.contactNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{complaintData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
