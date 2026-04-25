// BRAC University Mail	SUJIT KUMAR DATTA <sujit.kumar.datta@g.bracu.ac.bd>
// Updated
// MUNTAKA MUBARRAT ANTORIK <muntaka.mubarrat.antorik@g.bracu.ac.bd>	Sat, Apr 25, 2026 at 10:54 AM
// To: SUJIT KUMAR DATTA <sujit.kumar.datta@g.bracu.ac.bd>
// // ============================================================
// //  Complaints.jsx  –  Citizen Complaint Services Page
// //  Path: client/src/pages/Complaints.jsx
// //
// //  WHAT THIS FILE DOES:
// //  - Shows stat cards: My Complaints / Pending / In Progress / Resolved
// //  - Renders a table of all complaints (filterable by tab, status, search)
// //  - "File New Complaint" modal with:
// //      · Pre-filled citizen info from profile
// //      · AI-generated complaint text (via /api/ai/generate-complaint)
// //      · Bilingual support (English ↔ Bengali)
// //      · Auto-generated formal government letter template
// //      · Community Solutions panel (ViewSolutions component)
// //  - Complaint actions: View details, Timeline, Export PDF, Edit, Delete
// //  - Admin-only: Send feedback, Quick status update
// //  - Survey prompt for resolved complaints
// //  - "My Solutions" modal to view shared community solutions
// //
// //  SECTIONS IN THIS FILE:
// //  1.  Imports
// //  2.  MAIN COMPONENT + STATE
// //  3.  HELPER FUNCTIONS  (normalizeComplaintStatus, isMyComplaint,
// //                          canShareSolution, getStatusBadge, getPriorityBadge)
// //  4.  AI & TRANSLATION FUNCTIONS
// //  5.  TEMPLATE DOWNLOAD FUNCTIONS  (PDF, text, print)
// //  6.  FORM HANDLERS  (handleChange, handleTemplateEdit, handleSubmit)
// //  7.  EDIT COMPLAINT FUNCTIONS
// //  8.  ADMIN FEEDBACK FUNCTIONS
// //  9.  FETCH FUNCTIONS  (fetchComplaints, fetchUserSolutions)
// //  10. DELETE & STATUS FUNCTIONS
// //  11. REPORT GENERATION  (generateReport via pdf.co API)
// //  12. SURVEY FUNCTIONS
// //  13. useEFFECT HOOKS
// //  14. DERIVED STATE  (filtered complaints, user stats)
// //  15. RENDER
// //      15a. Page Header + Toast + Survey/Solution modals
// //      15b. Stats Cards
// //      15c. Controls Bar (tabs + search + filter + buttons)
// //      15d. Complaints Table
// //      15e. MODALS (complaint form, my solutions, timeline,
// //                   view details, edit, feedback, response, delete)
// // ============================================================

// // ── 1. IMPORTS ───────────────────────────────────────────────────────────────
// import API from "../config/api";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaClipboardList, FaTrash, FaEye, FaPlus, FaSearch, FaFilter,
//   FaCheckCircle, FaClock, FaExclamationCircle, FaFileAlt, FaHistory,
//   FaSpinner, FaFilePdf, FaEdit, FaDownload, FaCopy, FaBuilding,
//   FaUserTie, FaCalendarAlt, FaIdCard, FaPhone, FaEnvelope,
//   FaMapMarkerAlt, FaCheckDouble, FaHourglassHalf, FaShieldAlt,
//   FaStamp, FaUser, FaPrint, FaLightbulb, FaThumbsUp, FaThumbsDown,
//   FaTimes, FaLanguage, FaRobot, FaExclamationTriangle, FaComment, FaReply
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import SurveyModal from "../components/SurveyModal";
// import SolutionSuggestions from "../components/SolutionSuggestions";
// import SubmitSolution from "../components/SubmitSolution";
// import ViewSolutions from "../components/ViewSolutions";


// // ── 2. MAIN COMPONENT + STATE ─────────────────────────────────────────────────
// export default function Complaints({ user }) {

//   // ── Core data ──────────────────────────────────────────────────────────────
//   const [complaints,        setComplaints]        = useState([]);
//   const [userSolutions,     setUserSolutions]     = useState([]);

//   // ── UI / modal toggles ─────────────────────────────────────────────────────
//   const [showForm,          setShowForm]          = useState(false);   // New complaint modal
//   const [showSolutions,     setShowSolutions]     = useState(false);   // Community solutions panel inside form
//   const [showMySolutions,   setShowMySolutions]   = useState(false);   // "My Solutions" modal
//   const [showTimeline,      setShowTimeline]      = useState(false);   // Timeline modal
//   const [showEditModal,     setShowEditModal]      = useState(false);   // Edit complaint modal
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);   // Admin feedback modal
//   const [showResponseModal, setShowResponseModal] = useState(false);   // User response-to-feedback modal

//   // ── Selected items for modals ──────────────────────────────────────────────
//   const [selectedComplaint,           setSelectedComplaint]           = useState(null);
//   const [selectedForTimeline,         setSelectedForTimeline]         = useState(null);
//   const [editingComplaint,            setEditingComplaint]            = useState(null);
//   const [selectedForSolution,         setSelectedForSolution]         = useState(null);
//   const [selectedForFeedback,         setSelectedForFeedback]         = useState(null);
//   const [selectedFeedbackForResponse, setSelectedFeedbackForResponse] = useState(null);
//   const [deleteTarget,                setDeleteTarget]                = useState(null); // ID to delete

//   // ── Table controls ─────────────────────────────────────────────────────────
//   const [searchTerm,    setSearchTerm]    = useState("");
//   const [filterStatus,  setFilterStatus]  = useState("all"); // "all" | "Pending" | "Processing" | "Resolved"
//   const [activeTab,     setActiveTab]     = useState("all"); // "all" | "my"

//   // ── Loading / submitting flags ─────────────────────────────────────────────
//   const [loading,          setLoading]          = useState(true);
//   const [submitting,       setSubmitting]        = useState(false);
//   const [updatingStatus,   setUpdatingStatus]    = useState(false);
//   const [sendingFeedback,  setSendingFeedback]   = useState(false);
//   const [generatingAI,     setGeneratingAI]      = useState(false);
//   const [translating,      setTranslating]       = useState(false);
//   const [generatingReport, setGeneratingReport]  = useState(false);

//   // ── Toast notifications ────────────────────────────────────────────────────
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showDeleteSuccess,  setShowDeleteSuccess]  = useState(false);
//   const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

//   // ── Timeline / admin status update ────────────────────────────────────────
//   const [adminComment, setAdminComment] = useState("");

//   // ── Complaint form template ────────────────────────────────────────────────
//   const [generatedTemplate, setGeneratedTemplate] = useState(""); // Auto-generated template string
//   const [editedTemplate,    setEditedTemplate]    = useState(""); // Editable copy shown in the textarea

//   // ── Edit form data ─────────────────────────────────────────────────────────
//   const [editFormData, setEditFormData] = useState({
//     description: "", formalTemplate: "", editReason: ""
//   });

//   // ── Admin feedback ─────────────────────────────────────────────────────────
//   const [feedbackMessage, setFeedbackMessage] = useState("");
//   const [responseMessage, setResponseMessage] = useState("");

//   // ── Language / translation ─────────────────────────────────────────────────
//   // formLanguage: "en" (English) or "bn" (Bengali)
//   const [formLanguage,       setFormLanguage]       = useState("en");
//   const [translatedSections, setTranslatedSections] = useState({
//     complainantInfo: "", complaintDetails: "", communitySolutions: "", officialFormat: ""
//   });
//   const [translatedUserData, setTranslatedUserData] = useState({ name: "", address: "" });

//   // ── Survey states ──────────────────────────────────────────────────────────
//   const [showSurvey,                setShowSurvey]                = useState(false);
//   const [resolvedComplaint,         setResolvedComplaint]         = useState(null);  // Complaint for which survey is shown
//   const [surveySubmittedComplaints, setSurveySubmittedComplaints] = useState([]);   // IDs already surveyed
//   const [hasShownSurveyPopup,       setHasShownSurveyPopup]       = useState(false); // Only show once per session

//   // ── Derived flags ──────────────────────────────────────────────────────────
//   const isAdmin = user?.role === "admin" || user?.email?.includes("admin");
//   const getCurrentUser = () => user || JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUser = getCurrentUser();

//   // ── New complaint form data ────────────────────────────────────────────────
//   // Pre-filled from the user's profile stored in localStorage
//   const [formData, setFormData] = useState({
//     department:    "",
//     issueKeyword:  "",
//     description:   "",
//     priority:      "medium",
//     citizenName:   currentUser?.name    || "",
//     citizenId:     currentUser?.nid     || "",
//     contactNumber: currentUser?.phone   || "",
//     email:         currentUser?.email   || "",
//     address:       currentUser?.address || ""
//   });


//   // ── 3. HELPER FUNCTIONS ───────────────────────────────────────────────────

//   /**
//    * Normalize inconsistent status strings from the API.
//    * "in progress" / "processing" → "Processing", etc.
//    */
//   const normalizeComplaintStatus = (status) => {
//     const raw = (status || "").toString().trim();
//     const lowered = raw.toLowerCase();
//     if (lowered === "in progress" || lowered === "processing") return "Processing";
//     if (lowered === "pending")  return "Pending";
//     if (lowered === "resolved") return "Resolved";
//     return raw;
//   };

//   /**
//    * Check if a complaint belongs to the currently logged-in user.
//    * Falls back to email → phone → name matching when userId is unavailable.
//    */
//   const isMyComplaint = (complaint) => {
//     if (!currentUser || !complaint) return false;
//     const complaintUserId = typeof complaint.userId === "object"
//       ? complaint.userId?._id
//       : complaint.userId;
//     const currentUserId = currentUser._id;

//     if (currentUserId && complaintUserId) {
//       return complaintUserId === currentUserId ||
//              complaintUserId?.toString() === currentUserId?.toString();
//     }
//     if (currentUser.email && complaint.email && complaint.email !== "N/A") {
//       return complaint.email.toLowerCase() === currentUser.email.toLowerCase();
//     }
//     if (currentUser.phone && complaint.contactNumber && complaint.contactNumber !== "N/A") {
//       return complaint.contactNumber === currentUser.phone;
//     }
//     if (currentUser.name && complaint.citizenName && complaint.citizenName !== "Not Provided") {
//       return complaint.citizenName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
//     }
//     return false;
//   };

//   /**
//    * True if the user can share a community solution for this complaint.
//    * Condition: complaint is Resolved AND belongs to the current user.
//    */
//   const canShareSolution = (complaint) =>
//     complaint &&
//     normalizeComplaintStatus(complaint.status) === "Resolved" &&
//     isMyComplaint(complaint);

//   /** Returns a colored status badge JSX element */
//   const getStatusBadge = (status) => {
//     const normalized = normalizeComplaintStatus(status);
//     const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5";
//     switch (normalized) {
//       case "Resolved":
//         return <span className={`${base} bg-green-100 text-green-800`}><FaCheckCircle size={10} />Resolved</span>;
//       case "Pending":
//         return <span className={`${base} bg-amber-100 text-amber-800`}><FaClock size={10} />Pending</span>;
//       case "Processing":
//         return <span className={`${base} bg-blue-100 text-blue-800`}><FaSpinner size={10} className="animate-spin" />Processing</span>;
//       default:
//         return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
//     }
//   };

//   /** Returns a colored priority badge JSX element */
//   const getPriorityBadge = (priority) => {
//     switch (priority) {
//       case "high":   return <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">🔴 High</span>;
//       case "medium": return <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">🟡 Medium</span>;
//       case "low":    return <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">🟢 Low</span>;
//       default:       return null;
//     }
//   };


//   // ── 4. AI & TRANSLATION FUNCTIONS ────────────────────────────────────────

//   /**
//    * Translate `text` to Bengali via /api/ai/translate.
//    * Returns the original text on error or if targetLang is not "bn".
//    */
//   const translateText = async (text, targetLang) => {
//     if (targetLang !== "bn" || !text || text.trim() === "") return text;
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${API}/api/ai/translate`,
//         { text, targetLang },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.translated || text;
//     } catch (error) {
//       return text;
//     }
//   };

//   /**
//    * Call /api/ai/generate-complaint to auto-fill the description field.
//    * Requires department and issueKeyword to be set in formData.
//    * Also regenerates the formal letter template after generation.
//    */
//   const handleAIGenerate = async () => {
//     if (!formData.department || !formData.issueKeyword) {
//       alert(formLanguage === "en"
//         ? "Please select department and enter issue keyword first"
//         : "অনুগ্রহ করে প্রথমে বিভাগ নির্বাচন করুন এবং ইস্যু কীওয়ার্ড লিখুন");
//       return;
//     }
//     setGeneratingAI(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${API}/api/ai/generate-complaint`,
//         {
//           department:    formData.department,
//           keyword:       formData.issueKeyword,
//           description:   formData.description,
//           citizenName:   formData.citizenName,
//           citizenId:     formData.citizenId,
//           address:       formData.address,
//           contactNumber: formData.contactNumber,
//           language:      formLanguage
//         },
//         { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 }
//       );

//       if (response.data.success) {
//         // Store translated name/address if returned by the API
//         if (response.data.translatedName) {
//           setTranslatedUserData({
//             name:    response.data.translatedName,
//             address: response.data.translatedAddress || formData.address
//           });
//         }
//         const aiDescription = formLanguage === "bn"
//           ? response.data.bangla
//           : response.data.english;
//         setFormData(prev => ({ ...prev, description: aiDescription }));

//         // Regenerate the formal template with the new AI description
//         const template = await generateDynamicComplaintTemplate(
//           {
//             citizenName:   formData.citizenName,
//             citizenId:     formData.citizenId,
//             contactNumber: formData.contactNumber,
//             email:         formData.email,
//             address:       formData.address,
//             department:    formData.department,
//             issueKeyword:  formData.issueKeyword,
//             description:   aiDescription,
//             priority:      formData.priority,
//             complaintNumber: `CMP${Date.now().toString().slice(-8)}`
//           },
//           formLanguage,
//           aiDescription
//         );
//         setGeneratedTemplate(template);
//         setEditedTemplate(template);
//         alert(formLanguage === "en"
//           ? "AI complaint generated successfully!"
//           : "এআই অভিযোগ সফলভাবে তৈরি হয়েছে!");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to generate AI complaint.");
//     } finally {
//       setGeneratingAI(false);
//     }
//   };

