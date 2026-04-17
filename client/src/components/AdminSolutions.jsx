import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaCheckCircle, FaTimesCircle, FaSpinner,
  FaEye, FaCheck, FaTimes, FaComment
} from "react-icons/fa";

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState("");

  useEffect(() => {
    fetchPendingSolutions();
  }, []);

  const fetchPendingSolutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API}/api/solutions/admin/pending`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSolutions(res.data);
    } catch (err) {
      console.error("Error fetching pending solutions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/solutions/admin/${id}/verify`,
        { status, adminFeedback },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAdminFeedback("");
      setSelectedSolution(null);
      fetchPendingSolutions();
    } catch (err) {
      console.error("Error verifying solution:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Pending Solution Reviews</h3>
        <p className="text-sm text-purple-100">
          {solutions.length} solutions awaiting verification
        </p>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin text-3xl text-purple-600 mx-auto mb-3" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : solutions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
            <p>No pending solutions</p>
          </div>
        ) : (
          solutions.map((solution) => (
            <div key={solution._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{solution.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {solution.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>By: {solution.userId?.name}</span>
                    <span>•</span>
                    <span>Dept: {solution.department}</span>
                    <span>•</span>
                    <span>{formatDate(solution.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSolution(
                    selectedSolution?._id === solution._id ? null : solution
                  )}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                >
                  <FaEye /> Review
                </button>
              </div>

              {selectedSolution?._id === solution._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {/* Steps preview */}
                  {solution.steps && solution.steps.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Steps:</p>
                      <div className="space-y-1">
                        {solution.steps.slice(0, 3).map((step) => (
                          <p key={step.stepNumber} className="text-sm text-gray-600">
                            {step.stepNumber}. {step.description}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin feedback input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback (optional)
                    </label>
                    <textarea
                      value={adminFeedback}
                      onChange={(e) => setAdminFeedback(e.target.value)}
                      placeholder="Add feedback for the user..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(solution._id, "Approved")}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleVerify(solution._id, "Rejected")}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}