import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API from "../../config/api";
import AdminDepartmentBoard from "../../components/AdminDepartmentBoard";

const FALLBACK_FIELDS = [
  "nid",
  "birthCertificate",
  "passport",
  "drivingLicense",
  "tin",
  "citizenship",
  "educationalCertificate"
];

export default function AdminApplicationReview() {
  const [applications, setApplications] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [requestedFields, setRequestedFields] = useState([]);
  const [deadlines, setDeadlines] = useState({
    applicationDate: "",
    documentDate: "",
    appointmentDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "success", message: "" }), 3000);
  };

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const getCurrentUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return String(user.role || "").toLowerCase();
    } catch {
      return "";
    }
  };

  const fetchPendingApplications = async () => {
    const headers = getHeaders();
    if (!headers) {
      showToast("Session expired. Please log in again", "error");
      return;
    }

    if (!["admin", "superadmin"].includes(getCurrentUserRole())) {
      showToast("Only admin accounts can review applications", "error");
      return;
    }

    setLoading(true);
    try {
      const [pendingRes, groupedRes] = await Promise.all([
        axios.get(`${API}/api/applications/pending`, { headers }),
        axios.get(`${API}/api/applications/by-department`, { headers })
      ]);

      const data = pendingRes.data || [];
      setApplications(data);

      const grouped = groupedRes.data?.groupedData || {};
      setGroupedData(grouped);

      setSelectedId((prev) => {
        if (prev && data.some((item) => item._id === prev)) {
          return prev;
        }
        return data[0]?._id || "";
      });
    } catch (error) {
      console.error("Failed to fetch pending applications:", error);
      showToast(error.response?.data?.message || "Failed to load pending applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedApplication = useMemo(
    () => applications.find((item) => item._id === selectedId),
    [applications, selectedId]
  );

  const selectableFields = useMemo(() => {
    if (selectedApplication?.serviceId?.requiredDocuments?.length) {
      return selectedApplication.serviceId.requiredDocuments;
    }
    return FALLBACK_FIELDS;
  }, [selectedApplication]);

  const toYYYYMMDD = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (selectedApplication) {
      setRequestedFields(selectedApplication.requestedFields || []);
      setDeadlines({
        applicationDate: toYYYYMMDD(selectedApplication.deadlines?.applicationDate),
        documentDate: toYYYYMMDD(selectedApplication.deadlines?.documentDate),
        appointmentDate: toYYYYMMDD(selectedApplication.deadlines?.appointmentDate)
      });
    } else {
      setRequestedFields([]);
      setDeadlines({
        applicationDate: "",
        documentDate: "",
        appointmentDate: ""
      });
    }
  }, [selectedApplication]);

  const toggleField = (field) => {
    setRequestedFields((prev) =>
      prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]
    );
  };

  const handleSelectApplication = (app) => {
    if (!app?._id) return;
    const isInReviewableList = applications.some((item) => item._id === app._id);
    if (isInReviewableList) {
      setSelectedId(app._id);
      return;
    }
    showToast("This application is not currently reviewable from this form", "error");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const headers = getHeaders();
    if (!headers) {
      showToast("Session expired. Please log in again", "error");
      return;
    }

    if (!selectedApplication) {
      showToast("Please select a valid application before submitting", "error");
      return;
    }

    const normalizedRequestedFields = requestedFields
      .map((field) => String(field).trim())
      .filter(Boolean);

    if (normalizedRequestedFields.length === 0) {
      showToast("Please select at least one requested field", "error");
      return;
    }

    const payloadDeadlines = {
      applicationDate: toYYYYMMDD(deadlines.applicationDate),
      documentDate: toYYYYMMDD(deadlines.documentDate),
      appointmentDate: toYYYYMMDD(deadlines.appointmentDate)
    };

    if (!payloadDeadlines.applicationDate || !payloadDeadlines.documentDate || !payloadDeadlines.appointmentDate) {
      showToast("Please set all three deadlines", "error");
      return;
    }

    const payload = {
      requestedFields: normalizedRequestedFields,
      deadlines: payloadDeadlines
    };

    setSubmitting(true);
    await axios
      .patch(
        `${API}/api/applications/${selectedApplication._id}/review`,
        payload,
        { headers }
      )
      .then(async () => {
        showToast(
          selectedApplication.status === "AWAITING_USER_DOCS"
            ? "Application review updated successfully!"
            : "Review sent to user successfully!",
          "success"
        );
        await fetchPendingApplications();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        showToast("Failed to review: " + msg, "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Application Review</h1>
          <p className="text-gray-500 mt-1">Review pending or previously reviewed applications.</p>

          {loading ? (
            <p className="mt-6 text-gray-600">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="mt-6 text-gray-600">No applications to review.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminDepartmentBoard
                groupedData={groupedData}
                onSelectApplication={handleSelectApplication}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Application</label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {applications.map((app) => (
                      <option key={app._id} value={app._id}>
                        {app.userId?.name || "User"} - {app.serviceId?.name || "Service"} {app.status === "AWAITING_USER_DOCS" ? "(Reviewed)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedApplication && (
                  <div className="rounded-lg border border-gray-200 p-4 bg-blue-50 border-l-4 border-l-blue-500">
                    <p className="text-sm text-gray-800 font-medium">Applicant Details</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold text-gray-700">Name:</span> {selectedApplication.userId?.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-gray-700">Email:</span> {selectedApplication.userId?.email}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-gray-700">Service:</span> {selectedApplication.serviceId?.name}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-semibold text-gray-700 mr-2">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedApplication.status === "AWAITING_USER_DOCS"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedApplication.status.replace(/_/g, " ")}
                      </span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requested Fields</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectableFields.map((field) => (
                      <label key={field} className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer transition-colors ${requestedFields.includes(field) ? "bg-blue-50 border-blue-300 text-blue-800 font-medium" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={requestedFields.includes(field)}
                          onChange={() => toggleField(field)}
                        />
                        <span>{field}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                    <input
                      type="date"
                      required
                      value={deadlines.applicationDate}
                      onChange={(e) => setDeadlines({ ...deadlines, applicationDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document Final Date</label>
                    <input
                      type="date"
                      required
                      value={deadlines.documentDate}
                      onChange={(e) => setDeadlines({ ...deadlines, documentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={deadlines.appointmentDate}
                      onChange={(e) => setDeadlines({ ...deadlines, appointmentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedId}
                  className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : selectedApplication?.status === "AWAITING_USER_DOCS" ? "Update Review Details" : "Send Review to User"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