//   /**
//    * Translate the citizen's name and address to Bengali if Bengali mode is active.
//    * Sets translatedUserData which is then used in the template and form display.
//    */
//   const translateUserData = async () => {
//     if (formLanguage !== "bn") {
//       setTranslatedUserData({ name: formData.citizenName, address: formData.address });
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${API}/api/ai/translate-user-data`,
//         { name: formData.citizenName, address: formData.address, targetLang: "bn" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTranslatedUserData({
//         name:    response.data.translatedName    || formData.citizenName,
//         address: response.data.translatedAddress || formData.address
//       });
//     } catch (error) {
//       setTranslatedUserData({ name: formData.citizenName, address: formData.address });
//     }
//   };

//   /**
//    * Translate the 4 section headings displayed in the complaint form when
//    * Bengali mode is active.
//    */
//   const translateUISections = async () => {
//     if (formLanguage !== "bn") return;
//     setTranslating(true);
//     try {
//       const sections = {
//         complainantInfo:   "Complainant Information (As per NID)",
//         complaintDetails:  "Complaint Details",
//         communitySolutions:"Community Solutions",
//         officialFormat:    "Official Government Complaint Format"
//       };
//       const translated = {};
//       for (const [key, value] of Object.entries(sections)) {
//         translated[key] = await translateText(value, "bn");
//       }
//       setTranslatedSections(translated);
//     } catch (error) {
//       // Silently fall back to English labels
//     } finally {
//       setTranslating(false);
//     }
//   };

//   /**
//    * Build the formal government letter template string.
//    * Called whenever department, issue, description, or priority changes (via useEffect),
//    * and also after AI generation.
//    *
//    * @param {object} userData   - Citizen + complaint data
//    * @param {string} lang       - "en" or "bn"
//    * @param {string|null} aiGeneratedDescription - Override description (from AI)
//    */
//   const generateDynamicComplaintTemplate = async (userData, lang = "en", aiGeneratedDescription = null) => {
//     const currentDate = new Date().toLocaleDateString(
//       lang === "en" ? "en-GB" : "bn-BD",
//       { day: "numeric", month: "long", year: "numeric" }
//     );

//     // Priority labels in both languages
//     const priorityText = {
//       low:       lang === "en" ? "Low"       : "নিম্ন",
//       medium:    lang === "en" ? "Medium"    : "মাঝারি",
//       high:      lang === "en" ? "High"      : "উচ্চ",
//       emergency: lang === "en" ? "Emergency" : "জরুরি"
//     };

//     // Bengali department name mapping
//     // To add a new department translation: add an entry here
//     const departmentMapBN = {
//       "Passport Office":   "পাসপোর্ট অফিস",
//       "Electricity":       "বিদ্যুৎ বিভাগ",
//       "Road Maintenance":  "সড়ক রক্ষণাবেক্ষণ বিভাগ",
//       "Waste Management":  "বর্জ্য ব্যবস্থাপনা বিভাগ",
//       "Health Services":   "স্বাস্থ্য সেবা বিভাগ",
//       "Education":         "শিক্ষা বিভাগ",
//       "Revenue":           "রাজস্ব বিভাগ",
//       "Municipal Services":"পৌর সেবা বিভাগ"
//     };

//     const departmentName  = lang === "bn" && departmentMapBN[userData.department]
//       ? departmentMapBN[userData.department]
//       : userData.department;
//     const citizenName     = lang === "bn" ? (translatedUserData.name    || userData.citizenName) : userData.citizenName;
//     const citizenAddress  = lang === "bn" ? (translatedUserData.address || userData.address)     : userData.address;
//     const finalDescription = aiGeneratedDescription || userData.description;

//     const template = `====================================================================
// ${lang === "en" ? "GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH" : "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"}
// ${lang === "en" ? "Ministry of Public Administration" : "জনপ্রশাসন মন্ত্রণালয়"}
// ${departmentName}
// ====================================================================

// ${lang === "en" ? "FORMAL COMPLAINT LETTER" : "আনুষ্ঠানিক অভিযোগ পত্র"}

// ${lang === "en" ? "Complaint No" : "অভিযোগ নং"}: ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}
// ${lang === "en" ? "Date" : "তারিখ"}: ${currentDate}

// ${lang === "en" ? "To" : "প্রতি"},
// ${lang === "en" ? "The Concerned Authority" : "সম্মানিত কর্তৃপক্ষ"},
// ${departmentName},
// ${lang === "en" ? "Government of Bangladesh" : "বাংলাদেশ সরকার"},
// ${lang === "en" ? "Dhaka" : "ঢাকা"}.

// ${lang === "en" ? "Subject" : "বিষয়"}: ${lang === "en"
//   ? `FORMAL COMPLAINT REGARDING ${userData.issueKeyword.toUpperCase()}`
//   : `${userData.issueKeyword} সংক্রান্ত আনুষ্ঠানিক অভিযোগ`}

// ====================================================================
// ${lang === "en" ? "COMPLAINANT DETAILS" : "অভিযোগকারীর বিবরণ"}
// ====================================================================

// ${lang === "en" ? "Name"    : "নাম"}          : ${citizenName}
// ${lang === "en" ? "NID Number" : "জাতীয় পরিচয়পত্র নং"}: ${userData.citizenId}
// ${lang === "en" ? "Address" : "ঠিকানা"}      : ${citizenAddress}
// ${lang === "en" ? "Contact" : "যোগাযোগ নম্বর"}   : ${userData.contactNumber}
// ${lang === "en" ? "Email"   : "ইমেইল"}         : ${userData.email || "N/A"}

// ====================================================================
// ${lang === "en" ? "COMPLAINT DETAILS" : "অভিযোগের বিবরণ"}
// ====================================================================

// ${lang === "en" ? "Department" : "বিভাগ"}    : ${departmentName}
// ${lang === "en" ? "Issue"      : "অভিযোগ"}  : ${userData.issueKeyword}
// ${lang === "en" ? "Priority"   : "অগ্রাধিকার"}: ${priorityText[userData.priority]}
// ${lang === "en" ? "Date"       : "তারিখ"}    : ${new Date().toLocaleDateString()}

// ====================================================================
// ${lang === "en" ? "DETAILED DESCRIPTION" : "বিস্তারিত বিবরণ"}
// ====================================================================

// ${finalDescription}

// ${lang === "en"
//   ? "I sincerely request the concerned authority to take immediate action to resolve this matter."
//   : "আমি সংশ্লিষ্ট কর্তৃপক্ষকে এই বিষয়টি সমাধানের জন্য অবিলম্বে পদক্ষেপ নেওয়ার অনুরোধ করছি।"}

// ${lang === "en" ? "Yours faithfully," : "বিনীত নিবেদক,"}
// ${citizenName}
// ${lang === "en" ? "Date" : "তারিখ"}: ${new Date().toLocaleDateString()}
// ====================================================================`;

//     // If Bengali mode, translate the entire template through the API
//     if (lang === "bn") return await translateText(template, "bn");
//     return template;
//   };

//   /**
//    * Handle the language toggle button in the complaint form header.
//    * Re-translates UI sections, user data, and the existing template if one exists.
//    */
//   const handleLanguageToggle = async (newLang) => {
//     setFormLanguage(newLang);
//     if (newLang === "bn") {
//       await translateUISections();
//       await translateUserData();
//     }
//     if (generatedTemplate) {
//       setTranslating(true);
//       try {
//         if (newLang === "bn") {
//           const translated = await translateText(generatedTemplate, "bn");
//           setEditedTemplate(translated);
//         } else {
//           // Regenerate template in English from current form data
//           const englishTemplate = await generateDynamicComplaintTemplate(
//             {
//               citizenName:   formData.citizenName,
//               citizenId:     formData.citizenId,
//               contactNumber: formData.contactNumber,
//               email:         formData.email,
//               address:       formData.address,
//               department:    formData.department,
//               issueKeyword:  formData.issueKeyword,
//               description:   formData.description,
//               priority:      formData.priority,
//               complaintNumber: `CMP${Date.now().toString().slice(-8)}`
//             },
//             "en"
//           );
//           setEditedTemplate(englishTemplate);
//         }
//       } catch (error) {
//         // Keep existing template if translation fails
//       } finally {
//         setTranslating(false);
//       }
//     }
//   };


//   // ── 5. TEMPLATE DOWNLOAD FUNCTIONS ───────────────────────────────────────

//   /** Download the formal letter template as a PDF using jsPDF */
//   const downloadTemplateAsPDF = () => {
//     const doc = new jsPDF();
//     const lines = editedTemplate.split("\n");
//     let y = 10;
//     doc.setFontSize(10);
//     lines.forEach(line => {
//       if (y > 280) { doc.addPage(); y = 10; }
//       doc.text(line, 10, y);
//       y += 5;
//     });
//     doc.save(`complaint_${formData.department}_${Date.now()}.pdf`);
//   };

//   /** Download the formal letter template as a plain text (.txt) file */
//   const downloadTemplateAsText = () => {
//     const element = document.createElement("a");
//     const file = new Blob([editedTemplate], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `complaint_${formData.department}_${Date.now()}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   /** Open the template in a new print window */
//   const printTemplate = () => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write('<html><head><title>Complaint Form</title>');
//     printWindow.document.write("<style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; }</style>");
//     printWindow.document.write("</head><body>");
//     printWindow.document.write("<pre>" + editedTemplate + "</pre>");
//     printWindow.document.write("</body></html>");
//     printWindow.document.close();
//     printWindow.print();
//   };


//   // ── 6. FORM HANDLERS ─────────────────────────────────────────────────────

//   /** Generic onChange handler for all complaint form inputs */
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   /** Sync the editable template textarea content */
//   const handleTemplateEdit = (e) => setEditedTemplate(e.target.value);

//   /**
//    * Submit the new complaint form.
//    * Validates required fields, builds the complaint object,
//    * POSTs to /api/complaints/create, then resets the form.
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       // Client-side required field validation
//       const missingFields = [];
//       if (!formData.citizenName?.trim())   missingFields.push("Full Name");
//       if (!formData.citizenId?.trim())     missingFields.push("NID Number");
//       if (!formData.contactNumber?.trim()) missingFields.push("Contact Number");
//       if (!formData.department)            missingFields.push("Department");
//       if (!formData.issueKeyword?.trim())  missingFields.push("Issue Keyword");
//       if (!formData.description?.trim())   missingFields.push("Description");

//       if (missingFields.length > 0) {
//         alert(`Please fill in all required fields:\n• ${missingFields.join("\n• ")}`);
//         setSubmitting(false);
//         return;
//       }

//       const timeline = [{
//         status: "Pending",
//         comment: "Complaint submitted successfully",
//         updatedBy: formData.citizenName || "Citizen",
//         date: new Date()
//       }];

//       const complaintData = {
//         userId:        currentUser?._id,
//         citizenName:   formData.citizenName,
//         citizenId:     formData.citizenId,
//         contactNumber: formData.contactNumber,
//         email:         formData.email || "",
//         address:       formData.address || "",
//         department:    formData.department,
//         issueKeyword:  formData.issueKeyword,
//         description:   formData.description,
//         priority:      formData.priority || "medium",
//         timeline,
//         surveySubmitted: false,
//         language:      formLanguage,
//         formalTemplate: editedTemplate
//       };

//       const token = localStorage.getItem("token");
//       const res = await axios.post(`${API}/api/complaints/create`, complaintData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setComplaints(prev => [res.data, ...prev]);
//       setShowSuccessMessage(true);
//       setTimeout(() => setShowSuccessMessage(false), 5000);

//       // Reset form to default user values
//       setFormData({
//         department: "", issueKeyword: "", description: "", priority: "medium",
//         citizenName:   currentUser?.name    || "",
//         citizenId:     currentUser?.nid     || "",
//         contactNumber: currentUser?.phone   || "",
//         email:         currentUser?.email   || "",
//         address:       currentUser?.address || ""
//       });
//       setShowForm(false);
//       setGeneratedTemplate("");
//       setEditedTemplate("");
//       setFormLanguage("en");
//       setShowSolutions(false);
//     } catch (error) {
//       if (error.response)        alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
//       else if (error.request)    alert("Server is not responding.");
//       else                       alert(`Error: ${error.message}`);
//     }
//     setSubmitting(false);
//   };


//   // ── 7. EDIT COMPLAINT FUNCTIONS ──────────────────────────────────────────

//   /**
//    * Open the edit modal, pre-populating the form with existing complaint data.
//    * Resolved complaints cannot be edited.
//    */
//   const handleEditComplaint = (complaint) => {
//     if (complaint.status === "Resolved") {
//       alert("Cannot edit a resolved complaint.");
//       return;
//     }
//     setEditingComplaint(complaint);
//     setEditFormData({
//       description:    complaint.description    || "",
//       formalTemplate: complaint.formalTemplate || "",
//       editReason:     ""
//     });
//     setShowEditModal(true);
//   };

//   /**
//    * Save the edited complaint via PUT /api/complaints/:id.
//    * Requires an edit reason before submitting.
//    */
//   const handleSaveEdit = async () => {
//     if (!editFormData.editReason.trim()) {
//       alert("Please provide a reason for editing your complaint");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${API}/api/complaints/${editingComplaint._id}`,
//         {
//           description:    editFormData.description,
//           formalTemplate: editFormData.formalTemplate,
//           editReason:     editFormData.editReason
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints(prev =>
//         prev.map(c => c._id === editingComplaint._id ? response.data : c)
//       );
//       alert("Complaint updated successfully. Admin will review your changes.");
//       setShowEditModal(false);
//       setEditingComplaint(null);
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update complaint");
//     }
//   };


//   // ── 8. ADMIN FEEDBACK FUNCTIONS ──────────────────────────────────────────

//   /**
//    * Admin: send a feedback message to a citizen about their complaint.
//    * POSTs to /api/complaints/:id/feedback.
//    */
//   const handleSendFeedback = async () => {
//     if (!feedbackMessage.trim()) return;
//     setSendingFeedback(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API}/api/complaints/${selectedForFeedback._id}/feedback`,
//         { message: feedbackMessage, isQuestion: false, requiresResponse: false },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedbackMessage("");
//       setShowFeedbackModal(false);
//       setSelectedForFeedback(null);
//       fetchComplaints();
//       alert("Feedback sent successfully");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send feedback");
//     } finally {
//       setSendingFeedback(false);
//     }
//   };

//   /**
//    * Citizen: respond to a specific admin feedback message.
//    * POSTs to /api/complaints/:id/respond.
//    */
//   const handleRespondToFeedback = async () => {
//     if (!responseMessage.trim()) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API}/api/complaints/${selectedComplaint._id}/respond`,
//         { feedbackId: selectedFeedbackForResponse._id, response: responseMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setResponseMessage("");
//       setShowResponseModal(false);
//       setSelectedFeedbackForResponse(null);
//       fetchComplaints();
//       alert("Response sent successfully");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send response");
//     }
//   };


//   // ── 9. FETCH FUNCTIONS ───────────────────────────────────────────────────

//   /**
//    * Fetch all complaints AND the user's own complaints, then merge them.
//    * The merge ensures the user's full complaint details (citizenId, contactNumber, etc.)
//    * are preserved even when viewing the "all complaints" tab.
//    */
//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const allRes = await axios.get(`${API}/api/complaints`,    { headers: { Authorization: `Bearer ${token}` } });
//       const myRes  = await axios.get(`${API}/api/complaints/my`, { headers: { Authorization: `Bearer ${token}` } });
//       const myComplaintIds = new Set(myRes.data.map(c => c._id));

//       const mergedComplaints = allRes.data.map(complaint => {
//         if (myComplaintIds.has(complaint._id)) {
//           const full = myRes.data.find(c => c._id === complaint._id);
//           return {
//             ...complaint, ...full,
//             citizenId:     full?.citizenId     || complaint.citizenId,
//             contactNumber: full?.contactNumber || complaint.contactNumber,
//             email:         full?.email         || complaint.email,
//             address:       full?.address       || complaint.address
//           };
//         }
//         return {
//           ...complaint,
//           citizenName:     complaint.citizenName  || complaint.userId?.name || "Not Provided",
//           complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`
//         };
//       });
//       setComplaints(mergedComplaints);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//     setLoading(false);
//   };

//   /** Fetch only this user's submitted community solutions */
//   const fetchUserSolutions = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API}/api/solutions/my`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserSolutions(res.data);
//     } catch (err) {
//       // Silently fail; the modal will show empty state
//     }
//   };


//   // ── 10. DELETE & STATUS FUNCTIONS ────────────────────────────────────────

//   /**
//    * Delete a complaint after verifying the user is authorized.
//    * Only the complaint owner or an admin can delete.
//    */
//   const deleteComplaint = async () => {
//     try {
//       const complaintToDelete = complaints.find(c => c._id === deleteTarget);
//       if (!complaintToDelete) {
//         setDeleteSuccessMessage("Complaint not found");
//         setShowDeleteSuccess(true);
//         setTimeout(() => setShowDeleteSuccess(false), 3000);
//         setDeleteTarget(null);
//         return;
//       }
//       const isAuthorized = isAdmin || isMyComplaint(complaintToDelete);
//       if (!isAuthorized) {
//         setDeleteSuccessMessage("You are not authorized to delete this complaint");
//         setShowDeleteSuccess(true);
//         setTimeout(() => setShowDeleteSuccess(false), 3000);
//         setDeleteTarget(null);
//         return;
//       }
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API}/api/complaints/${deleteTarget}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComplaints(prev => prev.filter(c => c._id !== deleteTarget));
//       setDeleteTarget(null);
//       setDeleteSuccessMessage("Complaint deleted successfully");
//       setShowDeleteSuccess(true);
//       setTimeout(() => setShowDeleteSuccess(false), 3000);
//     } catch (error) {
//       setDeleteSuccessMessage("Failed to delete complaint.");
//       setShowDeleteSuccess(true);
//       setTimeout(() => setShowDeleteSuccess(false), 3000);
//     }
//   };

