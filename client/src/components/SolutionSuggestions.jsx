import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaLightbulb, FaClock, FaStar, FaRegStar, 
  FaComment, FaThumbsUp, FaThumbsDown, FaUser,
  FaCalendarAlt, FaBuilding, FaTags
} from "react-icons/fa";

export default function SolutionSuggestions({ department, keyword, onSelect }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    avgResolutionTime: null,
    adminEstimatedDays: null
  });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (department && keyword) {
      fetchSolutions();
    }
  }, [department, keyword]);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API}/api/surveys/similar?department=${department}&keyword=${keyword}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSolutions(res.data.surveys);
      setStats({
        avgResolutionTime: res.data.avgResolutionTime,
        adminEstimatedDays: res.data.adminEstimatedDays
      });
    } catch (err) {
      console.error("Error fetching solutions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="w-4 h-4 text-yellow-400" />
            ) : (
              <FaRegStar className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  if (!department || !keyword) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaLightbulb className="w-6 h-6 text-yellow-300" />
          <h3 className="text-lg font-semibold text-white">Similar Resolved Complaints</h3>
        </div>
      </div>

      {/* Resolution Time Estimates */}
      {(stats.avgResolutionTime || stats.adminEstimatedDays) && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaClock className="text-blue-600" />
            Estimated Resolution Time
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {stats.adminEstimatedDays && (
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Admin Estimate</p>
                <p className="text-xl font-bold text-blue-600">{stats.adminEstimatedDays} days</p>
              </div>
            )}
            {stats.avgResolutionTime && (
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Based on {solutions.length} similar cases</p>
                <p className="text-xl font-bold text-green-600">{stats.avgResolutionTime} days</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solutions List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500">Loading similar cases...</p>
          </div>
        ) : solutions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaLightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No similar resolved complaints found</p>
            <p className="text-sm mt-2">Be the first to share your solution!</p>
          </div>
        ) : (
          solutions.map((solution) => (
            <div key={solution._id} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Solution Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaBuilding className="text-gray-400 text-xs" />
                    <span className="text-sm font-medium text-gray-600">{solution.department}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{solution.issueKeyword}</span>
                  </div>
                  <p className="font-medium text-gray-800 line-clamp-2">
                    {solution.solution}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === solution._id ? null : solution._id)}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {expandedId === solution._id ? 'Show Less' : 'View Details'}
                </button>
              </div>

              {/* Solution Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <FaUser className="text-gray-400" />
                  <span>{solution.userId?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Resolved: {formatDate(solution.resolveDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-gray-400" />
                  <span>{solution.resolutionTime} days</span>
                </div>
                {renderStars(solution.satisfaction)}
              </div>

              {/* Expanded Details */}
              {expandedId === solution._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {/* Feedback */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {solution.feedback}
                    </p>
                  </div>

                  {/* Tags */}
                  {solution.tags && solution.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <FaTags className="text-gray-400 text-xs" />
                      {solution.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onSelect(solution)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FaComment />
                      Discuss This Solution
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