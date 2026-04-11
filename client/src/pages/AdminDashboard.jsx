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
  FaFilePdf, FaSpinner, FaUserCircle, FaEnvelope, FaPhone,
  FaIdCard, FaMapMarkerAlt, FaChartLine
} from "react-icons/fa";
import AdminSolutions from "../components/AdminSolutions";
import AdminComplaintDetail from "../components/AdminComplaintDetail";

// PDF.co API Key
const PDF_CO_API_KEY = 'muntaka.mubarrat.antorik@g.bracu.ac.bd_7bOKLjoVdjQc8cu8UleHOGAgQWssCk2bsFRUNI9hfk6EirfxdfG6zcWxSwkEM57p';

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
  const [selectedUserForReport, setSelectedUserForReport] = useState(null);
  const [showUserReportModal, setShowUserReportModal] = useState(false);
  const [reportFormat, setReportFormat] = useState("detailed");
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);

  // Helper function to generate PDF using PDF.co API
  const generatePDF = async (html, filename) => {
    try {
      const response = await axios.post(
        'https://api.pdf.co/v1/pdf/convert/from/html',
        {
          name: filename,
          html: html,
          margin: '20px',
          paperSize: 'Letter',
          async: false
        },
        {
          headers: {
            'x-api-key': PDF_CO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data.url;
    } catch (err) {
      console.error('PDF generation error:', err);
      throw err;
    }
  };

  // Generate user-wise report
  const generateUserWiseReport = async (user) => {
    setGenerating(true);
    try {
      const userComplaints = complaints.filter(c => 
        c.userId === user._id || c.userId?._id === user._id || c.email === user.email
      );

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>User Report - ${user.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4f46e5; }
            .user-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
            .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
            .stat-card { flex: 1; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; min-width: 120px; }
            .stat-value { font-size: 28px; font-weight: bold; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
            th { background-color: #f9fafb; font-weight: 600; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShebaConnect</h1>
            <p>Government of Bangladesh • Citizen Grievance Redressal System</p>
          </div>
          <div class="user-info">
            <strong>User Report for:</strong> ${user.name}<br>
            <strong>Email:</strong> ${user.email}<br>
            <strong>Phone:</strong> ${user.phone}<br>
            <strong>NID:</strong> ${user.nid}<br>
            <strong>Address:</strong> ${user.address}<br>
            <strong>Report Generated:</strong> ${new Date().toLocaleString()}
          </div>

          <div class="stats">
            <div class="stat-card"><div class="stat-value">${userComplaints.length}</div><div>Total Complaints</div></div>
            <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Resolved').length}</div><div>Resolved</div></div>
            <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Pending').length}</div><div>Pending</div></div>
          </div>

          <h3>Complaint Details</h3>
          <table>
            <thead>
              <tr>
                <th>Complaint #</th>
                <th>Department</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${userComplaints.map(c => `
                <tr>
                  <td>${c.complaintNumber || c._id.slice(-6)}</td>
                  <td>${c.department}</td>
                  <td>${c.issueKeyword}</td>
                  <td>${c.status}</td>
                  <td>${c.priority}</td>
                  <td>${new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            This report was generated automatically by ShebaConnect. For official use only.
          </div>
        </body>
        </html>
      `;

      const pdfUrl = await generatePDF(html, `user_report_${user.name}_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification(`Report for ${user.name} generated successfully`, 'success');
      
    } catch (err) {
      console.error('Error generating user report:', err);
      showNotification('Failed to generate user report', 'error');
    } finally {
      setGenerating(false);
      setShowUserReportModal(false);
    }
  };
  
  // Generate all users report
  const generateAllUsersReport = async () => {
    setGenerating(true);
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Complete Users Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4f46e5; }
            .summary { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
            th { background-color: #f9fafb; font-weight: 600; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShebaConnect</h1>
            <p>Government of Bangladesh • Citizen Grievance Redressal System</p>
          </div>
          <div class="summary">
            <strong>Complete Users Report</strong><br>
            Total Users: ${users.length}<br>
            Admin Users: ${users.filter(u => u.role === 'admin').length}<br>
            Citizen Users: ${users.filter(u => u.role === 'citizen').length}<br>
            Report Generated: ${new Date().toLocaleString()}
          </div>

          <h3>Users List</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${u.name}</td>
                  <td>${u.email}</td>
                  <td>${u.phone}</td>
                  <td>${u.role}</td>
                  <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            This report was generated automatically by ShebaConnect. For official use only.
          </div>
        </body>
        </html>
      `;

      const pdfUrl = await generatePDF(html, `all_users_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('All users report generated successfully', 'success');
      
    } catch (err) {
      console.error('Error generating all users report:', err);
      showNotification('Failed to generate all users report', 'error');
    } finally {
      setGenerating(false);
    }
  };
  
  // Generate service report
  const handleGenerateServiceReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const servicesRes = await axios.get(
        'http://localhost:5000/api/admin/services',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const services = servicesRes.data;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Service Usage Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
            th { background-color: #f9fafb; font-weight: 600; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShebaConnect</h1>
            <p>Service Usage Report</p>
            <p>Period: ${dateRange.start} to ${dateRange.end}</p>
          </div>

          <h3>Services List</h3>
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Department</th>
                <th>Cost (BDT)</th>
                <th>Processing Time</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${services.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.department}</td>
                  <td>${s.cost}</td>
                  <td>${s.processingTime}</td>
                  <td>${s.urgency}</td>
                  <td>${s.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report
          </div>
        </body>
        </html>
      `;

      const pdfUrl = await generatePDF(html, `service_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('Service report generated successfully', 'success');
      
    } catch (err) {
      console.error('Error generating service report:', err);
      showNotification('Failed to generate service report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Generate user activity report
  const handleGenerateUserActivityReport = async () => {
    setGenerating(true);
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>User Activity Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4f46e5; }
            .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
            .stat-card { flex: 1; background: #f3f4f6; border-radius: 8px; padding: 15px; text-align: center; }
            .stat-value { font-size: 28px; font-weight: bold; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
            th { background-color: #f9fafb; font-weight: 600; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShebaConnect</h1>
            <p>User Activity Report</p>
            <p>Period: ${dateRange.start} to ${dateRange.end}</p>
          </div>

          <div class="stats">
            <div class="stat-card"><div class="stat-value">${users.length}</div><div>Total Users</div></div>
            <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
            <div class="stat-card"><div class="stat-value">${stats.resolutionRate || 0}%</div><div>Resolution Rate</div></div>
          </div>

          <h3>Recent Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${users.slice(0, 20).map(u => `
                <tr>
                  <td>${u.name}</td>
                  <td>${u.email}</td>
                  <td>${u.role}</td>
                  <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report
          </div>
        </body>
        </html>
      `;

      const pdfUrl = await generatePDF(html, `user_activity_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('User activity report generated successfully', 'success');
      
    } catch (err) {
      console.error('Error generating user activity report:', err);
      showNotification('Failed to generate user activity report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Generate combined report
  const handleGenerateCombinedReport = async () => {
    setGenerating(true);
    try {
      const totalResolved = complaints.filter(c => c.status === 'Resolved').length;
      const resolutionRate = complaints.length > 0 ? Math.round((totalResolved / complaints.length) * 100) : 0;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Comprehensive System Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4f46e5; }
            .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
            .stat-value { font-size: 32px; font-weight: bold; color: #4f46e5; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShebaConnect</h1>
            <p>Comprehensive System Report</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="summary">
            <h3>Executive Summary</h3>
            <p>This report provides a comprehensive overview of ShebaConnect's performance, including user statistics, complaint resolution rates, and system activity for the specified period.</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${users.length}</div><div>Total Users</div></div>
            <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
            <div class="stat-card"><div class="stat-value">${resolutionRate}%</div><div>Resolution Rate</div></div>
          </div>

          <h3>Key Performance Indicators (KPIs)</h3>
          <table>
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Total Users</td><td>${users.length}</td></tr>
              <tr><td>Total Complaints</td><td>${complaints.length}</td></tr>
              <tr><td>Pending Complaints</td><td>${stats.pendingComplaints}</td></tr>
              <tr><td>Resolved Complaints</td><td>${stats.resolvedComplaints}</td></tr>
              <tr><td>Resolution Rate</td><td>${resolutionRate}%</td></tr>
              <tr><td>Total Documents</td><td>${stats.totalDocuments}</td></tr>
              <tr><td>Pending Solutions</td><td>${stats.pendingSolutions}</td></tr>
            </tbody>
          </table>

          <div class="footer">
            This report was generated automatically by ShebaConnect. For official use only.
          </div>
        </body>
        </html>
      `;

      const pdfUrl = await generatePDF(html, `comprehensive_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
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
      
      const usersRes = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);

      const complaintsRes = await axios.get("http://localhost:5000/api/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaintsRes.data);

      const docsRes = await axios.get("http://localhost:5000/api/admin/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(docsRes.data);

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
    { id: "settings", name: "System Settings", icon: FaCog, description: "Configure system parameters" },
    { id: "reports", name: "Reports", icon: FaFilePdf, description: "Generate and download reports" }
  ];

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

      {/* User Report Modal */}
      {showUserReportModal && selectedUserForReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Generate User Report</h3>
                <button
                  onClick={() => setShowUserReportModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <FaUserCircle className="text-4xl text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">{selectedUserForReport.name}</p>
                  <p className="text-sm text-gray-600">{selectedUserForReport.email}</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="detailed">Detailed Report</option>
                  <option value="summary">Summary Report</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => generateUserWiseReport(selectedUserForReport)}
                  disabled={generating}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                  Generate Report
                </button>
                <button
                  onClick={() => setShowUserReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Complaint Detail Modal */}
      {showComplaintDetail && selectedComplaintDetail && (
        <AdminComplaintDetail
          complaint={selectedComplaintDetail}
          onClose={() => {
            setShowComplaintDetail(false);
            setSelectedComplaintDetail(null);
          }}
          onUpdate={() => {
            fetchDashboardData();
          }}
          showNotification={showNotification}
        />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {statsCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-${card.color}-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                          <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                          <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                          <p className={`text-xs text-${card.color}-600 mt-1`}>{card.change}</p>
                        </div>
                        <div className={`bg-${card.color}-100 p-3 rounded-lg`}>
                          <card.icon className={`text-${card.color}-600 text-2xl`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="flex gap-3">
                      <button
                        onClick={generateAllUsersReport}
                        disabled={generating}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                        Report All Users
                      </button>
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 w-80"
                        />
                      </div>
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
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.address}</p>
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
                                onClick={() => {
                                  setSelectedUserForReport(user);
                                  setShowUserReportModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Generate Report"
                              >
                                <FaFilePdf />
                              </button>
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
                                setSelectedComplaintDetail(complaint);
                                setShowComplaintDetail(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Full Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowComplaintModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Quick Status Update"
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

            {/* Reports Tab */}
            {activeTab === "reports" && (
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
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
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
                      {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                      Generate Report
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
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
                      onClick={handleGenerateUserActivityReport}
                      disabled={generating}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                      Generate Report
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
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
                      {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Quick Export Options */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaChartLine className="text-purple-600" />
                    Quick Export Options
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Generate reports for specific time periods or export all data for analysis
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setDateRange({
                          start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
                          end: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Last 3 Months
                    </button>
                    <button
                      onClick={() => {
                        setDateRange({
                          start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
                          end: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Last Year
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Status Update Modal */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Quick Status Update</h3>
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
                  <button
                    onClick={() => {
                      setShowComplaintModal(false);
                      setSelectedComplaintDetail(selectedComplaint);
                      setShowComplaintDetail(true);
                    }}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}