//   /**
//    * Admin-only: update the status of a complaint via the timeline modal.
//    * PUT /api/complaints/:id/status
//    */
//   const updateComplaintStatus = async (complaintId, newStatus) => {
//     if (!isAdmin) { alert("Only administrators can update complaint status"); return; }
//     setUpdatingStatus(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${API}/api/complaints/${complaintId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setComplaints(prev => prev.map(c =>
//         c._id === complaintId ? { ...c, status: newStatus } : c
//       ));
//       setAdminComment("");
//       setSelectedForTimeline(null);
//       setShowTimeline(false);
//     } catch (error) {
//       alert("Failed to update status. Please try again.");
//     }
//     setUpdatingStatus(false);
//   };


//   // ── 11. REPORT GENERATION ────────────────────────────────────────────────

//   /**
//    * Generate an HTML report of the user's complaints and convert to PDF
//    * via the pdf.co API. Opens the resulting PDF in a new tab.
//    * NOTE: The API key below is a project key — do not expose in public repos.
//    */
//   const generateReport = async () => {
//     if (!user) return;
//     const myComplaints = complaints.filter(c => isMyComplaint(c));
//     if (myComplaints.length === 0) { alert("No complaints to report."); return; }

//     const stats = {
//       total:      myComplaints.length,
//       pending:    myComplaints.filter(c => normalizeComplaintStatus(c.status) === "Pending").length,
//       processing: myComplaints.filter(c => normalizeComplaintStatus(c.status) === "Processing").length,
//       resolved:   myComplaints.filter(c => normalizeComplaintStatus(c.status) === "Resolved").length
//     };
//     const deptCount    = {};
//     const priorityCount = { low: 0, medium: 0, high: 0 };
//     myComplaints.forEach(c => {
//       deptCount[c.department] = (deptCount[c.department] || 0) + 1;
//       if (c.priority) priorityCount[c.priority] = (priorityCount[c.priority] || 0) + 1;
//     });

//     // Build the HTML report string
//     const html = `
//       <!DOCTYPE html><html><head><meta charset="UTF-8"><title>ShebaConnect Complaint Report</title>
//       <style>
//         body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
//         .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
//         .header h1 { margin: 0; color: #2563eb; }
//         .user-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
//         .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
//         .stat-card { flex: 1; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; min-width: 120px; }
//         .stat-value { font-size: 28px; font-weight: bold; color: #2563eb; }
//         .breakdown { display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap; }
//         .breakdown-section { flex: 1; background: #f9fafb; border-radius: 8px; padding: 15px; }
//         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//         th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
//         th { background-color: #f9fafb; font-weight: 600; }
//         .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
//       </style>
//       </head><body>
//         <div class="header"><h1>ShebaConnect</h1><p>Government of Bangladesh • Citizen Grievance Redressal System</p></div>
//         <div class="user-info">
//           <strong>Report generated for:</strong> ${user.name} (${user.email})<br>
//           <strong>NID:</strong> ${user.nid}<br>
//           <strong>Date:</strong> ${new Date().toLocaleString()}
//         </div>
//         <div class="stats">
//           <div class="stat-card"><div class="stat-value">${stats.total}</div><div>Total Complaints</div></div>
//           <div class="stat-card"><div class="stat-value">${stats.pending}</div><div>Pending</div></div>
//           <div class="stat-card"><div class="stat-value">${stats.processing}</div><div>Processing</div></div>
//           <div class="stat-card"><div class="stat-value">${stats.resolved}</div><div>Resolved</div></div>
//         </div>
//         <div class="breakdown">
//           <div class="breakdown-section">
//             <h3>Complaints by Department</h3>
//             <ul>${Object.entries(deptCount).map(([dept, count]) => `<li><strong>${dept}</strong>: ${count}</li>`).join("")}</ul>
//           </div>
//           <div class="breakdown-section">
//             <h3>Complaints by Priority</h3>
//             <ul>
//               <li><strong>Low</strong>: ${priorityCount.low}</li>
//               <li><strong>Medium</strong>: ${priorityCount.medium}</li>
//               <li><strong>High</strong>: ${priorityCount.high}</li>
//             </ul>
//           </div>
//         </div>
//         <h3>Complaint Details</h3>
//         <table>
//           <thead><tr><th>Complaint #</th><th>Department</th><th>Issue</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
//           <tbody>
//             ${myComplaints.map(c => `
//               <tr>
//                 <td>${c.complaintNumber || c._id.slice(-6)}</td>
//                 <td>${c.department}</td><td>${c.issueKeyword}</td>
//                 <td>${c.status}</td><td>${c.priority}</td>
//                 <td>${new Date(c.createdAt).toLocaleDateString()}</td>
//               </tr>
//             `).join("")}
//           </tbody>
//         </table>
//         <div class="footer">This report was generated automatically by ShebaConnect. For official use only.</div>
//       </body></html>
//     `;

//     setGeneratingReport(true);
//     try {
//       const response = await axios.post(
//         "https://api.pdf.co/v1/pdf/convert/from/html",
//         { name: `complaint_report_${user._id}.pdf`, html, margin: "20px", paperSize: "Letter", async: false },
//         {
//           headers: {
//             "x-api-key": "sujit.kumar.datta@g.bracu.ac.bd_uEbOR7ssNIeTJ40JOkYLE0pjp5e6jcWOM57jZbBXBcYcdurjDSLc8x9m3hbIbKcC",
//             "Content-Type": "application/json"
//           }
//         }
//       );
//       if (response.data.error) throw new Error(response.data.error);
//       window.open(response.data.url, "_blank");
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       alert("Failed to generate report. Please try again later.");
//     } finally {
//       setGeneratingReport(false);
//     }
//   };

//   /** Export a single complaint's details as a PDF using jsPDF */
//   const exportComplaintAsPDF = (complaint) => {
//     const doc = new jsPDF();
//     let y = 10;
//     doc.setFontSize(16); doc.text("COMPLAINT DETAILS", 10, y); y += 10;
//     doc.setFontSize(12);
//     doc.text(`Complaint #: ${complaint.complaintNumber || complaint._id}`, 10, y); y += 7;
//     doc.text(`Citizen: ${complaint.citizenName}`,         10, y); y += 7;
//     doc.text(`Contact: ${complaint.contactNumber}`,        10, y); y += 7;
//     doc.text(`Department: ${complaint.department}`,        10, y); y += 7;
//     doc.text(`Issue: ${complaint.issueKeyword}`,           10, y); y += 7;
//     doc.text(`Status: ${complaint.status}`,                10, y); y += 7;
//     doc.text(`Priority: ${complaint.priority}`,            10, y); y += 7;
//     doc.text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`, 10, y); y += 10;
//     const descLines = doc.splitTextToSize(`Description: ${complaint.description}`, 180);
//     doc.text(descLines, 10, y);
//     doc.save(`complaint_${complaint.complaintNumber || complaint._id}.pdf`);
//   };


//   // ── 12. SURVEY FUNCTIONS ─────────────────────────────────────────────────

//   /** Called after a survey is successfully submitted */
//   const handleSurveySubmitted = async () => {
//     if (resolvedComplaint) {
//       setSurveySubmittedComplaints(prev => [...prev, resolvedComplaint._id]);
//     }
//     setShowSurvey(false);
//     setResolvedComplaint(null);
//     fetchComplaints();
//   };

//   /**
//    * Open the survey modal for a resolved complaint.
//    * First checks the backend to avoid showing the survey twice.
//    */
//   const openSurveyForComplaint = async (complaint) => {
//     if (surveySubmittedComplaints.includes(complaint._id)) {
//       alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API}/api/surveys/check/${complaint._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data.exists) {
//         alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
//         setSurveySubmittedComplaints(prev => [...prev, complaint._id]);
//         return;
//       }
//       setResolvedComplaint(complaint);
//       setShowSurvey(true);
//     } catch (err) {
//       // If the check endpoint is unavailable, show the survey anyway
//       console.warn("Survey check endpoint not available, showing survey anyway:", err.message);
//       setResolvedComplaint(complaint);
//       setShowSurvey(true);
//     }
//   };


//   // ── 13. useEFFECT HOOKS ──────────────────────────────────────────────────

//   // Auto-generate the formal template whenever form fields change
//   useEffect(() => {
//     const generateTemplate = async () => {
//       if (formData.department && formData.issueKeyword) {
//         const template = await generateDynamicComplaintTemplate(
//           {
//             citizenName:   formData.citizenName,
//             citizenId:     formData.citizenId,
//             contactNumber: formData.contactNumber,
//             email:         formData.email,
//             address:       formData.address,
//             department:    formData.department,
//             issueKeyword:  formData.issueKeyword,
//             description:   formData.description,
//             priority:      formData.priority,
//             complaintNumber: `CMP${Date.now().toString().slice(-8)}`
//           },
//           formLanguage
//         );
//         setGeneratedTemplate(template);
//         setEditedTemplate(template);
//       }
//     };
//     generateTemplate();
//   }, [formData.department, formData.issueKeyword, formData.description, formData.priority, formLanguage]);

//   // Re-translate user data when language or citizen name/address changes
//   useEffect(() => { translateUserData(); }, [formLanguage, formData.citizenName, formData.address]);

//   // Re-translate UI section headings when language changes
//   useEffect(() => { translateUISections(); }, [formLanguage]);

//   // Initial data fetch
//   useEffect(() => { fetchComplaints(); }, []);

//   // Pre-fill form when user object updates (e.g., after login refresh)
//   useEffect(() => {
//     const userData = getCurrentUser();
//     if (userData) {
//       setFormData(prev => ({
//         ...prev,
//         citizenName:   userData.name    || prev.citizenName   || "",
//         citizenId:     userData.nid     || prev.citizenId     || "",
//         contactNumber: userData.phone   || prev.contactNumber || "",
//         email:         userData.email   || prev.email         || "",
//         address:       userData.address || prev.address       || ""
//       }));
//     }
//   }, [user]);

//   // Persist survey-submitted complaint IDs in localStorage per user
//   useEffect(() => {
//     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
//     const submitted = localStorage.getItem(userKey);
//     if (submitted) setSurveySubmittedComplaints(JSON.parse(submitted));
//   }, [currentUser]);

//   useEffect(() => {
//     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
//     localStorage.setItem(userKey, JSON.stringify(surveySubmittedComplaints));
//   }, [surveySubmittedComplaints, currentUser]);

//   // Auto-show survey popup once per session when a resolved complaint has no survey yet
//   useEffect(() => {
//     if (isAdmin || hasShownSurveyPopup) return;
//     const checkAndShowSurvey = async () => {
//       const userResolvedComplaints = complaints.filter(c =>
//         normalizeComplaintStatus(c.status) === "Resolved" &&
//         isMyComplaint(c) &&
//         !surveySubmittedComplaints.includes(c._id)
//       );
//       if (userResolvedComplaints.length > 0 && !showSurvey && !resolvedComplaint) {
//         const latestResolved = userResolvedComplaints[0];
//         try {
//           const token = localStorage.getItem("token");
//           const response = await axios.get(
//             `${API}/api/surveys/check/${latestResolved._id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           if (!response.data.exists) {
//             setResolvedComplaint(latestResolved);
//             setShowSurvey(true);
//           } else {
//             setSurveySubmittedComplaints(prev => {
//               if (!prev.includes(latestResolved._id)) return [...prev, latestResolved._id];
//               return prev;
//             });
//           }
//         } catch (err) {
//           setResolvedComplaint(latestResolved);
//           setShowSurvey(true);
//         }
//         setHasShownSurveyPopup(true);
//       }
//     };
//     checkAndShowSurvey();
//   }, [complaints, surveySubmittedComplaints, isAdmin, showSurvey, resolvedComplaint, hasShownSurveyPopup]);

//   // Reset survey popup flag when user changes (e.g. after logout/login)
//   useEffect(() => { setHasShownSurveyPopup(false); }, [currentUser]);


//   // ── 14. DERIVED STATE ────────────────────────────────────────────────────

//   // Stats for the current user's own complaints
//   const userComplaints  = complaints.filter(c => isMyComplaint(c));
//   const userPending     = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Pending").length;
//   const userResolved    = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Resolved").length;
//   const userInProgress  = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Processing").length;

//   // Filtered table rows: applies tab + status filter + search term
//   const filteredComplaints = complaints.filter(c => {
//     const matchesSearch =
//       searchTerm === "" ||
//       c.department?.toLowerCase().includes(searchTerm.toLowerCase())   ||
//       c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase())  ||
//       c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === "all" || normalizeComplaintStatus(c.status) === filterStatus;
//     const matchesTab    = activeTab === "all" || isMyComplaint(c);
//     return matchesSearch && matchesFilter && matchesTab;
//   });


//   // ══════════════════════════════════════════════════════════════════════════
//   // ── 15. RENDER ────────────────────────────────────────────────────────────
//   // ══════════════════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ── 15a. PAGE HEADER ──────────────────────────────────────────────── */}
//       <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white px-8 py-10">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div className="flex items-center gap-5">
//               <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
//                 <FaClipboardList className="text-2xl text-white" />
//               </div>
//               <div>
//                 <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
//                   Grievance Redressal System
//                 </p>
//                 <h1 className="text-3xl font-black" style={{ fontFamily: "'Georgia', serif" }}>
//                   Complaint Services
//                 </h1>
//                 <p className="text-blue-200 text-sm mt-1 flex items-center gap-2">
//                   <FaShieldAlt size={12} /> Government of Bangladesh · Digital Security Act, 2018
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => { setShowForm(true); setShowSolutions(true); }}
//               className="bg-white text-blue-900 px-7 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg text-sm self-start md:self-auto"
//             >
//               <FaPlus /> File New Complaint
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── TOAST: Complaint submitted ──────────────────────────────────── */}
//       {showSuccessMessage && (
//         <div className="fixed top-6 right-6 z-50 animate-slideIn">
//           <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
//             <FaCheckCircle className="text-xl flex-shrink-0" />
//             <div>
//               <p className="font-bold text-sm">Complaint Submitted!</p>
//               <p className="text-xs text-green-100">Your complaint has been registered.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── TOAST: Delete result ─────────────────────────────────────────── */}
//       {showDeleteSuccess && (
//         <div className="fixed top-6 right-6 z-50 animate-slideIn">
//           <div className={`${deleteSuccessMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
//             <FaCheckCircle className="text-xl flex-shrink-0" />
//             <p className="text-sm font-medium">{deleteSuccessMessage}</p>
//           </div>
//         </div>
//       )}

