

// client/src/pages/UploadDocument.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUpload, FaFilePdf, FaTimes, FaCheckCircle, 
  FaArrowLeft, FaInfoCircle, FaFileAlt, FaShieldAlt,
  FaCloudUploadAlt, FaTrash, FaDownload, FaEye,
  FaCertificate, FaGraduationCap  // new icons
} from "react-icons/fa";

export default function UploadDocument() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [existingDocument, setExistingDocument] = useState(null);
  const [fetchingDoc, setFetchingDoc] = useState(true);

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch existing document for this type
  useEffect(() => {
    const fetchExistingDocument = async () => {
      setFetchingDoc(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/documents", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const doc = res.data.find(d => d.documentType === type);
        if (doc) {
          setExistingDocument(doc);
        }
      } catch (err) {
        console.error("Error fetching existing document:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setFetchingDoc(false);
      }
    };

    if (type) {
      fetchExistingDocument();
    }
  }, [type, navigate]);

  // Document type mapping – updated with new types
  const documentTypeMap = {
    passport: { 
      name: "Passport", 
      icon: FaFileAlt, 
      color: "blue", 
      description: "Upload a clear scan of your passport",
      gradient: "from-blue-600 to-blue-700",
      lightGradient: "from-blue-50 to-indigo-50"
    },
    nid: { 
      name: "National ID", 
      icon: FaFileAlt, 
      color: "purple", 
      description: "Upload a clear scan of your National ID",
      gradient: "from-purple-600 to-purple-700",
      lightGradient: "from-purple-50 to-pink-50"
    },
    birthCertificate: { 
      name: "Birth Certificate", 
      icon: FaFileAlt, 
      color: "pink", 
      description: "Upload a clear scan of your Birth Certificate",
      gradient: "from-pink-600 to-rose-600",
      lightGradient: "from-pink-50 to-rose-50"
    },
    tin: { 
      name: "TIN Certificate", 
      icon: FaFileAlt, 
      color: "green", 
      description: "Upload a clear scan of your TIN Certificate",
      gradient: "from-green-600 to-emerald-600",
      lightGradient: "from-green-50 to-emerald-50"
    },
    drivingLicense: { 
      name: "Driving License", 
      icon: FaFileAlt, 
      color: "orange", 
      description: "Upload a clear scan of your Driving License",
      gradient: "from-orange-600 to-amber-600",
      lightGradient: "from-orange-50 to-amber-50"
    },
    // New document types
    citizenship: { 
      name: "Citizenship Certificate", 
      icon: FaCertificate, 
      color: "indigo", 
      description: "Upload a clear scan of your Citizenship Certificate",
      gradient: "from-indigo-600 to-indigo-700",
      lightGradient: "from-indigo-50 to-blue-50"
    },
    educationalCertificate: { 
      name: "Educational Certificate", 
      icon: FaGraduationCap, 
      color: "teal", 
      description: "Upload your SSC/HSC or equivalent certificate",
      gradient: "from-teal-600 to-teal-700",
      lightGradient: "from-teal-50 to-cyan-50"
    }
  };

  const currentDoc = documentTypeMap[type] || { 
    name: type, 
    icon: FaFileAlt, 
    color: "blue", 
    description: "Upload your document",
    gradient: "from-blue-600 to-indigo-600",
    lightGradient: "from-blue-50 to-indigo-50"
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected) => {
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      showNotification("Only PDF files are allowed", "error");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      showNotification("File size must be less than 10MB", "error");
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    
    showNotification("File selected successfully", "success");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const dropped = e.dataTransfer.files[0];
    validateAndSetFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", type);

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        "http://localhost:5000/api/documents",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      showNotification("Document uploaded successfully", "success");
      
      setTimeout(() => {
        navigate("/documents");
      }, 1500);

    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showNotification(err.response?.data?.message || "Upload failed. Please try again.", "error");
      }
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const deleteExistingDocument = async () => {
    if (!existingDocument) return;
    
    if (!window.confirm(`Are you sure you want to delete your existing ${currentDoc.name}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/documents/${existingDocument._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setExistingDocument(null);
      showNotification("Document deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting document:", err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showNotification("Failed to delete document", "error");
      }
    }
  };

  const downloadExistingDocument = async () => {
    if (!existingDocument) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/documents/${existingDocument._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', existingDocument.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading document:", err);
      showNotification("Failed to download document", "error");
    }
  };

  const viewExistingDocument = async () => {
    if (!existingDocument) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/documents/${existingDocument._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (err) {
      console.error("Error viewing document:", err);
      showNotification("Failed to view document", "error");
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (fetchingDoc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/documents")}
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-gray-300"
        >
          <FaArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900">Back to Documents</span>
        </button>

        {/* Existing Document Card */}
        {existingDocument && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaFilePdf className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Existing {currentDoc.name}</h3>
                  <p className="text-sm text-gray-600">Uploaded on {new Date(existingDocument.uploadedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      existingDocument.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      existingDocument.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {existingDocument.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={viewExistingDocument}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="View"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadExistingDocument}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  title="Download"
                >
                  <FaDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={deleteExistingDocument}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp border border-gray-100">
          {/* Header with Document Type */}
          <div className={`bg-gradient-to-r ${currentDoc.gradient} px-8 py-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <currentDoc.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {existingDocument ? 'Update' : 'Upload'} {currentDoc.name}
                </h1>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <FaCloudUploadAlt className="w-4 h-4" />
                  {currentDoc.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Upload Stats Card */}
            <div className={`bg-gradient-to-r ${currentDoc.lightGradient} rounded-xl p-6 mb-8 border border-${currentDoc.color}-200 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentDoc.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                    <FaShieldAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure Upload</h3>
                    <p className="text-sm text-gray-600">Your documents are encrypted and securely stored</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Max file size</p>
                      <p className="font-semibold text-gray-800">10 MB</p>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Format</p>
                      <p className="font-semibold text-gray-800">PDF only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Info */}
            <div className="bg-amber-50 rounded-xl p-5 mb-8 flex items-start gap-4 border border-amber-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaInfoCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800 mb-2">Document Requirements:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    PDF format only
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Maximum file size: 10MB
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Clear and legible scan required
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    All corners of document visible
                  </li>
                </ul>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                ${dragActive 
                  ? `border-${currentDoc.color}-500 bg-${currentDoc.color}-50 scale-105 shadow-lg` 
                  : file 
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50 hover:shadow-md'
                }`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <FaCheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-800 mb-2">File Ready for Upload</p>
                  <p className="text-sm text-gray-500">Click or drag to replace</p>
                </div>
              ) : (
                <>
                  <div className={`w-20 h-20 bg-gradient-to-br ${currentDoc.lightGradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <FaUpload className={`w-8 h-8 text-${currentDoc.color}-600 transition-transform ${dragActive ? 'translate-y-1' : ''}`} />
                  </div>
                  <p className="text-lg font-medium text-gray-800 mb-2">
                    {dragActive ? 'Drop your file here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">or</p>
                  <button className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentDoc.gradient} text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 shadow-md font-medium`}>
                    <FaUpload className="w-4 h-4" />
                    Browse Files
                  </button>
                  <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <FaFilePdf className="w-3 h-3" />
                    Supported format: PDF (Max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* File Info & Preview */}
            {file && (
              <div className="mt-8 space-y-6 animate-slideUp">
                {/* File Details Card */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center shadow-sm">
                        <FaFilePdf className="w-7 h-7 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">{file.name}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-gray-600">PDF</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-emerald-600 font-medium">Ready to upload</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-3 hover:bg-gray-200 rounded-xl transition-colors group"
                      title="Remove file"
                    >
                      <FaTimes className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                    </button>
                  </div>

                  {/* Upload Progress Bar */}
                  {loading && (
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Uploading to secure storage...</span>
                        <span className={`font-bold text-${currentDoc.color}-600`}>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${currentDoc.gradient} h-3 rounded-full transition-all duration-300 relative overflow-hidden`}
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF Preview */}
                {previewUrl && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <div className={`bg-gradient-to-r ${currentDoc.lightGradient} px-5 py-3 border-b border-gray-200 flex items-center justify-between`}>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <FaFilePdf className="text-rose-600" />
                        Document Preview
                      </h3>
                      <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 shadow-sm">
                        Preview Mode
                      </span>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full h-96 bg-gray-100"
                      title="PDF Preview"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {file ? (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Uploading... {uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-5 h-5" />
                        <span>{existingDocument ? 'Update Document' : 'Upload Document'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={removeFile}
                    disabled={loading}
                    className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-sm"
                  >
                    <FaTimes className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Select a file to begin uploading</p>
                  <p className="text-sm text-gray-400 mt-1">Your document will be securely stored</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

