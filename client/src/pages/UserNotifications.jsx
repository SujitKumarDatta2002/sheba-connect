import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBell, FaEnvelope, FaCalendarAlt, FaTimes, FaCheck,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationCircle,
  FaChevronDown, FaReply, FaArrowLeft
} from "react-icons/fa";
import RequestRescheduleModal from "../components/RequestRescheduleModal";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, feedback, appointments
  const [unreadCount, setUnreadCount] = useState(0);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API}/api/users/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API}/api/users/notifications/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(response.data.total);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notification) => {
    try {
      const token = localStorage.getItem('token');

      if (notification.type === 'feedback') {
        await axios.put(
          `${API}/api/users/notifications/feedback/${notification.complaintId}/${notification.feedbackIndex}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (notification.type === 'appointment') {
        await axios.put(
          `${API}/api/users/appointments/${notification.appointmentId}/mark-read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Update UI
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleApproveReschedule = async (appointmentId, requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/users/appointments/${appointmentId}/reschedule-request/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reschedule request approved!');
      fetchNotifications();
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error approving reschedule:', error);
      alert('Failed to approve reschedule request');
    }
  };

  const handleRejectReschedule = async (appointmentId, requestId, reason) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/users/appointments/${appointmentId}/reschedule-request/${requestId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reschedule request rejected!');
      fetchNotifications();
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error rejecting reschedule:', error);
      alert('Failed to reject reschedule request');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'feedback') return n.type === 'feedback';
    if (filter === 'appointments') return n.type === 'appointment';
    return true;
  });

  if (selectedNotification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              markAsRead(selectedNotification);
              setSelectedNotification(null);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <FaArrowLeft /> Back to Notifications
          </button>

          {selectedNotification.type === 'feedback' ? (
            // Feedback Detail
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" /> Admin Feedback
                </h2>
                <p className="text-sm text-blue-700">
                  Complaint #: {selectedNotification.complaintNumber}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Message from Admin:</h3>
                <p className="text-gray-700 whitespace-pre-wrap text-lg">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.requiresResponse && (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-4">
                    <FaExclamationCircle /> Response Required
                  </div>
                  <p className="text-yellow-700">
                    Please respond to this feedback. Go to your complaints page to add your response.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Appointment Detail
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                <h2 className="text-2xl font-bold text-green-900 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-green-600" /> Appointment
                </h2>
                <p className="text-sm text-green-700">
                  Complaint #: {selectedNotification.complaintNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Date</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedNotification.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Time</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNotification.time}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600 font-semibold">Location</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNotification.location}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-semibold mb-2">Your Response:</p>
                <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                  selectedNotification.userResponseStatus === 'Accepted' ? 'bg-green-100 text-green-800' :
                  selectedNotification.userResponseStatus === 'Declined' ? 'bg-red-100 text-red-800' :
                  selectedNotification.userResponseStatus === 'Requested Reschedule' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedNotification.userResponseStatus || 'Pending'}
                </span>
              </div>

              {/* Request Reschedule Button */}
              {selectedNotification.type === 'appointment' && selectedNotification.userResponseStatus !== 'Declined' && selectedNotification.userResponseStatus !== 'Requested Reschedule' && (
                <div className="mb-6 flex gap-2">
                  <button
                    onClick={() => {
                      // Transform notification to appointment format for modal
                      const appointmentData = {
                        _id: selectedNotification.appointmentId,
                        appointmentDate: selectedNotification.date,
                        appointmentTime: selectedNotification.time,
                        location: selectedNotification.location
                      };
                      setAppointmentToReschedule(appointmentData);
                      setSelectedNotification(null); // Close detail view so modal shows on top
                    }}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaCalendarAlt /> Request Reschedule
                  </button>
                </div>
              )}

              {/* Reschedule Requests */}
              {selectedNotification.rescheduleRequests && selectedNotification.rescheduleRequests.length > 0 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <FaClock /> Reschedule Requests
                  </h3>
                  <div className="space-y-4">
                    {selectedNotification.rescheduleRequests.map((req, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Proposed Date</p>
                            <p className="font-semibold text-purple-900">
                              {new Date(req.proposedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Proposed Time</p>
                            <p className="font-semibold text-purple-900">{req.proposedTime}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 font-semibold">Proposed Location</p>
                          <p className="font-semibold text-purple-900">{req.proposedLocation}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Reason:</strong> {req.reason}
                        </p>

                        {/* Status Badge */}
                        <div className="mb-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        {/* Approval/Rejection Buttons */}
                        {req.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveReschedule(selectedNotification.appointmentId, req._id)}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectReschedule(selectedNotification.appointmentId, req._id, 'Your reschedule request has been rejected.')}
                              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        )}

                        {req.status !== 'Pending' && (
                          <p className="text-sm text-gray-600 italic">
                            {req.adminResponse}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-full text-white">
              <FaBell className="text-2xl" />
            </div>
            Messages & Notifications
          </h1>
          <p className="text-gray-600">View admin feedback, appointments, and reschedule requests</p>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <FaExclamationCircle />
            <span className="font-semibold">You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { label: 'All', value: 'all' },
            { label: 'Unread', value: 'unread', badge: unreadCount },
            { label: 'Feedback', value: 'feedback' },
            { label: 'Appointments', value: 'appointments' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No notifications yet</p>
            <p className="text-gray-400 text-sm">You'll see admin feedback and appointments here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div
                key={notification._id}
                onClick={() => setSelectedNotification(notification)}
                className={`p-5 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-lg ${
                  notification.isRead
                    ? 'bg-gray-50 border-l-gray-300'
                    : 'bg-white border-l-blue-600 shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full flex-shrink-0 ${
                    notification.type === 'feedback'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                  }`}>
                    {notification.type === 'feedback' ? (
                      <FaEnvelope className={notification.type === 'feedback' ? 'text-blue-600' : 'text-green-600'} />
                    ) : (
                      <FaCalendarAlt className="text-green-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          {notification.type === 'feedback' ? 'Feedback from ' : 'Appointment from '}
                          <span className="text-blue-600">{notification.adminName}</span>
                          {!notification.isRead && (
                            <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Complaint #{notification.complaintNumber}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3">
                      {notification.type === 'appointment' && (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          notification.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                          notification.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          notification.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notification.status}
                        </span>
                      )}
                      {notification.requiresResponse && (
                        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800">
                          Requires Response
                        </span>
                      )}
                      <span className="text-xs text-blue-600 font-semibold ml-auto">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Reschedule Modal */}
      <RequestRescheduleModal
        appointment={appointmentToReschedule}
        isOpen={!!appointmentToReschedule}
        onClose={() => setAppointmentToReschedule(null)}
        onSuccess={() => {
          fetchNotifications();
          setAppointmentToReschedule(null);
          setSelectedNotification(null);
        }}
      />
    </div>
  );
}
