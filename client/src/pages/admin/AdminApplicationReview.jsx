import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API from "../../config/api";

const STATUS_OPTIONS = ["submitted", "under_review", "approved", "rejected", "requires_additional_info"];

export default function AdminApplicationReview() {
  const [loading, setLoading] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [sendingAdminMessage, setSendingAdminMessage] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedServiceKey, setSelectedServiceKey] = useState("");
  const [selectedAppId, setSelectedAppId] = useState("");
  const [status, setStatus] = useState("under_review");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
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

  const fetchServiceApplications = async () => {
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
      const res = await axios.get(`${API}/api/service-applications/admin/all-applications`, { headers });
      const data = res.data || [];
      setApplications(data);
      const nextServiceKey = data[0]?.serviceId?._id || data[0]?.serviceId || "";
      setSelectedServiceKey((prev) => prev || nextServiceKey);
    } catch (error) {
      console.error("Failed to fetch service applications:", error);
      showToast(error.response?.data?.message || "Failed to load service applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedByService = useMemo(() => {
    return applications.reduce((acc, app) => {
      const serviceId = app.serviceId?._id || app.serviceId;
      const serviceName = app.serviceName || app.serviceId?.name || "Unknown service";
      if (!serviceId) return acc;
      if (!acc[serviceId]) {
        acc[serviceId] = { serviceId, serviceName, applicants: [] };
      }
      acc[serviceId].applicants.push(app);
      return acc;
    }, {});
  }, [applications]);

  const serviceGroups = useMemo(() => Object.values(groupedByService), [groupedByService]);

  const selectedService = useMemo(() => {
    if (!selectedServiceKey) return null;
    return groupedByService[selectedServiceKey] || null;
  }, [groupedByService, selectedServiceKey]);

  const selectedApplication = useMemo(() => {
    if (!selectedAppId) return null;
    return applications.find((app) => app._id === selectedAppId) || null;
  }, [applications, selectedAppId]);

  const toYYYYMMDD = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (selectedService?.applicants?.length) {
      const firstId = selectedService.applicants[0]._id;
      setSelectedAppId((prev) => {
        if (prev && selectedService.applicants.some((a) => a._id === prev)) {
          return prev;
        }
        return firstId;
      });
    } else {
      setSelectedAppId("");
    }
  }, [selectedService]);

  useEffect(() => {
    if (!selectedApplication) return;
    setStatus(selectedApplication.status || "under_review");
    setAppointmentDate(toYYYYMMDD(selectedApplication.appointmentDate));
    setAdminNotes(selectedApplication.adminNotes || "");
  }, [selectedApplication]);

  const handleUpdateApplication = async (event) => {
    event.preventDefault();

    const headers = getHeaders();
    if (!headers) {
      showToast("Session expired. Please log in again", "error");
      return;
    }

    if (!selectedApplication?._id) {
      showToast("Please select an applicant", "error");
      return;
    }

    const payload = {
      status,
      adminNotes,
      appointmentDate: appointmentDate || null
    };

    setSubmittingUpdate(true);
    await axios
      .patch(
        `${API}/api/service-applications/${selectedApplication._id}/status`,
        payload,
        { headers }
      )
      .then(async () => {
        showToast("Application updated successfully", "success");
        await fetchServiceApplications();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
        showToast("Failed to update: " + msg, "error");
      })
      .finally(() => {
        setSubmittingUpdate(false);
      });
  };

  const handleSendAdminMessage = async (event) => {
    event.preventDefault();
    const headers = getHeaders();
    if (!headers) {
      showToast("Session expired. Please log in again", "error");
      return;
    }
    if (!selectedApplication?._id) {
      showToast("Please select an applicant", "error");
      return;
    }
    if (!adminMessage.trim()) {
      showToast("Please type a message", "error");
      return;
    }

    setSendingAdminMessage(true);
    try {
      await axios.post(
        `${API}/api/service-applications/${selectedApplication._id}/message`,
        { message: adminMessage.trim() },
        { headers }
      );
      showToast("Message sent to applicant", "success");
      setAdminMessage("");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send message", "error");
    } finally {
      setSendingAdminMessage(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Service Application Review</h1>
          <p className="text-gray-500 mt-1">See service-wise applications and manage each applicant.</p>

          {loading ? (
            <p className="mt-6 text-gray-600">Loading applications...</p>
          ) : serviceGroups.length === 0 ? (
            <p className="mt-6 text-gray-600">No applications to review.</p>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceGroups.map((group) => (
                  <button
                    key={group.serviceId}
                    type="button"
                    onClick={() => setSelectedServiceKey(group.serviceId)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedServiceKey === group.serviceId
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{group.serviceName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.applicants.length} applicant{group.applicants.length > 1 ? "s" : ""}
                    </p>
                  </button>
                ))}
              </div>

              {selectedService && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-gray-200 p-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800">{selectedService.serviceName} Applicants</h3>
                    <div className="mt-4 space-y-2 max-h-[360px] overflow-auto pr-1">
                      {selectedService.applicants.map((app) => (
                        <button
                          key={app._id}
                          type="button"
                          onClick={() => setSelectedAppId(app._id)}
                          className={`w-full rounded-lg border p-3 text-left transition ${
                            selectedAppId === app._id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300"
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-800">{app.userName || app.userId?.name || "User"}</p>
                          <p className="text-xs text-gray-600">{app.userEmail || app.userId?.email || "N/A"}</p>
                          <p className="text-xs text-gray-500 mt-1">Status: {app.status}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 bg-white">
                    {!selectedApplication ? (
                      <p className="text-gray-500">Select an applicant to manage.</p>
                    ) : (
                      <div className="space-y-5">
                        <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                          <p className="text-sm"><span className="font-semibold">Applicant:</span> {selectedApplication.userName || selectedApplication.userId?.name || "N/A"}</p>
                          <p className="text-sm"><span className="font-semibold">Email:</span> {selectedApplication.userEmail || selectedApplication.userId?.email || "N/A"}</p>
                          <p className="text-sm"><span className="font-semibold">Phone:</span> {selectedApplication.notificationPhone || selectedApplication.userId?.phone || "N/A"}</p>
                        </div>

                        <form onSubmit={handleUpdateApplication} className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                            <input
                              type="date"
                              value={appointmentDate}
                              onChange={(e) => setAppointmentDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                            <textarea
                              rows={3}
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submittingUpdate}
                            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {submittingUpdate ? "Updating..." : "Update Application"}
                          </button>
                        </form>

                        <form onSubmit={handleSendAdminMessage} className="space-y-3 border-t pt-4">
                          <label className="block text-sm font-medium text-gray-700">Send Message</label>
                          <textarea
                            rows={3}
                            value={adminMessage}
                            onChange={(e) => setAdminMessage(e.target.value)}
                            placeholder="Type message for this applicant..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="submit"
                            disabled={sendingAdminMessage}
                            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {sendingAdminMessage ? "Sending..." : "Send Message"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
