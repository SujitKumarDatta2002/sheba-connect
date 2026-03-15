
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
  FaEdit
} from "react-icons/fa";
import jsPDF from "jspdf";

export default function Complaints() {

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const userId = "64b123456789abcdef123456";

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

  const fetchComplaints = async () => {
    setLoading(true);
    try {

      const res = await axios.get("http://localhost:5000/api/complaints");

      const complaintsWithDetails = res.data.map(complaint => ({
        ...complaint,
        citizenName: complaint.citizenName || "Not Provided",
        citizenId: complaint.citizenId || "N/A",
        contactNumber: complaint.contactNumber || "N/A",
        email: complaint.email || "N/A",
        address: complaint.address || "N/A",
        priority: complaint.priority || "medium",
        complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`,
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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSubmitting(true);

    try {

      if (
        !formData.citizenName ||
        !formData.citizenId ||
        !formData.contactNumber ||
        !formData.department ||
        !formData.issueKeyword ||
        !formData.description
      ) {

        alert("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const complaintData = {

        userId,
        citizenName: formData.citizenName,
        citizenId: formData.citizenId,
        contactNumber: formData.contactNumber,
        email: formData.email,
        address: formData.address,
        department: formData.department,
        issueKeyword: formData.issueKeyword,
        description: formData.description,
        priority: formData.priority,

        timeline: [
          {
            status: "Pending",
            comment: "Complaint submitted successfully",
            updatedBy: formData.citizenName,
            date: new Date()
          }
        ]
      };

      const res = await axios.post(
        "http://localhost:5000/api/complaints/create",
        complaintData
      );

      setComplaints(prev => [res.data, ...prev]);

      setFormData({
        department: "",
        issueKeyword: "",
        description: "",
        priority: "medium",
        citizenName: "",
        citizenId: "",
        contactNumber: "",
        email: "",
        address: ""
      });

      setShowForm(false);

    } catch (error) {

      console.error(error);
      alert("Error submitting complaint");

    }

    setSubmitting(false);

  };

  const deleteComplaint = async () => {

    try {

      await axios.delete(
        `http://localhost:5000/api/complaints/${deleteTarget}`
      );

      setComplaints(prev =>
        prev.filter(c => c._id !== deleteTarget)
      );

      setDeleteTarget(null);

    } catch (error) {
      console.error(error);
    }

  };

  const filteredComplaints = complaints.filter(c => {

    const matchesSearch =
      c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || c.status === filterStatus;

    return matchesSearch && matchesFilter;

  });

  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const getStatusBadge = (status) => {

    if (status === "Resolved") {

      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <FaCheckCircle /> Resolved
        </span>
      );

    }

    if (status === "Pending") {

      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <FaClock /> Pending
        </span>
      );

    }

    return (
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
        {status}
      </span>
    );

  };

  return (

    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b px-6 py-4">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">
            <FaClipboardList className="text-blue-600 text-xl"/>
            <h1 className="text-xl font-bold">Complaint Management</h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus />
            File Complaint
          </button>

        </div>

      </header>

      <div className="p-6">

        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded shadow">
            <p>Total</p>
            <h2 className="text-2xl font-bold">{complaints.length}</h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Pending</p>
            <h2 className="text-2xl font-bold text-yellow-500">{pending}</h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Resolved</p>
            <h2 className="text-2xl font-bold text-green-600">{resolved}</h2>
          </div>

        </div>

        <input
          type="text"
          placeholder="Search complaints..."
          className="border p-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />

        <table className="w-full bg-white shadow rounded">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Citizen</th>
              <th className="p-3">Department</th>
              <th className="p-3">Issue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>

            ) : (

              filteredComplaints.map(c => (
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

                <tr key={c._id} className="border-t">

                  <td className="p-3">{c.citizenName}</td>
                  <td className="p-3">{c.department}</td>
                  <td className="p-3">{c.issueKeyword}</td>
                  <td className="p-3">{getStatusBadge(c.status)}</td>

                  <td className="p-3 flex gap-3">

                    <button
                      onClick={()=>setSelectedComplaint(c)}
                      className="text-blue-600"
                    >
                      <FaEye/>
                    </button>

                    <button
                      onClick={()=>setDeleteTarget(c._id)}
                      className="text-red-600"
                    >
                      <FaTrash/>
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}