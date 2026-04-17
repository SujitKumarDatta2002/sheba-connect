<<<<<<< HEAD
=======

// import API from "../config/api";
// import ServiceManagement from "./admin/ServiceManagement";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUsers, FaClipboardList, FaLightbulb, FaFileAlt,
//   FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
//   FaChartBar, FaCog, FaShieldAlt, FaUserCheck, FaUserTimes,
//   FaCheckDouble, FaHourglassHalf, FaDownload, FaEye,
//   FaTrash, FaEdit, FaSearch, FaFilter, FaChevronDown,
//   FaBan, FaUnlock, FaLock, FaUserCog, FaBuilding,
//   FaCalendarAlt, FaComment, FaCheck, FaTimes, FaPlus,
//   FaUpload, FaPaperPlane, FaStar, FaRegStar,
//   FaFilePdf, FaSpinner, FaUserCircle, FaEnvelope, FaPhone,
//   FaIdCard, FaMapMarkerAlt, FaChartLine, FaBell, FaArrowRight,
//   FaSignOutAlt, FaTachometerAlt, FaCrown, FaUserShield
// } from "react-icons/fa";
// import AdminSolutions from "../components/AdminSolutions";
// import AdminComplaintDetail from "../components/AdminComplaintDetail";

// const PDF_CO_API_KEY = 'muntaka.mubarrat.antorik@g.bracu.ac.bd_7bOKLjoVdjQc8cu8UleHOGAgQWssCk2bsFRUNI9hfk6EirfxdfG6zcWxSwkEM57p';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [stats, setStats] = useState({
//     totalUsers: 0, totalComplaints: 0, pendingComplaints: 0,
//     resolvedComplaints: 0, pendingSolutions: 0, totalDocuments: 0,
//     verifiedDocuments: 0, pendingDocuments: 0
//   });
//   const [users, setUsers] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [showComplaintModal, setShowComplaintModal] = useState(false);
//   const [adminComment, setAdminComment] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [selectedUserForReport, setSelectedUserForReport] = useState(null);
//   const [showUserReportModal, setShowUserReportModal] = useState(false);
//   const [reportFormat, setReportFormat] = useState("detailed");
//   const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
//   const [showComplaintDetail, setShowComplaintDetail] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [surveys, setSurveys] = useState([]);
//   const [surveyStats, setSurveyStats] = useState({
//     totalSurveys: 0, avgSatisfaction: 0, helpfulPercentage: 0, avgResolutionTime: 0
//   });
//   const [selectedSurvey, setSelectedSurvey] = useState(null);
//   const [showSurveyDetail, setShowSurveyDetail] = useState(false);

//   // Get current admin info
//   const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const isAdminUser = currentUser?.role === 'admin';

//   // ─── PDF helpers ────────────────────────────────────────────────────────
//   const generatePDF = async (html, filename) => {
//     const response = await axios.post('https://api.pdf.co/v1/pdf/convert/from/html',
//       { name: filename, html, margin: '20px', paperSize: 'Letter', async: false },
//       { headers: { 'x-api-key': PDF_CO_API_KEY, 'Content-Type': 'application/json' } }
//     );
//     if (response.data.error) throw new Error(response.data.error);
//     return response.data.url;
//   };

//   const generateUserWiseReport = async (user) => {
//     setGenerating(true);
//     try {
//       const userComplaints = complaints.filter(c =>
//         c.userId === user._id || c.userId?._id === user._id || c.email === user.email
//       );
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>User Report - ${user.name}</title>
//         <style>body{font-family:Arial,sans-serif;margin:40px;color:#333;line-height:1.6}
//         .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
//         .header h1{margin:0;color:#1d4ed8}.user-info{background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:30px}
//         .stats{display:flex;gap:20px;margin-bottom:30px;flex-wrap:wrap}
//         .stat-card{flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:15px;text-align:center;min-width:120px}
//         .stat-value{font-size:28px;font-weight:bold;color:#1d4ed8}
//         table{width:100%;border-collapse:collapse;margin-top:20px}
//         th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
//         th{background-color:#f9fafb;font-weight:600}
//         .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>Government of Bangladesh • Citizen Grievance Redressal System</p></div>
//         <div class="user-info"><strong>User Report for:</strong> ${user.name}<br><strong>Email:</strong> ${user.email}<br>
//         <strong>Phone:</strong> ${user.phone}<br><strong>NID:</strong> ${user.nid}<br>
//         <strong>Address:</strong> ${user.address}<br><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
//         <div class="stats">
//           <div class="stat-card"><div class="stat-value">${userComplaints.length}</div><div>Total Complaints</div></div>
//           <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Resolved').length}</div><div>Resolved</div></div>
//           <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Pending').length}</div><div>Pending</div></div>
//         </div>
//         <h3>Complaint Details</h3>
//         <table><thead><tr><th>Complaint #</th><th>Department</th><th>Issue</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
//         <tbody>${userComplaints.map(c => `<tr><td>${c.complaintNumber || c._id.slice(-6)}</td>
//           <td>${c.department}</td><td>${c.issueKeyword}</td>
//           <td>${c.status}</td><td>${c.priority}</td>
//           <td>${new Date(c.createdAt).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>
//         <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
//       </body></html>`;
//       const pdfUrl = await generatePDF(html, `user_report_${user.name}_${Date.now()}.pdf`);
//       window.open(pdfUrl, '_blank');
//       showNotification(`Report for ${user.name} generated successfully`, 'success');
//     } catch (err) {
//       showNotification('Failed to generate user report', 'error');
//     } finally {
//       setGenerating(false);
//       setShowUserReportModal(false);
//     }
//   };

//   const generateAllUsersReport = async () => {
//     setGenerating(true);
//     try {
//       const citizenUsers = users.filter(u => u.role !== 'admin');
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Complete Users Report</title>
//         <style>body{font-family:Arial,sans-serif;margin:40px;color:#333;line-height:1.6}
//         .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
//         .header h1{margin:0;color:#1d4ed8}.summary{background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:30px}
//         table{width:100%;border-collapse:collapse;margin-top:20px}
//         th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
//         th{background-color:#f9fafb;font-weight:600}
//         .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>Government of Bangladesh • Citizen Grievance Redressal System</p></div>
//         <div class="summary"><strong>Complete Users Report</strong><br>Total Citizens: ${citizenUsers.length}<br>
//         Admin Users: ${users.filter(u => u.role === 'admin').length}<br>
//         Report Generated: ${new Date().toLocaleString()}</div>
//         <h3>Citizens List</h3>
//         <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>NID</th><th>Joined</th></tr></thead>
//         <tbody>${citizenUsers.map(u => `<tr><td>${u.name}</td>
//           <td>${u.email}</td><td>${u.phone}</td>
//           <td>${u.nid}</td>
//           <td>${new Date(u.createdAt).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>
//         <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
//       </body></html>`;
//       const pdfUrl = await generatePDF(html, `all_users_report_${Date.now()}.pdf`);
//       window.open(pdfUrl, '_blank');
//       showNotification('All users report generated successfully', 'success');
//     } catch (err) {
//       showNotification('Failed to generate all users report', 'error');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleGenerateServiceReport = async () => {
//     setGenerating(true);
//     try {
//       const token = localStorage.getItem('token');
//       const servicesRes = await axios.get(`${API}/api/admin/services`, { headers: { Authorization: `Bearer ${token}` } });
//       const services = servicesRes.data;
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Service Usage Report</title>
//         <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
//         .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
//         .header h1{margin:0;color:#1d4ed8}
//         table{width:100%;border-collapse:collapse;margin-top:20px}
//         th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
//         th{background-color:#f9fafb;font-weight:600}
//         .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>Service Usage Report</p><p>Period: ${dateRange.start} to ${dateRange.end}</p></div>
//         <table><thead><tr><th>Service Name</th><th>Department</th><th>Cost (BDT)</th><th>Processing Time</th><th>Urgency</th><th>Status</th></tr></thead>
//         <tbody>${services.map(s => `<tr><td>${s.name}</td>
//           <td>${s.department}</td>
//           <td>${s.cost}</td>
//           <td>${s.processingTime}</td>
//           <td>${s.urgency}</td>
//           <td>${s.isActive ? 'Active' : 'Inactive'}</td></tr>`).join('')}</tbody></table>
//         <div class="footer">Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report</div>
//       </body></html>`;
//       const pdfUrl = await generatePDF(html, `service_report_${Date.now()}.pdf`);
//       window.open(pdfUrl, '_blank');
//       showNotification('Service report generated successfully', 'success');
//     } catch (err) {
//       showNotification('Failed to generate service report', 'error');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleGenerateUserActivityReport = async () => {
//     setGenerating(true);
//     try {
//       const citizenUsers = users.filter(u => u.role !== 'admin');
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>User Activity Report</title>
//         <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
//         .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
//         .header h1{margin:0;color:#1d4ed8}.stats{display:flex;gap:20px;margin-bottom:30px;flex-wrap:wrap}
//         .stat-card{flex:1;background:#f3f4f6;border-radius:8px;padding:15px;text-align:center}
//         .stat-value{font-size:28px;font-weight:bold;color:#1d4ed8}
//         table{width:100%;border-collapse:collapse;margin-top:20px}
//         th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
//         th{background-color:#f9fafb;font-weight:600}
//         .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>User Activity Report</p><p>Period: ${dateRange.start} to ${dateRange.end}</p></div>
//         <div class="stats">
//           <div class="stat-card"><div class="stat-value">${citizenUsers.length}</div><div>Total Citizens</div></div>
//           <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
//           <div class="stat-card"><div class="stat-value">${stats.resolutionRate || 0}%</div><div>Resolution Rate</div></div>
//         </div>
//         <h3>Recent Citizens</h3>
//         <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
//         <tbody>${citizenUsers.slice(0, 20).map(u => `<tr><td>${u.name}</td>
//           <td>${u.email}</td>
//           <td>${u.phone}</td>
//           <td>${new Date(u.createdAt).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>
//         <div class="footer">Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report</div>
//       </body></html>`;
//       const pdfUrl = await generatePDF(html, `user_activity_report_${Date.now()}.pdf`);
//       window.open(pdfUrl, '_blank');
//       showNotification('User activity report generated successfully', 'success');
//     } catch (err) {
//       showNotification('Failed to generate user activity report', 'error');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleGenerateCombinedReport = async () => {
//     setGenerating(true);
//     try {
//       const citizenUsers = users.filter(u => u.role !== 'admin');
//       const totalResolved = complaints.filter(c => c.status === 'Resolved').length;
//       const resolutionRate = complaints.length > 0 ? Math.round((totalResolved / complaints.length) * 100) : 0;
//       const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Comprehensive System Report</title>
//         <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
//         .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
//         .header h1{margin:0;color:#1d4ed8}.summary{background:#f3f4f6;padding:20px;border-radius:8px;margin-bottom:30px}
//         .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:30px}
//         .stat-card{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:15px;text-align:center}
//         .stat-value{font-size:32px;font-weight:bold;color:#1d4ed8}
//         table{width:100%;border-collapse:collapse}th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
//         th{background-color:#f9fafb;font-weight:600}
//         .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>Comprehensive System Report</p><p>Generated on ${new Date().toLocaleString()}</p></div>
//         <div class="summary"><h3>Executive Summary</h3><p>This report provides a comprehensive overview of ShebaConnect's performance.</p></div>
//         <div class="stats-grid">
//           <div class="stat-card"><div class="stat-value">${citizenUsers.length}</div><div>Total Citizens</div></div>
//           <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
//           <div class="stat-card"><div class="stat-value">${resolutionRate}%</div><div>Resolution Rate</div></div>
//         </div>
//         <h3>Key Performance Indicators</h3>
//         <table><thead><tr><th>Metric</th><th>Value</th></tr></thead>
//         <tbody>
//           <tr><td>Total Citizens</td><td>${citizenUsers.length}</td></tr>
//           <tr><td>Total Complaints</td><td>${complaints.length}</td></tr>
//           <tr><td>Pending Complaints</td><td>${stats.pendingComplaints}</td></tr>
//           <tr><td>Resolved Complaints</td><td>${stats.resolvedComplaints}</td></tr>
//           <tr><td>Resolution Rate</td><td>${resolutionRate}%</td></tr>
//           <tr><td>Total Documents</td><td>${stats.totalDocuments}</td></tr>
//           <tr><td>Pending Solutions</td><td>${stats.pendingSolutions}</td></tr>
//         </tbody></table>
//         <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
//       </body></html>`;
//       const pdfUrl = await generatePDF(html, `comprehensive_report_${Date.now()}.pdf`);
//       window.open(pdfUrl, '_blank');
//       showNotification('Comprehensive report generated successfully', 'success');
//     } catch (err) {
//       showNotification('Failed to generate combined report', 'error');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   useEffect(() => {
//     checkAdmin();
//     fetchDashboardData();
//   }, []);

