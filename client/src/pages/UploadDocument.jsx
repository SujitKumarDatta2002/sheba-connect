

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaUpload, FaFilePdf, FaTimes } from "react-icons/fa";

// export default function UploadDocument() {

//   const { type } = useParams();
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {

//     const selected = e.target.files[0];

//     if (!selected) return;

//     if (selected.type !== "application/pdf") {
//       alert("Only PDF files are allowed");
//       return;
//     }

//     setFile(selected);

//     // Create preview URL
//     const url = URL.createObjectURL(selected);
//     setPreviewUrl(url);
//   };

//   const handleUpload = async () => {

//     if (!file) {
//       alert("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentType", type);

//     try {

//       setLoading(true);

//       await axios.post(
//         "http://localhost:5000/api/documents",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       alert("Document uploaded successfully");

//       navigate("/documents");

//     } catch (err) {

//       console.log(err);
//       alert("Upload failed");

//     }

//     setLoading(false);
//   };

//   const removeFile = () => {
//     setFile(null);
//     setPreviewUrl(null);
//   };

//   // Cleanup preview URL
//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   return (

//     <div className="p-10 flex justify-center">

//       <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-8">

//         <h1 className="text-2xl font-bold mb-6 capitalize">
//           Upload {type}
//         </h1>

//         {/* Drag Drop Box */}

//         <label className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-500 transition block">

//           <input
//             type="file"
//             accept="application/pdf"
//             className="hidden"
//             onChange={handleFileChange}
//           />

//           <FaUpload className="text-4xl text-blue-600 mx-auto mb-3" />

//           <p className="text-gray-600">
//             Drag & drop your PDF here or click to browse
//           </p>

//           <p className="text-sm text-gray-400 mt-1">
//             Only PDF files allowed
//           </p>

//         </label>


//         {/* File Info */}

//         {file && (

//           <div className="mt-6 flex items-center justify-between bg-gray-100 p-4 rounded">

//             <div className="flex items-center gap-3">

//               <FaFilePdf className="text-red-600 text-xl" />

//               <div>

//                 <p className="font-medium">
//                   {file.name}
//                 </p>

//                 <p className="text-sm text-gray-500">
//                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                 </p>

//               </div>

//             </div>

//             <button
//               onClick={removeFile}
//               className="text-red-500"
//             >
//               <FaTimes />
//             </button>

//           </div>

//         )}


//         {/* PDF Preview */}

//         {previewUrl && (

//           <div className="mt-6 border rounded-lg overflow-hidden">

//             <div className="bg-gray-100 px-4 py-2 font-medium">
//               PDF Preview
//             </div>

//             <iframe
//               src={previewUrl}
//               className="w-full h-96"
//               title="PDF Preview"
//             />

//           </div>

//         )}


//         {/* Upload Button */}

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//         >

//           {loading ? "Uploading..." : "Upload Document"}

//         </button>

//       </div>

//     </div>

//   );
// }












// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   FaUpload, FaFilePdf, FaTimes, FaCheckCircle, 
//   FaArrowLeft, FaInfoCircle, FaFileAlt 
// } from "react-icons/fa";

// export default function UploadDocument() {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//   // Document type mapping for better display
//   const documentTypeMap = {
//     passport: { name: "Passport", icon: FaFileAlt, color: "blue", description: "Upload a clear scan of your passport" },
//     nid: { name: "National ID", icon: FaFileAlt, color: "purple", description: "Upload a clear scan of your National ID" },
//     birthCertificate: { name: "Birth Certificate", icon: FaFileAlt, color: "pink", description: "Upload a clear scan of your Birth Certificate" },
//     tin: { name: "TIN Certificate", icon: FaFileAlt, color: "green", description: "Upload a clear scan of your TIN Certificate" },
//     drivingLicense: { name: "Driving License", icon: FaFileAlt, color: "orange", description: "Upload a clear scan of your Driving License" }
//   };

//   const currentDoc = documentTypeMap[type] || { 
//     name: type, 
//     icon: FaFileAlt, 
//     color: "blue", 
//     description: "Upload your document" 
//   };

//   const showNotification = (message, type) => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
//   };

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     validateAndSetFile(selected);
//   };

//   const validateAndSetFile = (selected) => {
//     if (!selected) return;

//     if (selected.type !== "application/pdf") {
//       showNotification("Only PDF files are allowed", "error");
//       return;
//     }

//     if (selected.size > 10 * 1024 * 1024) { // 10MB limit
//       showNotification("File size must be less than 10MB", "error");
//       return;
//     }

//     setFile(selected);

//     // Create preview URL
//     const url = URL.createObjectURL(selected);
//     setPreviewUrl(url);
    
//     showNotification("File selected successfully", "success");
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const dropped = e.dataTransfer.files[0];
//     validateAndSetFile(dropped);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       showNotification("Please select a file", "error");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentType", type);

//     try {
//       setLoading(true);
      
//       await axios.post(
//         "http://localhost:5000/api/documents",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(progress);
//           }
//         }
//       );

//       showNotification("Document uploaded successfully", "success");
      
//       setTimeout(() => {
//         navigate("/documents");
//       }, 1500);

//     } catch (err) {
//       console.log(err);
//       showNotification("Upload failed. Please try again.", "error");
//       setUploadProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFile = () => {
//     setFile(null);
//     setPreviewUrl(null);
//     setUploadProgress(0);
//   };

//   // Cleanup preview URL
//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slideDown ${
//           notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
//         } text-white`}>
//           {notification.message}
//         </div>
//       )}

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/documents")}
//           className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
//         >
//           <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           <span>Back to Documents</span>
//         </button>

//         {/* Main Upload Card */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp border border-gray-100">
//           {/* Header */}
//           <div className={`bg-gradient-to-r from-${currentDoc.color}-600 to-${currentDoc.color}-700 px-8 py-6`}>
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <currentDoc.icon className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white mb-1">
//                   Upload {currentDoc.name}
//                 </h1>
//                 <p className="text-white/90 text-sm">
//                   {currentDoc.description}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             {/* Requirements Info */}
//             <div className="bg-blue-50 rounded-xl p-4 mb-8 flex items-start gap-3">
//               <FaInfoCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <div className="text-sm text-blue-800">
//                 <p className="font-medium mb-1">Document Requirements:</p>
//                 <ul className="list-disc list-inside space-y-1 text-blue-700">
//                   <li>PDF format only</li>
//                   <li>Maximum file size: 10MB</li>
//                   <li>Clear and legible scan required</li>
//                   <li>All corners of the document should be visible</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Drag & Drop Area */}
//             <div
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//               className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
//                 ${dragActive 
//                   ? 'border-blue-500 bg-blue-50 scale-105' 
//                   : file 
//                     ? 'border-emerald-500 bg-emerald-50'
//                     : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
//                 }`}
//               onClick={() => document.getElementById('fileInput').click()}
//             >
//               <input
//                 id="fileInput"
//                 type="file"
//                 accept="application/pdf"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />

//               {file ? (
//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
//                     <FaCheckCircle className="w-10 h-10 text-emerald-600" />
//                   </div>
//                   <p className="text-lg font-medium text-gray-800 mb-2">File Ready for Upload</p>
//                   <p className="text-sm text-gray-500">Click or drag to replace</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <FaUpload className={`w-8 h-8 text-blue-600 transition-transform ${dragActive ? 'translate-y-1' : ''}`} />
//                   </div>
//                   <p className="text-lg font-medium text-gray-800 mb-2">
//                     {dragActive ? 'Drop your file here' : 'Drag & drop your PDF here'}
//                   </p>
//                   <p className="text-sm text-gray-500 mb-2">or</p>
//                   <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md">
//                     <FaUpload className="w-4 h-4" />
//                     Browse Files
//                   </button>
//                   <p className="text-xs text-gray-400 mt-4">Supported format: PDF (Max 10MB)</p>
//                 </>
//               )}
//             </div>

//             {/* File Info & Preview */}
//             {file && (
//               <div className="mt-8 space-y-6 animate-slideUp">
//                 {/* File Details Card */}
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center">
//                         <FaFilePdf className="w-6 h-6 text-rose-600" />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-800">{file.name}</p>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
//                           <span>•</span>
//                           <span>PDF</span>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                       title="Remove file"
//                     >
//                       <FaTimes className="w-5 h-5 text-gray-500" />
//                     </button>
//                   </div>

//                   {/* Upload Progress Bar */}
//                   {loading && (
//                     <div className="mt-4">
//                       <div className="flex items-center justify-between text-sm mb-2">
//                         <span className="text-gray-600">Uploading...</span>
//                         <span className="font-medium text-blue-600">{uploadProgress}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                           className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
//                           style={{ width: `${uploadProgress}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* PDF Preview */}
//                 {previewUrl && (
//                   <div className="border border-gray-200 rounded-xl overflow-hidden">
//                     <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
//                       <h3 className="font-medium text-gray-700">Document Preview</h3>
//                     </div>
//                     <iframe
//                       src={previewUrl}
//                       className="w-full h-96 bg-gray-50"
//                       title="PDF Preview"
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="mt-8 flex gap-4">
//               {file ? (
//                 <>
//                   <button
//                     onClick={handleUpload}
//                     disabled={loading}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                         <span>Uploading...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaUpload className="w-5 h-5" />
//                         <span>Upload Document</span>
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={removeFile}
//                     disabled={loading}
//                     className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     <FaTimes className="w-5 h-5" />
//                     <span>Cancel</span>
//                   </button>
//                 </>
//               ) : (
//                 <div className="w-full text-center py-4 text-gray-500">
//                   <p>Select a file to begin uploading</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-slideUp {
//           animation: slideUp 0.5s ease-out;
//         }
        
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUpload, FaFilePdf, FaTimes, FaCheckCircle, 
  FaArrowLeft, FaInfoCircle, FaFileAlt, FaShieldAlt,
  FaCloudUploadAlt
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

  // Document type mapping for better display
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

    if (selected.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification("File size must be less than 10MB", "error");
      return;
    }

    setFile(selected);

    // Create preview URL
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
      
      await axios.post(
        "http://localhost:5000/api/documents",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
      showNotification("Upload failed. Please try again.", "error");
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

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        {/* Back Button - Enhanced Visibility */}
        <button
          onClick={() => navigate("/documents")}
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-xl hover:shadow-md transition-all border border-gray-200 hover:border-gray-300"
        >
          <FaArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900">Back to Documents</span>
        </button>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp border border-gray-100">
          {/* Header with Document Type */}
          <div className={`bg-gradient-to-r ${currentDoc.gradient} px-8 py-6 relative overflow-hidden`}>
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <currentDoc.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Upload {currentDoc.name}
                </h1>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <FaCloudUploadAlt className="w-4 h-4" />
                  {currentDoc.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Upload Stats Card - Enhanced Visibility */}
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

            {/* Requirements Info - Enhanced with Icon */}
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
                        <span>Upload Document</span>
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