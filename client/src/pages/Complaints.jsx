

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaClipboardList, 
  FaTrash, 
  FaEye, 
  FaPlus,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFileAlt,
  FaHistory,
  FaSpinner,
  FaFilePdf,
  FaEdit,
  FaDownload,
  FaCopy,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckDouble,
  FaHourglassHalf,
  FaShieldAlt,
  FaStamp,
  FaUser,
  FaPrint
} from "react-icons/fa";
import jsPDF from "jspdf";

export default function Complaints({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedForTimeline, setSelectedForTimeline] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [editedTemplate, setEditedTemplate] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  // Check if current user is admin
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  // Get current user data
  const getCurrentUser = () => {
    return user || JSON.parse(localStorage.getItem("user") || "{}");
  };

  const currentUser = getCurrentUser();

  // Form state - pre-filled with user data
  const [formData, setFormData] = useState({
    department: "",
    issueKeyword: "",
    description: "",
    priority: "medium",
    citizenName: currentUser?.name || "",
    citizenId: currentUser?.nid || "",
    contactNumber: currentUser?.phone || "",
    email: currentUser?.email || "",
    address: currentUser?.address || ""
  });

  // Update formData when user changes or from localStorage
  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setFormData(prev => ({
        ...prev,
        citizenName: userData.name || prev.citizenName || "",
        citizenId: userData.nid || prev.citizenId || "",
        contactNumber: userData.phone || prev.contactNumber || "",
        email: userData.email || prev.email || "",
        address: userData.address || prev.address || ""
      }));
    }
  }, [user]);

  // Get userId from user object or localStorage
  const userId = currentUser?._id || "64b123456789abcdef123456";

  // Fetch complaints from database
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      
      const complaintsWithDetails = res.data.map(complaint => ({
        ...complaint,
        citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided",
        citizenId: complaint.citizenId || "N/A",
        contactNumber: complaint.contactNumber || "N/A",
        email: complaint.email || "N/A",
        address: complaint.address || "N/A",
        priority: complaint.priority || "medium",
        complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`,
        userId: complaint.userId?._id || complaint.userId, // Normalize userId
        timeline: complaint.timeline || [
          {
            status: "Submitted",
            date: complaint.createdAt || new Date().toISOString(),
            comment: "Complaint submitted successfully",
            updatedBy: "System"
          }
        ]
      }));
      
      setComplaints(complaintsWithDetails);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Generate formal government complaint template
  const generateGovernmentTemplate = (department, keyword, userData) => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const departmentMap = {
      "Passport Office": "The Regional Passport Officer",
      "Electricity": "The General Manager, DESCO",
      "Road Maintenance": "The Executive Engineer, Roads and Highways Department",
      "Waste Management": "The Chief Waste Management Officer, Dhaka City Corporation",
      "Health Services": "The Director, Health Services",
      "Education": "The District Education Officer",
      "Revenue": "The Deputy Commissioner, Revenue Department",
      "Municipal Services": "The Mayor, City Corporation"
    };

    return `====================================================================
              GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH
              Ministry of Public Administration
              ${department}
====================================================================

FORMAL COMPLAINT LETTER

Ref No: ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}
Date: ${currentDate}

To,
${departmentMap[department] || "The Concerned Authority"},
${department},
Government of Bangladesh,
Dhaka.

Through: Proper Channel

Subject: Formal Complaint Regarding ${keyword}

====================================================================
              COMPLAINANT DETAILS
====================================================================

Name of Complainant   : ${userData.citizenName}
National ID Number     : ${userData.citizenId}
Permanent Address      : ${userData.address}
Contact Number         : ${userData.contactNumber}
Email Address          : ${userData.email || 'N/A'}

====================================================================
              COMPLAINT DETAILS
====================================================================

Department Concerned   : ${department}
Nature of Complaint    : ${keyword}
Priority Level         : ${userData.priority?.toUpperCase() || 'MEDIUM'}
Date of Incident       : ${new Date().toLocaleDateString()}
Location of Incident   : ${userData.address}

====================================================================
              DETAILED DESCRIPTION
====================================================================

Respected Sir/Madam,

I, ${userData.citizenName}, bearing NID No. ${userData.citizenId}, a resident of ${userData.address}, would like to draw your kind attention to the following matter:

${userData.description || "[Please provide description]"}

====================================================================
              DECLARATION
====================================================================

I, ${userData.citizenName}, do hereby declare that the information provided above is true and correct to the best of my knowledge and belief.

                                            .....................
                                            (Signature of Complainant)

====================================================================
              OFFICIAL USE ONLY
====================================================================

Complaint Registered By: [OFFICER NAME]
Registration Date      : ${currentDate}
Complaint Number       : ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}

                                                           OFFICIAL STAMP

====================================================================

Thanking you,

Yours faithfully,
${userData.citizenName}
Mobile: ${userData.contactNumber}
NID: ${userData.citizenId}

====================================================================`;
  };

  // Handle department or keyword change to generate template
  useEffect(() => {
    if (formData.department && formData.issueKeyword) {
      const template = generateGovernmentTemplate(
        formData.department, 
        formData.issueKeyword,
        {
          citizenName: formData.citizenName,
          citizenId: formData.citizenId,
          contactNumber: formData.contactNumber,
          email: formData.email,
          address: formData.address,
          priority: formData.priority,
          description: formData.description,
          complaintNumber: `CMP${Date.now().toString().slice(-8)}`
        }
      );
      setGeneratedTemplate(template);
      setEditedTemplate(template);
    }
  }, [formData.department, formData.issueKeyword, formData.description, formData.priority]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTemplateEdit = (e) => {
    setEditedTemplate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!formData.department || !formData.issueKeyword || !formData.description) {
        alert("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const timeline = [
        {
          status: "Pending",
          comment: "Complaint submitted successfully",
          updatedBy: formData.citizenName || "Citizen",
          date: new Date()
        }
      ];

      const complaintData = {
        userId: userId,
        citizenName: formData.citizenName,
        citizenId: formData.citizenId,
        contactNumber: formData.contactNumber,
        email: formData.email || "",
        address: formData.address || "",
        department: formData.department,
        issueKeyword: formData.issueKeyword,
        description: formData.description,
        priority: formData.priority || "medium",
        timeline: timeline
      };

      console.log("Sending data:", complaintData);

      const res = await axios.post("http://localhost:5000/api/complaints/create", complaintData);
      
      console.log("Response:", res.data);
      
      setComplaints(prevComplaints => [res.data, ...prevComplaints]);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setFormData({
        department: "",
        issueKeyword: "",
        description: "",
        priority: "medium",
        citizenName: currentUser?.name || "",
        citizenId: currentUser?.nid || "",
        contactNumber: currentUser?.phone || "",
        email: currentUser?.email || "",
        address: currentUser?.address || ""
      });
      
      setShowForm(false);
      setGeneratedTemplate("");
      setEditedTemplate("");
      
    } catch (error) {
      console.error("Error details:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Server is not responding. Please check if the backend is running on port 5000");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
    setSubmitting(false);
  };

const deleteComplaint = async () => {
  try {
    // Find the complaint to check ownership
    const complaintToDelete = complaints.find(c => c._id === deleteTarget);
    
    if (!complaintToDelete) {
      setDeleteSuccessMessage("Complaint not found");
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
      setDeleteTarget(null);
      return;
    }
    
    // Check if user is authorized to delete
    const isAuthorized = isAdmin || 
      complaintToDelete.userId === currentUser?._id || 
      complaintToDelete.userId?._id === currentUser?._id ||
      complaintToDelete.email === currentUser?.email;
    
    if (!isAuthorized) {
      setDeleteSuccessMessage("You are not authorized to delete this complaint");
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
      setDeleteTarget(null);
      return;
    }
    
    await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`);
    setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== deleteTarget));
    setDeleteTarget(null);
    
    // Show success message
    setDeleteSuccessMessage("Complaint deleted successfully");
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
    
  } catch (error) {
    console.error("Error deleting complaint:", error);
    setDeleteSuccessMessage("Failed to delete complaint. Please try again.");
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
  }
};

  // Admin only: Update complaint status
  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!isAdmin) {
      alert("Only administrators can update complaint status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const timelineEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        comment: adminComment || `Status updated to ${newStatus} by admin`,
        updatedBy: "Admin"
      };

      await axios.put(`http://localhost:5000/api/complaints/${complaintId}`, {
        status: newStatus,
        timeline: [...(selectedForTimeline?.timeline || []), timelineEntry]
      });

      setComplaints(prevComplaints => 
        prevComplaints.map(c => 
          c._id === complaintId 
            ? { ...c, status: newStatus, timeline: [...(c.timeline || []), timelineEntry] }
            : c
        )
      );

      setAdminComment("");
      setSelectedForTimeline(null);
      setShowTimeline(false);
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setUpdatingStatus(false);
  };

  // Download template as PDF
  const downloadTemplateAsPDF = () => {
    const doc = new jsPDF();
    
    // Add content to PDF
    const lines = editedTemplate.split('\n');
    let y = 10;
    
    doc.setFontSize(10);
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 5;
    });
    
    doc.save(`complaint_${formData.department}_${Date.now()}.pdf`);
  };

  // Download template as text file
  const downloadTemplateAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([editedTemplate], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `complaint_${formData.department}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print template
  const printTemplate = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Complaint Form</title>');
    printWindow.document.write('<style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<pre>' + editedTemplate + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Export complaint as PDF
  const exportComplaintAsPDF = (complaint) => {
    const doc = new jsPDF();
    
    let y = 10;
    
    doc.setFontSize(16);
    doc.text("COMPLAINT DETAILS", 10, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Complaint #: ${complaint.complaintNumber || complaint._id}`, 10, y);
    y += 7;
    doc.text(`Citizen: ${complaint.citizenName}`, 10, y);
    y += 7;
    doc.text(`Contact: ${complaint.contactNumber}`, 10, y);
    y += 7;
    doc.text(`Department: ${complaint.department}`, 10, y);
    y += 7;
    doc.text(`Issue: ${complaint.issueKeyword}`, 10, y);
    y += 7;
    doc.text(`Status: ${complaint.status}`, 10, y);
    y += 7;
    doc.text(`Priority: ${complaint.priority}`, 10, y);
    y += 7;
    doc.text(`Date: ${complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "N/A"}`, 10, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.text("Description:", 10, y);
    y += 7;
    doc.setFontSize(11);
    
    const descriptionLines = doc.splitTextToSize(complaint.description || "No description", 180);
    descriptionLines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 5;
    });
    
    doc.save(`complaint_${complaint.complaintNumber || complaint._id}.pdf`);
  };

  // Check if complaint belongs to current user
  const isMyComplaint = (complaint) => {
    if (!currentUser) return false;
    
    const complaintUserId = complaint.userId?._id || complaint.userId;
    const currentUserId = currentUser._id;
    
    // Check by ID
    if (currentUserId && complaintUserId) {
      return complaintUserId === currentUserId;
    }
    
    // Check by email
    if (currentUser.email && complaint.email && complaint.email !== "N/A") {
      return complaint.email.toLowerCase() === currentUser.email.toLowerCase();
    }
    
    // Check by phone
    if (currentUser.phone && complaint.contactNumber && complaint.contactNumber !== "N/A") {
      return complaint.contactNumber === currentUser.phone;
    }
    
    // Check by name (case insensitive)
    if (currentUser.name && complaint.citizenName && complaint.citizenName !== "Not Provided") {
      return complaint.citizenName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
    }
    
    return false;
  };

  // Filter complaints based on search and active tab
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === "" || 
      c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    
    // Filter by "My Complaints" tab
    let matchesTab = true;
    if (activeTab === "my") {
      matchesTab = isMyComplaint(c);
    }
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const inProgress = complaints.filter(c => c.status === "In Progress" || c.status === "Processing").length;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Resolved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
      case 'In Progress':
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaExclamationCircle /> Processing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High Priority</span>;
      case 'medium':
        return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium Priority</span>;
      case 'low':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low Priority</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-4">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-6 mb-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg">
              <FaClipboardList className="text-4xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Complaint Services</h1>
              <p className="text-blue-100 text-lg">Government of Bangladesh • Citizen Grievance Redressal System</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-blue-200">
                <FaShieldAlt />
                <span>Your complaints are securely handled as per the Digital Security Act, 2018</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <FaCheckCircle className="text-2xl" />
            <div>
              <h4 className="font-bold">Complaint Submitted Successfully!</h4>
              <p className="text-sm">Your complaint has been registered and will be processed soon.</p>
            </div>
          </div>
        </div>
      )}
{/* Delete Success Message */}
{showDeleteSuccess && (
  <div className="fixed top-20 right-6 z-50 animate-slideIn">
    <div className={`${
      deleteSuccessMessage.includes("successfully") 
        ? "bg-green-500" 
        : "bg-red-500"
    } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
      <div className="flex-shrink-0">
        {deleteSuccessMessage.includes("successfully") ? (
          <FaCheckCircle className="text-2xl" />
        ) : (
          <FaExclamationCircle className="text-2xl" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{deleteSuccessMessage}</p>
      </div>
      <button
        onClick={() => setShowDeleteSuccess(false)}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
      {/* Main Content */}
      <div className="container mx-auto px-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Complaints</p>
                <h3 className="text-3xl font-bold text-gray-800">{complaints.length}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FaCheckDouble /> System Active
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaClipboardList className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                <h3 className="text-3xl font-bold text-yellow-500">{pending}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaHourglassHalf /> Awaiting processing
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <h3 className="text-3xl font-bold text-blue-500">{inProgress}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaSpinner className="animate-spin" /> Being processed
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaExclamationCircle className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolved</p>
                <h3 className="text-3xl font-bold text-green-600">{resolved}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FaCheckCircle /> Successfully closed
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "all" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Complaints
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "my" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            My Complaints
          </button>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="🔍 Search by complaint ID, citizen name, department, or issue..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">📊 All Status</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Processing">⚙️ Processing</option>
                  <option value="Resolved">✅ Resolved</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <FaPlus />
                File New Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Complaint Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <FaStamp className="text-blue-600" />
                      File a Formal Complaint
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Your information is pre-filled from your profile as per government records
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Citizen Information */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
                        <FaUserTie /> Complainant Information (As per NID)
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaUser className="text-blue-500" /> Full Name:
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              name="citizenName"
                              value={formData.citizenName}
                              readOnly
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaIdCard className="text-blue-500" /> NID Number:
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              name="citizenId"
                              value={formData.citizenId}
                              readOnly
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaPhone className="text-blue-500" /> Contact:
                          </div>
                          <div className="col-span-2">
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              readOnly
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaEnvelope className="text-blue-500" /> Email:
                          </div>
                          <div className="col-span-2">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              readOnly
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500" /> Address:
                          </div>
                          <div className="col-span-2">
                            <textarea
                              name="address"
                              value={formData.address}
                              readOnly
                              rows="2"
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Complaint Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
                      <h3 className="font-semibold text-orange-800 border-b border-orange-200 pb-2 mb-4 flex items-center gap-2">
                        <FaBuilding /> Complaint Details
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaBuilding className="text-orange-500" /> Department *
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                          >
                            <option value="">Select Government Department</option>
                            <option value="Passport Office">🏛️ Passport Office</option>
                            <option value="Electricity">⚡ Electricity (DESCO)</option>
                            <option value="Road Maintenance">🛣️ Roads & Highways</option>
                            <option value="Waste Management">🗑️ Waste Management</option>
                            <option value="Health Services">🏥 Health Services</option>
                            <option value="Education">📚 Education</option>
                            <option value="Revenue">💰 Revenue</option>
                            <option value="Municipal Services">🏙️ Municipal Services</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaExclamationCircle className="text-orange-500" /> Issue Keyword *
                          </label>
                          <input
                            type="text"
                            name="issueKeyword"
                            value={formData.issueKeyword}
                            onChange={handleChange}
                            placeholder="e.g., passport delay, power outage, bill issue"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaExclamationCircle className="text-orange-500" /> Priority Level
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">🟢 Low Priority</option>
                            <option value="medium">🟡 Medium Priority</option>
                            <option value="high">🔴 High Priority (Urgent)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaFileAlt className="text-orange-500" /> Detailed Description *
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please provide detailed description of your complaint including dates, locations, and any relevant information..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Format Template Preview */}
                {generatedTemplate && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-800 flex items-center gap-2 text-lg">
                        <FaStamp className="text-blue-600" />
                        Official Government Complaint Format
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(editedTemplate)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 transition-colors"
                        >
                          <FaCopy /> Copy
                        </button>
                        <button
                          type="button"
                          onClick={downloadTemplateAsPDF}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2 transition-colors"
                        >
                          <FaFilePdf /> PDF
                        </button>
                        <button
                          type="button"
                          onClick={downloadTemplateAsText}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2 transition-colors"
                        >
                          <FaDownload /> Text
                        </button>
                        <button
                          type="button"
                          onClick={printTemplate}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 transition-colors"
                        >
                          <FaPrint /> Print
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={editedTemplate}
                      onChange={handleTemplateEdit}
                      className="w-full h-96 p-4 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <FaShieldAlt className="text-green-500" />
                      This format complies with the Government of Bangladesh official correspondence guidelines
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-8 border-t mt-8">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaStamp />
                        Submit Formal Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaClipboardList className="text-blue-600" />
                Complaint Records
              </h2>
              <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Complaint #</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Citizen Details</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Issue</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500">Loading complaints from server...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500">
                      <FaClipboardList className="text-5xl mx-auto mb-3 text-gray-300" />
                      {activeTab === "my" ? 
                        "You haven't filed any complaints yet. Click 'File New Complaint' to get started." : 
                        "No complaints found"}
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-blue-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {c.complaintNumber || `#${c._id?.slice(-6)}`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{c.citizenName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FaPhone className="text-xs" /> {c.contactNumber}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{c.department}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{c.issueKeyword}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs mt-1">
                            {c.description?.substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(c.priority)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedForTimeline(c);
                              setShowTimeline(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Timeline"
                          >
                            <FaHistory />
                          </button>
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => exportComplaintAsPDF(c)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Export as PDF"
                          >
                            <FaFilePdf />
                          </button>
                          {/* Show delete button for admins OR for the user who owns the complaint */}
                          {(isAdmin || isMyComplaint(c)) && (
                            <button
                              onClick={() => setDeleteTarget(c._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={isAdmin ? "Delete (Admin)" : "Delete your complaint"}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimeline && selectedForTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaHistory /> Complaint Timeline
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">
                    #{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTimeline(false);
                    setSelectedForTimeline(null);
                    setAdminComment("");
                  }}
                  className="text-white hover:bg-purple-800 p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedForTimeline.timeline?.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        entry.status === 'Resolved' ? 'bg-green-500' :
                        entry.status === 'Processing' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      {index < (selectedForTimeline.timeline?.length - 1) && (
                        <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                        {entry.comment}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Updated by: {entry.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Only Status Update Section */}
              {isAdmin && selectedForTimeline.status !== "Resolved" && (
                <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <FaShieldAlt /> Admin Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        value={adminComment.split('|')[0] || "Processing"}
                        onChange={(e) => {
                          const comment = adminComment.split('|')[1] || "";
                          setAdminComment(e.target.value + '|' + comment);
                        }}
                      >
                        <option value="Processing">⚙️ Mark as Processing</option>
                        <option value="Resolved">✅ Mark as Resolved</option>
                      </select>
                      <button
                        onClick={() => updateComplaintStatus(
                          selectedForTimeline._id, 
                          adminComment.split('|')[0] || "Processing"
                        )}
                        disabled={updatingStatus}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 font-medium"
                      >
                        {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                        Update
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Add official comment (optional)"
                      className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      value={adminComment.split('|')[1] || ""}
                      onChange={(e) => setAdminComment(
                        (adminComment.split('|')[0] || "Processing") + '|' + e.target.value
                      )}
                    />
                    <p className="text-xs text-purple-600 flex items-center gap-1">
                      <FaShieldAlt /> Only administrators can update complaint status
                    </p>
                  </div>
                </div>
              )}

              {!isAdmin && selectedForTimeline.status !== "Resolved" && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 flex items-center gap-2">
                    <FaClock /> Status updates can only be made by authorized government officials.
                    Please wait for official response.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowTimeline(false);
                  setSelectedForTimeline(null);
                  setAdminComment("");
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaEye /> Complaint Details
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Complaint Number</p>
                  <p className="font-mono font-medium">{selectedComplaint.complaintNumber || selectedComplaint._id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Citizen Name</p>
                  <p className="font-medium">{selectedComplaint.citizenName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Contact</p>
                  <p>{selectedComplaint.contactNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{selectedComplaint.department}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Priority</p>
                  <p>{getPriorityBadge(selectedComplaint.priority)}</p>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Issue</p>
                  <p className="font-medium">{selectedComplaint.issueKeyword}</p>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-gray-700 mt-1">{selectedComplaint.description}</p>
                </div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Submitted On</p>
                  <p>{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setSelectedForTimeline(selectedComplaint);
                  setShowTimeline(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FaHistory />
                View Timeline
              </button>
              <button
                onClick={() => exportComplaintAsPDF(selectedComplaint)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FaFilePdf />
                Export PDF
              </button>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaTrash /> Confirm Deletion
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this complaint? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteComplaint}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