//   const checkAdmin = () => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (user.role !== 'admin') {
//       navigate('/');
//     }
//   };

//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const [usersRes, complaintsRes, docsRes, statsRes] = await Promise.all([
//         axios.get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API}/api/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API}/api/admin/documents`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);
//       setUsers(usersRes.data);
//       setComplaints(complaintsRes.data);
//       setDocuments(docsRes.data);
//       setStats(statsRes.data);
//     } catch (err) {
//       showNotification("Failed to load dashboard data", "error");
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const [surveysRes, surveyStatsRes] = await Promise.all([
//         axios.get(`${API}/api/admin/surveys`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API}/api/admin/surveys/stats/overview`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);
//       setSurveys(surveysRes.data || []);
//       setSurveyStats(surveyStatsRes.data);
//     } catch {
//       setSurveys([]);
//       setSurveyStats({ totalSurveys: 0, avgSatisfaction: 0, helpfulPercentage: 0, avgResolutionTime: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Only allow role updates for citizen users (not admins)
//   const updateUserRole = async (userId, newRole) => {
//     const targetUser = users.find(u => u._id === userId);
//     if (targetUser?.role === 'admin') {
//       showNotification("Admin roles cannot be modified", "error");
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API}/api/admin/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
//       showNotification(`User role updated to ${newRole}`, "success");
//       fetchDashboardData();
//     } catch { showNotification("Failed to update user role", "error"); }
//   };

//   // Only allow deletion of citizen users (not admins)
//   const deleteUser = async (userId) => {
//     const targetUser = users.find(u => u._id === userId);
//     if (targetUser?.role === 'admin') {
//       showNotification("Admin accounts cannot be deleted", "error");
//       return;
//     }
//     if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API}/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
//       showNotification("User deleted successfully", "success");
//       fetchDashboardData();
//     } catch { showNotification("Failed to delete user", "error"); }
//   };

//   const updateComplaintStatus = async (complaintId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API}/api/admin/complaints/${complaintId}/status`,
//         { status: newStatus, comment: adminComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification(`Complaint status updated to ${newStatus}`, "success");
//       setAdminComment(""); setSelectedComplaint(null); setShowComplaintModal(false);
//       fetchDashboardData();
//     } catch { showNotification("Failed to update complaint", "error"); }
//   };

//   const verifyDocument = async (docId, status) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${API}/api/admin/documents/${docId}/verify`, { status }, { headers: { Authorization: `Bearer ${token}` } });
//       showNotification(`Document ${status.toLowerCase()}`, "success");
//       fetchDashboardData();
//     } catch { showNotification("Failed to verify document", "error"); }
//   };

//   // Filter only citizen users for display (admins shown separately or not at all in user management)
//   const citizenUsers = users.filter(u => u.role !== 'admin');
  
//   const filteredUsers = citizenUsers.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.phone.includes(searchTerm)
//   );

//   const filteredComplaints = complaints.filter(c => {
//     if (statusFilter !== "all" && c.status !== statusFilter) return false;
//     if (dateRange.start && new Date(c.createdAt) < new Date(dateRange.start)) return false;
//     if (dateRange.end && new Date(c.createdAt) > new Date(dateRange.end)) return false;
//     return true;
//   });

//   // ─── Nav items ────────────────────────────────────────────────────────────
//   const navItems = [
//     { id: "overview",   label: "Overview",              icon: FaTachometerAlt },
//     { id: "users",      label: "Citizen Management",    icon: FaUsers },
//     { id: "complaints", label: "Complaints",            icon: FaClipboardList },
//     { id: "solutions",  label: "Solution Review",       icon: FaLightbulb },
//     { id: "documents",  label: "Document Verification", icon: FaFileAlt },
//     { id: "surveys",    label: "Surveys",               icon: FaStar },
//     { id: "services",   label: "Service Management",       icon: FaCog },

//     { id: "reports",    label: "Reports",               icon: FaFilePdf },
//     { id: "settings",   label: "System Settings",       icon: FaCog },

//     //services
//   ];

//   // ─── Stat cards ───────────────────────────────────────────────────────────
//   const statCards = [
//     { label: "Total Citizens",    value: citizenUsers.length,    icon: FaUsers,        accent: "#2563eb", light: "#eff6ff", sub: "Registered citizens" },
//     { label: "Total Complaints",  value: stats.totalComplaints,  icon: FaClipboardList,accent: "#7c3aed", light: "#f5f3ff", sub: `${stats.pendingComplaints} pending` },
//     { label: "Resolved",          value: stats.resolvedComplaints||0, icon: FaCheckCircle, accent: "#059669", light: "#ecfdf5", sub: "Complaints closed" },
//     { label: "Pending Solutions", value: stats.pendingSolutions, icon: FaLightbulb,    accent: "#d97706", light: "#fffbeb", sub: "Awaiting review" },
//     { label: "Total Documents",   value: stats.totalDocuments,   icon: FaFileAlt,      accent: "#0891b2", light: "#ecfeff", sub: `${stats.pendingDocuments||0} pending` },
//     { label: "Verified Docs",     value: stats.verifiedDocuments||0, icon: FaCheckDouble, accent: "#16a34a", light: "#f0fdf4", sub: "Approved documents" },
//   ];

//   const statusColor = (s) => ({
//     Resolved:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
//     Pending:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
//     Processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
//   }[s] || "bg-gray-100 text-gray-600");

//   const priorityColor = (p) => ({
//     high:   "bg-red-50 text-red-700 ring-1 ring-red-200",
//     medium: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
//     low:    "bg-green-50 text-green-700 ring-1 ring-green-200",
//   }[p] || "bg-gray-100 text-gray-600");

//   // ─── Loading screen ───────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//         <p className="text-slate-500 text-sm font-medium tracking-wide">Loading dashboard…</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
//         .sc-sidebar { width: 260px; transition: width 0.25s ease; }
//         .sc-sidebar.collapsed { width: 72px; }
//         .sc-sidebar.collapsed .sc-label { display: none; }
//         .sc-sidebar.collapsed .sc-brand-text { display: none; }
//         .sc-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 10px;
//           cursor: pointer; transition: all 0.15s; color: #94a3b8; font-size: 0.875rem; font-weight: 500; }
//         .sc-nav-item:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
//         .sc-nav-item.active { background: rgba(59,130,246,0.18); color: #93c5fd; }
//         .sc-nav-item.active .sc-nav-icon { color: #60a5fa; }
//         .sc-nav-icon { font-size: 1rem; flex-shrink: 0; }
//         .sc-stat-card { background: #fff; border-radius: 14px; padding: 22px 24px;
//           border: 1px solid #f1f5f9; transition: box-shadow 0.2s, transform 0.2s; }
//         .sc-stat-card:hover { box-shadow: 0 8px 24px rgba(15,23,42,0.08); transform: translateY(-2px); }
//         .sc-table th { font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
//           letter-spacing: 0.05em; color: #64748b; padding: 12px 16px; background: #f8fafc;
//           border-bottom: 1px solid #e2e8f0; }
//         .sc-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; color: #334155; }
//         .sc-table tr:hover td { background: #f8fafc; }
//         .sc-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px;
//           font-size: 0.72rem; font-weight: 600; }
//         .sc-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px;
//           background: #2563eb; color: #fff; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
//           border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; }
//         .sc-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
//         .sc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
//         .sc-btn-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
//           background: transparent; color: #64748b; border-radius: 8px; font-size: 0.825rem; font-weight: 500;
//           border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.15s; }
//         .sc-btn-ghost:hover { background: #f1f5f9; color: #334155; }
//         .sc-input { width: 100%; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 9px;
//           font-size: 0.875rem; color: #334155; outline: none; transition: border 0.15s; background: #fff; }
//         .sc-input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.25); }
//         .sc-card { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; }
//         .sc-card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
//         .sc-section-title { font-size: 1rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
//         @keyframes scSlideDown { from { opacity:0; transform: translateY(-12px); } to { opacity:1; transform:translateY(0); } }
//         .sc-notif { animation: scSlideDown 0.25s ease; }
//       `}</style>

//       {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
//       <aside className={`sc-sidebar ${sidebarOpen ? '' : 'collapsed'} bg-slate-900 flex flex-col min-h-screen sticky top-0 flex-shrink-0`}>
//         {/* Brand */}
//         <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
//           <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
//             <FaShieldAlt className="text-white text-sm" />
//           </div>
//           <div className="sc-brand-text">
//             <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>ShebaConnect</p>
//             <p className="text-slate-400 text-xs mt-0.5">Admin Portal</p>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {navItems.map(item => (
//             <div key={item.id}
//               className={`sc-nav-item ${activeTab === item.id ? 'active' : ''}`}
//               onClick={() => setActiveTab(item.id)}
//               title={item.label}
//             >
//               <item.icon className="sc-nav-icon" />
//               <span className="sc-label">{item.label}</span>
//             </div>
//           ))}
//         </nav>

//         {/* Bottom */}
//         <div className="px-3 pb-5 border-t border-slate-800 pt-4 space-y-1">
//           <div className="sc-nav-item" onClick={() => navigate('/')} title="Back to Home">
//             <FaSignOutAlt className="sc-nav-icon" />
//             <span className="sc-label">Back to Home</span>
//           </div>
//         </div>
//       </aside>

//       {/* ── MAIN ─────────────────────────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* Top Bar */}
//         <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(v => !v)}
//               className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
//             >
//               <FaFilter size={13} />
//             </button>
//             <div>
//               <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
//                 {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
//               </h1>
//               <p className="text-xs text-slate-400 mt-0.5">ShebaConnect — Government of Bangladesh</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
//                 <FaCrown className="text-white text-xs" />
//               </div>
//               <div className="hidden sm:block">
//                 <p className="text-xs font-semibold text-slate-800">{currentUser.name || 'Administrator'}</p>
//                 <p className="text-[10px] text-slate-400 flex items-center gap-1"><FaUserShield size={8} /> System Admin</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Notification Toast */}
//         {notification.show && (
//           <div className={`sc-notif fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold
//             ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
//             {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
//             {notification.message}
//           </div>
//         )}

//         {/* Modals */}
//         {showUserReportModal && selectedUserForReport && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//               <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
//                 <h3 className="font-bold text-slate-900">Generate Citizen Report</h3>
//                 <button onClick={() => setShowUserReportModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
//                   <FaTimes size={12} />
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
//                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                     <FaUserCircle className="text-blue-600 text-xl" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-slate-800">{selectedUserForReport.name}</p>
//                     <p className="text-sm text-slate-500">{selectedUserForReport.email}</p>
//                   </div>
//                 </div>
//                 <div className="mb-5">
//                   <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Report Format</label>
//                   <select value={reportFormat} onChange={e => setReportFormat(e.target.value)} className="sc-input">
//                     <option value="detailed">Detailed Report</option>
//                     <option value="summary">Summary Report</option>
//                   </select>
//                 </div>
//                 <div className="flex gap-3">
//                   <button onClick={() => generateUserWiseReport(selectedUserForReport)} disabled={generating} className="sc-btn-primary flex-1">
//                     {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />} Generate
//                   </button>
//                   <button onClick={() => setShowUserReportModal(false)} className="sc-btn-ghost flex-1">Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showComplaintDetail && selectedComplaintDetail && (
//           <AdminComplaintDetail
//             complaint={selectedComplaintDetail}
//             onClose={() => { setShowComplaintDetail(false); setSelectedComplaintDetail(null); }}
//             onUpdate={fetchDashboardData}
//             showNotification={showNotification}
//           />
//         )}

//         {/* ── CONTENT ──────────────────────────────────────────────────── */}
//         <main className="flex-1 p-6 space-y-6">

//           {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//           {activeTab === "overview" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//                 {statCards.map((c, i) => (
//                   <div key={i} className="sc-stat-card">
//                     <div className="flex items-center justify-between mb-3">
//                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{c.label}</p>
//                       <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.light }}>
//                         <c.icon style={{ color: c.accent, fontSize: '0.875rem' }} />
//                       </div>
//                     </div>
//                     <p className="text-2xl font-bold text-slate-900">{c.value}</p>
//                     <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {[
//                   { label: "Pending Complaints", value: stats.pendingComplaints, icon: FaClock, color: "#f59e0b", bg: "#fffbeb", tab: "complaints", btn: "Process Now" },
//                   { label: "Solutions to Review", value: stats.pendingSolutions, icon: FaLightbulb, color: "#8b5cf6", bg: "#f5f3ff", tab: "solutions", btn: "Review Solutions" },
//                   { label: "Documents Pending", value: stats.pendingDocuments||0, icon: FaFileAlt, color: "#0891b2", bg: "#ecfeff", tab: "documents", btn: "Verify Documents" },
//                 ].map((q, i) => (
//                   <div key={i} className="sc-card p-5 flex items-center justify-between gap-4">
//                     <div>
//                       <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: q.bg }}>
//                         <q.icon style={{ color: q.color }} />
//                       </div>
//                       <p className="text-xs text-slate-500 font-medium">{q.label}</p>
//                       <p className="text-3xl font-bold text-slate-900">{q.value}</p>
//                     </div>
//                     <button onClick={() => setActiveTab(q.tab)} className="sc-btn-ghost text-xs whitespace-nowrap">
//                       {q.btn} <FaArrowRight size={10} />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="sc-card">
//                   <div className="sc-card-header">
//                     <span className="sc-section-title"><FaClipboardList className="text-blue-500" /> Recent Complaints</span>
//                     <button onClick={() => setActiveTab("complaints")} className="sc-btn-ghost text-xs">View All <FaArrowRight size={10} /></button>
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {complaints.slice(0, 5).map(c => (
//                       <div key={c._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition">
//                         <div className="flex-1 min-w-0">
//                           <p className="font-semibold text-slate-800 text-sm truncate">{c.citizenName}</p>
//                           <p className="text-xs text-slate-400 truncate">{c.department} · {c.issueKeyword}</p>
//                         </div>
//                         <span className={`sc-badge ${statusColor(c.status)}`}>{c.status}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="sc-card">
//                   <div className="sc-card-header">
//                     <span className="sc-section-title"><FaUsers className="text-emerald-500" /> New Citizens</span>
//                     <button onClick={() => setActiveTab("users")} className="sc-btn-ghost text-xs">View All <FaArrowRight size={10} /></button>
//                   </div>
//                   <div className="divide-y divide-slate-50">
//                     {citizenUsers.slice(0, 5).map(u => (
//                       <div key={u._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition">
//                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
//                           {u.name?.[0]?.toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
//                           <p className="text-xs text-slate-400 truncate">{u.email}</p>
//                         </div>
//                         <span className="sc-badge bg-green-50 text-green-700 ring-1 ring-green-200">Citizen</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── USERS (CITIZENS ONLY) ────────────────────────────────────── */}
//           {activeTab === "users" && (
//             <div className="sc-card">
//               <div className="sc-card-header">
//                 <span className="sc-section-title"><FaUsers className="text-blue-500" /> Citizen Management</span>
//                 <div className="flex items-center gap-3">
//                   <button onClick={generateAllUsersReport} disabled={generating} className="sc-btn-ghost text-xs">
//                     {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />} Export All
//                   </button>
//                   <div className="relative">
//                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//                     <input
//                       type="text" placeholder="Search citizens…" value={searchTerm}
//                       onChange={e => setSearchTerm(e.target.value)}
//                       className="sc-input pl-8 w-64 text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full sc-table">
//                   <thead>
//                     <tr>
//                       <th className="text-left">Citizen</th>
//                       <th className="text-left">Contact</th>
//                       <th className="text-left">NID</th>
//                       <th className="text-left">Role</th>
//                       <th className="text-left">Joined</th>
//                       <th className="text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map(user => (
//                       <tr key={user._id}>
//                         <td>
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
//                               {user.name?.[0]?.toUpperCase()}
//                             </div>
//                             <div>
//                               <p className="font-semibold text-slate-800">{user.name}</p>
//                               <p className="text-xs text-slate-400">{user.email}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <p className="text-sm">{user.phone}</p>
//                           <p className="text-xs text-slate-400 truncate max-w-[180px]">{user.address}</p>
//                         </td>
//                         <td className="font-mono text-xs text-slate-600">{user.nid}</td>
//                         <td>
//                           <span className="sc-badge bg-green-50 text-green-700 ring-1 ring-green-200">Citizen</span>
//                         </td>
//                         <td className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
//                         <td>
//                           <div className="flex items-center gap-1">
//                             <button
//                               onClick={() => { setSelectedUserForReport(user); setShowUserReportModal(true); }}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition"
//                               title="Generate Report"
//                             ><FaFilePdf size={13} /></button>
//                             <button
//                               onClick={() => deleteUser(user._id)}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
//                               title="Delete User"
//                             ><FaTrash size={12} /></button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ── COMPLAINTS ───────────────────────────────────────────── */}
//           {activeTab === "complaints" && (
//             <div className="sc-card">
//               <div className="sc-card-header">
//                 <span className="sc-section-title"><FaClipboardList className="text-blue-500" /> Complaint Management</span>
//                 <div className="flex items-center gap-3">
//                   <select
//                     value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                     className="sc-input w-auto text-sm"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Resolved">Resolved</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full sc-table">
//                   <thead>
//                     <tr>
//                       <th>Complaint #</th>
//                       <th>Citizen</th>
//                       <th>Department</th>
//                       <th>Issue</th>
//                       <th>Status</th>
//                       <th>Priority</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredComplaints.map(c => (
//                       <tr key={c._id}>
//                         <td className="font-mono text-xs text-slate-600">{c.complaintNumber}</td>
//                         <td>
//                           <p className="font-medium text-slate-800">{c.citizenName}</p>
//                           <p className="text-xs text-slate-400">{c.contactNumber}</p>
//                         </td>
//                         <td className="text-sm">{c.department}</td>
//                         <td>
//                           <p className="font-medium text-sm text-slate-800">{c.issueKeyword}</p>
//                           <p className="text-xs text-slate-400 truncate max-w-[200px]">{c.description?.substring(0, 45)}…</p>
//                           {c.editHistory?.some(e => !e.reviewedByAdmin) && (
//                             <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 ring-1 ring-orange-200 rounded px-1.5 py-0.5 mt-1">
//                               ✏ Edits
//                             </span>
//                           )}
//                         </td>
//                         <td><span className={`sc-badge ${statusColor(c.status)}`}>{c.status}</span></td>
//                         <td><span className={`sc-badge ${priorityColor(c.priority)}`}>{c.priority}</span></td>
//                         <td className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
//                         <td>
//                           <div className="flex items-center gap-1">
//                             <button
//                               onClick={() => { setSelectedComplaintDetail(c); setShowComplaintDetail(true); }}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition"
//                               title="View Details"
//                             ><FaEye size={13} /></button>
//                             <button
//                               onClick={() => { setSelectedComplaint(c); setShowComplaintModal(true); }}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-violet-500 hover:bg-violet-50 transition"
//                               title="Quick Update"
//                             ><FaEdit size={12} /></button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ── DOCUMENTS ────────────────────────────────────────────── */}
//           {activeTab === "documents" && (
//             <div className="sc-card">
//               <div className="sc-card-header">
//                 <span className="sc-section-title"><FaFileAlt className="text-cyan-500" /> Document Verification</span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full sc-table">
//                   <thead>
//                     <tr>
//                       <th>Document</th>
//                       <th>Owner</th>
//                       <th>Type</th>
//                       <th>Status</th>
//                       <th>Uploaded</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {documents.map(doc => (
//                       <tr key={doc._id}>
//                         <td>
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
//                               <FaFileAlt className="text-cyan-500 text-xs" />
//                             </div>
//                             <span className="font-medium text-sm text-slate-800">{doc.filename}</span>
//                           </div>
//                         </td>
//                         <td>
//                           <p className="text-sm font-medium text-slate-800">{doc.userId?.name}</p>
//                           <p className="text-xs text-slate-400">{doc.userId?.email}</p>
//                         </td>
//                         <td className="text-sm">{doc.documentType}</td>
//                         <td>
//                           <span className={`sc-badge ${
//                             doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
//                             doc.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
//                             'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
//                           }`}>{doc.status}</span>
//                         </td>
//                         <td className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
//                         <td>
//                           <div className="flex items-center gap-1">
//                             <button
//                               onClick={() => window.open(doc.fileUrl, '_blank')}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition"
//                               title="View Document"
//                             ><FaEye size={13} /></button>
//                             <button
//                               onClick={() => verifyDocument(doc._id, 'Verified')}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition"
//                               title="Verify"
//                             ><FaCheck size={12} /></button>
//                             <button
//                               onClick={() => verifyDocument(doc._id, 'Rejected')}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
//                               title="Reject"
//                             ><FaTimes size={12} /></button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ── SOLUTIONS ────────────────────────────────────────────── */}
//           {activeTab === "solutions" && <AdminSolutions />}

//           {/* ── SURVEYS WITH COMPLETE DETAILS ───────────────────────────────── */}
//           {activeTab === "surveys" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 {[
//                   { label: "Total Surveys", value: surveyStats.totalSurveys, icon: FaStar, accent: "#2563eb", bg: "#eff6ff" },
//                   { label: "Avg Satisfaction", value: `${surveyStats.avgSatisfaction.toFixed(1)} / 5`, icon: FaStar, accent: "#d97706", bg: "#fffbeb" },
//                   { label: "Helpful Rate", value: `${surveyStats.helpfulPercentage}%`, icon: FaCheckCircle, accent: "#059669", bg: "#ecfdf5" },
//                   { label: "Avg Resolution", value: `${surveyStats.avgResolutionTime.toFixed(0)} days`, icon: FaClock, accent: "#7c3aed", bg: "#f5f3ff" },
//                 ].map((s, i) => (
//                   <div key={i} className="sc-stat-card">
//                     <div className="flex items-center justify-between mb-3">
//                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
//                       <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
//                         <s.icon style={{ color: s.accent, fontSize: '0.875rem' }} />
//                       </div>
//                     </div>
//                     <p className="text-2xl font-bold text-slate-900">{s.value}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="sc-card">
//                 <div className="sc-card-header">
//                   <span className="sc-section-title"><FaStar className="text-amber-400" /> Survey Submissions</span>
//                 </div>
//                 {surveys.length === 0 ? (
//                   <div className="py-16 text-center text-slate-400">
//                     <FaStar className="text-4xl mx-auto mb-3 text-slate-200" />
//                     <p className="text-sm">No surveys submitted yet</p>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full sc-table">
//                       <thead>
//                         <tr>
//                           <th>Citizen</th>
//                           <th>Department</th>
//                           <th>Issue</th>
//                           <th>Satisfaction</th>
//                           <th>Helpful</th>
//                           <th>Resolution</th>
//                           <th>Date</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {surveys.map(sv => (
//                           <tr key={sv._id}>
//                             <td>
//                               <p className="font-medium text-slate-800 text-sm">{sv.userId?.name || 'Unknown'}</p>
//                               <p className="text-xs text-slate-400">{sv.userId?.email}</p>
//                             </td>
//                             <td className="text-sm">{sv.department}</td>
//                             <td className="text-sm">{sv.issueKeyword}</td>
//                             <td>
//                               <div className="flex items-center gap-0.5">
//                                 {[...Array(5)].map((_, i) => (
//                                   <FaStar key={i} size={11} className={i < sv.satisfaction ? "text-amber-400" : "text-slate-200"} />
//                                 ))}
//                                 <span className="ml-1.5 text-xs font-bold text-slate-600">{sv.satisfaction}</span>
//                               </div>
//                             </td>
//                             <td>
//                               <span className={`sc-badge ${sv.helpful ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'}`}>
//                                 {sv.helpful ? 'Yes' : 'No'}
//                               </span>
//                             </td>
//                             <td className="text-xs text-slate-600">{sv.resolutionTime} days</td>
//                             <td className="text-xs text-slate-500">{new Date(sv.createdAt).toLocaleDateString()}</td>
//                             <td>
//                               <button onClick={() => { setSelectedSurvey(sv); setShowSurveyDetail(true); }}
//                                 className="sc-btn-ghost text-xs py-1.5 px-3">
//                                 <FaEye size={11} /> View Details
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               {/* Complete Survey Detail Modal - Enhanced Version */}
//               {showSurveyDetail && selectedSurvey && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//                     <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between z-10">
//                       <h3 className="text-xl font-bold flex items-center gap-2">
//                         <FaStar className="text-yellow-300" /> Survey Details
//                       </h3>
//                       <button onClick={() => setShowSurveyDetail(false)} className="p-2 hover:bg-white/20 rounded-full transition">
//                         <FaTimes size={18} />
//                       </button>
//                     </div>
                    
//                     <div className="p-6 space-y-6">
//                       {/* Citizen Information */}
//                       <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
//                         <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
//                           <FaUserCircle className="text-blue-600 text-xl" /> Citizen Information
//                         </h4>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-xs text-gray-500">Full Name</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.userId?.name || 'N/A'}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Email Address</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.userId?.email || 'N/A'}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Phone Number</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.userId?.phone || 'N/A'}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">NID Number</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.userId?.nid || 'N/A'}</p>
//                           </div>
//                           <div className="col-span-2">
//                             <p className="text-xs text-gray-500">Address</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.userId?.address || 'N/A'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Complaint Information */}
//                       <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
//                         <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
//                           <FaClipboardList className="text-amber-600" /> Complaint Information
//                         </h4>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-xs text-gray-500">Complaint Number</p>
//                             <p className="font-semibold text-gray-800 font-mono">{selectedSurvey.complaintId?.complaintNumber || 'N/A'}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Department</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.department}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Issue Keyword</p>
//                             <p className="font-semibold text-gray-800">{selectedSurvey.issueKeyword}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Priority Level</p>
//                             <p className="font-semibold text-gray-800 capitalize">{selectedSurvey.priority || 'N/A'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Satisfaction Rating */}
//                       <div className="bg-green-50 rounded-xl p-5 border border-green-200">
//                         <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
//                           <FaStar className="text-green-600" /> Satisfaction Rating
//                         </h4>
//                         <div className="space-y-3">
//                           <div className="flex items-center gap-4 flex-wrap">
//                             <div className="flex items-center gap-2">
//                               <span className="text-gray-600">Overall Rating:</span>
//                               <div className="flex gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                   <FaStar key={i} className={i < selectedSurvey.satisfaction ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"} />
//                                 ))}
//                               </div>
//                               <span className="font-bold text-lg ml-2">{selectedSurvey.satisfaction} / 5</span>
//                             </div>
//                           </div>
//                           <div>
//                             <p className="text-gray-600 mb-1">Was the solution helpful?</p>
//                             <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${
//                               selectedSurvey.helpful
//                                 ? 'bg-green-200 text-green-800'
//                                 : 'bg-red-200 text-red-800'
//                             }`}>
//                               {selectedSurvey.helpful ? '✓ Yes, very helpful' : '✗ No, not helpful'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Feedback and Solution */}
//                       <div className="space-y-4">
//                         <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
//                           <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
//                             <FaComment className="text-purple-600" /> Citizen Feedback
//                           </h4>
//                           <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
//                             {selectedSurvey.feedback || 'No feedback provided'}
//                           </div>
//                         </div>

//                         <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
//                           <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
//                             <FaLightbulb className="text-indigo-600" /> Solution Provided
//                           </h4>
//                           <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
//                             {selectedSurvey.solution || 'No solution provided'}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Resolution Timeline */}
//                       <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
//                         <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
//                           <FaCalendarAlt className="text-rose-600" /> Resolution Timeline
//                         </h4>
//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="text-center">
//                             <p className="text-xs text-gray-500">Issue Date</p>
//                             <p className="font-bold text-rose-800">{new Date(selectedSurvey.issueDate).toLocaleDateString()}</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xs text-gray-500">Resolved Date</p>
//                             <p className="font-bold text-rose-800">{new Date(selectedSurvey.resolveDate).toLocaleDateString()}</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xs text-gray-500">Resolution Time</p>
//                             <p className="font-bold text-emerald-700 text-lg">{selectedSurvey.resolutionTime} days</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Survey Metadata */}
//                       <div className="text-center pt-4 border-t border-gray-100">
//                         <p className="text-xs text-gray-400">
//                           Survey submitted on {new Date(selectedSurvey.createdAt).toLocaleString()}
//                         </p>
//                         {selectedSurvey.updatedAt && selectedSurvey.updatedAt !== selectedSurvey.createdAt && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             Last updated on {new Date(selectedSurvey.updatedAt).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
//                       <button onClick={() => setShowSurveyDetail(false)} className="sc-btn-primary">
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
// {/* Services Tab */}
//         {activeTab === "services" && <ServiceManagement />}
//           {/* ── SETTINGS ─────────────────────────────────────────────── */}
//           {activeTab === "settings" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="sc-card p-6">
//                 <h3 className="sc-section-title mb-5"><FaClock className="text-blue-500" /> Resolution Time Targets</h3>
//                 <div className="space-y-3">
//                   {['Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management'].map(dept => (
//                     <div key={dept} className="flex items-center gap-3">
//                       <span className="text-sm text-slate-600 w-40 flex-shrink-0">{dept}</span>
//                       <input type="number" min="1" placeholder="Days" className="sc-input text-sm" />
//                       <button className="sc-btn-primary text-xs py-2 px-3">Set</button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="sc-card p-6">
//                 <h3 className="sc-section-title mb-5"><FaCog className="text-slate-500" /> System Preferences</h3>
//                 <div className="space-y-4">
//                   {[
//                     { label: "Maintenance Mode", desc: "Temporarily disable public access" },
//                     { label: "Auto-verify Documents", desc: "Automatically approve uploaded documents" },
//                   ].map(item => (
//                     <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
//                       <div>
//                         <p className="text-sm font-medium text-slate-800">{item.label}</p>
//                         <p className="text-xs text-slate-400">{item.desc}</p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input type="checkbox" className="sr-only peer" />
//                         <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer
//                           peer-checked:after:translate-x-full peer-checked:after:border-white
//                           after:content-[''] after:absolute after:top-0.5 after:left-0.5
//                           after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all
//                           peer-checked:bg-blue-500" />
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── REPORTS ──────────────────────────────────────────────── */}
//           {activeTab === "reports" && (
//             <div className="space-y-6">
//               <div className="sc-card p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="sc-section-title"><FaCalendarAlt className="text-blue-500" /> Report Period</h3>
//                   <button onClick={() => setShowDatePicker(v => !v)} className="sc-btn-ghost text-xs">
//                     {showDatePicker ? 'Hide' : 'Select Date Range'}
//                   </button>
//                 </div>
//                 {showDatePicker && (
//                   <div className="grid grid-cols-2 gap-4 mt-2">
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Start Date</label>
//                       <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="sc-input text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">End Date</label>
//                       <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="sc-input text-sm" />
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {[
//                     { label: "Last 7 Days", days: 7 },
//                     { label: "Last 30 Days", days: 30 },
//                     { label: "Last 3 Months", days: 90 },
//                     { label: "Last Year", days: 365 },
//                   ].map(({ label, days }) => (
//                     <button key={label} className="sc-btn-ghost text-xs"
//                       onClick={() => setDateRange({
//                         start: new Date(Date.now() - days * 86400000).toISOString().split('T')[0],
//                         end: new Date().toISOString().split('T')[0]
//                       })}>
//                       {label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 {[
//                   { label: "Service Usage Report", desc: "Statistics and department analysis", icon: FaChartBar, accent: "#2563eb", bg: "#eff6ff", action: handleGenerateServiceReport },
//                   { label: "User Activity Report", desc: "Engagement and activity metrics", icon: FaUsers, accent: "#059669", bg: "#ecfdf5", action: handleGenerateUserActivityReport },
//                   { label: "Comprehensive Report", desc: "Complete system overview and KPIs", icon: FaFilePdf, accent: "#7c3aed", bg: "#f5f3ff", action: handleGenerateCombinedReport },
//                 ].map((r, i) => (
//                   <div key={i} className="sc-card p-6 hover:shadow-lg transition-shadow">
//                     <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: r.bg }}>
//                       <r.icon style={{ color: r.accent, fontSize: '1.1rem' }} />
//                     </div>
//                     <h3 className="font-bold text-slate-800 mb-1">{r.label}</h3>
//                     <p className="text-xs text-slate-400 mb-5">{r.desc}</p>
//                     <button onClick={r.action} disabled={generating} className="sc-btn-primary w-full justify-center"
//                       style={{ background: r.accent }}>
//                       {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
//                       Generate PDF
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//         </main>
//       </div>

//       {/* ── Quick Status Update Modal ─────────────────────────────────────── */}
//       {showComplaintModal && selectedComplaint && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl">
//             <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="font-bold text-slate-900">Quick Status Update</h3>
//               <button
//                 onClick={() => { setShowComplaintModal(false); setSelectedComplaint(null); setAdminComment(""); }}
//                 className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
//               ><FaTimes size={12} /></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="p-4 bg-slate-50 rounded-xl">
//                 <p className="text-xs text-slate-400 mb-1">Complaint #{selectedComplaint.complaintNumber}</p>
//                 <p className="font-semibold text-slate-800">{selectedComplaint.citizenName}</p>
//                 <p className="text-sm text-slate-500">{selectedComplaint.department} — {selectedComplaint.issueKeyword}</p>
//                 <p className="text-sm text-slate-600 mt-2">{selectedComplaint.description}</p>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Update Status</label>
//                 <select onChange={e => setAdminComment(e.target.value)} className="sc-input text-sm" defaultValue="">
//                   <option value="">Select new status</option>
//                   <option value="Processing">Mark as Processing</option>
//                   <option value="Resolved">Mark as Resolved</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Admin Comment</label>
//                 <textarea
//                   value={adminComment} onChange={e => setAdminComment(e.target.value)}
//                   placeholder="Add official comment…" rows="3" className="sc-input resize-none text-sm"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => updateComplaintStatus(selectedComplaint._id, 'Processing')}
//                   className="flex-1 sc-btn-primary justify-center" style={{ background: '#2563eb' }}>
//                   <FaClock size={12} /> Processing
//                 </button>
//                 <button onClick={() => updateComplaintStatus(selectedComplaint._id, 'Resolved')}
//                   className="flex-1 sc-btn-primary justify-center" style={{ background: '#059669' }}>
//                   <FaCheckCircle size={12} /> Resolved
//                 </button>
//                 <button
//                   onClick={() => { setShowComplaintModal(false); setSelectedComplaintDetail(selectedComplaint); setShowComplaintDetail(true); }}
//                   className="flex-1 sc-btn-ghost justify-center">
//                   <FaEye size={12} /> Full Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { 
=======
import {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  FaUsers, FaClipboardList, FaLightbulb, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
  FaChartBar, FaCog, FaShieldAlt, FaUserCheck, FaUserTimes,
  FaCheckDouble, FaHourglassHalf, FaDownload, FaEye,
  FaTrash, FaEdit, FaSearch, FaFilter, FaChevronDown,
  FaBan, FaUnlock, FaLock, FaUserCog, FaBuilding,
  FaCalendarAlt, FaComment, FaCheck, FaTimes, FaPlus,
  FaUpload, FaPaperPlane, FaStar, FaRegStar,
  FaFilePdf, FaSpinner, FaUserCircle, FaEnvelope, FaPhone,
<<<<<<< HEAD
  FaIdCard, FaMapMarkerAlt, FaChartLine
} from "react-icons/fa";
import AdminSolutions from "../components/AdminSolutions";
import AdminComplaintDetail from "../components/AdminComplaintDetail";

// PDF.co API Key
=======
  FaIdCard, FaMapMarkerAlt, FaChartLine, FaBell, FaArrowRight,
  FaSignOutAlt, FaTachometerAlt, FaCrown, FaUserShield,
  FaHistory, FaInfoCircle
} from "react-icons/fa";
import AdminSolutions from "../components/AdminSolutions";
import AdminComplaintDetail from "../components/AdminComplaintDetail";
import ServiceManagement from "./admin/ServiceManagement";

>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
const PDF_CO_API_KEY = 'muntaka.mubarrat.antorik@g.bracu.ac.bd_7bOKLjoVdjQc8cu8UleHOGAgQWssCk2bsFRUNI9hfk6EirfxdfG6zcWxSwkEM57p';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
<<<<<<< HEAD
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    pendingSolutions: 0,
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingDocuments: 0
=======
    totalUsers: 0, totalComplaints: 0, pendingComplaints: 0,
    resolvedComplaints: 0, pendingSolutions: 0, totalDocuments: 0,
    verifiedDocuments: 0, pendingDocuments: 0
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  });
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [documents, setDocuments] = useState([]);
<<<<<<< HEAD
=======
  const [appointments, setAppointments] = useState([]);
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
<<<<<<< HEAD
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
=======
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedUserForReport, setSelectedUserForReport] = useState(null);
  const [showUserReportModal, setShowUserReportModal] = useState(false);
  const [reportFormat, setReportFormat] = useState("detailed");
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
<<<<<<< HEAD

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
=======
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [surveyStats, setSurveyStats] = useState({
    totalSurveys: 0, avgSatisfaction: 0, helpfulPercentage: 0, avgResolutionTime: 0
  });
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSurveyDetail, setShowSurveyDetail] = useState(false);
  
  // Appointment states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    complaintId: '',
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    purpose: '',
    status: 'Scheduled'
  });

  // Get current admin info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // ─── PDF helpers ────────────────────────────────────────────────────────
  const generatePDF = async (html, filename) => {
    const response = await axios.post('https://api.pdf.co/v1/pdf/convert/from/html',
      { name: filename, html, margin: '20px', paperSize: 'Letter', async: false },
      { headers: { 'x-api-key': PDF_CO_API_KEY, 'Content-Type': 'application/json' } }
    );
    if (response.data.error) throw new Error(response.data.error);
    return response.data.url;
  };

  const generateUserWiseReport = async (user) => {
    setGenerating(true);
    try {
      const userComplaints = complaints.filter(c =>
        c.userId === user._id || c.userId?._id === user._id || c.email === user.email
      );
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>User Report - ${user.name}</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#333;line-height:1.6}
        .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
        .header h1{margin:0;color:#1d4ed8}.user-info{background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:30px}
        .stats{display:flex;gap:20px;margin-bottom:30px;flex-wrap:wrap}
        .stat-card{flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:15px;text-align:center;min-width:120px}
        .stat-value{font-size:28px;font-weight:bold;color:#1d4ed8}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
        th{background-color:#f9fafb;font-weight:600}
        .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
      </head><body>
        <div class="header"><h1>ShebaConnect</h1><p>Government of Bangladesh • Citizen Grievance Redressal System</p></div>
        <div class="user-info"><strong>User Report for:</strong> ${user.name}<br><strong>Email:</strong> ${user.email}<br>
        <strong>Phone:</strong> ${user.phone}<br><strong>NID:</strong> ${user.nid}<br>
        <strong>Address:</strong> ${user.address}<br><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
        <div class="stats">
          <div class="stat-card"><div class="stat-value">${userComplaints.length}</div><div>Total Complaints</div></div>
          <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Resolved').length}</div><div>Resolved</div></div>
          <div class="stat-card"><div class="stat-value">${userComplaints.filter(c => c.status === 'Pending').length}</div><div>Pending</div></div>
        </div>
        <h3>Complaint Details</h3>
        <table><thead><tr><th>Complaint #</th><th>Department</th><th>Issue</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
        <tbody>${userComplaints.map(c => `<tr><td>${c.complaintNumber || c._id.slice(-6)}</td
          <td>${c.department}</td
          <td>${c.issueKeyword}</td
          <td>${c.status}</td
          <td>${c.priority}</td
          <td>${new Date(c.createdAt).toLocaleDateString()}</td
        </tr>`).join('')}</tbody>
        </table>
        <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
      </body></html>`;
      const pdfUrl = await generatePDF(html, `user_report_${user.name}_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification(`Report for ${user.name} generated successfully`, 'success');
    } catch (err) {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
      showNotification('Failed to generate user report', 'error');
    } finally {
      setGenerating(false);
      setShowUserReportModal(false);
    }
  };
<<<<<<< HEAD
  
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
=======

  const generateAllUsersReport = async () => {
    setGenerating(true);
    try {
      const citizenUsers = users.filter(u => u.role !== 'admin');
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Complete Users Report</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#333;line-height:1.6}
        .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
        .header h1{margin:0;color:#1d4ed8}.summary{background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:30px}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
        th{background-color:#f9fafb;font-weight:600}
        .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
      </head><body>
        <div class="header"><h1>ShebaConnect</h1><p>Government of Bangladesh • Citizen Grievance Redressal System</p></div>
        <div class="summary"><strong>Complete Users Report</strong><br>Total Citizens: ${citizenUsers.length}<br>
        Admin Users: ${users.filter(u => u.role === 'admin').length}<br>
        Report Generated: ${new Date().toLocaleString()}</div>
        <h3>Citizens List</h3>
        <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>NID</th><th>Joined</th></tr></thead>
        <tbody>${citizenUsers.map(u => `<tr><td>${u.name}</td
          <td>${u.email}</td
          <td>${u.phone}</td
          <td>${u.nid}</td
          <td>${new Date(u.createdAt).toLocaleDateString()}</td
        </tr>`).join('')}</tbody>
        </table>
        <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
      </body></html>`;
      const pdfUrl = await generatePDF(html, `all_users_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('All users report generated successfully', 'success');
    } catch (err) {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
      showNotification('Failed to generate all users report', 'error');
    } finally {
      setGenerating(false);
    }
  };
<<<<<<< HEAD
  
  // Generate service report
=======

>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  const handleGenerateServiceReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
<<<<<<< HEAD
      const servicesRes = await axios.get(
        `${API}/api/admin/services`,
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
=======
      const servicesRes = await axios.get(`${API}/api/admin/services`, { headers: { Authorization: `Bearer ${token}` } });
      const services = servicesRes.data;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Service Usage Report</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
        .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
        .header h1{margin:0;color:#1d4ed8}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
        th{background-color:#f9fafb;font-weight:600}
        .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
      </head><body>
        <div class="header"><h1>ShebaConnect</h1><p>Service Usage Report</p><p>Period: ${dateRange.start} to ${dateRange.end}</p></div>
        <table><thead><tr><th>Service Name</th><th>Department</th><th>Cost (BDT)</th><th>Processing Time</th><th>Urgency</th><th>Status</th></tr></thead>
        <tbody>${services.map(s => `<tr><td>${s.name}</td
          <td>${s.department}</td
          <td>${s.cost}</td
          <td>${s.processingTime}</td
          <td>${s.urgency}</td
          <td>${s.isActive ? 'Active' : 'Inactive'}</td
        </tr>`).join('')}</tbody>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report</div>
      </body></html>`;
      const pdfUrl = await generatePDF(html, `service_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('Service report generated successfully', 'success');
    } catch (err) {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
      showNotification('Failed to generate service report', 'error');
    } finally {
      setGenerating(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleGenerateUserActivityReport = async () => {
    setGenerating(true);
    try {
      const citizenUsers = users.filter(u => u.role !== 'admin');
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>User Activity Report</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
        .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
        .header h1{margin:0;color:#1d4ed8}.stats{display:flex;gap:20px;margin-bottom:30px;flex-wrap:wrap}
        .stat-card{flex:1;background:#f3f4f6;border-radius:8px;padding:15px;text-align:center}
        .stat-value{font-size:28px;font-weight:bold;color:#1d4ed8}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
        th{background-color:#f9fafb;font-weight:600}
        .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
      </head><body>
        <div class="header"><h1>ShebaConnect</h1><p>User Activity Report</p><p>Period: ${dateRange.start} to ${dateRange.end}</p></div>
        <div class="stats">
          <div class="stat-card"><div class="stat-value">${citizenUsers.length}</div><div>Total Citizens</div></div>
          <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
          <div class="stat-card"><div class="stat-value">${stats.resolutionRate || 0}%</div><div>Resolution Rate</div></div>
        </div>
        <h3>Recent Citizens</h3>
        <tr><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
        <tbody>${citizenUsers.slice(0, 20).map(u => `<tr><td>${u.name}</td
          <td>${u.email}</td
          <td>${u.phone}</td
          <td>${new Date(u.createdAt).toLocaleDateString()}</td
        </tr>`).join('')}</tbody>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleString()} | ShebaConnect Official Report</div>
      </body></html>`;
      const pdfUrl = await generatePDF(html, `user_activity_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('User activity report generated successfully', 'success');
    } catch (err) {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
      showNotification('Failed to generate user activity report', 'error');
    } finally {
      setGenerating(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleGenerateCombinedReport = async () => {
    setGenerating(true);
    try {
      const citizenUsers = users.filter(u => u.role !== 'admin');
      const totalResolved = complaints.filter(c => c.status === 'Resolved').length;
      const resolutionRate = complaints.length > 0 ? Math.round((totalResolved / complaints.length) * 100) : 0;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Comprehensive System Report</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;color:#333}
        .header{text-align:center;border-bottom:2px solid #1d4ed8;padding-bottom:20px;margin-bottom:20px}
        .header h1{margin:0;color:#1d4ed8}.summary{background:#f3f4f6;padding:20px;border-radius:8px;margin-bottom:30px}
        .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:30px}
        .stat-card{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:15px;text-align:center}
        .stat-value{font-size:32px;font-weight:bold;color:#1d4ed8}
        table{width:100%;border-collapse:collapse}th,td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;font-size:12px}
        th{background-color:#f9fafb;font-weight:600}
        .footer{margin-top:30px;text-align:center;font-size:10px;color:#9ca3af}</style>
      </head><body>
        <div class="header"><h1>ShebaConnect</h1><p>Comprehensive System Report</p><p>Generated on ${new Date().toLocaleString()}</p></div>
        <div class="summary"><h3>Executive Summary</h3><p>This report provides a comprehensive overview of ShebaConnect's performance.</p></div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${citizenUsers.length}</div><div>Total Citizens</div></div>
          <div class="stat-card"><div class="stat-value">${complaints.length}</div><div>Total Complaints</div></div>
          <div class="stat-card"><div class="stat-value">${resolutionRate}%</div><div>Resolution Rate</div></div>
        </div>
        <h3>Key Performance Indicators</h3>
        <tr><thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Total Citizens</td
          <td>${citizenUsers.length}</td
        </tr>
          <tr><td>Total Complaints</td
          <td>${complaints.length}</td
        </tr>
          <tr><td>Pending Complaints</td
          <td>${stats.pendingComplaints}</td
        </tr>
          <tr><td>Resolved Complaints</td
          <td>${stats.resolvedComplaints}</td
        </tr>
          <tr><td>Resolution Rate</td
          <td>${resolutionRate}%</td
        </tr>
          <tr><td>Total Documents</td
          <td>${stats.totalDocuments}</td
        </tr>
          <tr><td>Pending Solutions</td
          <td>${stats.pendingSolutions}</td
        </tr>
        </tbody>
        </table>
        <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
      </body></html>`;
      const pdfUrl = await generatePDF(html, `comprehensive_report_${Date.now()}.pdf`);
      window.open(pdfUrl, '_blank');
      showNotification('Comprehensive report generated successfully', 'success');
    } catch (err) {
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
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
<<<<<<< HEAD
      
      const usersRes = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);

      const complaintsRes = await axios.get(`${API}/api/admin/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaintsRes.data);

      const docsRes = await axios.get(`${API}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(docsRes.data);

      const statsRes = await axios.get(`${API}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
=======
      const [usersRes, complaintsRes, docsRes, statsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/admin/documents`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/admin/appointments`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      setUsers(usersRes.data);
      setComplaints(complaintsRes.data);
      setDocuments(docsRes.data);
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data || []);
    } catch (err) {
      showNotification("Failed to load dashboard data", "error");
    }
    try {
      const token = localStorage.getItem('token');
      const [surveysRes, surveyStatsRes] = await Promise.all([
        axios.get(`${API}/api/admin/surveys`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/admin/surveys/stats/overview`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSurveys(surveysRes.data || []);
      setSurveyStats(surveyStatsRes.data);
    } catch {
      setSurveys([]);
      setSurveyStats({ totalSurveys: 0, avgSatisfaction: 0, helpfulPercentage: 0, avgResolutionTime: 0 });
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/api/admin/users/${userId}/role`,
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
      await axios.delete(`${API}/api/admin/users/${userId}`, {
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
        `${API}/api/admin/complaints/${complaintId}/status`,
=======
  // Appointment CRUD functions
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/admin/appointments`, appointmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Appointment created successfully', 'success');
      setShowAppointmentModal(false);
      resetAppointmentForm();
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating appointment:', err);
      showNotification('Failed to create appointment', 'error');
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/admin/appointments/${editingAppointment._id}`, appointmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Appointment updated successfully', 'success');
      setShowAppointmentModal(false);
      setEditingAppointment(null);
      resetAppointmentForm();
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating appointment:', err);
      showNotification('Failed to update appointment', 'error');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/admin/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Appointment deleted successfully', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      showNotification('Failed to delete appointment', 'error');
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/admin/appointments/${appointmentId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Appointment marked as ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating appointment status:', err);
      showNotification('Failed to update appointment status', 'error');
    }
  };

  const resetAppointmentForm = () => {
    setAppointmentForm({
      complaintId: '',
      appointmentDate: '',
      appointmentTime: '',
      location: '',
      purpose: '',
      status: 'Scheduled'
    });
  };

  const editAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      complaintId: appointment.complaintId?._id || appointment.complaintId,
      appointmentDate: appointment.appointmentDate?.split('T')[0] || '',
      appointmentTime: appointment.appointmentTime || '',
      location: appointment.location || '',
      purpose: appointment.purpose || '',
      status: appointment.status || 'Scheduled'
    });
    setShowAppointmentModal(true);
  };

  // Only allow role updates for citizen users (not admins)
  const updateUserRole = async (userId, newRole) => {
    const targetUser = users.find(u => u._id === userId);
    if (targetUser?.role === 'admin') {
      showNotification("Admin roles cannot be modified", "error");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/admin/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`User role updated to ${newRole}`, "success");
      fetchDashboardData();
    } catch { showNotification("Failed to update user role", "error"); }
  };

  // Only allow deletion of citizen users (not admins)
  const deleteUser = async (userId) => {
    const targetUser = users.find(u => u._id === userId);
    if (targetUser?.role === 'admin') {
      showNotification("Admin accounts cannot be deleted", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("User deleted successfully", "success");
      fetchDashboardData();
    } catch { showNotification("Failed to delete user", "error"); }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/admin/complaints/${complaintId}/status`,
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
        { status: newStatus, comment: adminComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Complaint status updated to ${newStatus}`, "success");
<<<<<<< HEAD
      setAdminComment("");
      setSelectedComplaint(null);
      setShowComplaintModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating complaint:", err);
      showNotification("Failed to update complaint", "error");
    }
=======
      setAdminComment(""); setSelectedComplaint(null); setShowComplaintModal(false);
      fetchDashboardData();
    } catch { showNotification("Failed to update complaint", "error"); }
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
  };

  const verifyDocument = async (docId, status) => {
    try {
      const token = localStorage.getItem('token');
<<<<<<< HEAD
      await axios.put(
        `${API}/api/admin/documents/${docId}/verify`,
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
=======
      await axios.put(`${API}/api/admin/documents/${docId}/verify`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`Document ${status.toLowerCase()}`, "success");
      fetchDashboardData();
    } catch { showNotification("Failed to verify document", "error"); }
  };

  // Filter only citizen users for display
  const citizenUsers = users.filter(u => u.role !== 'admin');
  
  const filteredUsers = citizenUsers.filter(user =>
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
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

<<<<<<< HEAD
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
=======
  // ─── Nav items with Appointments and Services added ────────────────────────
  const navItems = [
    { id: "overview",   label: "Overview",              icon: FaTachometerAlt },
    { id: "users",      label: "Citizen Management",    icon: FaUsers },
    { id: "complaints", label: "Complaints",            icon: FaClipboardList },
    { id: "appointments", label: "Appointments",        icon: FaCalendarAlt },
    { id: "solutions",  label: "Solution Review",       icon: FaLightbulb },
    { id: "documents",  label: "Document Verification", icon: FaFileAlt },
    { id: "services",   label: "Services",              icon: FaCog },
    { id: "surveys",    label: "Surveys",               icon: FaStar },
    { id: "reports",    label: "Reports",               icon: FaFilePdf },
    { id: "settings",   label: "System Settings",       icon: FaCog },
  ];

  // ─── Stat cards ───────────────────────────────────────────────────────────
  const statCards = [
    { label: "Total Citizens",    value: citizenUsers.length,    icon: FaUsers,        accent: "#2563eb", light: "#eff6ff", sub: "Registered citizens" },
    { label: "Total Complaints",  value: stats.totalComplaints,  icon: FaClipboardList,accent: "#7c3aed", light: "#f5f3ff", sub: `${stats.pendingComplaints} pending` },
    { label: "Resolved",          value: stats.resolvedComplaints||0, icon: FaCheckCircle, accent: "#059669", light: "#ecfdf5", sub: "Complaints closed" },
    { label: "Pending Solutions", value: stats.pendingSolutions, icon: FaLightbulb,    accent: "#d97706", light: "#fffbeb", sub: "Awaiting review" },
    { label: "Total Documents",   value: stats.totalDocuments,   icon: FaFileAlt,      accent: "#0891b2", light: "#ecfeff", sub: `${stats.pendingDocuments||0} pending` },
    { label: "Verified Docs",     value: stats.verifiedDocuments||0, icon: FaCheckDouble, accent: "#16a34a", light: "#f0fdf4", sub: "Approved documents" },
  ];

  const statusColor = (s) => ({
    Resolved:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Pending:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  }[s] || "bg-gray-100 text-gray-600");

  const priorityColor = (p) => ({
    high:   "bg-red-50 text-red-700 ring-1 ring-red-200",
    medium: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    low:    "bg-green-50 text-green-700 ring-1 ring-green-200",
  }[p] || "bg-gray-100 text-gray-600");

  const appointmentStatusColor = (status) => ({
    'Scheduled': 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
    'Completed': 'bg-green-100 text-green-800 ring-1 ring-green-200',
    'Cancelled': 'bg-red-100 text-red-800 ring-1 ring-red-200',
    'Rescheduled': 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
  }[status] || 'bg-gray-100 text-gray-600');

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-medium tracking-wide">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        .sc-sidebar { width: 260px; transition: width 0.25s ease; }
        .sc-sidebar.collapsed { width: 72px; }
        .sc-sidebar.collapsed .sc-label { display: none; }
        .sc-sidebar.collapsed .sc-brand-text { display: none; }
        .sc-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 10px;
          cursor: pointer; transition: all 0.15s; color: #94a3b8; font-size: 0.875rem; font-weight: 500; }
        .sc-nav-item:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .sc-nav-item.active { background: rgba(59,130,246,0.18); color: #93c5fd; }
        .sc-nav-item.active .sc-nav-icon { color: #60a5fa; }
        .sc-nav-icon { font-size: 1rem; flex-shrink: 0; }
        .sc-stat-card { background: #fff; border-radius: 14px; padding: 22px 24px;
          border: 1px solid #f1f5f9; transition: box-shadow 0.2s, transform 0.2s; }
        .sc-stat-card:hover { box-shadow: 0 8px 24px rgba(15,23,42,0.08); transform: translateY(-2px); }
        .sc-table th { font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: #64748b; padding: 12px 16px; background: #f8fafc;
          border-bottom: 1px solid #e2e8f0; }
        .sc-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; color: #334155; }
        .sc-table tr:hover td { background: #f8fafc; }
        .sc-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600; }
        .sc-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px;
          background: #2563eb; color: #fff; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
          border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; }
        .sc-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .sc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .sc-btn-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
          background: transparent; color: #64748b; border-radius: 8px; font-size: 0.825rem; font-weight: 500;
          border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.15s; }
        .sc-btn-ghost:hover { background: #f1f5f9; color: #334155; }
        .sc-input { width: 100%; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 9px;
          font-size: 0.875rem; color: #334155; outline: none; transition: border 0.15s; background: #fff; }
        .sc-input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.25); }
        .sc-card { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; }
        .sc-card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .sc-section-title { font-size: 1rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
        @keyframes scSlideDown { from { opacity:0; transform: translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        .sc-notif { animation: scSlideDown 0.25s ease; }
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className={`sc-sidebar ${sidebarOpen ? '' : 'collapsed'} bg-slate-900 flex flex-col min-h-screen sticky top-0 flex-shrink-0`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <FaShieldAlt className="text-white text-sm" />
          </div>
          <div className="sc-brand-text">
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>ShebaConnect</p>
            <p className="text-slate-400 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <div key={item.id}
              className={`sc-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <item.icon className="sc-nav-icon" />
              <span className="sc-label">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 border-t border-slate-800 pt-4 space-y-1">
          <div className="sc-nav-item" onClick={() => navigate('/')} title="Back to Home">
            <FaSignOutAlt className="sc-nav-icon" />
            <span className="sc-label">Back to Home</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
            >
              <FaFilter size={13} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">ShebaConnect — Government of Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <FaCrown className="text-white text-xs" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">{currentUser.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1"><FaUserShield size={8} /> System Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Notification Toast */}
        {notification.show && (
          <div className={`sc-notif fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold
            ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
            {notification.message}
          </div>
        )}

        {/* Modals */}
        {showUserReportModal && selectedUserForReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Generate Citizen Report</h3>
                <button onClick={() => setShowUserReportModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <FaTimes size={12} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserCircle className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedUserForReport.name}</p>
                    <p className="text-sm text-slate-500">{selectedUserForReport.email}</p>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Report Format</label>
                  <select value={reportFormat} onChange={e => setReportFormat(e.target.value)} className="sc-input">
                    <option value="detailed">Detailed Report</option>
                    <option value="summary">Summary Report</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => generateUserWiseReport(selectedUserForReport)} disabled={generating} className="sc-btn-primary flex-1">
                    {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />} Generate
                  </button>
                  <button onClick={() => setShowUserReportModal(false)} className="sc-btn-ghost flex-1">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showComplaintDetail && selectedComplaintDetail && (
          <AdminComplaintDetail
            complaint={selectedComplaintDetail}
            onClose={() => { setShowComplaintDetail(false); setSelectedComplaintDetail(null); }}
            onUpdate={fetchDashboardData}
            showNotification={showNotification}
          />
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
                <h3 className="font-bold text-white">{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h3>
                <button onClick={() => { setShowAppointmentModal(false); setEditingAppointment(null); resetAppointmentForm(); }} className="text-white/70 hover:text-white p-2 rounded-full">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={editingAppointment ? (e) => { e.preventDefault(); handleUpdateAppointment(); } : handleCreateAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Complaint ID</label>
                  <select
                    value={appointmentForm.complaintId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, complaintId: e.target.value })}
                    className="sc-input text-sm"
                    required
                  >
                    <option value="">Select Complaint</option>
                    {complaints.map(c => (
                      <option key={c._id} value={c._id}>{c.complaintNumber} - {c.citizenName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Date</label>
                    <input type="date" value={appointmentForm.appointmentDate} onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })} className="sc-input text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Time</label>
                    <input type="time" value={appointmentForm.appointmentTime} onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentTime: e.target.value })} className="sc-input text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Location</label>
                  <input type="text" value={appointmentForm.location} onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })} placeholder="Office address" className="sc-input text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Purpose</label>
                  <textarea value={appointmentForm.purpose} onChange={(e) => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })} rows="2" placeholder="Reason for appointment" className="sc-input text-sm resize-none" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 sc-btn-primary">{editingAppointment ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowAppointmentModal(false); setEditingAppointment(null); resetAppointmentForm(); }} className="flex-1 sc-btn-ghost">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── CONTENT ──────────────────────────────────────────────────── */}
        <main className="flex-1 p-6 space-y-6">

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((c, i) => (
                  <div key={i} className="sc-stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{c.label}</p>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.light }}>
                        <c.icon style={{ color: c.accent, fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Pending Complaints", value: stats.pendingComplaints, icon: FaClock, color: "#f59e0b", bg: "#fffbeb", tab: "complaints", btn: "Process Now" },
                  { label: "Solutions to Review", value: stats.pendingSolutions, icon: FaLightbulb, color: "#8b5cf6", bg: "#f5f3ff", tab: "solutions", btn: "Review Solutions" },
                  { label: "Documents Pending", value: stats.pendingDocuments||0, icon: FaFileAlt, color: "#0891b2", bg: "#ecfeff", tab: "documents", btn: "Verify Documents" },
                ].map((q, i) => (
                  <div key={i} className="sc-card p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: q.bg }}>
                        <q.icon style={{ color: q.color }} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{q.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{q.value}</p>
                    </div>
                    <button onClick={() => setActiveTab(q.tab)} className="sc-btn-ghost text-xs whitespace-nowrap">
                      {q.btn} <FaArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="sc-card">
                  <div className="sc-card-header">
                    <span className="sc-section-title"><FaClipboardList className="text-blue-500" /> Recent Complaints</span>
                    <button onClick={() => setActiveTab("complaints")} className="sc-btn-ghost text-xs">View All <FaArrowRight size={10} /></button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {complaints.slice(0, 5).map(c => (
                      <div key={c._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{c.citizenName}</p>
                          <p className="text-xs text-slate-400 truncate">{c.department} · {c.issueKeyword}</p>
                        </div>
                        <span className={`sc-badge ${statusColor(c.status)}`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sc-card">
                  <div className="sc-card-header">
                    <span className="sc-section-title"><FaUsers className="text-emerald-500" /> New Citizens</span>
                    <button onClick={() => setActiveTab("users")} className="sc-btn-ghost text-xs">View All <FaArrowRight size={10} /></button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {citizenUsers.slice(0, 5).map(u => (
                      <div key={u._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                        <span className="sc-badge bg-green-50 text-green-700 ring-1 ring-green-200">Citizen</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS (CITIZENS ONLY) ────────────────────────────────────── */}
          {activeTab === "users" && (
            <div className="sc-card">
              <div className="sc-card-header">
                <span className="sc-section-title"><FaUsers className="text-blue-500" /> Citizen Management</span>
                <div className="flex items-center gap-3">
                  <button onClick={generateAllUsersReport} disabled={generating} className="sc-btn-ghost text-xs">
                    {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />} Export All
                  </button>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text" placeholder="Search citizens…" value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="sc-input pl-8 w-64 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full sc-table">
                  <thead>
                    <tr>
                      <th className="text-left">Citizen</th>
                      <th className="text-left">Contact</th>
                      <th className="text-left">NID</th>
                      <th className="text-left">Role</th>
                      <th className="text-left">Joined</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm">{user.phone}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{user.address}</p>
                        </td>
                        <td className="font-mono text-xs text-slate-600">{user.nid}</td>
                        <td>
                          <span className="sc-badge bg-green-50 text-green-700 ring-1 ring-green-200">Citizen</span>
                        </td>
                        <td className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setSelectedUserForReport(user); setShowUserReportModal(true); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition"
                              title="Generate Report"
                            ><FaFilePdf size={13} /></button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                              title="Delete User"
                            ><FaTrash size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMPLAINTS ───────────────────────────────────────────── */}
          {activeTab === "complaints" && (
            <div className="sc-card">
              <div className="sc-card-header">
                <span className="sc-section-title"><FaClipboardList className="text-blue-500" /> Complaint Management</span>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="sc-input w-auto text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full sc-table">
                  <thead>
                    <tr>
                      <th>Complaint #</th>
                      <th>Citizen</th>
                      <th>Department</th>
                      <th>Issue</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map(c => (
                      <tr key={c._id}>
                        <td className="font-mono text-xs text-slate-600">{c.complaintNumber}</td>
                        <td>
                          <p className="font-medium text-slate-800">{c.citizenName}</p>
                          <p className="text-xs text-slate-400">{c.contactNumber}</p>
                        </td>
                        <td className="text-sm">{c.department}</td>
                        <td>
                          <p className="font-medium text-sm text-slate-800">{c.issueKeyword}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{c.description?.substring(0, 45)}…</p>
                          {c.editHistory?.some(e => !e.reviewedByAdmin) && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 ring-1 ring-orange-200 rounded px-1.5 py-0.5 mt-1">
                              ✏ Edits
                            </span>
                          )}
                        </td>
                        <td><span className={`sc-badge ${statusColor(c.status)}`}>{c.status}</span></td>
                        <td><span className={`sc-badge ${priorityColor(c.priority)}`}>{c.priority}</span></td>
                        <td className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setSelectedComplaintDetail(c); setShowComplaintDetail(true); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition"
                              title="View Details"
                            ><FaEye size={13} /></button>
                            <button
                              onClick={() => { setSelectedComplaint(c); setShowComplaintModal(true); }}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-violet-500 hover:bg-violet-50 transition"
                              title="Quick Update"
                            ><FaEdit size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ────────────────────────────────────────────── */}
          {activeTab === "appointments" && (
            <div className="sc-card">
              <div className="sc-card-header">
                <span className="sc-section-title"><FaCalendarAlt className="text-blue-500" /> Appointment Management</span>
                <button onClick={() => { resetAppointmentForm(); setEditingAppointment(null); setShowAppointmentModal(true); }} className="sc-btn-primary text-sm">
                  <FaPlus /> New Appointment
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full sc-table">
                  <thead>
                    <tr>
                      <th>Complaint #</th>
                      <th>Citizen</th>
                      <th>Date & Time</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Purpose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-8 text-slate-400">No appointments scheduled</td></tr>
                    ) : (
                      appointments.map(apt => (
                        <tr key={apt._id}>
                          <td className="font-mono text-xs text-slate-600">{apt.complaintId?.complaintNumber || 'N/A'}</td>
                          <td>
                            <p className="font-medium text-slate-800 text-sm">{apt.complaintId?.citizenName || 'N/A'}</p>
                            <p className="text-xs text-slate-400">{apt.complaintId?.contactNumber}</p>
                          </td>
                          <td>
                            <p className="text-sm">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                            <p className="text-xs text-slate-400">{apt.appointmentTime}</p>
                          </td>
                          <td className="text-sm">{apt.location}</td>
                          <td><span className={`sc-badge ${appointmentStatusColor(apt.status)}`}>{apt.status}</span></td>
                          <td className="text-sm truncate max-w-[200px]">{apt.purpose || '-'}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <button onClick={() => editAppointment(apt)} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition" title="Edit"><FaEdit size={13} /></button>
                              <button onClick={() => updateAppointmentStatus(apt._id, 'Completed')} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition" title="Mark Completed"><FaCheck size={12} /></button>
                              <button onClick={() => updateAppointmentStatus(apt._id, 'Rescheduled')} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition" title="Rescheduled"><FaCheckDouble size={12} /></button>
                              <button onClick={() => updateAppointmentStatus(apt._id, 'Cancelled')} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition" title="Cancel"><FaTimes size={12} /></button>
                              <button onClick={() => deleteAppointment(apt._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition" title="Delete"><FaTrash size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ────────────────────────────────────────────── */}
          {activeTab === "documents" && (
            <div className="sc-card">
              <div className="sc-card-header">
                <span className="sc-section-title"><FaFileAlt className="text-cyan-500" /> Document Verification</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full sc-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Owner</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc._id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                              <FaFileAlt className="text-cyan-500 text-xs" />
                            </div>
                            <span className="font-medium text-sm text-slate-800">{doc.filename}</span>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm font-medium text-slate-800">{doc.userId?.name}</p>
                          <p className="text-xs text-slate-400">{doc.userId?.email}</p>
                        </td>
                        <td className="text-sm">{doc.documentType}</td>
                        <td>
                          <span className={`sc-badge ${
                            doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                            doc.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                            'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          }`}>{doc.status}</span>
                        </td>
                        <td className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => window.open(doc.fileUrl, '_blank')} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition" title="View Document"><FaEye size={13} /></button>
                            <button onClick={() => verifyDocument(doc._id, 'Verified')} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition" title="Verify"><FaCheck size={12} /></button>
                            <button onClick={() => verifyDocument(doc._id, 'Rejected')} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition" title="Reject"><FaTimes size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SOLUTIONS ────────────────────────────────────────────── */}
          {activeTab === "solutions" && <AdminSolutions />}

          {/* ── SERVICES ──────────────────────────────────────────────── */}
          {activeTab === "services" && <ServiceManagement />}

          {/* ── SURVEYS ──────────────────────────────────────────────── */}
          {activeTab === "surveys" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Surveys", value: surveyStats.totalSurveys, icon: FaStar, accent: "#2563eb", bg: "#eff6ff" },
                  { label: "Avg Satisfaction", value: `${surveyStats.avgSatisfaction.toFixed(1)} / 5`, icon: FaStar, accent: "#d97706", bg: "#fffbeb" },
                  { label: "Helpful Rate", value: `${surveyStats.helpfulPercentage}%`, icon: FaCheckCircle, accent: "#059669", bg: "#ecfdf5" },
                  { label: "Avg Resolution", value: `${surveyStats.avgResolutionTime.toFixed(0)} days`, icon: FaClock, accent: "#7c3aed", bg: "#f5f3ff" },
                ].map((s, i) => (
                  <div key={i} className="sc-stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                        <s.icon style={{ color: s.accent, fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="sc-card">
                <div className="sc-card-header">
                  <span className="sc-section-title"><FaStar className="text-amber-400" /> Survey Submissions</span>
                </div>
                {surveys.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <FaStar className="text-4xl mx-auto mb-3 text-slate-200" />
                    <p className="text-sm">No surveys submitted yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full sc-table">
                      <thead>
                        <tr>
                          <th>Citizen</th><th>Department</th><th>Issue</th>
                          <th>Satisfaction</th><th>Helpful</th><th>Resolution</th>
                          <th>Date</th><th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {surveys.map(sv => (
                          <tr key={sv._id}>
                            <td>
                              <p className="font-medium text-slate-800 text-sm">{sv.userId?.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-400">{sv.userId?.email}</p>
                            </td>
                            <td className="text-sm">{sv.department}</td>
                            <td className="text-sm">{sv.issueKeyword}</td>
                            <td>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} size={11} className={i < sv.satisfaction ? "text-amber-400" : "text-slate-200"} />
                                ))}
                                <span className="ml-1.5 text-xs font-bold text-slate-600">{sv.satisfaction}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`sc-badge ${sv.helpful ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'}`}>
                                {sv.helpful ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="text-xs text-slate-600">{sv.resolutionTime} days</td>
                            <td className="text-xs text-slate-500">{new Date(sv.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button onClick={() => { setSelectedSurvey(sv); setShowSurveyDetail(true); }}
                                className="sc-btn-ghost text-xs py-1.5 px-3">
                                <FaEye size={11} /> View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Survey Detail Modal */}
              {showSurveyDetail && selectedSurvey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between z-10">
                      <h3 className="text-xl font-bold flex items-center gap-2"><FaStar className="text-yellow-300" /> Survey Details</h3>
                      <button onClick={() => setShowSurveyDetail(false)} className="p-2 hover:bg-white/20 rounded-full transition"><FaTimes size={18} /></button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><FaUserCircle className="text-blue-600 text-xl" /> Citizen Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-gray-500">Full Name</p><p className="font-semibold text-gray-800">{selectedSurvey.userId?.name || 'N/A'}</p></div>
                          <div><p className="text-xs text-gray-500">Email Address</p><p className="font-semibold text-gray-800">{selectedSurvey.userId?.email || 'N/A'}</p></div>
                          <div><p className="text-xs text-gray-500">Phone Number</p><p className="font-semibold text-gray-800">{selectedSurvey.userId?.phone || 'N/A'}</p></div>
                          <div><p className="text-xs text-gray-500">NID Number</p><p className="font-semibold text-gray-800">{selectedSurvey.userId?.nid || 'N/A'}</p></div>
                          <div className="col-span-2"><p className="text-xs text-gray-500">Address</p><p className="font-semibold text-gray-800">{selectedSurvey.userId?.address || 'N/A'}</p></div>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                        <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><FaClipboardList className="text-amber-600" /> Complaint Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-gray-500">Complaint Number</p><p className="font-semibold text-gray-800 font-mono">{selectedSurvey.complaintId?.complaintNumber || 'N/A'}</p></div>
                          <div><p className="text-xs text-gray-500">Department</p><p className="font-semibold text-gray-800">{selectedSurvey.department}</p></div>
                          <div><p className="text-xs text-gray-500">Issue Keyword</p><p className="font-semibold text-gray-800">{selectedSurvey.issueKeyword}</p></div>
                          <div><p className="text-xs text-gray-500">Priority Level</p><p className="font-semibold text-gray-800 capitalize">{selectedSurvey.priority || 'N/A'}</p></div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                        <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2"><FaStar className="text-green-600" /> Satisfaction Rating</h4>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Overall Rating:</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (<FaStar key={i} className={i < selectedSurvey.satisfaction ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"} />))}
                            </div>
                            <span className="font-bold text-lg ml-2">{selectedSurvey.satisfaction} / 5</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-600 mb-1">Was the solution helpful?</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${selectedSurvey.helpful ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {selectedSurvey.helpful ? '✓ Yes, very helpful' : '✗ No, not helpful'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2"><FaComment className="text-purple-600" /> Citizen Feedback</h4>
                          <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedSurvey.feedback || 'No feedback provided'}</div>
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
                          <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2"><FaLightbulb className="text-indigo-600" /> Solution Provided</h4>
                          <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedSurvey.solution || 'No solution provided'}</div>
                        </div>
                      </div>
                      <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
                        <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2"><FaCalendarAlt className="text-rose-600" /> Resolution Timeline</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center"><p className="text-xs text-gray-500">Issue Date</p><p className="font-bold text-rose-800">{new Date(selectedSurvey.issueDate).toLocaleDateString()}</p></div>
                          <div className="text-center"><p className="text-xs text-gray-500">Resolved Date</p><p className="font-bold text-rose-800">{new Date(selectedSurvey.resolveDate).toLocaleDateString()}</p></div>
                          <div className="text-center"><p className="text-xs text-gray-500">Resolution Time</p><p className="font-bold text-emerald-700 text-lg">{selectedSurvey.resolutionTime} days</p></div>
                        </div>
                      </div>
                      <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Survey submitted on {new Date(selectedSurvey.createdAt).toLocaleString()}</p>
                        {selectedSurvey.updatedAt && selectedSurvey.updatedAt !== selectedSurvey.createdAt && (<p className="text-xs text-gray-400 mt-1">Last updated on {new Date(selectedSurvey.updatedAt).toLocaleString()}</p>)}
                      </div>
                    </div>
                    <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end rounded-b-2xl">
                      <button onClick={() => setShowSurveyDetail(false)} className="sc-btn-primary">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="sc-card p-6">
                <h3 className="sc-section-title mb-5"><FaClock className="text-blue-500" /> Resolution Time Targets</h3>
                <div className="space-y-3">
                  {['Passport Office', 'Electricity', 'Road Maintenance', 'Waste Management'].map(dept => (
                    <div key={dept} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-40 flex-shrink-0">{dept}</span>
                      <input type="number" min="1" placeholder="Days" className="sc-input text-sm" />
                      <button className="sc-btn-primary text-xs py-2 px-3">Set</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sc-card p-6">
                <h3 className="sc-section-title mb-5"><FaCog className="text-slate-500" /> System Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: "Maintenance Mode", desc: "Temporarily disable public access" },
                    { label: "Auto-verify Documents", desc: "Automatically approve uploaded documents" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div><p className="text-sm font-medium text-slate-800">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS ──────────────────────────────────────────────── */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="sc-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="sc-section-title"><FaCalendarAlt className="text-blue-500" /> Report Period</h3>
                  <button onClick={() => setShowDatePicker(v => !v)} className="sc-btn-ghost text-xs">{showDatePicker ? 'Hide' : 'Select Date Range'}</button>
                </div>
                {showDatePicker && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Start Date</label><input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="sc-input text-sm" /></div>
                    <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">End Date</label><input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="sc-input text-sm" /></div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { label: "Last 7 Days", days: 7 },
                    { label: "Last 30 Days", days: 30 },
                    { label: "Last 3 Months", days: 90 },
                    { label: "Last Year", days: 365 },
                  ].map(({ label, days }) => (
                    <button key={label} className="sc-btn-ghost text-xs" onClick={() => setDateRange({ start: new Date(Date.now() - days * 86400000).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] })}>{label}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Service Usage Report", desc: "Statistics and department analysis", icon: FaChartBar, accent: "#2563eb", bg: "#eff6ff", action: handleGenerateServiceReport },
                  { label: "User Activity Report", desc: "Engagement and activity metrics", icon: FaUsers, accent: "#059669", bg: "#ecfdf5", action: handleGenerateUserActivityReport },
                  { label: "Comprehensive Report", desc: "Complete system overview and KPIs", icon: FaFilePdf, accent: "#7c3aed", bg: "#f5f3ff", action: handleGenerateCombinedReport },
                ].map((r, i) => (
                  <div key={i} className="sc-card p-6 hover:shadow-lg transition-shadow">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: r.bg }}><r.icon style={{ color: r.accent, fontSize: '1.1rem' }} /></div>
                    <h3 className="font-bold text-slate-800 mb-1">{r.label}</h3>
                    <p className="text-xs text-slate-400 mb-5">{r.desc}</p>
                    <button onClick={r.action} disabled={generating} className="sc-btn-primary w-full justify-center" style={{ background: r.accent }}>
                      {generating ? <FaSpinner className="animate-spin" /> : <FaDownload />} Generate PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Quick Status Update Modal ─────────────────────────────────────── */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Quick Status Update</h3>
              <button onClick={() => { setShowComplaintModal(false); setSelectedComplaint(null); setAdminComment(""); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"><FaTimes size={12} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Complaint #{selectedComplaint.complaintNumber}</p>
                <p className="font-semibold text-slate-800">{selectedComplaint.citizenName}</p>
                <p className="text-sm text-slate-500">{selectedComplaint.department} — {selectedComplaint.issueKeyword}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedComplaint.description}</p>
              </div>
              <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Update Status</label><select onChange={e => setAdminComment(e.target.value)} className="sc-input text-sm" defaultValue=""><option value="">Select new status</option><option value="Processing">Mark as Processing</option><option value="Resolved">Mark as Resolved</option></select></div>
              <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Admin Comment</label><textarea value={adminComment} onChange={e => setAdminComment(e.target.value)} placeholder="Add official comment…" rows="3" className="sc-input resize-none text-sm" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => updateComplaintStatus(selectedComplaint._id, 'Processing')} className="flex-1 sc-btn-primary justify-center" style={{ background: '#2563eb' }}><FaClock size={12} /> Processing</button>
                <button onClick={() => updateComplaintStatus(selectedComplaint._id, 'Resolved')} className="flex-1 sc-btn-primary justify-center" style={{ background: '#059669' }}><FaCheckCircle size={12} /> Resolved</button>
                <button onClick={() => { setShowComplaintModal(false); setSelectedComplaintDetail(selectedComplaint); setShowComplaintDetail(true); }} className="flex-1 sc-btn-ghost justify-center"><FaEye size={12} /> Full Details</button>
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD

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
=======
>>>>>>> 3c8289d15fa9d470ef64cf6f98721546cd2e5dc1
    </div>
  );
}