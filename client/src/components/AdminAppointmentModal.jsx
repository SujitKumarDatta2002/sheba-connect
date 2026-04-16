import API from "../config/api";

import { useState } from "react";
import axios from "axios";
import {
  FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt,
  FaUser, FaComment, FaPaperPlane, FaCheckCircle,
  FaExclamationTriangle, FaSpinner
} from "react-icons/fa";

export default function AdminAppointmentModal({ complaint, user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    purpose: "Discussion on complaint resolution"
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();

    if (!formData.appointmentDate || !formData.appointmentTime || !formData.location) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/admin/appointments`,
        {
          complaintId: complaint._id,
          userId: user._id,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          location: formData.location,
          purpose: formData.purpose
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Appointment scheduled successfully", "success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      showNotification(err.response?.data?.message || "Failed to schedule appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:p-4 p-0 animate-in">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-md md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaCalendarAlt /> Schedule Appointment
            </h2>
            <p className="text-blue-100 text-sm mt-1">{complaint.complaintNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-2 rounded transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mx-4 mt-4 p-3 rounded-lg text-sm text-white ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleScheduleAppointment} className="p-6 space-y-4">
          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-bold text-blue-900 flex items-center gap-2 mb-2">
              <FaUser /> Scheduled for
            </p>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <p className="text-xs text-gray-600">{user?.phone}</p>
          </div>

          {/* Complaint Reference */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs font-bold text-purple-900 mb-2">Complaint</p>
            <p className="text-sm text-gray-900">{complaint.complaintNumber}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{complaint.issueKeyword}</p>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Time Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaClock className="text-blue-500" /> Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" /> Location <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">Select location...</option>
              <option value="Head Office, Dhaka">Head Office, Dhaka</option>
              <option value="District Office">District Office</option>
              <option value="Upazila Office">Upazila Office</option>
              <option value="Virtual Meeting">Virtual Meeting</option>
              <option value="On-site Visit">On-site Visit</option>
            </select>
          </div>

          {/* Purpose Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaComment className="text-blue-500" /> Purpose
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Brief description of the meeting purpose"
              rows="3"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-xs font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <FaExclamationTriangle /> Note
            </p>
            <p className="text-xs text-yellow-800">
              The user will receive notification and can accept or request to reschedule if they're not available.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Scheduling...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
