import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, FaClipboardList, FaLightbulb, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
  FaChartBar, FaCog, FaShieldAlt, FaUserCheck, FaUserTimes,
  FaCheckDouble, FaHourglassHalf, FaDownload, FaEye,
  FaTrash, FaEdit, FaSearch, FaFilter, FaChevronDown,
  FaBan, FaUnlock, FaLock, FaUserCog, FaBuilding,
  FaCalendarAlt, FaComment, FaCheck, FaTimes, FaPlus,
  FaUpload, FaPaperPlane, FaStar, FaRegStar,
  FaFilePdf
} from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateServiceReport, generateUserActivityReport, generateCombinedReport } from "../utils/reportGenerator";
import AdminSolutions from "../components/AdminSolutions";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    pendingSolutions: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0
  });
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [serviceApplications, setServiceApplications] = useState([]);
  const [publicDatasets, setPublicDatasets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const [selectedAnalyticsDate, setSelectedAnalyticsDate] = useState("");
  const [loadingCalendarEvents, setLoadingCalendarEvents] = useState(false);
  const [calendarError, setCalendarError] = useState("");

  const requiredDocumentTypes = [
    "nid",
    "birthCertificate",
    "passport",
    "drivingLicense",
    "tin",
    "citizenship",
    "educationalCertificate"
  ];

  const documentLabels = {
    nid: "NID",
    birthCertificate: "Birth Certificate",
    passport: "Passport",
    drivingLicense: "Driving License",
    tin: "TIN",
    citizenship: "Citizenship",
    educationalCertificate: "Educational Certificate"
  };
  // Report generation handlers
  const handleGenerateServiceReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const statsRes = await axios.get(
        `http://localhost:5000/api/reports/service-stats?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const servicesRes = await axios.get(
        'http://localhost:5000/api/admin/services',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await generateServiceReport(servicesRes.data, statsRes.data, dateRange);
      showNotification('Service report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating service report:', err);
      showNotification('Failed to generate service report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateUserReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const statsRes = await axios.get(
        `http://localhost:5000/api/reports/user-stats?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await generateUserActivityReport(statsRes.data.users, statsRes.data, dateRange);
      showNotification('User activity report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating user report:', err);
      showNotification('Failed to generate user report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCombinedReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const statsRes = await axios.get(
        `http://localhost:5000/api/reports/combined-stats?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await generateCombinedReport(statsRes.data);
      showNotification('Comprehensive report generated successfully', 'success');
    } catch (err) {
      console.error('Error generating combined report:', err);
      showNotification('Failed to generate combined report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (selectedAnalyticsDate) {
      fetchDashboardData(selectedAnalyticsDate);
    } else {
      fetchDashboardData();
    }
  }, [selectedAnalyticsDate]);

  const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchGoogleCalendarEvents = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
    const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

    if (!apiKey || !calendarId) {
      setCalendarError("Google Calendar is not configured. Add VITE_GOOGLE_CALENDAR_API_KEY and VITE_GOOGLE_CALENDAR_ID to client/.env.local, then restart the Vite dev server.");
      return;
    }

    setLoadingCalendarEvents(true);
    setCalendarError("");

    try {
      // Fetch ALL events across all dates with pagination
      const from = new Date(2000, 0, 1).toISOString(); // Start from year 2000
      const to = new Date(2100, 11, 31, 23, 59, 59).toISOString(); // End year 2100
      const encodedCalendarId = encodeURIComponent(calendarId);
      
      let allEvents = [];
      let pageToken = null;
      let hasMore = true;

      while (hasMore) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(from)}&timeMax=${encodeURIComponent(to)}&maxResults=250${pageToken ? `&pageToken=${pageToken}` : ''}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Google Calendar API error (${res.status})`);
        }

        const payload = await res.json();
        const items = Array.isArray(payload.items) ? payload.items : [];
        allEvents = allEvents.concat(items);

        // Check if there are more results
        pageToken = payload.nextPageToken;
        hasMore = !!pageToken;
      }

      const normalizedEvents = allEvents
        .map((event) => {
          const rawDate = event?.start?.date || event?.start?.dateTime?.slice(0, 10);
          if (!rawDate) return null;
          return {
            id: event.id,
            summary: event.summary || "Calendar Event",
            date: rawDate
          };
        })
        .filter(Boolean);

      setGoogleCalendarEvents(normalizedEvents);
      if (normalizedEvents.length === 0) {
        setCalendarError("No events found for the configured calendar.");
      }
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      setCalendarError("Failed to load Google Calendar events.");
    } finally {
      setLoadingCalendarEvents(false);
    }
  };

  const fetchDashboardData = async (analyticsDate = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users
      const usersRes = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);

      // Fetch complaints
      const complaintsRes = await axios.get("http://localhost:5000/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaintsRes.data);

      // Fetch documents
      const docsRes = await axios.get("http://localhost:5000/api/admin/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(docsRes.data);

      // Fetch stats
      const statsRes = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch service applications for trend analysis
      const applicationsRes = await axios.get("http://localhost:5000/api/service-applications/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServiceApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);

      // Fetch official public datasets for external benchmark insights
      const publicDatasetRes = await axios.get("http://localhost:5000/api/stats/public-datasets", {
        params: analyticsDate ? { date: analyticsDate } : {}
      });
      setPublicDatasets(publicDatasetRes.data || null);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`User role updated to ${newRole}`, "success");
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating user role:", err);
      showNotification("Failed to update user role", "error");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification("User deleted successfully", "success");
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting user:", err);
      showNotification("Failed to delete user", "error");
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/complaints/${complaintId}/status`,
        { status: newStatus, comment: adminComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Complaint status updated to ${newStatus}`, "success");
      setAdminComment("");
      setSelectedComplaint(null);
      setShowComplaintModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating complaint:", err);
      showNotification("Failed to update complaint", "error");
    }
  };

  const verifyDocument = async (docId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/documents/${docId}/verify`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Document ${status.toLowerCase()}`, "success");
      fetchDashboardData();
    } catch (err) {
      console.error("Error verifying document:", err);
      showNotification("Failed to verify document", "error");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (dateRange.start && new Date(c.createdAt) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(c.createdAt) > new Date(dateRange.end)) return false;
    return true;
  });

  const tabs = [
    { id: "overview", name: "Overview", icon: FaChartBar, description: "System statistics and quick actions" },
    { id: "users", name: "User Management", icon: FaUsers, description: "Manage citizens and their accounts" },
    { id: "complaints", name: "Complaint Management", icon: FaClipboardList, description: "Review and process citizen complaints" },
    { id: "solutions", name: "Solution Review", icon: FaLightbulb, description: "Verify user-submitted solutions" },
    { id: "documents", name: "Document Verification", icon: FaFileAlt, description: "Verify citizen documents" },
    { id: "settings", name: "System Settings", icon: FaCog, description: "Configure system parameters" },
    { id: "reports", name: "Reports", icon: FaFilePdf, description: "Generate and download reports" }
  ];

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Report Period
          </h3>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showDatePicker ? 'Hide' : 'Select Date Range'}
          </button>
        </div>
        {showDatePicker && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaChartBar className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Service Usage Report</h3>
              <p className="text-sm text-gray-500">Service statistics and department analysis</p>
            </div>
          </div>
          <button
            onClick={handleGenerateServiceReport}
            disabled={generating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaDownload />
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">User Activity Report</h3>
              <p className="text-sm text-gray-500">User engagement and activity metrics</p>
            </div>
          </div>
          <button
            onClick={handleGenerateUserReport}
            disabled={generating}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaDownload />
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaFilePdf className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Comprehensive Report</h3>
              <p className="text-sm text-gray-500">Complete system overview and KPIs</p>
            </div>
          </div>
          <button
            onClick={handleGenerateCombinedReport}
            disabled={generating}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaDownload />
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Export Options</h3>
        <p className="text-sm text-gray-600 mb-4">
          Generate reports for specific time periods or export all data for analysis
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setDateRange({
                start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              setDateRange({
                start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => {
              setDateRange({
                start: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0]
              });
            }}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Last 3 Months
          </button>
        </div>
      </div>
    </div>
  );

  // Stats cards configuration
  const statsCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: FaUsers, 
      color: "blue",
      description: "Registered citizens",
      change: "+12 this month"
    },
    { 
      title: "Total Complaints", 
      value: stats.totalComplaints, 
      icon: FaClipboardList, 
      color: "purple",
      description: "All complaints",
      change: `${stats.pendingComplaints} pending`
    },
    { 
      title: "Pending Solutions", 
      value: stats.pendingSolutions, 
      icon: FaLightbulb, 
      color: "yellow",
      description: "Awaiting verification",
      change: "Need review"
    },
    { 
      title: "Documents", 
      value: stats.totalDocuments, 
      icon: FaFileAlt, 
      color: "green",
      description: `${stats.verifiedDocuments || 0} verified`,
      change: `${stats.pendingDocuments || 0} pending`
    }
  ];

  const serviceTrendData = (() => {
    const months = [];
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.push({ key, label: monthFormatter.format(date), value: 0 });
    }

    const monthIndex = months.reduce((acc, month, index) => {
      acc[month.key] = index;
      return acc;
    }, {});

    serviceApplications.forEach((application) => {
      const createdAt = application?.createdAt ? new Date(application.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return;

      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      const index = monthIndex[key];
      if (index !== undefined) {
        months[index].value += 1;
      }
    });

    return months;
  })();

  const missingDocumentInsights = (() => {
    const totalRegisteredUsers = users.length;
    if (!totalRegisteredUsers) {
      return requiredDocumentTypes.map((type) => ({
        label: documentLabels[type] || type,
        missing: 0,
        percentage: 0
      }));
    }

    const uniqueUploadsByType = requiredDocumentTypes.reduce((acc, type) => {
      acc[type] = new Set();
      return acc;
    }, {});

    documents.forEach((doc) => {
      const type = doc?.documentType;
      const userId = doc?.userId?._id || doc?.userId;
      if (!type || !userId || !uniqueUploadsByType[type]) return;
      uniqueUploadsByType[type].add(String(userId));
    });

    return requiredDocumentTypes
      .map((type) => {
        const uploadedCount = uniqueUploadsByType[type]?.size || 0;
        const missing = Math.max(totalRegisteredUsers - uploadedCount, 0);
        return {
          label: documentLabels[type] || type,
          missing,
          percentage: Math.round((missing / totalRegisteredUsers) * 100)
        };
      })
      .sort((a, b) => b.missing - a.missing)
      .slice(0, 5);
  })();

  const frequentIssueInsights = Object.entries(
    complaints.reduce((acc, complaint) => {
      const issue = complaint?.issueKeyword?.trim() || "Uncategorized";
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const userGrowthInsights = (() => {
    const days = [];
    const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      days.push({ key, label: dayFormatter.format(date), value: 0 });
    }

    const dayIndex = days.reduce((acc, day, index) => {
      acc[day.key] = index;
      return acc;
    }, {});

    users.forEach((user) => {
      const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return;
      const key = createdAt.toISOString().slice(0, 10);
      const index = dayIndex[key];
      if (index !== undefined) {
        days[index].value += 1;
      }
    });

    return days;
  })();

  const adminCount = users.filter((user) => user.role === "admin").length;
  const citizenCount = users.length - adminCount;

  const maxServiceTrendValue = Math.max(...serviceTrendData.map((item) => item.value), 1);
  const maxMissingDocValue = Math.max(...missingDocumentInsights.map((item) => item.missing), 1);
  const maxIssueValue = Math.max(...frequentIssueInsights.map((item) => item.count), 1);
  const maxUserGrowthValue = Math.max(...userGrowthInsights.map((item) => item.value), 1);

  const serviceInsights = publicDatasets?.serviceInsights;
  const topAppliedServices = serviceInsights?.topAppliedServices || [];
  const departmentLoad = serviceInsights?.departmentLoad || [];
  const requiredDocumentDemand = serviceInsights?.requiredDocumentDemand || [];
  const monthlyApplications = serviceInsights?.monthlyApplications || [];
  const processingTimeDistribution = serviceInsights?.processingTimeDistribution || {
    fast: 0,
    standard: 0,
    extended: 0,
    unknown: 0
  };
  const maxTopServiceApplications = Math.max(...topAppliedServices.map((item) => item.applications), 1);
  const maxMonthlyApplications = Math.max(...monthlyApplications.map((item) => item.applications), 1);
  const additionalDatasets = publicDatasets?.additionalDatasets;
  const complaintInsights = additionalDatasets?.complaintInsights;
  const userInsights = additionalDatasets?.userInsights;
  const documentInsights = additionalDatasets?.documentInsights;
  const complaintStatusBreakdown = complaintInsights?.statusBreakdown || [];
  const complaintTrend = complaintInsights?.trend || [];
  const userRoleBreakdown = userInsights?.roleBreakdown || [];
  const userTrend = userInsights?.trend || [];
  const documentStatusBreakdown = documentInsights?.statusBreakdown || [];
  const documentTypeBreakdown = documentInsights?.typeBreakdown || [];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatTrendLabel = (entry) => `${monthLabels[(entry.month || 1) - 1]}/${String(entry.year).slice(-2)}`;
  const maxComplaintTrend = Math.max(...complaintTrend.map((item) => item.value), 1);
  const maxUserTrend = Math.max(...userTrend.map((item) => item.value), 1);
  const complaintTrendChart = complaintTrend.slice(-6).map((entry) => ({ name: formatTrendLabel(entry), value: entry.value }));
  const userTrendChart = userTrend.slice(-6).map((entry) => ({ name: formatTrendLabel(entry), value: entry.value }));
  const topDocumentTypes = documentTypeBreakdown.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-8 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <FaShieldAlt className="text-4xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Control Panel</h1>
                <p className="text-purple-100 text-lg">Manage users, complaints, solutions, and documents</p>
              </div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-sm">Logged in as</p>
              <p className="font-semibold">System Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto gap-2 py-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={tab.description}
              >
                <tab.icon />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {statsCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-${card.color}-500 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                          <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                          <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                          <p className="text-xs text-${card.color}-600 mt-1">{card.change}</p>
                        </div>
                        <div className={`bg-${card.color}-100 p-3 rounded-lg`}>
                          <card.icon className={`text-${card.color}-600 text-2xl`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphical Insights */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaChartBar className="text-indigo-600" />
                        Graphical Insights
                      </h3>
                      <p className="text-sm text-gray-500">Service trends, missing documents, frequent issues, and user statistics</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">Live snapshot</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white">
                      <h4 className="font-semibold text-gray-800 mb-4">Service Trends (Last 6 Months)</h4>
                      <div className="h-40 flex items-end gap-3">
                        {serviceTrendData.map((item) => {
                          const height = `${Math.max((item.value / maxServiceTrendValue) * 100, 6)}%`;
                          return (
                            <div key={item.key} className="flex-1 flex flex-col items-center justify-end gap-2">
                              <div className="text-xs font-semibold text-gray-700">{item.value}</div>
                              <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height }}></div>
                              <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-red-50 to-white">
                      <h4 className="font-semibold text-gray-800 mb-4">Missing Documents (Top 5)</h4>
                      <div className="space-y-3">
                        {missingDocumentInsights.map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{item.label}</span>
                              <span className="font-semibold text-red-600">{item.missing}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                                style={{ width: `${Math.max((item.missing / maxMissingDocValue) * 100, item.missing ? 8 : 0)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-amber-50 to-white">
                      <h4 className="font-semibold text-gray-800 mb-4">Frequent Issues</h4>
                      <div className="space-y-3">
                        {frequentIssueInsights.length === 0 && (
                          <p className="text-sm text-gray-500">No complaint data available yet.</p>
                        )}
                        {frequentIssueInsights.map((item) => (
                          <div key={item.issue}>
                            <div className="flex justify-between text-sm mb-1 gap-3">
                              <span className="text-gray-700 truncate">{item.issue}</span>
                              <span className="font-semibold text-amber-700">{item.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                                style={{ width: `${Math.max((item.count / maxIssueValue) * 100, 10)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-white">
                      <h4 className="font-semibold text-gray-800 mb-4">User Statistics</h4>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-lg bg-white p-3 border border-emerald-100">
                          <p className="text-xs text-gray-500">Citizens</p>
                          <p className="text-xl font-bold text-emerald-700">{citizenCount}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3 border border-indigo-100">
                          <p className="text-xs text-gray-500">Admins</p>
                          <p className="text-xl font-bold text-indigo-700">{adminCount}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">New users in last 7 days</p>
                      <div className="h-24 flex items-end gap-2">
                        {userGrowthInsights.map((day) => {
                          const height = `${Math.max((day.value / maxUserGrowthValue) * 100, day.value ? 12 : 6)}%`;
                          return (
                            <div key={day.key} className="flex-1 flex flex-col items-center gap-1 justify-end">
                              <div className="w-full rounded-md bg-gradient-to-t from-emerald-600 to-lime-400" style={{ height }}></div>
                              <span className="text-[10px] text-gray-500">{day.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <h4 className="font-semibold text-gray-800">Official Service Dataset</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        Source: {publicDatasets?.source?.name || "ShebaConnect Official Service Registry"}
                      </span>
                    </div>

                    <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <button
                          onClick={fetchGoogleCalendarEvents}
                          disabled={loadingCalendarEvents}
                          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loadingCalendarEvents ? "Loading Calendar..." : "Sync Google Calendar"}
                        </button>

                        <select
                          value={selectedAnalyticsDate}
                          onChange={(e) => setSelectedAnalyticsDate(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-blue-200 rounded-lg bg-white"
                        >
                          <option value="">All Dates</option>
                          {googleCalendarEvents.map((event) => (
                            <option key={event.id} value={event.date}>
                              {event.date} - {event.summary}
                            </option>
                          ))}
                        </select>

                        <input
                          type="date"
                          value={selectedAnalyticsDate}
                          onChange={(e) => setSelectedAnalyticsDate(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-blue-200 rounded-lg bg-white"
                          placeholder="Or type a date"
                        />
                      </div>
                      {calendarError && <p className="text-xs text-red-600">{calendarError}</p>}
                      {selectedAnalyticsDate && (
                        <p className="text-xs text-blue-800">Analytics filtered by date: {selectedAnalyticsDate}</p>
                      )}
                    </div>

                    {publicDatasets ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                          <div className="rounded-lg bg-white border border-slate-100 p-3">
                            <p className="text-xs text-gray-500">Total Services</p>
                            <p className="text-lg font-bold text-slate-800">{serviceInsights?.totalServices ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white border border-slate-100 p-3">
                            <p className="text-xs text-gray-500">Active Services</p>
                            <p className="text-lg font-bold text-emerald-700">{serviceInsights?.activeServices ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white border border-slate-100 p-3">
                            <p className="text-xs text-gray-500">Applications</p>
                            <p className="text-lg font-bold text-slate-800">{serviceInsights?.totalApplications ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white border border-slate-100 p-3">
                            <p className="text-xs text-gray-500">Approval Rate</p>
                            <p className="text-lg font-bold text-emerald-700">{serviceInsights?.approvalRate ?? 0}%</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-2">Monthly service applications (official dataset)</p>
                        <div className="h-28 flex items-end gap-2">
                          {monthlyApplications.map((entry) => {
                            const height = `${Math.max((entry.applications / maxMonthlyApplications) * 100, 10)}%`;
                            return (
                              <div key={`${entry.year}-${entry.month}`} className="flex-1 flex flex-col items-center gap-1 justify-end">
                                <div className="w-full rounded-md bg-gradient-to-t from-slate-700 to-slate-400" style={{ height }}></div>
                                <span className="text-[10px] text-gray-500">{entry.month}/{String(entry.year).slice(-2)}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                            <h5 className="text-sm font-semibold text-blue-900 mb-3">Application Status Mix</h5>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="rounded-md bg-white p-2 border border-blue-100">
                                <p className="text-xs text-gray-500">Applications</p>
                                <p className="font-bold text-blue-800">{serviceInsights?.totalApplications ?? 0}</p>
                              </div>
                              <div className="rounded-md bg-white p-2 border border-blue-100">
                                <p className="text-xs text-gray-500">Approval Rate</p>
                                <p className="font-bold text-emerald-700">{serviceInsights?.approvalRate ?? 0}%</p>
                              </div>
                              <div className="rounded-md bg-white p-2 border border-blue-100">
                                <p className="text-xs text-gray-500">Inactive Services</p>
                                <p className="font-bold text-rose-700">{serviceInsights?.inactiveServices ?? 0}</p>
                              </div>
                              <div className="rounded-md bg-white p-2 border border-blue-100">
                                <p className="text-xs text-gray-500">Departments</p>
                                <p className="font-bold text-blue-800">{departmentLoad.length}</p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                              <div className="rounded-md bg-white p-2 border border-slate-100">
                                <p className="text-gray-500">Pending</p>
                                <p className="font-semibold text-amber-700">{serviceInsights?.pendingApplications ?? 0}</p>
                              </div>
                              <div className="rounded-md bg-white p-2 border border-slate-100">
                                <p className="text-gray-500">Approved</p>
                                <p className="font-semibold text-emerald-700">{serviceInsights?.approvedApplications ?? 0}</p>
                              </div>
                              <div className="rounded-md bg-white p-2 border border-slate-100">
                                <p className="text-gray-500">Rejected</p>
                                <p className="font-semibold text-rose-700">{serviceInsights?.rejectedApplications ?? 0}</p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
                            <h5 className="text-sm font-semibold text-indigo-900 mb-3">Top Applied Services</h5>
                            <div className="space-y-2 mb-3">
                              {topAppliedServices.length === 0 && (
                                <p className="text-xs text-gray-500">No service application data available yet.</p>
                              )}
                              {topAppliedServices.map((item) => (
                                <div key={`${item.name}-${item.department}`}>
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-700 truncate pr-2">{item.name}</span>
                                    <span className="font-semibold text-indigo-700">{item.applications}</span>
                                  </div>
                                  <div className="h-2 bg-white rounded-full overflow-hidden border border-indigo-100">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-600 to-blue-400"
                                      style={{ width: `${Math.max((item.applications / maxTopServiceApplications) * 100, 8)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs font-semibold text-indigo-900 mb-1">Department Load</p>
                            <p className="text-xs text-gray-600">
                              {(departmentLoad || []).slice(0, 3).map((dept) => `${dept.department} (${dept.applications})`).join(', ') || 'No department load data yet.'}
                            </p>

                            <p className="text-xs font-semibold text-indigo-900 mt-3 mb-1">Top Required Documents</p>
                            <p className="text-xs text-gray-600">
                              {requiredDocumentDemand.slice(0, 3).map((doc) => `${doc.label} (${doc.servicesUsing})`).join(', ') || 'No required-document data yet.'}
                            </p>

                            <p className="text-xs font-semibold text-indigo-900 mt-3 mb-1">Processing Time Distribution</p>
                            <p className="text-xs text-gray-600">
                              Fast: {processingTimeDistribution.fast || 0}, Standard: {processingTimeDistribution.standard || 0}, Extended: {processingTimeDistribution.extended || 0}, Unknown: {processingTimeDistribution.unknown || 0}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/40 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <h5 className="text-sm font-semibold text-sky-900">Additional Internal Datasets</h5>
                            <span className="text-[11px] text-sky-800">
                              {additionalDatasets?.source?.name || "ShebaConnect Internal Analytics"}
                            </span>
                          </div>

                          {additionalDatasets ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                                <div className="rounded-md bg-white border border-sky-100 p-3 h-full flex flex-col">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-xs font-semibold text-sky-900">Complaint Dataset</h6>
                                    <span className="text-[11px] text-sky-700">{complaintInsights?.summary?.totalComplaints || 0} total</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-[11px] mb-3">
                                    <div className="rounded bg-sky-50 p-2">Pending: {complaintInsights?.summary?.pendingComplaints || 0}</div>
                                    <div className="rounded bg-sky-50 p-2">Processing: {complaintInsights?.summary?.processingComplaints || 0}</div>
                                    <div className="rounded bg-sky-50 p-2">Resolved: {complaintInsights?.summary?.resolvedComplaints || 0}</div>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    {complaintStatusBreakdown.map((item) => (
                                      <div key={item.label} className="flex items-center justify-between rounded bg-sky-50 px-3 py-2">
                                        <span className="text-gray-700">{item.label}</span>
                                        <span className="font-semibold text-sky-700">{item.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2 mb-1">Monthly complaint volume</p>
                                  <div className="h-24 flex items-end gap-2">
                                    {complaintTrendChart.slice(-6).map((entry) => {
                                      const height = `${Math.max((entry.value / maxComplaintTrend) * 100, 10)}%`;
                                      return (
                                        <div key={entry.name} className="flex-1 flex flex-col items-center gap-1 justify-end">
                                          <div className="w-full rounded-md bg-gradient-to-t from-sky-700 to-cyan-400" style={{ height }}></div>
                                          <span className="text-[10px] text-gray-500">{entry.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="rounded-md bg-white border border-sky-100 p-3 h-full flex flex-col">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-xs font-semibold text-sky-900">User Dataset</h6>
                                    <span className="text-[11px] text-sky-700">{userInsights?.summary?.totalUsers || 0} users</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                                    {userRoleBreakdown.map((role) => (
                                      <div key={role.label} className="rounded bg-sky-50 p-2">
                                        {role.label}: {role.value}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    {userRoleBreakdown.map((role) => (
                                      <div key={role.label} className="flex items-center justify-between rounded bg-sky-50 px-3 py-2">
                                        <span className="text-gray-700">{role.label}</span>
                                        <span className="font-semibold text-sky-700">{role.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2 mb-1">Monthly user registrations</p>
                                  <div className="h-24 flex items-end gap-2">
                                    {userTrendChart.slice(-6).map((entry) => {
                                      const height = `${Math.max((entry.value / maxUserTrend) * 100, 10)}%`;
                                      return (
                                        <div key={entry.name} className="flex-1 flex flex-col items-center gap-1 justify-end">
                                          <div className="w-full rounded-md bg-gradient-to-t from-violet-700 to-cyan-400" style={{ height }}></div>
                                          <span className="text-[10px] text-gray-500">{entry.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="rounded-md bg-white border border-sky-100 p-3 h-full flex flex-col">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-xs font-semibold text-sky-900">Document Dataset</h6>
                                    <span className="text-[11px] text-sky-700">{documentInsights?.summary?.totalDocuments || 0} docs</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-[11px] mb-3">
                                    <div className="rounded bg-sky-50 p-2">Pending: {documentInsights?.summary?.pendingDocuments || 0}</div>
                                    <div className="rounded bg-sky-50 p-2">Verified: {documentInsights?.summary?.verifiedDocuments || 0}</div>
                                    <div className="rounded bg-sky-50 p-2">Rejected: {documentInsights?.summary?.rejectedDocuments || 0}</div>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    {documentStatusBreakdown.map((item) => (
                                      <div key={item.label} className="flex items-center justify-between rounded bg-sky-50 px-3 py-2">
                                        <span className="text-gray-700">{item.label}</span>
                                        <span className="font-semibold text-sky-700">{item.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2 mb-1">Top document types</p>
                                  <div className="grid grid-cols-1 gap-2">
                                    {topDocumentTypes.map((doc) => (
                                      <div key={doc.label} className="flex items-center justify-between rounded bg-sky-50 px-3 py-2 text-[11px]">
                                        <span className="text-gray-700 truncate pr-2">{doc.label}</span>
                                        <span className="font-semibold text-sky-700">{doc.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>

                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Internal analytics dataset is temporarily unavailable.</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Official dataset unavailable right now.</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FaLightbulb className="text-purple-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Pending Solutions</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats.pendingSolutions}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("solutions")}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Review Solutions
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FaFileAlt className="text-blue-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Pending Documents</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.pendingDocuments || 0}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("documents")}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verify Documents
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <FaClipboardList className="text-yellow-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Pending Complaints</h3>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("complaints")}
                      className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Process Complaints
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Complaints */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaClipboardList className="text-purple-600" />
                      Recent Complaints
                    </h3>
                    <div className="space-y-3">
                      {complaints.slice(0, 5).map(complaint => (
                        <div key={complaint._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium">{complaint.citizenName}</p>
                            <p className="text-sm text-gray-600">{complaint.department} - {complaint.issueKeyword}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <FaCalendarAlt className="inline mr-1" />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaUsers className="text-green-600" />
                      New Users
                    </h3>
                    <div className="space-y-3">
                      {users.slice(0, 5).map(user => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <FaCalendarAlt className="inline mr-1" />
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Management Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-purple-600" />
                        User Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage citizen accounts, roles, and permissions
                      </p>
                    </div>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-80"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">User</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">NID</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{user.phone}</p>
                            <p className="text-xs text-gray-500">{user.address}</p>
                          </td>
                          <td className="p-4 font-mono text-sm">{user.nid}</td>
                          <td className="p-4">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user._id, e.target.value)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800 border-purple-200' 
                                  : 'bg-blue-100 text-blue-800 border-blue-200'
                              }`}
                            >
                              <option value="citizen">Citizen</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Complaints Management Tab */}
            {activeTab === "complaints" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaClipboardList className="text-purple-600" />
                        Complaint Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Review and process citizen complaints
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left">Complaint #</th>
                        <th className="p-4 text-left">Citizen</th>
                        <th className="p-4 text-left">Department</th>
                        <th className="p-4 text-left">Issue</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Priority</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map(complaint => (
                        <tr key={complaint._id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-mono text-sm">{complaint.complaintNumber}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{complaint.citizenName}</p>
                              <p className="text-xs text-gray-500">{complaint.contactNumber}</p>
                            </div>
                          </td>
                          <td className="p-4">{complaint.department}</td>
                          <td className="p-4">
                            <p className="font-medium">{complaint.issueKeyword}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{complaint.description?.substring(0, 50)}...</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                              complaint.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="p-4 text-sm">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowComplaintModal(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Process Complaint"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents Verification Tab */}
            {activeTab === "documents" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaFileAlt className="text-purple-600" />
                    Document Verification
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Verify citizen uploaded documents
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left">User</th>
                        <th className="p-4 text-left">Document Type</th>
                        <th className="p-4 text-left">File Name</th>
                        <th className="p-4 text-left">Uploaded</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(doc => (
                        <tr key={doc._id} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            <p className="font-medium">{doc.userId?.name}</p>
                            <p className="text-xs text-gray-500">{doc.userId?.email}</p>
                          </td>
                          <td className="p-4 capitalize">{doc.documentType}</td>
                          <td className="p-4 text-sm">{doc.fileName}</td>
                          <td className="p-4 text-sm">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'Verified' ? 'bg-green-100 text-green-800' :
                              doc.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => verifyDocument(doc._id, 'Verified')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Verify"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => verifyDocument(doc._id, 'Rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Solutions Tab */}
            {activeTab === "solutions" && (
              <AdminSolutions />
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && renderReportsTab()}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaCog className="text-purple-600" />
                  System Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resolution Times */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Set Resolution Times</h3>
                    <div className="space-y-3">
                      {['Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management'].map(dept => (
                        <div key={dept} className="flex items-center gap-4">
                          <span className="w-40 text-sm">{dept}</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Days"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                            Set
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Preferences */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">System Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintenance Mode</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-verify Documents</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Complaint Processing Modal */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Process Complaint</h3>
                <button
                  onClick={() => {
                    setShowComplaintModal(false);
                    setSelectedComplaint(null);
                    setAdminComment("");
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Complaint #{selectedComplaint.complaintNumber}</p>
                  <p className="font-medium mt-2">{selectedComplaint.citizenName}</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.department} - {selectedComplaint.issueKeyword}</p>
                  <p className="text-sm mt-2">{selectedComplaint.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    defaultValue=""
                  >
                    <option value="">Select new status</option>
                    <option value="Processing">Mark as Processing</option>
                    <option value="Resolved">Mark as Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Comment
                  </label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Add official comment..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => updateComplaintStatus(selectedComplaint._id, 'Processing')}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => updateComplaintStatus(selectedComplaint._id, 'Resolved')}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Resolved
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