//       {/* ── SURVEY MODAL (auto-popup for resolved complaints) ───────────── */}
//       {showSurvey && resolvedComplaint && isMyComplaint(resolvedComplaint) && (
//         <SurveyModal
//           complaint={resolvedComplaint}
//           onClose={() => { setShowSurvey(false); setResolvedComplaint(null); }}
//           onSubmit={handleSurveySubmitted}
//         />
//       )}

//       {/* ── SUBMIT SOLUTION MODAL ────────────────────────────────────────── */}
//       {showSolutionForm && selectedForSolution && canShareSolution(selectedForSolution) && (
//         <SubmitSolution
//           complaint={selectedForSolution}
//           onClose={() => { setShowSolutionForm(false); setSelectedForSolution(null); }}
//           onSubmit={() => { fetchUserSolutions(); fetchComplaints(); }}
//         />
//       )}

//       {/* ── 15b. MAIN CONTENT ─────────────────────────────────────────────── */}
//       <div className="container mx-auto px-8 py-8">

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
//           {[
//             { label: "My Complaints", value: userComplaints.length,  icon: <FaClipboardList />,              color: "blue",   sub: "Total filed" },
//             { label: "Pending",       value: userPending,            icon: <FaClock />,                      color: "amber",  sub: "Awaiting review" },
//             { label: "In Progress",   value: userInProgress,         icon: <FaSpinner className="animate-spin" />, color: "indigo", sub: "Being processed" },
//             { label: "Resolved",      value: userResolved,           icon: <FaCheckCircle />,                color: "green",  sub: "Successfully closed" },
//           ].map((card, i) => (
//             <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
//               <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 text-lg flex-shrink-0`}>
//                 {card.icon}
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-gray-900">{card.value}</p>
//                 <p className="text-xs font-semibold text-gray-500">{card.label}</p>
//                 <p className="text-xs text-gray-400">{card.sub}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── 15c. CONTROLS BAR ─────────────────────────────────────────── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-center">

//             {/* Tab toggles: All / My Complaints */}
//             <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
//               {[{ label: "All Complaints", val: "all" }, { label: "My Complaints", val: "my" }].map(tab => (
//                 <button
//                   key={tab.val}
//                   onClick={() => setActiveTab(tab.val)}
//                   className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
//                     activeTab === tab.val
//                       ? "bg-white text-blue-700 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Search input */}
//             <div className="relative flex-1">
//               <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//               <input
//                 type="text"
//                 placeholder="Search by ID, name, department, or issue..."
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Status filter dropdown */}
//             <div className="relative flex-shrink-0">
//               <select
//                 className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//                 value={filterStatus}
//                 onChange={e => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Resolved">Resolved</option>
//               </select>
//               <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
//             </div>

//             {/* Report + My Solutions buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={generateReport}
//                 disabled={generatingReport}
//                 className="flex-shrink-0 bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center gap-2 disabled:opacity-50"
//               >
//                 {generatingReport ? <FaSpinner className="animate-spin" size={13} /> : <FaFilePdf size={13} />}
//                 Report
//               </button>
//               <button
//                 onClick={() => { fetchUserSolutions(); setShowMySolutions(true); }}
//                 className="flex-shrink-0 bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition flex items-center gap-2"
//               >
//                 <FaLightbulb size={13} /> My Solutions
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── 15d. COMPLAINTS TABLE ─────────────────────────────────────── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   {["Complaint #", "Citizen", "Department", "Issue", "Priority", "Status", "Date", "Actions"].map(h => (
//                     <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {/* Loading state */}
//                 {loading ? (
//                   <tr><td colSpan="8" className="py-20 text-center">
//                     <div className="flex justify-center items-center gap-3 text-gray-400">
//                       <FaSpinner className="animate-spin text-2xl text-blue-500" />
//                       <span className="text-sm">Loading complaints...</span>
//                     </div>
//                   </td></tr>

//                 // Empty state
//                 ) : filteredComplaints.length === 0 ? (
//                   <tr><td colSpan="8" className="py-20 text-center">
//                     <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-4" />
//                     <p className="text-gray-500 text-sm font-medium">
//                       {activeTab === "my" ? "You haven't filed any complaints yet." : "No complaints found."}
//                     </p>
//                     {activeTab === "my" && (
//                       <button
//                         onClick={() => { setShowForm(true); setShowSolutions(true); }}
//                         className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
//                       >
//                         <FaPlus /> File Your First Complaint
//                       </button>
//                     )}
//                   </td></tr>

//                 // Data rows
//                 ) : filteredComplaints.map(c => (
//                   <tr key={c._id} className="hover:bg-blue-50/40 transition-colors group">
//                     {/* Complaint number */}
//                     <td className="px-5 py-4">
//                       <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
//                         {c.complaintNumber || `#${c._id?.slice(-6)}`}
//                       </span>
//                     </td>
//                     {/* Citizen name + phone */}
//                     <td className="px-5 py-4">
//                       <p className="text-sm font-semibold text-gray-800">{c.citizenName}</p>
//                       <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                         <FaPhone size={9} /> {c.contactNumber}
//                       </p>
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className="text-sm text-gray-700 font-medium">{c.department}</span>
//                     </td>
//                     {/* Issue keyword + truncated description */}
//                     <td className="px-5 py-4">
//                       <p className="text-sm font-semibold text-gray-800">{c.issueKeyword}</p>
//                       <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
//                         {c.description?.substring(0, 55)}...
//                       </p>
//                     </td>
//                     <td className="px-5 py-4">{getPriorityBadge(c.priority)}</td>
//                     {/* Status badge + survey indicator */}
//                     <td className="px-5 py-4">
//                       <div className="space-y-1">
//                         {getStatusBadge(c.status)}
//                         {!isAdmin && normalizeComplaintStatus(c.status) === "Resolved" && isMyComplaint(c) && (
//                           <p className={`text-xs ${surveySubmittedComplaints.includes(c._id) ? "text-green-600" : "text-amber-500"} flex items-center gap-1`}>
//                             {surveySubmittedComplaints.includes(c._id)
//                               ? <><FaCheckCircle size={9} /> Survey done</>
//                               : <><FaFileAlt size={9} /> Survey pending</>
//                             }
//                           </p>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       <p className="text-sm text-gray-600">
//                         {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
//                       </p>
//                     </td>
//                     {/* Action buttons */}
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-1">
//                         {/* Timeline */}
//                         <button onClick={() => { setSelectedForTimeline(c); setShowTimeline(true); }}
//                           className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition" title="View Timeline">
//                           <FaHistory size={13} />
//                         </button>
//                         {/* View details */}
//                         <button onClick={() => setSelectedComplaint(c)}
//                           className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View Details">
//                           <FaEye size={13} />
//                         </button>
//                         {/* Export PDF */}
//                         <button onClick={() => exportComplaintAsPDF(c)}
//                           className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Export PDF">
//                           <FaFilePdf size={13} />
//                         </button>
//                         {/* Edit (own non-resolved complaints only) */}
//                         {!isAdmin && isMyComplaint(c) && normalizeComplaintStatus(c.status) !== "Resolved" && (
//                           <button onClick={() => handleEditComplaint(c)}
//                             className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Edit Complaint">
//                             <FaEdit size={13} />
//                           </button>
//                         )}
//                         {/* Admin feedback */}
//                         {isAdmin && (
//                           <button onClick={() => { setSelectedForFeedback(c); setShowFeedbackModal(true); }}
//                             className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition" title="Send Feedback">
//                             <FaComment size={13} />
//                           </button>
//                         )}
//                         {/* Share solution (resolved own complaints) */}
//                         {canShareSolution(c) && (
//                           <button onClick={() => { setSelectedForSolution(c); setShowSolutionForm(true); }}
//                             className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition" title="Share Solution">
//                             <FaLightbulb size={13} />
//                           </button>
//                         )}
//                         {/* Survey (resolved own complaints) */}
//                         {!isAdmin && normalizeComplaintStatus(c.status) === "Resolved" && isMyComplaint(c) && (
//                           <button
//                             onClick={() => openSurveyForComplaint(c)}
//                             disabled={surveySubmittedComplaints.includes(c._id)}
//                             className={`p-2 rounded-lg transition ${
//                               surveySubmittedComplaints.includes(c._id)
//                                 ? "text-green-500 bg-green-50 cursor-default"
//                                 : "text-blue-500 hover:bg-blue-50"
//                             }`}
//                             title="Fill Survey"
//                           >
//                             <FaFileAlt size={13} />
//                           </button>
//                         )}
//                         {/* Delete */}
//                         {(isAdmin || isMyComplaint(c)) && (
//                           <button onClick={() => setDeleteTarget(c._id)}
//                             className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete">
//                             <FaTrash size={13} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Table footer: complaint count */}
//           {filteredComplaints.length > 0 && (
//             <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 text-xs text-gray-400">
//               Showing {filteredComplaints.length} of {complaints.length} complaints
//             </div>
//           )}
//         </div>
//       </div>


//       {/* ════════════════════════════════════════════════════════════════════
//           ── 15e. MODALS ──────────────────────────────────────────────────
//       ════════════════════════════════════════════════════════════════════ */}

//       {/* ── COMPLAINT FORM MODAL ─────────────────────────────────────────── */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl my-8">

//             {/* Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-6 rounded-t-2xl flex justify-between items-start z-10">
//               <div>
//                 <h2 className="text-xl font-black flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
//                   <FaStamp /> File a Formal Complaint
//                 </h2>
//                 <p className="text-blue-200 text-sm mt-1">
//                   Information pre-filled from your government profile
//                 </p>
//               </div>
//               <button
//                 onClick={() => { setShowForm(false); setShowSolutions(false); }}
//                 className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Language toggle: English / বাংলা */}
//             <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
//               <p className="text-sm text-gray-500">Complaint Language</p>
//               <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
//                 {[{ val: "en", label: "English" }, { val: "bn", label: "বাংলা" }].map(l => (
//                   <button
//                     key={l.val}
//                     onClick={() => handleLanguageToggle(l.val)}
//                     className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
//                       formLanguage === l.val ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     {l.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//                 {/* Left column: Citizen Info */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <FaUserTie className="text-blue-500" />
//                     {formLanguage === "en" ? "Complainant Information" : (translatedSections.complainantInfo || "অভিযোগকারীর তথ্য")}
//                   </h3>
//                   <div className="bg-blue-50 rounded-xl p-5 space-y-4 border border-blue-100">
//                     {/* Citizen info fields (name, NID, phone, email) */}
//                     {[
//                       { icon: <FaUser />,     label: "Full Name",      name: "citizenName",   type: "text",  required: true },
//                       { icon: <FaIdCard />,   label: "NID Number",     name: "citizenId",     type: "text",  required: true },
//                       { icon: <FaPhone />,    label: "Contact Number", name: "contactNumber", type: "tel",   required: true },
//                       { icon: <FaEnvelope />, label: "Email Address",  name: "email",         type: "email", required: false },
//                     ].map((field, i) => (
//                       <div key={i} className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 text-xs flex-shrink-0 border border-blue-100">
//                           {field.icon}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-xs text-gray-500 mb-1">{field.label}</p>
//                           <input
//                             type={field.type}
//                             name={field.name}
//                             value={formData[field.name]}
//                             onChange={handleChange}
//                             required={field.required}
//                             className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
//                               !formData[field.name] && field.required && formLanguage === "en" ? "bg-yellow-50 border-yellow-400" : ""
//                             }`}
//                           />
//                           {!formData[field.name] && field.required && formLanguage === "en" && (
//                             <p className="text-xs text-yellow-600 mt-1">⚠ Required — please enter your {field.label.toLowerCase()}</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     {/* Address textarea */}
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 text-xs flex-shrink-0 border border-blue-100 mt-1">
//                         <FaMapMarkerAlt />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-500 mb-1">Address</p>
//                         <textarea
//                           name="address"
//                           value={formData.address}
//                           onChange={handleChange}
//                           rows="2"
//                           className="w-full bg-white border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right column: Complaint Details */}
//                 <div>
//                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <FaClipboardList className="text-blue-500" />
//                     {formLanguage === "en" ? "Complaint Details" : (translatedSections.complaintDetails || "অভিযোগের বিবরণ")}
//                   </h3>
//                   <div className="space-y-4">
//                     {/* Department select */}
//                     <div>
//                       <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Department *</label>
//                       <select name="department" value={formData.department} onChange={handleChange} required
//                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium">
//                         <option value="">Select Department...</option>
//                         <option value="Passport Office">🛂 Passport Office</option>
//                         <option value="Electricity">⚡ Electricity</option>
//                         <option value="Road Maintenance">🛣️ Road Maintenance</option>
//                         <option value="Waste Management">♻️ Waste Management</option>
//                         <option value="Water Supply">💧 Water Supply</option>
//                         <option value="Health Services">🏥 Health Services</option>
//                         <option value="Education">📚 Education</option>
//                         <option value="Revenue">🏛️ Revenue</option>
//                         <option value="Municipal Services">🏙️ Municipal Services</option>
//                       </select>
//                     </div>
//                     {/* Issue keyword input */}
//                     <div>
//                       <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Issue Keyword *</label>
//                       <input type="text" name="issueKeyword" value={formData.issueKeyword} onChange={handleChange}
//                         placeholder="e.g., passport delay, power outage" required
//                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                     </div>
//                     {/* Priority select */}
//                     <div>
//                       <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Priority Level</label>
//                       <select name="priority" value={formData.priority} onChange={handleChange}
//                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium">
//                         <option value="low">🟢 Low Priority</option>
//                         <option value="medium">🟡 Medium Priority</option>
//                         <option value="high">🔴 High Priority (Urgent)</option>
//                       </select>
//                     </div>
//                     {/* Description textarea + AI Generate button */}
//                     <div>
//                       <div className="flex items-center justify-between mb-1.5">
//                         <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Detailed Description *</label>
//                         <button type="button" onClick={handleAIGenerate} disabled={generatingAI}
//                           className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition font-semibold disabled:opacity-50">
//                           {generatingAI ? <FaSpinner className="animate-spin" /> : <FaRobot />} AI Generate
//                         </button>
//                       </div>
//                       <textarea name="description" value={formData.description} onChange={handleChange}
//                         placeholder="Please provide detailed description including dates, locations, and relevant information..."
//                         className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
//                         rows="5" required />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Community Solutions panel (shown when department + keyword are filled) */}
//               {formData.department && formData.issueKeyword && showSolutions && (
//                 <div className="mt-8">
//                   <div className="mb-2">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {formLanguage === "en" ? "Community Solutions" : (translatedSections.communitySolutions || "কমিউনিটি সমাধান")}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {formLanguage === "en" ? "Verified solutions from other users" : "অন্যান্য ব্যবহারকারীদের থেকে যাচাইকৃত সমাধান"}
//                     </p>
//                   </div>
//                   <ViewSolutions
//                     department={formData.department}
//                     keyword={formData.issueKeyword}
//                     onSelect={(solution) => {
//                       if (window.confirm(formLanguage === "en"
//                         ? "Would you like to use this solution as reference?"
//                         : "আপনি কি এই সমাধানটি রেফারেন্স হিসাবে ব্যবহার করতে চান?")) {
//                         setFormData({ ...formData, description: solution.description || formData.description });
//                       }
//                     }}
//                   />
//                 </div>
//               )}

//               {/* Formal Template Preview + download options */}
//               {generatedTemplate && (
//                 <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
//                       <FaStamp className="text-blue-600" /> Official Complaint Format Preview
//                     </h3>
//                     <div className="flex gap-2">
//                       <button type="button" onClick={() => navigator.clipboard.writeText(editedTemplate)}
//                         className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1.5 text-xs font-semibold transition">
//                         <FaCopy size={11} /> Copy
//                       </button>
//                       <button type="button" onClick={downloadTemplateAsPDF}
//                         className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-1.5 text-xs font-semibold transition">
//                         <FaFilePdf size={11} /> PDF
//                       </button>
//                       <button type="button" onClick={downloadTemplateAsText}
//                         className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1.5 text-xs font-semibold transition">
//                         <FaDownload size={11} /> Text
//                       </button>
//                       <button type="button" onClick={printTemplate}
//                         className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1.5 text-xs font-semibold transition">
//                         <FaPrint size={11} /> Print
//                       </button>
//                     </div>
//                   </div>
//                   {/* Show spinner during translation, otherwise the editable textarea */}
//                   {translating ? (
//                     <div className="flex justify-center items-center h-64">
//                       <FaSpinner className="animate-spin text-3xl text-blue-600" />
//                       <span className="ml-3 text-gray-600">
//                         {formLanguage === "en" ? "Translating..." : "অনুবাদ করা হচ্ছে..."}
//                       </span>
//                     </div>
//                   ) : (
//                     <textarea
//                       value={editedTemplate}
//                       onChange={handleTemplateEdit}
//                       className="w-full font-mono text-xs p-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                       rows="12"
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Form action buttons */}
//               <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
//                 <button type="button" onClick={() => { setShowForm(false); setShowSolutions(false); }}
//                   className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
//                   Cancel
//                 </button>
//                 <button type="submit" disabled={submitting}
//                   className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 text-sm disabled:opacity-50">
//                   {submitting
//                     ? <><FaSpinner className="animate-spin" /> Submitting...</>
//                     : <><FaCheckCircle /> Submit Complaint</>
//                   }
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ── MY SOLUTIONS MODAL ──────────────────────────────────────────── */}
//       {showMySolutions && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col">
//             <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center flex-shrink-0">
//               <div className="flex items-center gap-3">
//                 <FaLightbulb className="text-xl" />
//                 <div>
//                   <h2 className="font-black">My Solutions</h2>
//                   <p className="text-indigo-200 text-xs">Solutions you've shared with the community</p>
//                 </div>
//               </div>
//               <button onClick={() => setShowMySolutions(false)} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition">
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6 overflow-y-auto">
//               {userSolutions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaLightbulb className="text-5xl text-gray-200 mx-auto mb-4" />
//                   <p className="text-gray-500 text-sm">
//                     No solutions yet. When your complaint is resolved, share your experience to help others!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {userSolutions.map(solution => (
//                     <div key={solution._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition">
//                       <div className="flex items-start gap-3">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2 flex-wrap">
//                             <span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
//                               {solution.department}
//                             </span>
//                             {solution.verified
//                               ? <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold"><FaCheckCircle size={10} /> Verified</span>
//                               : <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold"><FaHourglassHalf size={10} /> Pending</span>
//                             }
//                           </div>
//                           <h3 className="font-bold text-gray-800 text-sm">{solution.title}</h3>
//                           <p className="text-xs text-gray-500 mt-1 line-clamp-2">{solution.description}</p>
//                           <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
//                             <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
//                             <span className="flex items-center gap-1"><FaThumbsUp size={10} /> {solution.helpfulCount || 0}</span>
//                             <span className="flex items-center gap-1"><FaThumbsDown size={10} /> {solution.notHelpfulCount || 0}</span>
//                           </div>
//                         </div>
//                       </div>
//                       {solution.status === "Rejected" && (
//                         <div className="mt-3 p-3 bg-red-50 rounded-lg text-xs text-red-700">
//                           <strong>Feedback:</strong> {solution.adminFeedback}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── TIMELINE MODAL ──────────────────────────────────────────────── */}
//       {showTimeline && selectedForTimeline && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-start">
//               <div>
//                 <h2 className="font-black flex items-center gap-2"><FaHistory /> Complaint Timeline</h2>
//                 <p className="text-purple-200 text-xs mt-1">
//                   #{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}
//                 </p>
//               </div>
//               <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }}
//                 className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition">
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Timeline entries */}
//             <div className="p-6 max-h-80 overflow-y-auto">
//               <div className="space-y-5">
//                 {selectedForTimeline.timeline?.map((entry, index) => (
//                   <div key={index} className="flex gap-4">
//                     <div className="relative flex-shrink-0">
//                       <div className={`w-3 h-3 rounded-full mt-1.5 ${
//                         entry.status === "Resolved"   ? "bg-green-500" :
//                         entry.status === "Processing" ? "bg-blue-500"  : "bg-amber-500"
//                       }`} />
//                       {/* Connector line to next entry */}
//                       {index < (selectedForTimeline.timeline?.length - 1) && (
//                         <div className="absolute top-4 left-1 w-0.5 h-full bg-gray-200" />
//                       )}
//                     </div>
//                     <div className="flex-1 pb-4">
//                       <div className="flex items-center justify-between mb-1">
//                         <p className="font-bold text-sm text-gray-800">{entry.status}</p>
//                         <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleString()}</p>
//                       </div>
//                       <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{entry.comment}</p>
//                       <p className="text-xs text-gray-400 mt-1">By: {entry.updatedBy}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Admin actions panel inside timeline */}
//               {isAdmin && normalizeComplaintStatus(selectedForTimeline.status) !== "Resolved" && (
//                 <div className="mt-6 p-5 bg-purple-50 rounded-xl border border-purple-200">
//                   <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-sm">
//                     <FaShieldAlt /> Admin Actions
//                   </h3>
//                   <div className="flex gap-2 mb-3">
//                     <select
//                       className="flex-1 border border-purple-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium"
//                       value={adminComment.split("|")[0] || "Processing"}
//                       onChange={e => {
//                         const comment = adminComment.split("|")[1] || "";
//                         setAdminComment(e.target.value + "|" + comment);
//                       }}
//                     >
//                       <option value="Processing">Mark as Processing</option>
//                       <option value="Resolved">Mark as Resolved</option>
//                     </select>
//                     <button
//                       onClick={() => updateComplaintStatus(selectedForTimeline._id, adminComment.split("|")[0] || "Processing")}
//                       disabled={updatingStatus}
//                       className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold transition"
//                     >
//                       {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />} Update
//                     </button>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Add official comment (optional)"
//                     className="w-full border border-purple-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//                     value={adminComment.split("|")[1] || ""}
//                     onChange={e => setAdminComment((adminComment.split("|")[0] || "Processing") + "|" + e.target.value)}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
//               <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }}
//                 className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-semibold">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── VIEW DETAILS MODAL ──────────────────────────────────────────── */}
//       {selectedComplaint && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[85vh] flex flex-col">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center flex-shrink-0">
//               <div className="flex items-center gap-2">
//                 <FaEye />
//                 <h2 className="font-black">Complaint Details</h2>
//               </div>
//               <button onClick={() => setSelectedComplaint(null)}
//                 className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition">
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Detail grid */}
//             <div className="p-6 overflow-y-auto">
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { label: "Complaint Number", value: <span className="font-mono text-sm font-bold">{selectedComplaint.complaintNumber || selectedComplaint._id}</span> },
//                   { label: "Status",           value: getStatusBadge(selectedComplaint.status) },
//                   { label: "Citizen Name",     value: selectedComplaint.citizenName },
//                   { label: "Contact",          value: selectedComplaint.contactNumber },
//                   { label: "Department",       value: selectedComplaint.department },
//                   { label: "Priority",         value: getPriorityBadge(selectedComplaint.priority) },
//                 ].map((item, i) => (
//                   <div key={i} className="bg-gray-50 rounded-xl p-3">
//                     <p className="text-xs text-gray-400 mb-1">{item.label}</p>
//                     <div className="text-sm font-semibold text-gray-800">{item.value}</div>
//                   </div>
//                 ))}
//                 <div className="col-span-2 bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-400 mb-1">Issue</p>
//                   <p className="text-sm font-bold text-gray-800">{selectedComplaint.issueKeyword}</p>
//                 </div>
//                 <div className="col-span-2 bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-400 mb-1">Description</p>
//                   <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-1">
//                     {selectedComplaint.description}
//                   </p>
//                 </div>

