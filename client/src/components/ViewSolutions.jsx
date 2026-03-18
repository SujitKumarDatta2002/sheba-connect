import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaLightbulb, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaThumbsUp, FaThumbsDown, FaEye,
  FaUser, FaCalendarAlt, FaBuilding, FaTag,
  FaCheckDouble, FaHourglassHalf
} from "react-icons/fa";

export default function ViewSolutions({ department, keyword, onSelect }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
        `http://localhost:5000/api/solutions/public?department=${department}&keyword=${keyword}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSolutions(res.data);
    } catch (err) {
      console.error("Error fetching solutions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (id, helpful) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/solutions/${id}/rate`,
        { helpful },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Refresh solutions to update counts
      fetchSolutions();
    } catch (err) {
      console.error("Error rating solution:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!department || !keyword) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaLightbulb className="text-3xl text-yellow-300" />
          <div>
            <h3 className="text-lg font-semibold text-white">Community Solutions</h3>
            <p className="text-sm text-purple-100">
              Verified solutions from other users
            </p>
          </div>
        </div>
      </div>

      {/* Solutions List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin text-3xl text-purple-600 mx-auto mb-3" />
            <p className="text-gray-500">Loading solutions...</p>
          </div>
        ) : solutions.length === 0 ? (
          <div className="p-8 text-center">
            <FaLightbulb className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No verified solutions yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to share a solution!
            </p>
          </div>
        ) : (
          solutions.map((solution) => (
            <div key={solution._id} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Solution Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaBuilding className="text-gray-400 text-xs" />
                    <span className="text-sm font-medium text-gray-600">
                      {solution.department}
                    </span>
                    {solution.verified && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <FaCheckCircle /> Verified
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {solution.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {solution.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSolution(solution);
                    setShowDetails(true);
                  }}
                  className="ml-4 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
                >
                  <FaEye /> View
                </button>
              </div>

              {/* Solution Meta */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FaUser className="text-gray-400" />
                  <span>{solution.userId?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{formatDate(solution.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRate(solution._id, true)}
                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                  >
                    <FaThumbsUp /> {solution.helpfulCount || 0}
                  </button>
                  <button
                    onClick={() => handleRate(solution._id, false)}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <FaThumbsDown /> {solution.notHelpfulCount || 0}
                  </button>
                </div>
              </div>

              {/* Tags */}
              {solution.tags && solution.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <FaTag className="text-xs text-gray-400" />
                  {solution.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Solution Details Modal */}
      {showDetails && selectedSolution && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Solution Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Verified Badge */}
              {selectedSolution.verified && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-green-700">
                  <FaCheckDouble className="text-green-600" />
                  <span className="font-medium">Verified Solution</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedSolution.title}
              </h2>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaBuilding /> {selectedSolution.department}
                </div>
                <div className="flex items-center gap-1">
                  <FaUser /> {selectedSolution.userId?.name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt /> {formatDate(selectedSolution.createdAt)}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedSolution.description}
                </p>
              </div>

              {/* Steps */}
              {selectedSolution.steps && selectedSolution.steps.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Step-by-Step Guide</h4>
                  <div className="space-y-3">
                    {selectedSolution.steps.map((step) => (
                      <div key={step.stepNumber} className="flex gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-purple-700">{step.stepNumber}</span>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpfulness */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-3">Was this solution helpful?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleRate(selectedSolution._id, true);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                  >
                    <FaThumbsUp /> Yes ({selectedSolution.helpfulCount || 0})
                  </button>
                  <button
                    onClick={() => {
                      handleRate(selectedSolution._id, false);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                  >
                    <FaThumbsDown /> No ({selectedSolution.notHelpfulCount || 0})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}