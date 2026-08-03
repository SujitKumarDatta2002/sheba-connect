import API from "../config/api";
import { useState } from "react";
import axios from "axios";
import { 
  FaLightbulb, FaPlus, FaTrash, FaCheckCircle,
  FaTimes, FaSpinner, FaUpload, FaPaperPlane
} from "react-icons/fa";

export default function SubmitSolution({ complaint, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    department: complaint?.department || "",
    issueKeyword: complaint?.issueKeyword || "",
    title: "",
    description: "",
    steps: [{ stepNumber: 1, description: "" }],
    complaintId: complaint?._id || null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index].description = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { stepNumber: formData.steps.length + 1, description: "" }
      ]
    });
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      // Renumber steps
      updatedSteps.forEach((step, i) => {
        step.stepNumber = i + 1;
      });
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/solutions`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        if (onSubmit) onSubmit();
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      console.error("Error submitting solution:", err);
      setError(err.response?.data?.message || "Failed to submit solution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaLightbulb className="text-3xl" />
              <div>
                <h2 className="text-xl font-bold">Share Your Solution</h2>
                <p className="text-sm text-purple-100">
                  Help others by sharing how you resolved this issue
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Solution Submitted!
            </h3>
            <p className="text-gray-600">
              Your solution has been submitted and is pending admin review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Complaint Info (if from complaint) */}
              {complaint && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Department:</span> {complaint.department}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <span className="font-semibold">Issue:</span> {complaint.issueKeyword}
                  </p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., How to resolve passport delay issue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your solution in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Step-by-Step Guide
                </label>
                <div className="space-y-3">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-purple-700">{step.stepNumber}</span>
                      </div>
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        placeholder={`Step ${step.stepNumber}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addStep}
                  className="mt-3 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Step
                </button>
              </div>

              {/* Note about verification */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  Your solution will be reviewed by admins before being visible to others.
                  You'll be notified once it's approved.
                </p>
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}