//                 {/* Admin feedback threads */}
//                 {selectedComplaint.adminFeedback?.length > 0 && (
//                   <div className="col-span-2 bg-purple-50 rounded-xl p-4 border border-purple-100">
//                     <p className="text-xs font-bold text-purple-700 mb-3 uppercase tracking-wider">Admin Feedback</p>
//                     <div className="space-y-3">
//                       {selectedComplaint.adminFeedback.map((fb, idx) => (
//                         <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
//                           <p className="text-sm text-gray-700">{fb.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">{new Date(fb.askedAt).toLocaleString()}</p>
//                           {fb.response ? (
//                             <div className="mt-2 pl-3 border-l-2 border-green-300">
//                               <p className="text-xs text-green-600 font-semibold">Your Response:</p>
//                               <p className="text-xs text-gray-600">{fb.response.text}</p>
//                             </div>
//                           ) : (
//                             fb.requiresResponse && isMyComplaint(selectedComplaint) && (
//                               <button
//                                 onClick={() => { setSelectedFeedbackForResponse(fb); setShowResponseModal(true); }}
//                                 className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold"
//                               >
//                                 <FaReply size={10} /> Respond
//                               </button>
//                             )
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="col-span-2 bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-400 mb-1">Submitted On</p>
//                   <p className="text-sm text-gray-700">
//                     {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer buttons */}
//             <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
//               <button
//                 onClick={() => { setSelectedComplaint(null); setSelectedForTimeline(selectedComplaint); setShowTimeline(true); }}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-1.5 text-sm font-semibold transition">
//                 <FaHistory size={12} /> Timeline
//               </button>
//               {canShareSolution(selectedComplaint) && (
//                 <button
//                   onClick={() => { setSelectedForSolution(selectedComplaint); setShowSolutionForm(true); setSelectedComplaint(null); }}
//                   className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-1.5 text-sm font-semibold transition">
//                   <FaLightbulb size={12} /> Share Solution
//                 </button>
//               )}
//               <button onClick={() => exportComplaintAsPDF(selectedComplaint)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-1.5 text-sm font-semibold transition">
//                 <FaFilePdf size={12} /> Export PDF
//               </button>
//               <button onClick={() => setSelectedComplaint(null)}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-semibold">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── EDIT COMPLAINT MODAL ─────────────────────────────────────────── */}
//       {showEditModal && editingComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold">Edit Complaint</h3>
//                 <button onClick={() => { setShowEditModal(false); setEditingComplaint(null); }}
//                   className="p-2 hover:bg-white/20 rounded-full">
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">
//                   <FaExclamationTriangle className="inline mr-1" />
//                   <strong>Note:</strong> Your edits will be reviewed by an administrator.
//                 </p>
//               </div>
//               <div className="space-y-4">
//                 {/* Edit reason (required) */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Editing *</label>
//                   <input type="text" value={editFormData.editReason}
//                     onChange={e => setEditFormData({ ...editFormData, editReason: e.target.value })}
//                     placeholder="e.g., Additional information, Correction, etc."
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
//                 </div>
//                 {/* Updated description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                   <textarea value={editFormData.description}
//                     onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
//                     rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
//                 <button onClick={() => { setShowEditModal(false); setEditingComplaint(null); }} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── ADMIN FEEDBACK MODAL ─────────────────────────────────────────── */}
//       {showFeedbackModal && selectedForFeedback && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//             <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
//               <h3 className="font-black flex items-center gap-2"><FaComment /> Send Feedback</h3>
//               <button onClick={() => { setShowFeedbackModal(false); setSelectedForFeedback(null); setFeedbackMessage(""); }}
//                 className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition">
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6">
//               <p className="text-sm text-gray-500 mb-4">
//                 Complaint: <span className="font-bold text-gray-800">{selectedForFeedback.complaintNumber}</span>
//               </p>
//               <textarea value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)}
//                 placeholder="Type your feedback or question for the citizen..." rows="4"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" />
//               <div className="flex gap-3 mt-4">
//                 <button onClick={handleSendFeedback} disabled={sendingFeedback}
//                   className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
//                   {sendingFeedback ? <FaSpinner className="animate-spin" /> : null} Send Feedback
//                 </button>
//                 <button onClick={() => { setShowFeedbackModal(false); setSelectedForFeedback(null); setFeedbackMessage(""); }}
//                   className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold text-sm transition">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── CITIZEN RESPONSE TO FEEDBACK MODAL ──────────────────────────── */}
//       {showResponseModal && selectedFeedbackForResponse && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//             <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
//               <h3 className="font-black flex items-center gap-2"><FaReply /> Respond to Admin</h3>
//               <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); setResponseMessage(""); }}
//                 className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition">
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6">
//               {/* Show the admin's original message for context */}
//               <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                 <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Admin Message</p>
//                 <p className="text-sm text-gray-700">{selectedFeedbackForResponse.message}</p>
//               </div>
//               <textarea value={responseMessage} onChange={e => setResponseMessage(e.target.value)}
//                 placeholder="Type your response..." rows="4"
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none resize-none" />
//               <div className="flex gap-3 mt-4">
//                 <button onClick={handleRespondToFeedback}
//                   className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm transition">
//                   Send Response
//                 </button>
//                 <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); }}
//                   className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold text-sm transition">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── DELETE CONFIRMATION MODAL ────────────────────────────────────── */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//             <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5 rounded-t-2xl">
//               <h2 className="font-black flex items-center gap-2"><FaTrash /> Confirm Deletion</h2>
//             </div>
//             <div className="p-6">
//               <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4 mb-5 border border-red-100">
//                 <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
//                 <p className="text-sm text-red-700">
//                   This action is <strong>permanent</strong>. The complaint and all its data will be removed and cannot be recovered.
//                 </p>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={() => setDeleteTarget(null)}
//                   className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
//                   Cancel
//                 </button>
//                 <button onClick={deleteComplaint}
//                   className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-sm transition flex items-center gap-2">
//                   <FaTrash size={12} /> Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── KEYFRAME ANIMATIONS ─────────────────────────────────────────── */}
//       <style>{`
//         @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
//         .animate-slideIn { animation: slideIn 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// }

// --
// Best Regards,

// Muntaka Mubarrat Antorik

// ID: 24241061

// Department of Computer Science and Engineering


