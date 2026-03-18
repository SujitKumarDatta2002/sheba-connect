
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
  FaUpload, FaPaperPlane, FaStar, FaRegStar
} from "react-icons/fa";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    checkAdmin();
    fetchDashboardData();
  }, []);

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

  const fetchDashboardData = async () => {
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
    { id: "settings", name: "System Settings", icon: FaCog, description: "Configure system parameters" }
  ];

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