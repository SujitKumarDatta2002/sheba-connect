import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import API from '../config/api';

const RequestRescheduleModal = ({ appointment, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    proposedDate: '',
    proposedTime: '',
    proposedLocation: appointment?.location || '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.proposedDate || !formData.proposedTime || !formData.proposedLocation) {
      setError('Please fill in all fields (date, time, and location)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/api/users/appointments/${appointment._id}/reschedule-request`,
        {
          proposedDate: formData.proposedDate,
          proposedTime: formData.proposedTime,
          proposedLocation: formData.proposedLocation,
          reason: formData.reason || 'User requested reschedule'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting reschedule request:', err);
      setError(err.response?.data?.message || 'Failed to submit reschedule request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      proposedDate: '',
      proposedTime: '',
      proposedLocation: appointment?.location || '',
      reason: ''
    });
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Request Appointment Reschedule</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Current Appointment Info */}
        <div className="px-6 py-4 bg-blue-50 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Appointment</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Date:</strong> {appointment.appointmentDate?.split('T')[0]}</p>
            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            <p><strong>Location:</strong> {appointment.location}</p>
          </div>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheck className="text-3xl text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Your reschedule request has been sent to the admin. They will review your proposed date, time, and location.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive a notification once the admin responds.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Proposed Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Date *
            </label>
            <input
              type="date"
              name="proposedDate"
              value={formData.proposedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Proposed Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Time *
            </label>
            <input
              type="time"
              name="proposedTime"
              value={formData.proposedTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Proposed Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Location *
            </label>
            <input
              type="text"
              name="proposedLocation"
              value={formData.proposedLocation}
              onChange={handleChange}
              placeholder="Enter new location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Reschedule
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain why you need to reschedule (optional)"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default RequestRescheduleModal;