import API from "../config/api";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboardList, FaTrash, FaEye, FaPlus, FaSearch, FaFilter,
  FaCheckCircle, FaClock, FaExclamationCircle, FaFileAlt, FaHistory,
  FaSpinner, FaFilePdf, FaEdit, FaDownload, FaCopy, FaBuilding,
  FaUserTie, FaCalendarAlt, FaIdCard, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCheckDouble, FaHourglassHalf, FaShieldAlt,
  FaStamp, FaUser, FaPrint, FaLightbulb, FaThumbsUp, FaThumbsDown,
  FaTimes, FaLanguage, FaRobot, FaExclamationTriangle, FaComment, FaReply
} from "react-icons/fa";
import jsPDF from "jspdf";
import SurveyModal from "../components/SurveyModal";
import SolutionSuggestions from "../components/SolutionSuggestions";
import SubmitSolution from "../components/SubmitSolution";
import ViewSolutions from "../components/ViewSolutions";

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
  const [showSolutions, setShowSolutions] = useState(false);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [selectedForSolution, setSelectedForSolution] = useState(null);
  const [showMySolutions, setShowMySolutions] = useState(false);
  const [userSolutions, setUserSolutions] = useState([]);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ description: "", formalTemplate: "", editReason: "" });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [selectedForFeedback, setSelectedForFeedback] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedFeedbackForResponse, setSelectedFeedbackForResponse] = useState(null);
  const [formLanguage, setFormLanguage] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [translatedSections, setTranslatedSections] = useState({ complainantInfo: "", complaintDetails: "", communitySolutions: "", officialFormat: "" });
  const [translatedUserData, setTranslatedUserData] = useState({ name: "", address: "" });
  const [showSurvey, setShowSurvey] = useState(false);
  const [resolvedComplaint, setResolvedComplaint] = useState(null);
  const [surveySubmittedComplaints, setSurveySubmittedComplaints] = useState([]);
  const [hasShownSurveyPopup, setHasShownSurveyPopup] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");
  const getCurrentUser = () => user || JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    department: "", issueKeyword: "", description: "", priority: "medium",
    citizenName: currentUser?.name || "", citizenId: currentUser?.nid || "",
    contactNumber: currentUser?.phone || "", email: currentUser?.email || "",
    address: currentUser?.address || ""
  });

  // ==================== Helper Functions ====================
  
  const normalizeComplaintStatus = (status) => {
    const raw = (status || "").toString().trim();
    const lowered = raw.toLowerCase();
    if (lowered === "in progress" || lowered === "processing") return "Processing";
    if (lowered === "pending") return "Pending";
    if (lowered === "resolved") return "Resolved";
    return raw;
  };

  const isMyComplaint = (complaint) => {
    if (!currentUser || !complaint) return false;
    const complaintUserId = typeof complaint.userId === 'object' ? complaint.userId?._id : complaint.userId;
    const currentUserId = currentUser._id;
    if (currentUserId && complaintUserId) {
      return complaintUserId === currentUserId || complaintUserId?.toString() === currentUserId?.toString();
    }
    if (currentUser.email && complaint.email && complaint.email !== "N/A") {
      return complaint.email.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (currentUser.phone && complaint.contactNumber && complaint.contactNumber !== "N/A") {
      return complaint.contactNumber === currentUser.phone;
    }
    if (currentUser.name && complaint.citizenName && complaint.citizenName !== "Not Provided") {
      return complaint.citizenName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
    }
    return false;
  };

  const canShareSolution = (complaint) => {
    return complaint && normalizeComplaintStatus(complaint.status) === "Resolved" && isMyComplaint(complaint);
  };

  // ==================== AI & Translation Functions ====================
  
  const translateText = async (text, targetLang) => {
    if (targetLang !== "bn" || !text || text.trim() === "") return text;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/api/ai/translate`, { text, targetLang }, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.translated || text;
    } catch (error) { return text; }
  };

  const handleAIGenerate = async () => {
    if (!formData.department || !formData.issueKeyword) {
      alert(formLanguage === "en" ? "Please select department and enter issue keyword first" : "অনুগ্রহ করে প্রথমে বিভাগ নির্বাচন করুন এবং ইস্যু কীওয়ার্ড লিখুন");
      return;
    }
    setGeneratingAI(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/api/ai/generate-complaint`, {
        department: formData.department, keyword: formData.issueKeyword,
        description: formData.description, citizenName: formData.citizenName,
        citizenId: formData.citizenId, address: formData.address,
        contactNumber: formData.contactNumber, language: formLanguage
      }, { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 });
      if (response.data.success) {
        if (response.data.translatedName) setTranslatedUserData({ name: response.data.translatedName, address: response.data.translatedAddress || formData.address });
        const aiDescription = formLanguage === "bn" ? response.data.bangla : response.data.english;
        setFormData(prev => ({ ...prev, description: aiDescription }));
        const template = await generateDynamicComplaintTemplate({ citizenName: formData.citizenName, citizenId: formData.citizenId, contactNumber: formData.contactNumber, email: formData.email, address: formData.address, department: formData.department, issueKeyword: formData.issueKeyword, description: aiDescription, priority: formData.priority, complaintNumber: `CMP${Date.now().toString().slice(-8)}` }, formLanguage, aiDescription);
        setGeneratedTemplate(template);
        setEditedTemplate(template);
        alert(formLanguage === "en" ? "AI complaint generated successfully!" : "এআই অভিযোগ সফলভাবে তৈরি হয়েছে!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate AI complaint.");
    } finally { setGeneratingAI(false); }
  };

  const translateUserData = async () => {
    if (formLanguage !== "bn") { setTranslatedUserData({ name: formData.citizenName, address: formData.address }); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/api/ai/translate-user-data`, { name: formData.citizenName, address: formData.address, targetLang: "bn" }, { headers: { Authorization: `Bearer ${token}` } });
      setTranslatedUserData({ name: response.data.translatedName || formData.citizenName, address: response.data.translatedAddress || formData.address });
    } catch (error) { setTranslatedUserData({ name: formData.citizenName, address: formData.address }); }
  };

  const translateUISections = async () => {
    if (formLanguage !== "bn") return;
    setTranslating(true);
    try {
      const sections = { complainantInfo: "Complainant Information (As per NID)", complaintDetails: "Complaint Details", communitySolutions: "Community Solutions", officialFormat: "Official Government Complaint Format" };
      const translated = {};
      for (const [key, value] of Object.entries(sections)) { translated[key] = await translateText(value, "bn"); }
      setTranslatedSections(translated);
    } catch (error) {} finally { setTranslating(false); }
  };

  const generateDynamicComplaintTemplate = async (userData, lang = "en", aiGeneratedDescription = null) => {
    const currentDate = new Date().toLocaleDateString(lang === "en" ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const priorityText = { low: lang === "en" ? "Low" : "নিম্ন", medium: lang === "en" ? "Medium" : "মাঝারি", high: lang === "en" ? "High" : "উচ্চ", emergency: lang === "en" ? "Emergency" : "জরুরি" };
    const departmentMapBN = { "Passport Office": "পাসপোর্ট অফিস", "Electricity": "বিদ্যুৎ বিভাগ", "Road Maintenance": "সড়ক রক্ষণাবেক্ষণ বিভাগ", "Waste Management": "বর্জ্য ব্যবস্থাপনা বিভাগ", "Health Services": "স্বাস্থ্য সেবা বিভাগ", "Education": "শিক্ষা বিভাগ", "Revenue": "রাজস্ব বিভাগ", "Municipal Services": "পৌর সেবা বিভাগ" };
    const departmentName = lang === "bn" && departmentMapBN[userData.department] ? departmentMapBN[userData.department] : userData.department;
    const citizenName = lang === "bn" ? (translatedUserData.name || userData.citizenName) : userData.citizenName;
    const citizenAddress = lang === "bn" ? (translatedUserData.address || userData.address) : userData.address;
    const finalDescription = aiGeneratedDescription || userData.description;
    
    const template = `====================================================================
${lang === "en" ? "GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH" : "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"}
${lang === "en" ? "Ministry of Public Administration" : "জনপ্রশাসন মন্ত্রণালয়"}
${departmentName}
====================================================================

${lang === "en" ? "FORMAL COMPLAINT LETTER" : "আনুষ্ঠানিক অভিযোগ পত্র"}

${lang === "en" ? "Complaint No" : "অভিযোগ নং"}: ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}
${lang === "en" ? "Date" : "তারিখ"}: ${currentDate}

${lang === "en" ? "To" : "প্রতি"},
${lang === "en" ? "The Concerned Authority" : "সম্মানিত কর্তৃপক্ষ"},
${departmentName},
${lang === "en" ? "Government of Bangladesh" : "বাংলাদেশ সরকার"},
${lang === "en" ? "Dhaka" : "ঢাকা"}.

${lang === "en" ? "Subject" : "বিষয়"}: ${lang === "en" ? `FORMAL COMPLAINT REGARDING ${userData.issueKeyword.toUpperCase()}` : `${userData.issueKeyword} সংক্রান্ত আনুষ্ঠানিক অভিযোগ`}

====================================================================
${lang === "en" ? "COMPLAINANT DETAILS" : "অভিযোগকারীর বিবরণ"}
====================================================================

${lang === "en" ? "Name" : "নাম"}          : ${citizenName}
${lang === "en" ? "NID Number" : "জাতীয় পরিচয়পত্র নং"}: ${userData.citizenId}
${lang === "en" ? "Address" : "ঠিকানা"}      : ${citizenAddress}
${lang === "en" ? "Contact" : "যোগাযোগ নম্বর"}   : ${userData.contactNumber}
${lang === "en" ? "Email" : "ইমেইল"}         : ${userData.email || 'N/A'}

====================================================================
${lang === "en" ? "COMPLAINT DETAILS" : "অভিযোগের বিবরণ"}
====================================================================

${lang === "en" ? "Department" : "বিভাগ"}    : ${departmentName}
${lang === "en" ? "Issue" : "অভিযোগ"}        : ${userData.issueKeyword}
${lang === "en" ? "Priority" : "অগ্রাধিকার"}  : ${priorityText[userData.priority]}
${lang === "en" ? "Date" : "তারিখ"}          : ${new Date().toLocaleDateString()}

====================================================================
${lang === "en" ? "DETAILED DESCRIPTION" : "বিস্তারিত বিবরণ"}
====================================================================

${finalDescription}

${lang === "en" ? "I sincerely request the concerned authority to take immediate action to resolve this matter." : "আমি সংশ্লিষ্ট কর্তৃপক্ষকে এই বিষয়টি সমাধানের জন্য অবিলম্বে পদক্ষেপ নেওয়ার অনুরোধ করছি।"}

${lang === "en" ? "Yours faithfully," : "বিনীত নিবেদক,"}
${citizenName}
${lang === "en" ? "Date" : "তারিখ"}: ${new Date().toLocaleDateString()}
====================================================================`;

    if (lang === "bn") {
      return await translateText(template, "bn");
    }
    return template;
  };

  const handleLanguageToggle = async (newLang) => {
    setFormLanguage(newLang);
    if (newLang === "bn") {
      await translateUISections();
      await translateUserData();
    }
    if (generatedTemplate) {
      setTranslating(true);
      try {
        if (newLang === "bn") {
          const translated = await translateText(generatedTemplate, "bn");
          setEditedTemplate(translated);
        } else {
          const englishTemplate = await generateDynamicComplaintTemplate({ citizenName: formData.citizenName, citizenId: formData.citizenId, contactNumber: formData.contactNumber, email: formData.email, address: formData.address, department: formData.department, issueKeyword: formData.issueKeyword, description: formData.description, priority: formData.priority, complaintNumber: `CMP${Date.now().toString().slice(-8)}` }, "en");
          setEditedTemplate(englishTemplate);
        }
      } catch (error) {} finally { setTranslating(false); }
    }
  };

  // ==================== Template Download Functions ====================
  
  const downloadTemplateAsPDF = () => {
    const doc = new jsPDF();
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

  const downloadTemplateAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([editedTemplate], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `complaint_${formData.department}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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

  // ==================== Form Handlers ====================
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTemplateEdit = (e) => setEditedTemplate(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const missingFields = [];
      if (!formData.citizenName?.trim()) missingFields.push("Full Name");
      if (!formData.citizenId?.trim()) missingFields.push("NID Number");
      if (!formData.contactNumber?.trim()) missingFields.push("Contact Number");
      if (!formData.department) missingFields.push("Department");
      if (!formData.issueKeyword?.trim()) missingFields.push("Issue Keyword");
      if (!formData.description?.trim()) missingFields.push("Description");

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields:\n• ${missingFields.join("\n• ")}`);
        setSubmitting(false);
        return;
      }

      const timeline = [{ status: "Pending", comment: "Complaint submitted successfully", updatedBy: formData.citizenName || "Citizen", date: new Date() }];
      const complaintData = { userId: currentUser?._id, citizenName: formData.citizenName, citizenId: formData.citizenId, contactNumber: formData.contactNumber, email: formData.email || "", address: formData.address || "", department: formData.department, issueKeyword: formData.issueKeyword, description: formData.description, priority: formData.priority || "medium", timeline, surveySubmitted: false, language: formLanguage, formalTemplate: editedTemplate };
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API}/api/complaints/create`, complaintData, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(prev => [res.data, ...prev]);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      setFormData({ department: "", issueKeyword: "", description: "", priority: "medium", citizenName: currentUser?.name || "", citizenId: currentUser?.nid || "", contactNumber: currentUser?.phone || "", email: currentUser?.email || "", address: currentUser?.address || "" });
      setShowForm(false); setGeneratedTemplate(""); setEditedTemplate(""); setFormLanguage("en"); setShowSolutions(false);
    } catch (error) {
      if (error.response) alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      else if (error.request) alert("Server is not responding.");
      else alert(`Error: ${error.message}`);
    }
    setSubmitting(false);
  };

  // ==================== Edit Complaint Functions ====================
  
  const handleEditComplaint = (complaint) => {
    if (complaint.status === 'Resolved') { alert("Cannot edit a resolved complaint."); return; }
    setEditingComplaint(complaint); setEditFormData({ description: complaint.description || "", formalTemplate: complaint.formalTemplate || "", editReason: "" }); setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editFormData.editReason.trim()) { alert("Please provide a reason for editing your complaint"); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API}/api/complaints/${editingComplaint._id}`, { description: editFormData.description, formalTemplate: editFormData.formalTemplate, editReason: editFormData.editReason }, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(prev => prev.map(c => c._id === editingComplaint._id ? response.data : c));
      alert("Complaint updated successfully."); setShowEditModal(false); setEditingComplaint(null);
    } catch (error) { alert(error.response?.data?.message || "Failed to update complaint"); }
  };

  // ==================== Admin Feedback Functions ====================
  
  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    setSendingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/complaints/${selectedForFeedback._id}/feedback`, { message: feedbackMessage, isQuestion: false, requiresResponse: false }, { headers: { Authorization: `Bearer ${token}` } });
      setFeedbackMessage(""); setShowFeedbackModal(false); setSelectedForFeedback(null); fetchComplaints(); alert("Feedback sent successfully");
    } catch (err) { alert(err.response?.data?.message || "Failed to send feedback"); } finally { setSendingFeedback(false); }
  };

  const handleRespondToFeedback = async () => {
    if (!responseMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/complaints/${selectedComplaint._id}/respond`, { feedbackId: selectedFeedbackForResponse._id, response: responseMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setResponseMessage(""); setShowResponseModal(false); setSelectedFeedbackForResponse(null); fetchComplaints(); alert("Response sent successfully");
    } catch (err) { alert(err.response?.data?.message || "Failed to send response"); }
  };

  // ==================== Fetch Functions ====================
  
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const allRes = await axios.get(`${API}/api/complaints`, { headers: { Authorization: `Bearer ${token}` } });
      const myRes = await axios.get(`${API}/api/complaints/my`, { headers: { Authorization: `Bearer ${token}` } });
      const myComplaintIds = new Set(myRes.data.map(c => c._id));
      const mergedComplaints = allRes.data.map(complaint => {
        if (myComplaintIds.has(complaint._id)) {
          const full = myRes.data.find(c => c._id === complaint._id);
          return { ...complaint, ...full, citizenId: full?.citizenId || complaint.citizenId, contactNumber: full?.contactNumber || complaint.contactNumber, email: full?.email || complaint.email, address: full?.address || complaint.address };
        }
        return { ...complaint, citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided", complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}` };
      });
      setComplaints(mergedComplaints);
    } catch (error) { console.error("Error fetching complaints:", error); }
    setLoading(false);
  };

  const fetchUserSolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/solutions/my`, { headers: { Authorization: `Bearer ${token}` } });
      setUserSolutions(res.data);
    } catch (err) {}
  };

  // ==================== Delete & Status Functions ====================
  
  const deleteComplaint = async () => {
    try {
      const complaintToDelete = complaints.find(c => c._id === deleteTarget);
      if (!complaintToDelete) { setDeleteSuccessMessage("Complaint not found"); setShowDeleteSuccess(true); setTimeout(() => setShowDeleteSuccess(false), 3000); setDeleteTarget(null); return; }
      const isAuthorized = isAdmin || isMyComplaint(complaintToDelete);
      if (!isAuthorized) { setDeleteSuccessMessage("You are not authorized to delete this complaint"); setShowDeleteSuccess(true); setTimeout(() => setShowDeleteSuccess(false), 3000); setDeleteTarget(null); return; }
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/complaints/${deleteTarget}`, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(prev => prev.filter(c => c._id !== deleteTarget));
      setDeleteTarget(null); setDeleteSuccessMessage("Complaint deleted successfully"); setShowDeleteSuccess(true); setTimeout(() => setShowDeleteSuccess(false), 3000);
    } catch (error) { setDeleteSuccessMessage("Failed to delete complaint."); setShowDeleteSuccess(true); setTimeout(() => setShowDeleteSuccess(false), 3000); }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!isAdmin) { alert("Only administrators can update complaint status"); return; }
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/complaints/${complaintId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: newStatus } : c));
      setAdminComment(""); setSelectedForTimeline(null); setShowTimeline(false);
    } catch (error) { alert("Failed to update status. Please try again."); }
    setUpdatingStatus(false);
  };

  // ==================== Report Generation ====================
  
  const generateReport = async () => {
    if (!user) return;

    const myComplaints = complaints.filter(c => isMyComplaint(c));
    if (myComplaints.length === 0) {
      alert('No complaints to report.');
      return;
    }

    const stats = {
      total: myComplaints.length,
      pending: myComplaints.filter(c => normalizeComplaintStatus(c.status) === 'Pending').length,
      processing: myComplaints.filter(c => normalizeComplaintStatus(c.status) === 'Processing').length,
      resolved: myComplaints.filter(c => normalizeComplaintStatus(c.status) === 'Resolved').length,
    };

    const deptCount = {};
    myComplaints.forEach(c => { deptCount[c.department] = (deptCount[c.department] || 0) + 1; });

    const priorityCount = { low: 0, medium: 0, high: 0 };
    myComplaints.forEach(c => { if (c.priority) priorityCount[c.priority] = (priorityCount[c.priority] || 0) + 1; });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ShebaConnect Complaint Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #2563eb; }
          .user-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
          .stat-card { flex: 1; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; min-width: 120px; }
          .stat-value { font-size: 28px; font-weight: bold; color: #2563eb; }
          .breakdown { display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap; }
          .breakdown-section { flex: 1; background: #f9fafb; border-radius: 8px; padding: 15px; }
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
          <strong>Report generated for:</strong> ${user.name} (${user.email})<br>
          <strong>NID:</strong> ${user.nid}<br>
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </div>

        <div class="stats">
          <div class="stat-card"><div class="stat-value">${stats.total}</div><div>Total Complaints</div></div>
          <div class="stat-card"><div class="stat-value">${stats.pending}</div><div>Pending</div></div>
          <div class="stat-card"><div class="stat-value">${stats.processing}</div><div>Processing</div></div>
          <div class="stat-card"><div class="stat-value">${stats.resolved}</div><div>Resolved</div></div>
        </div>

        <div class="breakdown">
          <div class="breakdown-section">
            <h3>Complaints by Department</h3>
            <ul>
              ${Object.entries(deptCount).map(([dept, count]) => `<li><strong>${dept}</strong>: ${count}</li>`).join('')}
            </ul>
          </div>
          <div class="breakdown-section">
            <h3>Complaints by Priority</h3>
            <ul>
              <li><strong>Low</strong>: ${priorityCount.low}</li>
              <li><strong>Medium</strong>: ${priorityCount.medium}</li>
              <li><strong>High</strong>: ${priorityCount.high}</li>
            </ul>
          </div>
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
            ${myComplaints.map(c => `
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

    setGeneratingReport(true);
    try {
      const response = await axios.post(
        'https://api.pdf.co/v1/pdf/convert/from/html',
        {
          name: `complaint_report_${user._id}.pdf`,
          html: html,
          margin: '20px',
          paperSize: 'Letter',
          async: false
        },
        {
          headers: {
            'x-api-key': 'sujit.kumar.datta@g.bracu.ac.bd_uEbOR7ssNIeTJ40JOkYLE0pjp5e6jcWOM57jZbBXBcYcdurjDSLc8x9m3hbIbKcC',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.error) throw new Error(response.data.error);
      window.open(response.data.url, '_blank');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate report. Please try again later.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // ==================== Survey Functions ====================
  
  const handleSurveySubmitted = async () => {
    if (resolvedComplaint) setSurveySubmittedComplaints(prev => [...prev, resolvedComplaint._id]);
    setShowSurvey(false); setResolvedComplaint(null); fetchComplaints();
  };

  const openSurveyForComplaint = async (complaint) => {
    if (surveySubmittedComplaints.includes(complaint._id)) {
      alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/api/surveys/check/${complaint._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.exists) {
        alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
        setSurveySubmittedComplaints(prev => [...prev, complaint._id]);
        return;
      }
      setResolvedComplaint(complaint);
      setShowSurvey(true);
    } catch (err) {
      console.warn("Survey check endpoint not available, showing survey anyway:", err.message);
      setResolvedComplaint(complaint);
      setShowSurvey(true);
    }
  };

  const exportComplaintAsPDF = (complaint) => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16); doc.text("COMPLAINT DETAILS", 10, y); y += 10;
    doc.setFontSize(12);
    doc.text(`Complaint #: ${complaint.complaintNumber || complaint._id}`, 10, y); y += 7;
    doc.text(`Citizen: ${complaint.citizenName}`, 10, y); y += 7;
    doc.text(`Contact: ${complaint.contactNumber}`, 10, y); y += 7;
    doc.text(`Department: ${complaint.department}`, 10, y); y += 7;
    doc.text(`Issue: ${complaint.issueKeyword}`, 10, y); y += 7;
    doc.text(`Status: ${complaint.status}`, 10, y); y += 7;
    doc.text(`Priority: ${complaint.priority}`, 10, y); y += 7;
    doc.text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`, 10, y); y += 10;
    const descLines = doc.splitTextToSize(`Description: ${complaint.description}`, 180);
    doc.text(descLines, 10, y);
    doc.save(`complaint_${complaint.complaintNumber || complaint._id}.pdf`);
  };

  // ==================== UI Helpers ====================
  
  const getStatusBadge = (status) => {
    const normalized = normalizeComplaintStatus(status);
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5";
    switch (normalized) {
      case 'Resolved': return <span className={`${base} bg-green-100 text-green-800`}><FaCheckCircle size={10} />Resolved</span>;
      case 'Pending': return <span className={`${base} bg-amber-100 text-amber-800`}><FaClock size={10} />Pending</span>;
      case 'Processing': return <span className={`${base} bg-blue-100 text-blue-800`}><FaSpinner size={10} className="animate-spin" />Processing</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">🔴 High</span>;
      case 'medium': return <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">🟡 Medium</span>;
      case 'low': return <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">🟢 Low</span>;
      default: return null;
    }
  };

  // ==================== useEffect Hooks ====================
  
  useEffect(() => {
    const generateTemplate = async () => {
      if (formData.department && formData.issueKeyword) {
        const template = await generateDynamicComplaintTemplate({
          citizenName: formData.citizenName, citizenId: formData.citizenId,
          contactNumber: formData.contactNumber, email: formData.email,
          address: formData.address, department: formData.department,
          issueKeyword: formData.issueKeyword, description: formData.description,
          priority: formData.priority, complaintNumber: `CMP${Date.now().toString().slice(-8)}`
        }, formLanguage);
        setGeneratedTemplate(template);
        setEditedTemplate(template);
      }
    };
    generateTemplate();
  }, [formData.department, formData.issueKeyword, formData.description, formData.priority, formLanguage]);

  useEffect(() => { translateUserData(); }, [formLanguage, formData.citizenName, formData.address]);
  useEffect(() => { translateUISections(); }, [formLanguage]);
  useEffect(() => { fetchComplaints(); }, []);
  
  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) setFormData(prev => ({ ...prev, citizenName: userData.name || prev.citizenName || "", citizenId: userData.nid || prev.citizenId || "", contactNumber: userData.phone || prev.contactNumber || "", email: userData.email || prev.email || "", address: userData.address || prev.address || "" }));
  }, [user]);

  useEffect(() => {
    const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
    const submitted = localStorage.getItem(userKey);
    if (submitted) setSurveySubmittedComplaints(JSON.parse(submitted));
  }, [currentUser]);

  useEffect(() => {
    const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
    localStorage.setItem(userKey, JSON.stringify(surveySubmittedComplaints));
  }, [surveySubmittedComplaints, currentUser]);

  useEffect(() => {
    if (isAdmin || hasShownSurveyPopup) return;
    const checkAndShowSurvey = async () => {
      const userResolvedComplaints = complaints.filter(c => normalizeComplaintStatus(c.status) === "Resolved" && isMyComplaint(c) && !surveySubmittedComplaints.includes(c._id));
      if (userResolvedComplaints.length > 0 && !showSurvey && !resolvedComplaint) {
        const latestResolved = userResolvedComplaints[0];
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API}/api/surveys/check/${latestResolved._id}`, { headers: { Authorization: `Bearer ${token}` } });
          if (!response.data.exists) {
            setResolvedComplaint(latestResolved);
            setShowSurvey(true);
          } else {
            setSurveySubmittedComplaints(prev => { if (!prev.includes(latestResolved._id)) return [...prev, latestResolved._id]; return prev; });
          }
        } catch (err) {
          setResolvedComplaint(latestResolved);
          setShowSurvey(true);
        }
        setHasShownSurveyPopup(true);
      }
    };
    checkAndShowSurvey();
  }, [complaints, surveySubmittedComplaints, isAdmin, showSurvey, resolvedComplaint, hasShownSurveyPopup]);

  useEffect(() => { setHasShownSurveyPopup(false); }, [currentUser]);

  // ==================== Derived State ====================
  
  const userComplaints = complaints.filter(c => isMyComplaint(c));
  const userPending = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Pending").length;
  const userResolved = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Resolved").length;
  const userInProgress = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Processing").length;

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === "" || c.department?.toLowerCase().includes(searchTerm.toLowerCase()) || c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) || c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || normalizeComplaintStatus(c.status) === filterStatus;
    const matchesTab = activeTab === "all" || isMyComplaint(c);
    return matchesSearch && matchesFilter && matchesTab;
  });

  // ══════════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white px-8 py-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                <FaClipboardList className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">Grievance Redressal System</p>
                <h1 className="text-3xl font-black" style={{ fontFamily: "'Georgia', serif" }}>Complaint Services</h1>
                <p className="text-blue-200 text-sm mt-1 flex items-center gap-2">
                  <FaShieldAlt size={12} /> Government of Bangladesh · Digital Security Act, 2018
                </p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(true); setShowSolutions(true); }}
              className="bg-white text-blue-900 px-7 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg text-sm self-start md:self-auto"
            >
              <FaPlus /> File New Complaint
            </button>
          </div>
        </div>
      </div>

      {/* ── TOAST NOTIFICATIONS ─────────────────────────────────── */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <FaCheckCircle className="text-xl flex-shrink-0" />
            <div><p className="font-bold text-sm">Complaint Submitted!</p><p className="text-xs text-green-100">Your complaint has been registered.</p></div>
          </div>
        </div>
      )}
      {showDeleteSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className={`${deleteSuccessMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
            <FaCheckCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-medium">{deleteSuccessMessage}</p>
          </div>
        </div>
      )}

      {/* ── SURVEY MODAL ────────────────────────────────────────── */}
      {showSurvey && resolvedComplaint && isMyComplaint(resolvedComplaint) && (
        <SurveyModal complaint={resolvedComplaint} onClose={() => { setShowSurvey(false); setResolvedComplaint(null); }} onSubmit={handleSurveySubmitted} />
      )}

      {/* ── SOLUTION FORM ───────────────────────────────────────── */}
      {showSolutionForm && selectedForSolution && canShareSolution(selectedForSolution) && (
        <SubmitSolution complaint={selectedForSolution} onClose={() => { setShowSolutionForm(false); setSelectedForSolution(null); }} onSubmit={() => { fetchUserSolutions(); fetchComplaints(); }} />
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <div className="container mx-auto px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: "My Complaints", value: userComplaints.length, icon: <FaClipboardList />, color: "blue", sub: "Total filed" },
            { label: "Pending", value: userPending, icon: <FaClock />, color: "amber", sub: "Awaiting review" },
            { label: "In Progress", value: userInProgress, icon: <FaSpinner className="animate-spin" />, color: "indigo", sub: "Being processed" },
            { label: "Resolved", value: userResolved, icon: <FaCheckCircle />, color: "green", sub: "Successfully closed" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 text-lg flex-shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{card.value}</p>
                <p className="text-xs font-semibold text-gray-500">{card.label}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
              {[{ label: "All Complaints", val: "all" }, { label: "My Complaints", val: "my" }].map(tab => (
                <button
                  key={tab.val}
                  onClick={() => setActiveTab(tab.val)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.val ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by ID, name, department, or issue..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative flex-shrink-0">
              <select
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Resolved">Resolved</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Report and Solutions Buttons */}
            <div className="flex gap-2">
              <button
                onClick={generateReport}
                disabled={generatingReport}
                className="flex-shrink-0 bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center gap-2 disabled:opacity-50"
              >
                {generatingReport ? <FaSpinner className="animate-spin" size={13} /> : <FaFilePdf size={13} />} Report
              </button>
              <button
                onClick={() => { fetchUserSolutions(); setShowMySolutions(true); }}
                className="flex-shrink-0 bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition flex items-center gap-2"
              >
                <FaLightbulb size={13} /> My Solutions
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Complaint #</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Citizen</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="8" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-gray-400">
                      <FaSpinner className="animate-spin text-2xl text-blue-500" />
                      <span className="text-sm">Loading complaints...</span>
                    </div>
                  </td></tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr><td colSpan="8" className="py-20 text-center">
                    <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">
                      {activeTab === "my" ? "You haven't filed any complaints yet." : "No complaints found."}
                    </p>
                    {activeTab === "my" && (
                      <button onClick={() => { setShowForm(true); setShowSolutions(true); }} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2">
                        <FaPlus /> File Your First Complaint
                      </button>
                    )}
                  </td></tr>
                ) : filteredComplaints.map(c => (
                  <tr key={c._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                        {c.complaintNumber || `#${c._id?.slice(-6)}`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">{c.citizenName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><FaPhone size={9} /> {c.contactNumber}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700 font-medium">{c.department}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">{c.issueKeyword}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{c.description?.substring(0, 55)}...</p>
                    </td>
                    <td className="px-5 py-4">{getPriorityBadge(c.priority)}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(c.status)}
                        {!isAdmin && normalizeComplaintStatus(c.status) === "Resolved" && isMyComplaint(c) && (
                          <p className={`text-xs ${surveySubmittedComplaints.includes(c._id) ? "text-green-600" : "text-amber-500"} flex items-center gap-1`}>
                            {surveySubmittedComplaints.includes(c._id) ? <><FaCheckCircle size={9} /> Survey done</> : <><FaFileAlt size={9} /> Survey pending</>}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedForTimeline(c); setShowTimeline(true); }} className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition" title="View Timeline"><FaHistory size={13} /></button>
                        <button onClick={() => setSelectedComplaint(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View Details"><FaEye size={13} /></button>
                        <button onClick={() => exportComplaintAsPDF(c)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Export PDF"><FaFilePdf size={13} /></button>
                        
                        {/* Edit button for user's own non-resolved complaints */}
                        {!isAdmin && isMyComplaint(c) && normalizeComplaintStatus(c.status) !== 'Resolved' && (
                          <button onClick={() => handleEditComplaint(c)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" title="Edit Complaint"><FaEdit size={13} /></button>
                        )}
                        
                        {/* Admin feedback button */}
                        {isAdmin && (
                          <button onClick={() => { setSelectedForFeedback(c); setShowFeedbackModal(true); }} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition" title="Send Feedback"><FaComment size={13} /></button>
                        )}
                        
                        {/* Share Solution Button */}
                        {canShareSolution(c) && (
                          <button onClick={() => { setSelectedForSolution(c); setShowSolutionForm(true); }} className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition" title="Share Solution"><FaLightbulb size={13} /></button>
                        )}
                        
                        {/* Survey Button */}
                        {!isAdmin && normalizeComplaintStatus(c.status) === "Resolved" && isMyComplaint(c) && (
                          <button onClick={() => openSurveyForComplaint(c)} disabled={surveySubmittedComplaints.includes(c._id)} className={`p-2 rounded-lg transition ${surveySubmittedComplaints.includes(c._id) ? "text-green-500 bg-green-50 cursor-default" : "text-blue-500 hover:bg-blue-50"}`} title="Fill Survey"><FaFileAlt size={13} /></button>
                        )}
                        
                        {/* Delete button */}
                        {(isAdmin || isMyComplaint(c)) && (
                          <button onClick={() => setDeleteTarget(c._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete"><FaTrash size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredComplaints.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 text-xs text-gray-400">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════ */}

      {/* ── COMPLAINT FORM MODAL ─────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-6 rounded-t-2xl flex justify-between items-start z-10">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
                  <FaStamp /> File a Formal Complaint
                </h2>
                <p className="text-blue-200 text-sm mt-1">Information pre-filled from your government profile</p>
              </div>
              <button onClick={() => { setShowForm(false); setShowSolutions(false); }} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-xl transition"><FaTimes /></button>
            </div>

            {/* Language Toggle */}
            <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Complaint Language</p>
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {[{ val: "en", label: "English" }, { val: "bn", label: "বাংলা" }].map(l => (
                  <button key={l.val} onClick={() => handleLanguageToggle(l.val)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${formLanguage === l.val ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Citizen Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaUserTie className="text-blue-500" />
                    {formLanguage === "en" ? "Complainant Information" : (translatedSections.complainantInfo || "অভিযোগকারীর তথ্য")}
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-5 space-y-4 border border-blue-100">
                    {[
                      { icon: <FaUser />, label: "Full Name", name: "citizenName", type: "text" },
                      { icon: <FaIdCard />, label: "NID Number", name: "citizenId", type: "text" },
                      { icon: <FaPhone />, label: "Contact Number", name: "contactNumber", type: "tel" },
                      { icon: <FaEnvelope />, label: "Email Address", name: "email", type: "email" },
                    ].map((field, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 text-xs flex-shrink-0 border border-blue-100">{field.icon}</div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                          <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange}
                            className={`w-full bg-white border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${!formData[field.name] && formLanguage === "en" ? "bg-yellow-50 border-yellow-400" : ""}`}
                            required={field.name !== "email"} />
                          {!formData[field.name] && field.name !== "email" && formLanguage === "en" && (
                            <p className="text-xs text-yellow-600 mt-1">⚠ Required — please enter your {field.label.toLowerCase()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 text-xs flex-shrink-0 border border-blue-100 mt-1"><FaMapMarkerAlt /></div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
                          className="w-full bg-white border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Complaint Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-blue-500" />
                    {formLanguage === "en" ? "Complaint Details" : (translatedSections.complaintDetails || "অভিযোগের বিবরণ")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Department *</label>
                      <select name="department" value={formData.department} onChange={handleChange} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium">
                        <option value="">Select Department...</option>
                        <option value="Passport Office">🛂 Passport Office</option>
                        <option value="Electricity">⚡ Electricity</option>
                        <option value="Road Maintenance">🛣️ Road Maintenance</option>
                        <option value="Waste Management">♻️ Waste Management</option>
                        <option value="Water Supply">💧 Water Supply</option>
                        <option value="Health Services">🏥 Health Services</option>
                        <option value="Education">📚 Education</option>
                        <option value="Revenue">🏛️ Revenue</option>
                        <option value="Municipal Services">🏙️ Municipal Services</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Issue Keyword *</label>
                      <input type="text" name="issueKeyword" value={formData.issueKeyword} onChange={handleChange} placeholder="e.g., passport delay, power outage" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Priority Level</label>
                      <select name="priority" value={formData.priority} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium">
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority (Urgent)</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Detailed Description *</label>
                        <button type="button" onClick={handleAIGenerate} disabled={generatingAI}
                          className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition font-semibold disabled:opacity-50">
                          {generatingAI ? <FaSpinner className="animate-spin" /> : <FaRobot />} AI Generate
                        </button>
                      </div>
                      <textarea name="description" value={formData.description} onChange={handleChange}
                        placeholder="Please provide detailed description including dates, locations, and relevant information..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" rows="5" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Solutions Section */}
              {formData.department && formData.issueKeyword && showSolutions && (
                <div className="mt-8">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formLanguage === "en" ? "Community Solutions" : (translatedSections.communitySolutions || "কমিউনিটি সমাধান")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formLanguage === "en" ? "Verified solutions from other users" : "অন্যান্য ব্যবহারকারীদের থেকে যাচাইকৃত সমাধান"}
                    </p>
                  </div>
                  <ViewSolutions
                    department={formData.department}
                    keyword={formData.issueKeyword}
                    onSelect={(solution) => {
                      if (window.confirm(formLanguage === "en" ? "Would you like to use this solution as reference?" : "আপনি কি এই সমাধানটি রেফারেন্স হিসাবে ব্যবহার করতে চান?")) {
                        setFormData({ ...formData, description: solution.description || formData.description });
                      }
                    }}
                  />
                </div>
              )}

              {/* Template Preview */}
              {generatedTemplate && (
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <FaStamp className="text-blue-600" /> Official Complaint Format Preview
                    </h3>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => navigator.clipboard.writeText(editedTemplate)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1.5 text-xs font-semibold transition"><FaCopy size={11} /> Copy</button>
                      <button type="button" onClick={downloadTemplateAsPDF} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-1.5 text-xs font-semibold transition"><FaFilePdf size={11} /> PDF</button>
                      <button type="button" onClick={downloadTemplateAsText} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1.5 text-xs font-semibold transition"><FaDownload size={11} /> Text</button>
                      <button type="button" onClick={printTemplate} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1.5 text-xs font-semibold transition"><FaPrint size={11} /> Print</button>
                    </div>
                  </div>
                  {translating ? (
                    <div className="flex justify-center items-center h-64">
                      <FaSpinner className="animate-spin text-3xl text-blue-600" />
                      <span className="ml-3 text-gray-600">{formLanguage === "en" ? "Translating..." : "অনুবাদ করা হচ্ছে..."}</span>
                    </div>
                  ) : (
                    <textarea value={editedTemplate} onChange={handleTemplateEdit} className="w-full font-mono text-xs p-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="12" />
                  )}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { setShowForm(false); setShowSolutions(false); }} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 text-sm disabled:opacity-50">
                  {submitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : <><FaCheckCircle /> Submit Complaint</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MY SOLUTIONS MODAL ──────────────────────────────────── */}
      {showMySolutions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3"><FaLightbulb className="text-xl" /><div><h2 className="font-black">My Solutions</h2><p className="text-indigo-200 text-xs">Solutions you've shared with the community</p></div></div>
              <button onClick={() => setShowMySolutions(false)} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {userSolutions.length === 0 ? (
                <div className="text-center py-12">
                  <FaLightbulb className="text-5xl text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No solutions yet. When your complaint is resolved, share your experience to help others!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSolutions.map(solution => (
                    <div key={solution._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">{solution.department}</span>
                            {solution.verified ? <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold"><FaCheckCircle size={10} /> Verified</span> : <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold"><FaHourglassHalf size={10} /> Pending</span>}
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm">{solution.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{solution.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaThumbsUp size={10} /> {solution.helpfulCount || 0}</span>
                            <span className="flex items-center gap-1"><FaThumbsDown size={10} /> {solution.notHelpfulCount || 0}</span>
                          </div>
                        </div>
                      </div>
                      {solution.status === "Rejected" && <div className="mt-3 p-3 bg-red-50 rounded-lg text-xs text-red-700"><strong>Feedback:</strong> {solution.adminFeedback}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TIMELINE MODAL ──────────────────────────────────────── */}
      {showTimeline && selectedForTimeline && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-start">
              <div>
                <h2 className="font-black flex items-center gap-2"><FaHistory /> Complaint Timeline</h2>
                <p className="text-purple-200 text-xs mt-1">#{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}</p>
              </div>
              <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition"><FaTimes /></button>
            </div>
            <div className="p-6 max-h-80 overflow-y-auto">
              <div className="space-y-5">
                {selectedForTimeline.timeline?.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${entry.status === 'Resolved' ? 'bg-green-500' : entry.status === 'Processing' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                      {index < (selectedForTimeline.timeline?.length - 1) && <div className="absolute top-4 left-1 w-0.5 h-full bg-gray-200" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-gray-800">{entry.status}</p>
                        <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{entry.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">By: {entry.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isAdmin && normalizeComplaintStatus(selectedForTimeline.status) !== "Resolved" && (
                <div className="mt-6 p-5 bg-purple-50 rounded-xl border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-sm"><FaShieldAlt /> Admin Actions</h3>
                  <div className="flex gap-2 mb-3">
                    <select className="flex-1 border border-purple-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium"
                      value={adminComment.split('|')[0] || "Processing"}
                      onChange={e => { const comment = adminComment.split('|')[1] || ""; setAdminComment(e.target.value + '|' + comment); }}>
                      <option value="Processing">Mark as Processing</option>
                      <option value="Resolved">Mark as Resolved</option>
                    </select>
                    <button onClick={() => updateComplaintStatus(selectedForTimeline._id, adminComment.split('|')[0] || "Processing")} disabled={updatingStatus}
                      className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold transition">
                      {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />} Update
                    </button>
                  </div>
                  <input type="text" placeholder="Add official comment (optional)"
                    className="w-full border border-purple-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    value={adminComment.split('|')[1] || ""}
                    onChange={e => setAdminComment((adminComment.split('|')[0] || "Processing") + '|' + e.target.value)} />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ──────────────────────────────────────────── */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2"><FaEye /><h2 className="font-black">Complaint Details</h2></div>
              <button onClick={() => setSelectedComplaint(null)} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition"><FaTimes /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Complaint Number", value: <span className="font-mono text-sm font-bold">{selectedComplaint.complaintNumber || selectedComplaint._id}</span> },
                  { label: "Status", value: getStatusBadge(selectedComplaint.status) },
                  { label: "Citizen Name", value: selectedComplaint.citizenName },
                  { label: "Contact", value: selectedComplaint.contactNumber },
                  { label: "Department", value: selectedComplaint.department },
                  { label: "Priority", value: getPriorityBadge(selectedComplaint.priority) },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                  </div>
                ))}
                <div className="col-span-2 bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Issue</p><p className="text-sm font-bold text-gray-800">{selectedComplaint.issueKeyword}</p></div>
                <div className="col-span-2 bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-1">{selectedComplaint.description}</p></div>

                {selectedComplaint.adminFeedback?.length > 0 && (
                  <div className="col-span-2 bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs font-bold text-purple-700 mb-3 uppercase tracking-wider">Admin Feedback</p>
                    <div className="space-y-3">
                      {selectedComplaint.adminFeedback.map((fb, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
                          <p className="text-sm text-gray-700">{fb.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(fb.askedAt).toLocaleString()}</p>
                          {fb.response ? (
                            <div className="mt-2 pl-3 border-l-2 border-green-300">
                              <p className="text-xs text-green-600 font-semibold">Your Response:</p>
                              <p className="text-xs text-gray-600">{fb.response.text}</p>
                            </div>
                          ) : fb.requiresResponse && isMyComplaint(selectedComplaint) && (
                            <button onClick={() => { setSelectedFeedbackForResponse(fb); setShowResponseModal(true); }} className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold">
                              <FaReply size={10} /> Respond
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="col-span-2 bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Submitted On</p><p className="text-sm text-gray-700">{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
              <button onClick={() => { setSelectedComplaint(null); setSelectedForTimeline(selectedComplaint); setShowTimeline(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-1.5 text-sm font-semibold transition"><FaHistory size={12} /> Timeline</button>
              {canShareSolution(selectedComplaint) && <button onClick={() => { setSelectedForSolution(selectedComplaint); setShowSolutionForm(true); setSelectedComplaint(null); }} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-1.5 text-sm font-semibold transition"><FaLightbulb size={12} /> Share Solution</button>}
              <button onClick={() => exportComplaintAsPDF(selectedComplaint)} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-1.5 text-sm font-semibold transition"><FaFilePdf size={12} /> Export PDF</button>
              <button onClick={() => setSelectedComplaint(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT COMPLAINT MODAL ─────────────────────────────────── */}
      {showEditModal && editingComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Edit Complaint</h3>
                <button onClick={() => { setShowEditModal(false); setEditingComplaint(null); }} className="p-2 hover:bg-white/20 rounded-full"><FaTimes /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800"><FaExclamationTriangle className="inline mr-1" /> <strong>Note:</strong> Your edits will be reviewed by an administrator.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Editing *</label>
                  <input type="text" value={editFormData.editReason} onChange={(e) => setEditFormData({ ...editFormData, editReason: e.target.value })} placeholder="e.g., Additional information, Correction, etc." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                <button onClick={() => { setShowEditModal(false); setEditingComplaint(null); }} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FEEDBACK MODAL (Admin) ───────────────────────────────── */}
      {showFeedbackModal && selectedForFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-black flex items-center gap-2"><FaComment /> Send Feedback</h3>
              <button onClick={() => { setShowFeedbackModal(false); setSelectedForFeedback(null); setFeedbackMessage(""); }} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition"><FaTimes /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Complaint: <span className="font-bold text-gray-800">{selectedForFeedback.complaintNumber}</span></p>
              <textarea value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} placeholder="Type your feedback or question for the citizen..." rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={handleSendFeedback} disabled={sendingFeedback}
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {sendingFeedback ? <FaSpinner className="animate-spin" /> : null} Send Feedback
                </button>
                <button onClick={() => { setShowFeedbackModal(false); setSelectedForFeedback(null); setFeedbackMessage(""); }} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold text-sm transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESPONSE MODAL (User) ───────────────────────────────── */}
      {showResponseModal && selectedFeedbackForResponse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white px-6 py-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-black flex items-center gap-2"><FaReply /> Respond to Admin</h3>
              <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); setResponseMessage(""); }} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-xl transition"><FaTimes /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Admin Message</p>
                <p className="text-sm text-gray-700">{selectedFeedbackForResponse.message}</p>
              </div>
              <textarea value={responseMessage} onChange={e => setResponseMessage(e.target.value)} placeholder="Type your response..." rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none resize-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={handleRespondToFeedback} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm transition">Send Response</button>
                <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); }} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold text-sm transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5 rounded-t-2xl">
              <h2 className="font-black flex items-center gap-2"><FaTrash /> Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4 mb-5 border border-red-100">
                <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
                <p className="text-sm text-red-700">This action is <strong>permanent</strong>. The complaint and all its data will be removed and cannot be recovered.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">Cancel</button>
                <button onClick={deleteComplaint} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-sm transition flex items-center gap-2"><FaTrash size={12} /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .fixed.top-6.right-6 { animation: slideInRight 0.3s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}