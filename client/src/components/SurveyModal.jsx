import { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function SurveyModal({ complaint, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    issueDate: complaint.createdAt?.split('T')[0] || '',
    resolveDate: new Date().toISOString().split('T')[0],
    feedback: '',
    solution: '',
    satisfaction: 5,
    helpful: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      satisfaction: rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Validate all required fields
      if (!formData.issueDate || !formData.resolveDate || !formData.feedback.trim() || !formData.solution.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/surveys/submit",
        {
          complaintId: complaint._id,
          issueDate: formData.issueDate,
          resolveDate: formData.resolveDate,
          feedback: formData.feedback,
          solution: formData.solution,
          satisfaction: parseInt(formData.satisfaction),
          helpful: formData.helpful === true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSubmit();
      onClose();
    } catch (err) {
      console.error("Survey submission error:", err);
      setError(err.response?.data?.message || "Failed to submit survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaCheckCircle /> Complaint Resolved!
              </h2>
              <p className="text-sm text-green-100 mt-1">
                Help others by sharing your experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <FaExclamationCircle />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Complaint Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Complaint Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Department:</span> {complaint.department}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Issue:</span> {complaint.issueKeyword}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Date *
                </label>
                <input
                  type="date"
                  name="resolveDate"
                  value={formData.resolveDate}
                  onChange={handleChange}
                  required
                  min={formData.issueDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Solution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What was the solution? *
              </label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe how your complaint was resolved..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Share your experience with the resolution process..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Satisfaction Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How satisfied are you with the resolution? *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRating(rating)}
                    className="focus:outline-none"
                  >
                    {rating <= formData.satisfaction ? (
                      <FaStar className="w-8 h-8 text-yellow-400 hover:scale-110 transition-transform" />
                    ) : (
                      <FaRegStar className="w-8 h-8 text-gray-300 hover:text-yellow-400 hover:scale-110 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Was this helpful? */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Was this solution helpful for others?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="helpful"
                    value="true"
                    checked={formData.helpful === true}
                    onChange={() => setFormData({ ...formData, helpful: true })}
                    className="w-4 h-4 text-green-600"
                  />
                  <span>Yes, it will help others</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="helpful"
                    value="false"
                    checked={formData.helpful === false}
                    onChange={() => setFormData({ ...formData, helpful: false })}
                    className="w-4 h-4 text-red-600"
                  />
                  <span>No, it was specific to my case</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Submit Survey
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}