
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { 
// //   FaClipboardList, 
// //   FaTrash, 
// //   FaEye, 
// //   FaPlus,
// //   FaSearch,
// //   FaFilter,
// //   FaCheckCircle,
// //   FaClock,
// //   FaExclamationCircle,
// //   FaFileAlt,
// //   FaHistory,
// //   FaSpinner,
// //   FaFilePdf,
// //   FaEdit,
// //   FaDownload,
// //   FaCopy,
// //   FaBuilding,
// //   FaUserTie,
// //   FaCalendarAlt,
// //   FaIdCard,
// //   FaPhone,
// //   FaEnvelope,
// //   FaMapMarkerAlt,
// //   FaCheckDouble,
// //   FaHourglassHalf,
// //   FaShieldAlt,
// //   FaStamp,
// //   FaUser,
// //   FaPrint,
// //   FaLightbulb,
// //   FaThumbsUp,
// //   FaThumbsDown,
// //   FaTimes,
// //   FaLanguage,
// //   FaRobot
// // } from "react-icons/fa";
// // import jsPDF from "jspdf";
// // import SurveyModal from "../components/SurveyModal";
// // import SolutionSuggestions from "../components/SolutionSuggestions";
// // import SubmitSolution from "../components/SubmitSolution";
// // import ViewSolutions from "../components/ViewSolutions";

// // export default function Complaints({ user }) {
// //   const [complaints, setComplaints] = useState([]);
// //   const [selectedComplaint, setSelectedComplaint] = useState(null);
// //   const [deleteTarget, setDeleteTarget] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [showForm, setShowForm] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [showTimeline, setShowTimeline] = useState(false);
// //   const [selectedForTimeline, setSelectedForTimeline] = useState(null);
// //   const [adminComment, setAdminComment] = useState("");
// //   const [updatingStatus, setUpdatingStatus] = useState(false);
// //   const [generatedTemplate, setGeneratedTemplate] = useState("");
// //   const [editedTemplate, setEditedTemplate] = useState("");
// //   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
// //   const [activeTab, setActiveTab] = useState("all");
// //   const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
// //   const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
// //   const [showSolutions, setShowSolutions] = useState(false);
// //   const [showSolutionForm, setShowSolutionForm] = useState(false);
// //   const [selectedForSolution, setSelectedForSolution] = useState(null);
// //   const [showMySolutions, setShowMySolutions] = useState(false);
// //   const [userSolutions, setUserSolutions] = useState([]);
  
// //   // Language state
// //   const [formLanguage, setFormLanguage] = useState("en");
// //   const [translating, setTranslating] = useState(false);
// //   const [generatingAI, setGeneratingAI] = useState(false);
// //   const [translatedSections, setTranslatedSections] = useState({
// //     complainantInfo: "",
// //     complaintDetails: "",
// //     communitySolutions: "",
// //     officialFormat: ""
// //   });
// //   const [editingComplaint, setEditingComplaint] = useState(null);
// // const [showEditModal, setShowEditModal] = useState(false);
// // const [editFormData, setEditFormData] = useState({
// //   description: "",
// //   formalTemplate: "",
// //   editReason: ""
// // });

// //   // Translated user data
// //   const [translatedUserData, setTranslatedUserData] = useState({
// //     name: "",
// //     address: ""
// //   });
  
// //   // Survey related states
// //   const [showSurvey, setShowSurvey] = useState(false);
// //   const [resolvedComplaint, setResolvedComplaint] = useState(null);
// //   const [surveySubmittedComplaints, setSurveySubmittedComplaints] = useState([]);
// //   const [hasShownSurveyPopup, setHasShownSurveyPopup] = useState(false);
  
// //   // Report generation state
// //   const [generatingReport, setGeneratingReport] = useState(false);

// //   const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

// //   const getCurrentUser = () => {
// //     return user || JSON.parse(localStorage.getItem("user") || "{}");
// //   };

// //   const currentUser = getCurrentUser();

// //   const [formData, setFormData] = useState({
// //     department: "",
// //     issueKeyword: "",
// //     description: "",
// //     priority: "medium",
// //     citizenName: currentUser?.name || "",
// //     citizenId: currentUser?.nid || "",
// //     contactNumber: currentUser?.phone || "",
// //     email: currentUser?.email || "",
// //     address: currentUser?.address || ""
// //   });

// //   // Translate text using  API
// //   const translateText = async (text, targetLang) => {
// //     if (targetLang !== "bn" || !text || text.trim() === "") return text;
    
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.post(
// //         "http://localhost:5000/api/ai/translate",
// //         { text, targetLang },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       return response.data.translated || text;
// //     } catch (error) {
// //       console.error("Translation error:", error);
// //       return text;
// //     }
// //   };

// // const handleAIGenerate = async () => {
// //   if (!formData.department || !formData.issueKeyword) {
// //     alert(formLanguage === "en" 
// //       ? "Please select department and enter issue keyword first"
// //       : "অনুগ্রহ করে প্রথমে বিভাগ নির্বাচন করুন এবং ইস্যু কীওয়ার্ড লিখুন");
// //     return;
// //   }

// //   setGeneratingAI(true);
// //   try {
// //     const token = localStorage.getItem('token');
    
// //     const response = await axios.post(
// //       "http://localhost:5000/api/ai/generate-complaint",
// //       {
// //         department: formData.department,
// //         keyword: formData.issueKeyword,
// //         description: formData.description,
// //         citizenName: formData.citizenName,
// //         citizenId: formData.citizenId,
// //         address: formData.address,
// //         contactNumber: formData.contactNumber,
// //         language: formLanguage
// //       },
// //       {
// //         headers: { Authorization: `Bearer ${token}` },
// //         timeout: 60000
// //       }
// //     );

// //     if (response.data.success) {
// //       if (response.data.translatedName) {
// //         setTranslatedUserData({
// //           name: response.data.translatedName,
// //           address: response.data.translatedAddress || formData.address
// //         });
// //       }
      
// //       const aiDescription = formLanguage === "bn" ? response.data.bangla : response.data.english;
// //       setFormData(prev => ({ ...prev, description: aiDescription }));
      
// //       const template = await generateDynamicComplaintTemplate(
// //         {
// //           citizenName: formData.citizenName,
// //           citizenId: formData.citizenId,
// //           contactNumber: formData.contactNumber,
// //           email: formData.email,
// //           address: formData.address,
// //           department: formData.department,
// //           issueKeyword: formData.issueKeyword,
// //           description: aiDescription,
// //           priority: formData.priority,
// //           complaintNumber: `CMP${Date.now().toString().slice(-8)}`
// //         },
// //         formLanguage,
// //         aiDescription
// //       );
// //       setGeneratedTemplate(template);
// //       setEditedTemplate(template);
      
// //       alert(formLanguage === "en" 
// //         ? "AI complaint generated successfully!"
// //         : "এআই অভিযোগ সফলভাবে তৈরি হয়েছে!");
// //     } else {
// //       alert(response.data.message || (formLanguage === "en" 
// //         ? "AI generation failed. Please try again."
// //         : "এআই জেনারেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
// //     }
// //   } catch (error) {
// //     console.error("AI generation error:", error);
    
// //     let errorMessage = formLanguage === "en" 
// //       ? "Failed to generate AI complaint. Please try again later."
// //       : "এআই অভিযোগ তৈরি করতে ব্যর্থ হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।";
    
// //     if (error.response) {
// //       errorMessage = error.response.data?.message || errorMessage;
// //     } else if (error.request) {
// //       errorMessage = formLanguage === "en" 
// //         ? "Server not responding. Please check if the backend is running."
// //         : "সার্ভার সাড়া দিচ্ছে না। অনুগ্রহ করে ব্যাকএন্ড চলছে কিনা পরীক্ষা করুন।";
// //     }
    
// //     alert(errorMessage);
// //   } finally {
// //     setGeneratingAI(false);
// //   }
// // };

// // const translateUserData = async () => {
// //   if (formLanguage !== "bn") {
// //     setTranslatedUserData({
// //       name: formData.citizenName,
// //       address: formData.address
// //     });
// //     return;
// //   }
  
// //   try {
// //     const token = localStorage.getItem('token');
// //     const response = await axios.post(
// //       "http://localhost:5000/api/ai/translate-user-data",
// //       {
// //         name: formData.citizenName,
// //         address: formData.address,
// //         targetLang: "bn"
// //       },
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     );
    
// //     setTranslatedUserData({
// //       name: response.data.translatedName || formData.citizenName,
// //       address: response.data.translatedAddress || formData.address
// //     });
// //   } catch (error) {
// //     console.error("User data translation error:", error);
// //     setTranslatedUserData({
// //       name: formData.citizenName,
// //       address: formData.address
// //     });
// //   }
// // };
// //   // Translate UI sections
// //   const translateUISections = async () => {
// //     if (formLanguage !== "bn") return;
    
// //     setTranslating(true);
// //     try {
// //       const sections = {
// //         complainantInfo: "Complainant Information (As per NID)",
// //         complaintDetails: "Complaint Details",
// //         communitySolutions: "Community Solutions",
// //         officialFormat: "Official Government Complaint Format"
// //       };
      
// //       const translated = {};
// //       for (const [key, value] of Object.entries(sections)) {
// //         translated[key] = await translateText(value, "bn");
// //       }
// //       setTranslatedSections(translated);
// //     } catch (error) {
// //       console.error("Section translation error:", error);
// //     } finally {
// //       setTranslating(false);
// //     }
// //   };

// // const generateDynamicComplaintTemplate = async (userData, lang = "en", aiGeneratedDescription = null) => {
// //   const currentDate = new Date().toLocaleDateString(lang === "en" ? 'en-GB' : 'bn-BD', {
// //     day: 'numeric',
// //     month: 'long',
// //     year: 'numeric'
// //   });

// //   const priorityText = {
// //     low: lang === "en" ? "Low" : "নিম্ন",
// //     medium: lang === "en" ? "Medium" : "মাঝারি",
// //     high: lang === "en" ? "High" : "উচ্চ",
// //     emergency: lang === "en" ? "Emergency" : "জরুরি"
// //   };

// //   const departmentMapBN = {
// //     "Passport Office": "পাসপোর্ট অফিস",
// //     "Electricity": "বিদ্যুৎ বিভাগ",
// //     "Road Maintenance": "সড়ক রক্ষণাবেক্ষণ বিভাগ",
// //     "Waste Management": "বর্জ্য ব্যবস্থাপনা বিভাগ",
// //     "Health Services": "স্বাস্থ্য সেবা বিভাগ",
// //     "Education": "শিক্ষা বিভাগ",
// //     "Revenue": "রাজস্ব বিভাগ",
// //     "Municipal Services": "পৌর সেবা বিভাগ"
// //   };

// //   const departmentName = lang === "bn" && departmentMapBN[userData.department] 
// //     ? departmentMapBN[userData.department] 
// //     : userData.department;

// //   const citizenName = lang === "bn" ? (translatedUserData.name || userData.citizenName) : userData.citizenName;
// //   const citizenAddress = lang === "bn" ? (translatedUserData.address || userData.address) : userData.address;
// //   const finalDescription = aiGeneratedDescription || userData.description;
// //   const template = `====================================================================
// // ${lang === "en" ? "GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH" : "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"}
// // ${lang === "en" ? "Ministry of Public Administration" : "জনপ্রশাসন মন্ত্রণালয়"}
// // ${departmentName}
// // ====================================================================

// // ${lang === "en" ? "FORMAL COMPLAINT LETTER" : "আনুষ্ঠানিক অভিযোগ পত্র"}

// // ${lang === "en" ? "Complaint No" : "অভিযোগ নং"}: ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}
// // ${lang === "en" ? "Date" : "তারিখ"}: ${currentDate}

// // ${lang === "en" ? "To" : "প্রতি"},
// // ${lang === "en" ? "The Concerned Authority" : "সম্মানিত কর্তৃপক্ষ"},
// // ${departmentName},
// // ${lang === "en" ? "Government of Bangladesh" : "বাংলাদেশ সরকার"},
// // ${lang === "en" ? "Dhaka" : "ঢাকা"}.

// // ${lang === "en" ? "Subject" : "বিষয়"}: ${lang === "en" ? `FORMAL COMPLAINT REGARDING ${userData.issueKeyword.toUpperCase()}` : `${userData.issueKeyword} সংক্রান্ত আনুষ্ঠানিক অভিযোগ`}

// // ====================================================================
// // ${lang === "en" ? "COMPLAINANT DETAILS" : "অভিযোগকারীর বিবরণ"}
// // ====================================================================

// // ${lang === "en" ? "Name" : "নাম"}                    : ${citizenName}
// // ${lang === "en" ? "Father's/Spouse's Name" : "পিতা/স্বামীর নাম"}  : ${lang === "en" ? "[Father's/Spouse's Name]" : "[পিতার/স্বামীর নাম]"}
// // ${lang === "en" ? "National ID Number" : "জাতীয় পরিচয়পত্র নং"}      : ${userData.citizenId}
// // ${lang === "en" ? "Present/Permanent Address" : "বর্তমান/স্থায়ী ঠিকানা"}: ${citizenAddress}
// // ${lang === "en" ? "Contact Number" : "যোগাযোগ নম্বর"}          : ${userData.contactNumber}
// // ${lang === "en" ? "Email Address" : "ইমেইল ঠিকানা"}           : ${userData.email || 'N/A'}

// // ====================================================================
// // ${lang === "en" ? "COMPLAINT DETAILS" : "অভিযোগের বিবরণ"}
// // ====================================================================

// // ${lang === "en" ? "Department Concerned" : "বিভাগ"}    : ${departmentName}
// // ${lang === "en" ? "Nature of Complaint" : "অভিযোগের ধরন"}     : ${userData.issueKeyword}
// // ${lang === "en" ? "Priority Level" : "অগ্রাধিকার স্তর"}          : ${priorityText[userData.priority]}
// // ${lang === "en" ? "Date of Incident" : "ঘটনার তারিখ"}        : ${new Date().toLocaleDateString()}
// // ${lang === "en" ? "Location of Incident" : "ঘটনার স্থান"}    : ${citizenAddress}

// // ====================================================================
// // ${lang === "en" ? "DETAILED DESCRIPTION" : "বিস্তারিত বিবরণ"}
// // ====================================================================

// // ${lang === "en" ? "Respected Sir/Madam," : "মাননীয় মহোদয়/মহোদয়া,"}

// // ${lang === "en" ? "I" : "আমি"}, ${citizenName}, ${lang === "en" ? "son/daughter of" : "পুত্র/কন্যা"} [${lang === "en" ? "Father's Name" : "পিতার নাম"}], ${lang === "en" ? "bearing NID No" : "এনআইডি নং ধারী"} ${userData.citizenId}, ${lang === "en" ? "a resident of" : "এর বাসিন্দা"} ${citizenAddress}, ${lang === "en" ? "would like to draw your kind attention to the following matter" : "আপনার সদয় দৃষ্টি আকর্ষণ করে নিম্নোক্ত বিষয়টি জানাতে চাই"}:

// // ${finalDescription}

// // ${lang === "en" ? "This issue has been causing significant hardship and inconvenience." : "এই সমস্যাটি উল্লেখযোগ্য কষ্ট ও অসুবিধার সৃষ্টি করছে।"}

// // ====================================================================
// // ${lang === "en" ? "SPECIFIC REQUESTS" : "নির্দিষ্ট অনুরোধ"}
// // ====================================================================

// // ${lang === "en" ? "Therefore, I humbly request your esteemed office to" : "অতএব, আমি আপনার কার্যালয়ের কাছে বিনীতভাবে অনুরোধ করছি"}:

// // 1. ${lang === "en" ? "Investigate the matter thoroughly at the earliest convenience." : "বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করা।"}
// // 2. ${lang === "en" ? "Take necessary action against the concerned parties (if applicable)." : "প্রয়োজনীয় ব্যবস্থা গ্রহণ করা (যদি প্রযোজ্য হয়)।"}
// // 3. ${lang === "en" ? "Provide a written update on the action taken within 7 working days." : "গৃহীত ব্যবস্থার একটি লিখিত আপডেট ৭ কার্যদিবসের মধ্যে প্রদান করা।"}
// // 4. ${lang === "en" ? "Implement preventive measures to avoid recurrence of such issues." : "এ ধরনের সমস্যার পুনরাবৃত্তি রোধে প্রতিরোধমূলক ব্যবস্থা গ্রহণ করা।"}

// // ====================================================================
// // ${lang === "en" ? "DECLARATION" : "ঘোষণা"}
// // ====================================================================

// // ${lang === "en" ? "I" : "আমি"}, ${citizenName}, ${lang === "en" ? "do hereby declare that the information provided above is true and correct to the best of my knowledge and belief." : "এতদ্বারা ঘোষণা করছি যে উপরোক্ত প্রদত্ত তথ্যগুলি সম্পূর্ণ সত্য ও সঠিক।"}

// //                                             .....................
// //                                             (${lang === "en" ? "Signature of Complainant" : "স্বাক্ষরকারীর স্বাক্ষর"})

// // ====================================================================
// // ${lang === "en" ? "OFFICIAL USE ONLY" : "অফিসিয়াল ব্যবহারের জন্য"}
// // ====================================================================

// // ${lang === "en" ? "Complaint Registered By" : "অভিযোগ নিবন্ধনকারী"}: [${lang === "en" ? "Officer Name" : "কর্মকর্তার নাম"}]
// // ${lang === "en" ? "Registration Date" : "নিবন্ধনের তারিখ"}      : ${currentDate}
// // ${lang === "en" ? "Complaint Number" : "অভিযোগ নম্বর"}       : ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}

// //                                                            ${lang === "en" ? "OFFICIAL STAMP" : "সরকারী সিলমোহর"}

// // ====================================================================

// // ${lang === "en" ? "Thanking you," : "ধন্যবাদান্তে,"}

// // ${lang === "en" ? "Yours faithfully," : "আন্তরিকভাবে,"}
// // ${citizenName}
// // ${lang === "en" ? "Contact" : "যোগাযোগ"}: ${userData.contactNumber}
// // ${lang === "en" ? "NID" : "এনআইডি"}: ${userData.citizenId}

// // ====================================================================`;

// //   if (lang === "bn") {
// //     return await translateText(template, "bn");
// //   }
// //   return template;
// // };

// // // Add this function to handle opening edit modal
// // const handleEditComplaint = (complaint) => {
// //   setEditingComplaint(complaint);
// //   setEditFormData({
// //     description: complaint.description || "",
// //     formalTemplate: complaint.formalTemplate || "",
// //     editReason: ""
// //   });
// //   setShowEditModal(true);
// // };

// // // Add this function to handle saving edits
// // const handleSaveEdit = async () => {
// //   if (!editFormData.editReason.trim()) {
// //     alert("Please provide a reason for editing your complaint");
// //     return;
// //   }

// //   try {
// //     const token = localStorage.getItem('token');
// //     await axios.put(
// //       `http://localhost:5000/api/complaints/${editingComplaint._id}`,
// //       {
// //         description: editFormData.description,
// //         formalTemplate: editFormData.formalTemplate,
// //         editReason: editFormData.editReason
// //       },
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     );
    
// //     showNotification("Complaint updated successfully. Admin will review your changes.", "success");
// //     setShowEditModal(false);
// //     setEditingComplaint(null);
// //     fetchComplaints();
// //   } catch (error) {
// //     console.error("Error updating complaint:", error);
// //     alert(error.response?.data?.message || "Failed to update complaint");
// //   }
// // };

// //   // Generate template when form data changes
// //   useEffect(() => {
// //     const generateTemplate = async () => {
// //       if (formData.department && formData.issueKeyword) {
// //         const template = await generateDynamicComplaintTemplate(
// //           {
// //             citizenName: formData.citizenName,
// //             citizenId: formData.citizenId,
// //             contactNumber: formData.contactNumber,
// //             email: formData.email,
// //             address: formData.address,
// //             department: formData.department,
// //             issueKeyword: formData.issueKeyword,
// //             description: formData.description,
// //             priority: formData.priority,
// //             complaintNumber: `CMP${Date.now().toString().slice(-8)}`
// //           },
// //           formLanguage
// //         );
// //         setGeneratedTemplate(template);
// //         setEditedTemplate(template);
// //       }
// //     };
    
// //     generateTemplate();
// //   }, [formData.department, formData.issueKeyword, formData.description, formData.priority, formLanguage]);

// //   // Translate user data when language changes
// //   useEffect(() => {
// //     translateUserData();
// //   }, [formLanguage, formData.citizenName, formData.address]);

// //   // Translate UI sections when language changes
// //   useEffect(() => {
// //     translateUISections();
// //   }, [formLanguage]);

// //   const toggleFormLanguage = async () => {
// //     const newLang = formLanguage === "en" ? "bn" : "en";
// //     setFormLanguage(newLang);
    
// //     if (generatedTemplate) {
// //       setTranslating(true);
// //       try {
// //         if (newLang === "bn") {
// //           const translated = await translateText(generatedTemplate, "bn");
// //           setEditedTemplate(translated);
// //         } else {
// //           const englishTemplate = await generateDynamicComplaintTemplate(
// //             {
// //               citizenName: formData.citizenName,
// //               citizenId: formData.citizenId,
// //               contactNumber: formData.contactNumber,
// //               email: formData.email,
// //               address: formData.address,
// //               department: formData.department,
// //               issueKeyword: formData.issueKeyword,
// //               description: formData.description,
// //               priority: formData.priority,
// //               complaintNumber: `CMP${Date.now().toString().slice(-8)}`
// //             },
// //             "en"
// //           );
// //           setEditedTemplate(englishTemplate);
// //         }
// //       } catch (error) {
// //         console.error("Language toggle translation error:", error);
// //       } finally {
// //         setTranslating(false);
// //       }
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const handleTemplateEdit = (e) => {
// //     setEditedTemplate(e.target.value);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
    
// //     try {
// //       if (!formData.department || !formData.issueKeyword || !formData.description) {
// //         alert("Please fill in all required fields");
// //         setSubmitting(false);
// //         return;
// //       }

// //       const timeline = [
// //         {
// //           status: "Pending",
// //           comment: "Complaint submitted successfully",
// //           updatedBy: formData.citizenName || "Citizen",
// //           date: new Date()
// //         }
// //       ];

// //       const complaintData = {
// //         userId: userId,
// //         citizenName: formData.citizenName,
// //         citizenId: formData.citizenId,
// //         contactNumber: formData.contactNumber,
// //         email: formData.email || "",
// //         address: formData.address || "",
// //         department: formData.department,
// //         issueKeyword: formData.issueKeyword,
// //         description: formData.description,
// //         priority: formData.priority || "medium",
// //         timeline: timeline,
// //         surveySubmitted: false,
// //         language: formLanguage,
// //         formalTemplate: editedTemplate
// //       };

// //       const token = localStorage.getItem('token');
// //       const res = await axios.post(
// //         "http://localhost:5000/api/complaints/create", 
// //         complaintData,
// //         {
// //           headers: { Authorization: `Bearer ${token}` }
// //         }
// //       );
      
// //       setComplaints(prevComplaints => [res.data, ...prevComplaints]);
      
// //       setShowSuccessMessage(true);
// //       setTimeout(() => setShowSuccessMessage(false), 5000);
      
// //       setFormData({
// //         department: "",
// //         issueKeyword: "",
// //         description: "",
// //         priority: "medium",
// //         citizenName: currentUser?.name || "",
// //         citizenId: currentUser?.nid || "",
// //         contactNumber: currentUser?.phone || "",
// //         email: currentUser?.email || "",
// //         address: currentUser?.address || ""
// //       });
      
// //       setShowForm(false);
// //       setGeneratedTemplate("");
// //       setEditedTemplate("");
// //       setFormLanguage("en");
      
// //     } catch (error) {
// //       console.error("Error details:", error);
      
// //       if (error.response) {
// //         alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
// //       } else if (error.request) {
// //         alert("Server is not responding. Please check if the backend is running on port 5000");
// //       } else {
// //         alert(`Error: ${error.message}`);
// //       }
// //     }
// //     setSubmitting(false);
// //   };

// //   // Load survey submitted complaints from localStorage
// //   useEffect(() => {
// //     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
// //     const submitted = localStorage.getItem(userKey);
// //     if (submitted) {
// //       setSurveySubmittedComplaints(JSON.parse(submitted));
// //     }
// //   }, [currentUser]);

// //   useEffect(() => {
// //     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
// //     localStorage.setItem(userKey, JSON.stringify(surveySubmittedComplaints));
// //   }, [surveySubmittedComplaints, currentUser]);

// //   useEffect(() => {
// //     if (isAdmin) return;
// //     if (hasShownSurveyPopup) return;
    
// //     const userResolvedComplaints = complaints.filter(c => 
// //       c.status === "Resolved" && 
// //       isMyComplaint(c) &&
// //       !surveySubmittedComplaints.includes(c._id)
// //     );
    
// //     if (userResolvedComplaints.length > 0 && !showSurvey && !resolvedComplaint) {
// //       const latestResolved = userResolvedComplaints[0];
// //       setResolvedComplaint(latestResolved);
// //       setShowSurvey(true);
// //       setHasShownSurveyPopup(true);
// //     }
// //   }, [complaints, surveySubmittedComplaints, isAdmin, showSurvey, resolvedComplaint, hasShownSurveyPopup, currentUser]);

// //   useEffect(() => {
// //     setHasShownSurveyPopup(false);
// //   }, [currentUser]);

// //   useEffect(() => {
// //     const userData = getCurrentUser();
// //     if (userData) {
// //       setFormData(prev => ({
// //         ...prev,
// //         citizenName: userData.name || prev.citizenName || "",
// //         citizenId: userData.nid || prev.citizenId || "",
// //         contactNumber: userData.phone || prev.contactNumber || "",
// //         email: userData.email || prev.email || "",
// //         address: userData.address || prev.address || ""
// //       }));
// //     }
// //   }, [user]);

// //   const userId = currentUser?._id || "64b123456789abcdef123456";

// //   const canShareSolution = (complaint) => {
// //     return complaint && 
// //            complaint.status === "Resolved" && 
// //            isMyComplaint(complaint);
// //   };

// //   const fetchComplaints = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem('token');
// //       const res = await axios.get("http://localhost:5000/api/complaints", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
      
// //       const complaintsWithDetails = res.data.map(complaint => ({
// //         ...complaint,
// //         citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided",
// //         citizenId: complaint.citizenId || "N/A",
// //         contactNumber: complaint.contactNumber || "N/A",
// //         email: complaint.email || "N/A",
// //         address: complaint.address || "N/A",
// //         priority: complaint.priority || "medium",
// //         complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`,
// //         userId: complaint.userId?._id || complaint.userId,
// //         surveySubmitted: complaint.surveySubmitted || false,
// //         timeline: complaint.timeline || [
// //           {
// //             status: "Submitted",
// //             date: complaint.createdAt || new Date().toISOString(),
// //             comment: "Complaint submitted successfully",
// //             updatedBy: "System"
// //           }
// //         ]
// //       }));
      
// //       setComplaints(complaintsWithDetails);
// //     } catch (error) {
// //       console.error("Error fetching complaints:", error);
// //     }
// //     setLoading(false);
// //   };

// //   const fetchUserSolutions = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const res = await axios.get("http://localhost:5000/api/solutions/my", {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       setUserSolutions(res.data);
// //     } catch (err) {
// //       console.error("Error fetching solutions:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchComplaints();
// //   }, []);

// //   const deleteComplaint = async () => {
// //     try {
// //       const complaintToDelete = complaints.find(c => c._id === deleteTarget);
      
// //       if (!complaintToDelete) {
// //         setDeleteSuccessMessage("Complaint not found");
// //         setShowDeleteSuccess(true);
// //         setTimeout(() => setShowDeleteSuccess(false), 3000);
// //         setDeleteTarget(null);
// //         return;
// //       }
      
// //       const isAuthorized = isAdmin || 
// //         complaintToDelete.userId === currentUser?._id || 
// //         complaintToDelete.userId?._id === currentUser?._id ||
// //         complaintToDelete.email === currentUser?.email;
      
// //       if (!isAuthorized) {
// //         setDeleteSuccessMessage("You are not authorized to delete this complaint");
// //         setShowDeleteSuccess(true);
// //         setTimeout(() => setShowDeleteSuccess(false), 3000);
// //         setDeleteTarget(null);
// //         return;
// //       }
      
// //       const token = localStorage.getItem('token');
// //       await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
      
// //       setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== deleteTarget));
// //       setDeleteTarget(null);
      
// //       setDeleteSuccessMessage("Complaint deleted successfully");
// //       setShowDeleteSuccess(true);
// //       setTimeout(() => setShowDeleteSuccess(false), 3000);
      
// //     } catch (error) {
// //       console.error("Error deleting complaint:", error);
// //       setDeleteSuccessMessage("Failed to delete complaint. Please try again.");
// //       setShowDeleteSuccess(true);
// //       setTimeout(() => setShowDeleteSuccess(false), 3000);
// //     }
// //   };

// //   const updateComplaintStatus = async (complaintId, newStatus) => {
// //     if (!isAdmin) {
// //       alert("Only administrators can update complaint status");
// //       return;
// //     }

// //     setUpdatingStatus(true);
// //     try {
// //       const timelineEntry = {
// //         status: newStatus,
// //         date: new Date().toISOString(),
// //         comment: adminComment || `Status updated to ${newStatus} by admin`,
// //         updatedBy: "Admin"
// //       };

// //       const token = localStorage.getItem('token');
// //       await axios.put(
// //         `http://localhost:5000/api/complaints/${complaintId}`, 
// //         {
// //           status: newStatus,
// //           timeline: [...(selectedForTimeline?.timeline || []), timelineEntry]
// //         },
// //         {
// //           headers: { Authorization: `Bearer ${token}` }
// //         }
// //       );

// //       setComplaints(prevComplaints => 
// //         prevComplaints.map(c => 
// //           c._id === complaintId 
// //             ? { ...c, status: newStatus, timeline: [...(c.timeline || []), timelineEntry] }
// //             : c
// //         )
// //       );

// //       setAdminComment("");
// //       setSelectedForTimeline(null);
// //       setShowTimeline(false);
      
// //     } catch (error) {
// //       console.error("Error updating status:", error);
// //     }
// //     setUpdatingStatus(false);
// //   };

// //   const handleSurveySubmitted = async () => {
// //     if (resolvedComplaint) {
// //       setSurveySubmittedComplaints(prev => [...prev, resolvedComplaint._id]);
// //     }
// //     setShowSurvey(false);
// //     setResolvedComplaint(null);
// //     fetchComplaints();
// //   };

// //   const openSurveyForComplaint = (complaint) => {
// //     if (surveySubmittedComplaints.includes(complaint._id)) {
// //       alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
// //       return;
// //     }
// //     setResolvedComplaint(complaint);
// //     setShowSurvey(true);
// //   };

// //   const downloadTemplateAsPDF = () => {
// //     const doc = new jsPDF();
// //     const lines = editedTemplate.split('\n');
// //     let y = 10;
    
// //     doc.setFontSize(10);
// //     lines.forEach(line => {
// //       if (y > 280) {
// //         doc.addPage();
// //         y = 10;
// //       }
// //       doc.text(line, 10, y);
// //       y += 5;
// //     });
    
// //     doc.save(`complaint_${formData.department}_${Date.now()}.pdf`);
// //   };

// //   const downloadTemplateAsText = () => {
// //     const element = document.createElement("a");
// //     const file = new Blob([editedTemplate], {type: 'text/plain'});
// //     element.href = URL.createObjectURL(file);
// //     element.download = `complaint_${formData.department}_${Date.now()}.txt`;
// //     document.body.appendChild(element);
// //     element.click();
// //     document.body.removeChild(element);
// //   };

// //   const printTemplate = () => {
// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write('<html><head><title>Complaint Form</title>');
// //     printWindow.document.write('<style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; }</style>');
// //     printWindow.document.write('</head><body>');
// //     printWindow.document.write('<pre>' + editedTemplate + '</pre>');
// //     printWindow.document.write('</body></html>');
// //     printWindow.document.close();
// //     printWindow.print();
// //   };

// //   const exportComplaintAsPDF = (complaint) => {
// //     const doc = new jsPDF();
// //     let y = 10;
    
// //     doc.setFontSize(16);
// //     doc.text("COMPLAINT DETAILS", 10, y);
// //     y += 10;
    
// //     doc.setFontSize(12);
// //     doc.text(`Complaint #: ${complaint.complaintNumber || complaint._id}`, 10, y);
// //     y += 7;
// //     doc.text(`Citizen: ${complaint.citizenName}`, 10, y);
// //     y += 7;
// //     doc.text(`Contact: ${complaint.contactNumber}`, 10, y);
// //     y += 7;
// //     doc.text(`Department: ${complaint.department}`, 10, y);
// //     y += 7;
// //     doc.text(`Issue: ${complaint.issueKeyword}`, 10, y);
// //     y += 7;
// //     doc.text(`Status: ${complaint.status}`, 10, y);
// //     y += 7;
// //     doc.text(`Priority: ${complaint.priority}`, 10, y);
// //     y += 7;
// //     doc.text(`Date: ${complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "N/A"}`, 10, y);
// //     y += 10;
    
// //     doc.setFontSize(14);
// //     doc.text("Description:", 10, y);
// //     y += 7;
// //     doc.setFontSize(11);
    
// //     const descriptionLines = doc.splitTextToSize(complaint.description || "No description", 180);
// //     descriptionLines.forEach(line => {
// //       if (y > 280) {
// //         doc.addPage();
// //         y = 10;
// //       }
// //       doc.text(line, 10, y);
// //       y += 5;
// //     });
    
// //     doc.save(`complaint_${complaint.complaintNumber || complaint._id}.pdf`);
// //   };

// //   const generateReport = async () => {
// //     if (!user) return;

// //     const myComplaints = complaints.filter(c => isMyComplaint(c));
// //     if (myComplaints.length === 0) {
// //       alert('No complaints to report.');
// //       return;
// //     }

// //     const getResolutionInfo = (complaint) => {
// //       if (complaint.status !== 'Resolved') return null;
// //       const created = new Date(complaint.createdAt);
// //       const resolvedEntry = complaint.timeline?.find(e => e.status === 'Resolved');
// //       if (resolvedEntry && resolvedEntry.date) {
// //         const resolved = new Date(resolvedEntry.date);
// //         const days = Math.ceil((resolved - created) / (1000 * 60 * 60 * 24));
// //         return { resolvedDate: resolved, days };
// //       }
// //       return { resolvedDate: null, days: null };
// //     };

// //     const stats = {
// //       total: myComplaints.length,
// //       pending: myComplaints.filter(c => c.status === 'Pending').length,
// //       processing: myComplaints.filter(c => c.status === 'Processing').length,
// //       resolved: myComplaints.filter(c => c.status === 'Resolved').length,
// //     };

// //     const deptCount = {};
// //     myComplaints.forEach(c => {
// //       deptCount[c.department] = (deptCount[c.department] || 0) + 1;
// //     });

// //     const priorityCount = { low: 0, medium: 0, high: 0, emergency: 0 };
// //     myComplaints.forEach(c => {
// //       if (c.priority) priorityCount[c.priority] = (priorityCount[c.priority] || 0) + 1;
// //     });

// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>ShebaConnect Complaint Report</title>
// //         <style>
// //           body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
// //           .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
// //           .header h1 { margin: 0; color: #2563eb; }
// //           .user-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
// //           .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
// //           .stat-card { flex: 1; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; min-width: 120px; }
// //           .stat-value { font-size: 28px; font-weight: bold; color: #2563eb; }
// //           .breakdown { display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap; }
// //           .breakdown-section { flex: 1; background: #f9fafb; border-radius: 8px; padding: 15px; }
// //           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
// //           th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 12px; }
// //           th { background-color: #f9fafb; font-weight: 600; }
// //           .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
// //         </style>
// //       </head>
// //       <body>
// //         <div class="header">
// //           <h1>ShebaConnect</h1>
// //           <p>Government of Bangladesh • Citizen Grievance Redressal System</p>
// //         </div>
// //         <div class="user-info">
// //           <strong>Report generated for:</strong> ${user.name} (${user.email})<br>
// //           <strong>NID:</strong> ${user.nid}<br>
// //           <strong>Date:</strong> ${new Date().toLocaleString()}
// //         </div>

// //         <div class="stats">
// //           <div class="stat-card"><div class="stat-value">${stats.total}</div><div>Total Complaints</div></div>
// //           <div class="stat-card"><div class="stat-value">${stats.pending}</div><div>Pending</div></div>
// //           <div class="stat-card"><div class="stat-value">${stats.processing}</div><div>Processing</div></div>
// //           <div class="stat-card"><div class="stat-value">${stats.resolved}</div><div>Resolved</div></div>
// //         </div>

// //         <div class="breakdown">
// //           <div class="breakdown-section">
// //             <h3>📊 Complaints by Department</h3>
// //             <ul>
// //               ${Object.entries(deptCount).map(([dept, count]) => `<li><strong>${dept}</strong>: ${count}</li>`).join('')}
// //             </ul>
// //           </div>
// //           <div class="breakdown-section">
// //             <h3>⚠️ Complaints by Priority</h3>
// //             <ul>
// //               <li><strong>Low</strong>: ${priorityCount.low}</li>
// //               <li><strong>Medium</strong>: ${priorityCount.medium}</li>
// //               <li><strong>High</strong>: ${priorityCount.high}</li>
// //               <li><strong>Emergency</strong>: ${priorityCount.emergency}</li>
// //             </ul>
// //           </div>
// //         </div>

// //         <h3>📋 Complaint Details</h3>
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Complaint #</th>
// //               <th>Department</th>
// //               <th>Issue</th>
// //               <th>Status</th>
// //               <th>Priority</th>
// //               <th>Date</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             ${myComplaints.map(c => `
// //               <tr>
// //                 <td>${c.complaintNumber || c._id.slice(-6)}</td>
// //                 <td>${c.department}</td>
// //                 <td>${c.issueKeyword}</td>
// //                 <td>${c.status}</td>
// //                 <td>${c.priority}</td>
// //                 <td>${new Date(c.createdAt).toLocaleDateString()}</td>
// //               </tr>
// //             `).join('')}
// //           </tbody>
// //         </table>

// //         <div class="footer">
// //           This report was generated automatically by ShebaConnect. For official use only.
// //         </div>
// //       </body>
// //       </html>
// //     `;

// //     setGeneratingReport(true);
// //     try {
// //       const response = await axios.post(
// //         'https://api.pdf.co/v1/pdf/convert/from/html',
// //         {
// //           name: `complaint_report_${user._id}.pdf`,
// //           html: html,
// //           margin: '20px',
// //           paperSize: 'Letter',
// //           async: false
// //         },
// //         {
// //           headers: {
// //             'x-api-key': 'YOUR_PDF_CO_API_KEY_HERE',
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       if (response.data.error) throw new Error(response.data.error);
// //       const pdfUrl = response.data.url;
// //       window.open(pdfUrl, '_blank');
// //     } catch (err) {
// //       console.error('PDF generation error:', err);
// //       alert('Failed to generate report. Please try again later.');
// //     } finally {
// //       setGeneratingReport(false);
// //     }
// //   };

// //   const isMyComplaint = (complaint) => {
// //     if (!currentUser) return false;
    
// //     const complaintUserId = complaint.userId?._id || complaint.userId;
// //     const currentUserId = currentUser._id;
    
// //     if (currentUserId && complaintUserId) {
// //       return complaintUserId === currentUserId;
// //     }
    
// //     if (currentUser.email && complaint.email && complaint.email !== "N/A") {
// //       return complaint.email.toLowerCase() === currentUser.email.toLowerCase();
// //     }
    
// //     if (currentUser.phone && complaint.contactNumber && complaint.contactNumber !== "N/A") {
// //       return complaint.contactNumber === currentUser.phone;
// //     }
    
// //     if (currentUser.name && complaint.citizenName && complaint.citizenName !== "Not Provided") {
// //       return complaint.citizenName.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
// //     }
    
// //     return false;
// //   };

// //   const filteredComplaints = complaints.filter(c => {
// //     const matchesSearch = searchTerm === "" || 
// //       c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
// //     const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    
// //     let matchesTab = true;
// //     if (activeTab === "my") {
// //       matchesTab = isMyComplaint(c);
// //     }
    
// //     return matchesSearch && matchesFilter && matchesTab;
// //   });

// //   const userComplaints = complaints.filter(c => isMyComplaint(c));
// //   const userPending = userComplaints.filter(c => c.status === "Pending").length;
// //   const userResolved = userComplaints.filter(c => c.status === "Resolved").length;
// //   const userInProgress = userComplaints.filter(c => c.status === "In Progress" || c.status === "Processing").length;

// //   const getStatusBadge = (status) => {
// //     switch(status) {
// //       case 'Resolved':
// //         return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Resolved</span>;
// //       case 'Pending':
// //         return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
// //       case 'In Progress':
// //       case 'Processing':
// //         return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaExclamationCircle /> Processing</span>;
// //       default:
// //         return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
// //     }
// //   };

// //   const getPriorityBadge = (priority) => {
// //     switch(priority) {
// //       case 'high':
// //         return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High Priority</span>;
// //       case 'medium':
// //         return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium Priority</span>;
// //       case 'low':
// //         return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low Priority</span>;
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-4">
      
// //       {/* Page Header */}
// //       <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-6 mb-6 shadow-lg">
// //         <div className="container mx-auto">
// //           <div className="flex items-center gap-4">
// //             <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg">
// //               <FaClipboardList className="text-4xl" />
// //             </div>
// //             <div>
// //               <h1 className="text-4xl font-bold mb-2">Complaint Services</h1>
// //               <p className="text-blue-100 text-lg">Government of Bangladesh • Citizen Grievance Redressal System</p>
// //               <div className="flex items-center gap-2 mt-2 text-sm text-blue-200">
// //                 <FaShieldAlt />
// //                 <span>Your complaints are securely handled as per the Digital Security Act, 2018</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Success Messages */}
// //       {showSuccessMessage && (
// //         <div className="fixed top-20 right-6 z-50 animate-slideIn">
// //           <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
// //             <FaCheckCircle className="text-2xl" />
// //             <div>
// //               <h4 className="font-bold">Complaint Submitted Successfully!</h4>
// //               <p className="text-sm">Your complaint has been registered and will be processed soon.</p>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {showDeleteSuccess && (
// //         <div className="fixed top-20 right-6 z-50 animate-slideIn">
// //           <div className={`${
// //             deleteSuccessMessage.includes("successfully") 
// //               ? "bg-green-500" 
// //               : "bg-red-500"
// //           } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
// //             <div className="flex-shrink-0">
// //               {deleteSuccessMessage.includes("successfully") ? (
// //                 <FaCheckCircle className="text-2xl" />
// //               ) : (
// //                 <FaExclamationCircle className="text-2xl" />
// //               )}
// //             </div>
// //             <div className="flex-1">
// //               <p className="font-medium">{deleteSuccessMessage}</p>
// //             </div>
// //             <button
// //               onClick={() => setShowDeleteSuccess(false)}
// //               className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
// //             >
// //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Survey Modal */}
// //       {showSurvey && resolvedComplaint && isMyComplaint(resolvedComplaint) && (
// //         <SurveyModal
// //           complaint={resolvedComplaint}
// //           onClose={() => {
// //             setShowSurvey(false);
// //             setResolvedComplaint(null);
// //           }}
// //           onSubmit={handleSurveySubmitted}
// //         />
// //       )}

// //       {/* Solution Submission Modal */}
// //       {showSolutionForm && selectedForSolution && canShareSolution(selectedForSolution) && (
// //         <SubmitSolution
// //           complaint={selectedForSolution}
// //           onClose={() => {
// //             setShowSolutionForm(false);
// //             setSelectedForSolution(null);
// //           }}
// //           onSubmit={() => {
// //             fetchUserSolutions();
// //             fetchComplaints();
// //           }}
// //         />
// //       )}

// //       {/* My Solutions Modal */}
// //       {showMySolutions && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <FaLightbulb className="text-3xl" />
// //                   <div>
// //                     <h2 className="text-xl font-bold">My Solutions</h2>
// //                     <p className="text-sm text-purple-100">Solutions you've shared with the community</p>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowMySolutions(false)}
// //                   className="p-2 hover:bg-white/20 rounded-full transition-colors"
// //                 >
// //                   <FaTimes />
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="p-6">
// //               {userSolutions.length === 0 ? (
// //                 <div className="text-center py-12">
// //                   <FaLightbulb className="text-6xl text-gray-300 mx-auto mb-4" />
// //                   <h3 className="text-lg font-medium text-gray-700 mb-2">No solutions yet</h3>
// //                   <p className="text-gray-500 mb-4">When you resolve a complaint, share your solution to help others!</p>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-4">
// //                   {userSolutions.map((solution) => (
// //                     <div key={solution._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
// //                       <div className="flex items-start justify-between mb-2">
// //                         <div>
// //                           <div className="flex items-center gap-2 mb-2">
// //                             <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
// //                               {solution.department}
// //                             </span>
// //                             {solution.verified ? (
// //                               <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
// //                                 <FaCheckCircle /> Verified
// //                               </span>
// //                             ) : (
// //                               <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
// //                                 <FaHourglassHalf /> Pending Verification
// //                               </span>
// //                             )}
// //                           </div>
// //                           <h3 className="font-semibold text-gray-800">{solution.title}</h3>
// //                           <p className="text-sm text-gray-600 mt-1 line-clamp-2">{solution.description}</p>
// //                         </div>
// //                       </div>
                      
// //                       <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
// //                         <span>Posted: {new Date(solution.createdAt).toLocaleDateString()}</span>
// //                         <span>•</span>
// //                         <span className="flex items-center gap-1">
// //                           <FaThumbsUp /> {solution.helpfulCount || 0}
// //                         </span>
// //                         <span>•</span>
// //                         <span className="flex items-center gap-1">
// //                           <FaThumbsDown /> {solution.notHelpfulCount || 0}
// //                         </span>
// //                       </div>

// //                       {solution.status === "Rejected" && (
// //                         <div className="mt-3 p-3 bg-red-50 rounded-lg">
// //                           <p className="text-sm text-red-700">
// //                             <span className="font-semibold">Feedback:</span> {solution.adminFeedback}
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Content */}
// //       <div className="container mx-auto px-6">
        
// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 mb-1">My Complaints</p>
// //                 <h3 className="text-3xl font-bold text-gray-800">{userComplaints.length}</h3>
// //                 <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
// //                   <FaClipboardList /> Total complaints filed
// //                 </p>
// //               </div>
// //               <div className="bg-blue-100 p-3 rounded-lg">
// //                 <FaClipboardList className="text-blue-600 text-2xl" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 mb-1">Pending</p>
// //                 <h3 className="text-3xl font-bold text-yellow-500">{userPending}</h3>
// //                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
// //                   <FaHourglassHalf /> Awaiting review
// //                 </p>
// //               </div>
// //               <div className="bg-yellow-100 p-3 rounded-lg">
// //                 <FaClock className="text-yellow-600 text-2xl" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 mb-1">In Progress</p>
// //                 <h3 className="text-3xl font-bold text-blue-500">{userInProgress}</h3>
// //                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
// //                   <FaSpinner className="animate-spin" /> Being processed
// //                 </p>
// //               </div>
// //               <div className="bg-blue-100 p-3 rounded-lg">
// //                 <FaExclamationCircle className="text-blue-600 text-2xl" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 mb-1">Resolved</p>
// //                 <h3 className="text-3xl font-bold text-green-600">{userResolved}</h3>
// //                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// //                   <FaCheckCircle /> Successfully closed
// //                 </p>
// //               </div>
// //               <div className="bg-green-100 p-3 rounded-lg">
// //                 <FaCheckCircle className="text-green-600 text-2xl" />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Tabs */}
// //         <div className="flex gap-2 mb-6">
// //           <button
// //             onClick={() => setActiveTab("all")}
// //             className={`px-6 py-3 rounded-lg font-medium transition-all ${
// //               activeTab === "all" 
// //                 ? "bg-blue-600 text-white shadow-lg" 
// //                 : "bg-white text-gray-600 hover:bg-gray-100"
// //             }`}
// //           >
// //             All Complaints
// //           </button>
// //           <button
// //             onClick={() => setActiveTab("my")}
// //             className={`px-6 py-3 rounded-lg font-medium transition-all ${
// //               activeTab === "my" 
// //                 ? "bg-blue-600 text-white shadow-lg" 
// //                 : "bg-white text-gray-600 hover:bg-gray-100"
// //             }`}
// //           >
// //             My Complaints
// //           </button>
// //         </div>

// //         {/* Actions Bar */}
// //         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
// //           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
// //             {/* Search and Filters */}
// //             <div className="flex flex-1 items-center gap-4">
// //               <div className="relative flex-1">
// //                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                 <input
// //                   type="text"
// //                   placeholder="🔍 Search by complaint ID, citizen name, department, or issue..."
// //                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
              
// //               <div className="relative">
// //                 <select
// //                   className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   value={filterStatus}
// //                   onChange={(e) => setFilterStatus(e.target.value)}
// //                 >
// //                   <option value="all">📊 All Status</option>
// //                   <option value="Pending">⏳ Pending</option>
// //                   <option value="Processing">⚙️ Processing</option>
// //                   <option value="Resolved">✅ Resolved</option>
// //                 </select>
// //                 <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex items-center gap-3">
// //               <button
// //                 onClick={generateReport}
// //                 disabled={generatingReport}
// //                 className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {generatingReport ? (
// //                   <>
// //                     <FaSpinner className="animate-spin" />
// //                     Generating...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <FaFilePdf />
// //                     Download Report
// //                   </>
// //                 )}
// //               </button>

// //               <button
// //                 onClick={() => {
// //                   fetchUserSolutions();
// //                   setShowMySolutions(true);
// //                 }}
// //                 className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
// //               >
// //                 <FaLightbulb />
// //                 My Solutions
// //               </button>

// //               <button
// //                 onClick={() => {
// //                   setShowForm(true);
// //                   setShowSolutions(true);
// //                 }}
// //                 className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
// //               >
// //                 <FaPlus />
// //                 File New Complaint
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Complaint Form Modal */}
// //         {showForm && (
// //           <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
// //             <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
// //               <div className="p-8 border-b border-gray-200 sticky top-0 bg-white z-10">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
// //                       <FaStamp className="text-blue-600" />
// //                       {formLanguage === "en" ? "File a Formal Complaint" : "আনুষ্ঠানিক অভিযোগ দায়ের করুন"}
// //                     </h2>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       {formLanguage === "en" 
// //                         ? "Your information is pre-filled from your profile as per government records" 
// //                         : "সরকারি রেকর্ড অনুযায়ী আপনার তথ্য প্রোফাইল থেকে পূর্বে পূরণ করা হয়েছে"}
// //                     </p>
// //                   </div>
// //                   <div className="flex items-center gap-3">
// //                     {/* Language Toggle Button */}
// //                     <button
// //                       type="button"
// //                       onClick={toggleFormLanguage}
// //                       disabled={translating}
// //                       className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //                     >
// //                       <FaLanguage />
// //                       <span className="text-sm font-medium">
// //                         {formLanguage === "en" ? "বাংলা" : "English"}
// //                       </span>
// //                       {translating && <FaSpinner className="animate-spin ml-1" />}
// //                     </button>
// //                     <button
// //                       onClick={() => {
// //                         setShowForm(false);
// //                         setShowSolutions(false);
// //                       }}
// //                       className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
// //                     >
// //                       ✕
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               <form onSubmit={handleSubmit} className="p-8">
// //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //                   {/* Left Column - Citizen Information */}
// //                   <div className="space-y-6">
// //                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
// //                       <h3 className="font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
// //                         <FaUserTie /> 
// //                         {formLanguage === "en" ? "Complainant Information (As per NID)" : (translatedSections.complainantInfo || "অভিযোগকারীর তথ্য (এনআইডি অনুযায়ী)")}
// //                       </h3>
                      
// //                       <div className="space-y-4">
// //                         <div className="grid grid-cols-3 gap-4">
// //                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
// //                             <FaUser className="text-blue-500" /> 
// //                             {formLanguage === "en" ? "Full Name:" : "পুরো নাম:"}
// //                           </div>
// //                           <div className="col-span-2">
// //                             <input
// //                               type="text"
// //                               name="citizenName"
// //                               value={formLanguage === "bn" ? translatedUserData.name || formData.citizenName : formData.citizenName}
// //                               readOnly
// //                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-4">
// //                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
// //                             <FaIdCard className="text-blue-500" /> 
// //                             {formLanguage === "en" ? "NID Number:" : "এনআইডি নম্বর:"}
// //                           </div>
// //                           <div className="col-span-2">
// //                             <input
// //                               type="text"
// //                               name="citizenId"
// //                               value={formData.citizenId}
// //                               readOnly
// //                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-4">
// //                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
// //                             <FaPhone className="text-blue-500" /> 
// //                             {formLanguage === "en" ? "Contact:" : "যোগাযোগ:"}
// //                           </div>
// //                           <div className="col-span-2">
// //                             <input
// //                               type="tel"
// //                               name="contactNumber"
// //                               value={formData.contactNumber}
// //                               readOnly
// //                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-4">
// //                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
// //                             <FaEnvelope className="text-blue-500" /> 
// //                             {formLanguage === "en" ? "Email:" : "ইমেইল:"}
// //                           </div>
// //                           <div className="col-span-2">
// //                             <input
// //                               type="email"
// //                               name="email"
// //                               value={formData.email}
// //                               readOnly
// //                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-4">
// //                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
// //                             <FaMapMarkerAlt className="text-blue-500" /> 
// //                             {formLanguage === "en" ? "Address:" : "ঠিকানা:"}
// //                           </div>
// //                           <div className="col-span-2">
// //                             <textarea
// //                               name="address"
// //                               value={formLanguage === "bn" ? translatedUserData.address || formData.address : formData.address}
// //                               readOnly
// //                               rows="2"
// //                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Right Column - Complaint Details */}
// //                   <div className="space-y-6">
// //                     <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
// //                       <h3 className="font-semibold text-orange-800 border-b border-orange-200 pb-2 mb-4 flex items-center gap-2">
// //                         <FaBuilding /> 
// //                         {formLanguage === "en" ? "Complaint Details" : (translatedSections.complaintDetails || "অভিযোগের বিবরণ")}
// //                       </h3>

// //                       <div className="space-y-4">
// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                             <FaBuilding className="text-orange-500" /> 
// //                             {formLanguage === "en" ? "Department *" : "বিভাগ *"}
// //                           </label>
// //                           <select
// //                             name="department"
// //                             value={formData.department}
// //                             onChange={handleChange}
// //                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
// //                             required
// //                           >
// //                             <option value="">
// //                               {formLanguage === "en" ? "Select Government Department" : "সরকারি বিভাগ নির্বাচন করুন"}
// //                             </option>
// //                             <option value="Passport Office">🏛️ {formLanguage === "en" ? "Passport Office" : "পাসপোর্ট অফিস"}</option>
// //                             <option value="Electricity">⚡ {formLanguage === "en" ? "Electricity (DESCO)" : "বিদ্যুৎ (ডেসকো)"}</option>
// //                             <option value="Road Maintenance">🛣️ {formLanguage === "en" ? "Roads & Highways" : "সড়ক ও মহাসড়ক"}</option>
// //                             <option value="Waste Management">🗑️ {formLanguage === "en" ? "Waste Management" : "বর্জ্য ব্যবস্থাপনা"}</option>
// //                             <option value="Health Services">🏥 {formLanguage === "en" ? "Health Services" : "স্বাস্থ্য সেবা"}</option>
// //                             <option value="Education">📚 {formLanguage === "en" ? "Education" : "শিক্ষা"}</option>
// //                             <option value="Revenue">💰 {formLanguage === "en" ? "Revenue" : "রাজস্ব"}</option>
// //                             <option value="Municipal Services">🏙️ {formLanguage === "en" ? "Municipal Services" : "পৌর সেবা"}</option>
// //                           </select>
// //                         </div>

// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                             <FaExclamationCircle className="text-orange-500" /> 
// //                             {formLanguage === "en" ? "Issue Keyword *" : "ইস্যু কীওয়ার্ড *"}
// //                           </label>
// //                           <input
// //                             type="text"
// //                             name="issueKeyword"
// //                             value={formData.issueKeyword}
// //                             onChange={handleChange}
// //                             placeholder={formLanguage === "en" 
// //                               ? "e.g., passport delay, power outage, bill issue"
// //                               : "যেমন: পাসপোর্ট বিলম্ব, বিদ্যুৎ বিভ্রাট, বিল সমস্যা"}
// //                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             required
// //                           />
// //                         </div>

// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                             <FaExclamationCircle className="text-orange-500" /> 
// //                             {formLanguage === "en" ? "Priority Level" : "অগ্রাধিকার স্তর"}
// //                           </label>
// //                           <select
// //                             name="priority"
// //                             value={formData.priority}
// //                             onChange={handleChange}
// //                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                           >
// //                             <option value="low">🟢 {formLanguage === "en" ? "Low Priority" : "নিম্ন অগ্রাধিকার"}</option>
// //                             <option value="medium">🟡 {formLanguage === "en" ? "Medium Priority" : "মাঝারি অগ্রাধিকার"}</option>
// //                             <option value="high">🔴 {formLanguage === "en" ? "High Priority (Urgent)" : "উচ্চ অগ্রাধিকার (জরুরি)"}</option>
// //                           </select>
// //                         </div>

// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
// //                             <FaFileAlt className="text-orange-500" /> 
// //                             {formLanguage === "en" ? "Detailed Description *" : "বিস্তারিত বিবরণ *"}
// //                           </label>
// //                           <div className="flex gap-2">
// //                             <textarea
// //                               name="description"
// //                               value={formData.description}
// //                               onChange={handleChange}
// //                               placeholder={formLanguage === "en"
// //                                 ? "Please provide detailed description of your complaint including dates, locations, and any relevant information..."
// //                                 : "অনুগ্রহ করে আপনার অভিযোগের বিস্তারিত বিবরণ দিন যার মধ্যে তারিখ, অবস্থান এবং যেকোনো প্রাসঙ্গিক তথ্য অন্তর্ভুক্ত রয়েছে..."}
// //                               className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                               rows="4"
// //                               required
// //                             />
// //                             <button
// //                               type="button"
// //                               onClick={handleAIGenerate}
// //                               disabled={generatingAI}
// //                               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 h-fit"
// //                               title="Generate AI-powered complaint"
// //                             >
// //                               {generatingAI ? <FaSpinner className="animate-spin" /> : <FaRobot />}
// //                               AI Generate
// //                             </button>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Solution Suggestions */}
// //                 {formData.department && formData.issueKeyword && showSolutions && (
// //                   <div className="mt-6">
// //                     <div className="mb-2">
// //                       <h3 className="text-lg font-semibold text-gray-800">
// //                         {formLanguage === "en" ? "Community Solutions" : (translatedSections.communitySolutions || "কমিউনিটি সমাধান")}
// //                       </h3>
// //                       <p className="text-sm text-gray-500">
// //                         {formLanguage === "en" ? "Verified solutions from other users" : "অন্যান্য ব্যবহারকারীদের থেকে যাচাইকৃত সমাধান"}
// //                       </p>
// //                     </div>
// //                     <ViewSolutions
// //                       department={formData.department}
// //                       keyword={formData.issueKeyword}
// //                       onSelect={(solution) => {
// //                         if (window.confirm(formLanguage === "en" 
// //                           ? "Would you like to use this solution as reference?" 
// //                           : "আপনি কি এই সমাধানটি রেফারেন্স হিসাবে ব্যবহার করতে চান?")) {
// //                           setFormData({
// //                             ...formData,
// //                             description: solution.description || formData.description
// //                           });
// //                         }
// //                       }}
// //                     />
// //                   </div>
// //                 )}

// //                 {/* Government Format Template Preview */}
// //                 {generatedTemplate && (
// //                   <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-blue-200">
// //                     <div className="flex items-center justify-between mb-4">
// //                       <h3 className="font-bold text-blue-800 flex items-center gap-2 text-lg">
// //                         <FaStamp className="text-blue-600" />
// //                         {formLanguage === "en" ? "Official Government Complaint Format" : (translatedSections.officialFormat || "সরকারি অভিযোগের ফরম্যাট")}
// //                         <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
// //                           {formLanguage === "en" ? "English" : "বাংলা"}
// //                         </span>
// //                       </h3>
// //                       <div className="flex gap-2">
// //                         <button
// //                           type="button"
// //                           onClick={() => navigator.clipboard.writeText(editedTemplate)}
// //                           className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 transition-colors"
// //                         >
// //                           <FaCopy /> {formLanguage === "en" ? "Copy" : "অনুলিপি করুন"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           onClick={downloadTemplateAsPDF}
// //                           className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2 transition-colors"
// //                         >
// //                           <FaFilePdf /> PDF
// //                         </button>
// //                         <button
// //                           type="button"
// //                           onClick={downloadTemplateAsText}
// //                           className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2 transition-colors"
// //                         >
// //                           <FaDownload /> {formLanguage === "en" ? "Text" : "টেক্সট"}
// //                         </button>
// //                         <button
// //                           type="button"
// //                           onClick={printTemplate}
// //                           className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 transition-colors"
// //                         >
// //                           <FaPrint /> {formLanguage === "en" ? "Print" : "প্রিন্ট"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                     {translating ? (
// //                       <div className="flex justify-center items-center h-96">
// //                         <FaSpinner className="animate-spin text-3xl text-blue-600" />
// //                         <span className="ml-3 text-gray-600">
// //                           {formLanguage === "en" ? "Translating to Bengali..." : "বাংলায় অনুবাদ করা হচ্ছে..."}
// //                         </span>
// //                       </div>
// //                     ) : (
// //                       <textarea
// //                         value={editedTemplate}
// //                         onChange={handleTemplateEdit}
// //                         className="w-full h-96 p-4 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
// //                       />
// //                     )}
// //                     <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
// //                       <FaShieldAlt className="text-green-500" />
// //                       {formLanguage === "en" 
// //                         ? "This format complies with the Government of Bangladesh official correspondence guidelines" 
// //                         : "এই ফরম্যাটটি বাংলাদেশ সরকারের অফিসিয়াল চিঠিপত্র নির্দেশিকা মেনে চলে"}
// //                     </p>
// //                   </div>
// //                 )}

// //                 <div className="flex justify-end gap-4 pt-8 border-t mt-8">
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowForm(false);
// //                       setShowSolutions(false);
// //                     }}
// //                     className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
// //                   >
// //                     {formLanguage === "en" ? "Cancel" : "বাতিল করুন"}
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     disabled={submitting}
// //                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
// //                   >
// //                     {submitting ? (
// //                       <>
// //                         <FaSpinner className="animate-spin" />
// //                         {formLanguage === "en" ? "Submitting..." : "জমা দেওয়া হচ্ছে..."}
// //                       </>
// //                     ) : (
// //                       <>
// //                         <FaStamp />
// //                         {formLanguage === "en" ? "Submit Formal Complaint" : "আনুষ্ঠানিক অভিযোগ জমা দিন"}
// //                       </>
// //                     )}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}

// //         {/* Complaints Table */}
// //         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
// //           <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
// //             <div className="flex items-center justify-between">
// //               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
// //                 <FaClipboardList className="text-blue-600" />
// //                 Complaint Records
// //               </h2>
// //               <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
// //                 Showing {filteredComplaints.length} of {complaints.length} complaints
// //               </p>
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-100">
// //                 <tr>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Complaint #</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Citizen Details</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Issue</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
// //                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan="8" className="p-12 text-center">
// //                       <div className="flex justify-center items-center gap-3">
// //                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// //                         <span className="text-gray-500">Loading complaints from server...</span>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : filteredComplaints.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="8" className="p-12 text-center text-gray-500">
// //                       <FaClipboardList className="text-5xl mx-auto mb-3 text-gray-300" />
// //                       {activeTab === "my" ? 
// //                         "You haven't filed any complaints yet. Click 'File New Complaint' to get started." : 
// //                         "No complaints found"}
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   filteredComplaints.map((c) => (
// //                     <tr key={c._id} className="border-t hover:bg-blue-50 transition-colors">
// //                       <td className="p-4">
// //                         <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
// //                           {c.complaintNumber || `#${c._id?.slice(-6)}`}
// //                         </span>
// //                       </td>
// //                       <td className="p-4">
// //                         <div>
// //                           <p className="font-medium text-gray-800">{c.citizenName}</p>
// //                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
// //                             <FaPhone className="text-xs" /> {c.contactNumber}
// //                           </p>
// //                         </div>
// //                       </td>
// //                       <td className="p-4">
// //                         <span className="text-sm">{c.department}</span>
// //                       </td>
// //                       <td className="p-4">
// //                         <div>
// //                           <p className="font-medium text-sm">{c.issueKeyword}</p>
// //                           <p className="text-xs text-gray-500 truncate max-w-xs mt-1">
// //                             {c.description?.substring(0, 60)}...
// //                           </p>
// //                         </div>
// //                       </td>
// //                       <td className="p-4">
// //                         {getPriorityBadge(c.priority)}
// //                       </td>
// //                       <td className="p-4">
// //                         <div className="flex flex-col gap-1">
// //                           {getStatusBadge(c.status)}
// //                           {!isAdmin && c.status === "Resolved" && surveySubmittedComplaints.includes(c._id) && (
// //                             <span className="text-xs text-green-600 flex items-center gap-1">
// //                               <FaCheckCircle className="w-3 h-3" />
// //                               Survey Completed
// //                             </span>
// //                           )}
// //                           {!isAdmin && c.status === "Resolved" && !surveySubmittedComplaints.includes(c._id) && (
// //                             <span className="text-xs text-orange-500 flex items-center gap-1">
// //                               <FaFileAlt className="w-3 h-3" />
// //                               Survey Pending
// //                             </span>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="p-4 text-sm text-gray-600">
// //                         <div className="flex items-center gap-1">
// //                           <FaCalendarAlt className="text-xs" />
// //                           {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
// //                         </div>
// //                       </td>
// //                       <td className="p-4">
// //                         <div className="flex gap-2 flex-wrap">
// //                           <button
// //                             onClick={() => {
// //                               setSelectedForTimeline(c);
// //                               setShowTimeline(true);
// //                             }}
// //                             className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
// //                             title="View Timeline"
// //                           >
// //                             <FaHistory />
// //                           </button>
// //                           <button
// //                             onClick={() => setSelectedComplaint(c)}
// //                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
// //                             title="View Details"
// //                           >
// //                             <FaEye />
// //                           </button>
// //                           <button
// //                             onClick={() => exportComplaintAsPDF(c)}
// //                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
// //                             title="Export as PDF"
// //                           >
// //                             <FaFilePdf />
// //                           </button>
                          
// //                           {/* Share Solution Button */}
// //                           {canShareSolution(c) && (
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedForSolution(c);
// //                                 setShowSolutionForm(true);
// //                               }}
// //                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
// //                               title="Share Solution"
// //                             >
// //                               <FaLightbulb />
// //                             </button>
// //                           )}
                          
// //                           {/* Survey Button */}
// //                           {!isAdmin && c.status === "Resolved" && isMyComplaint(c) && (
// //                             <button
// //                               onClick={() => openSurveyForComplaint(c)}
// //                               className={`p-2 rounded-lg transition-colors ${
// //                                 surveySubmittedComplaints.includes(c._id)
// //                                   ? 'text-green-600 bg-green-50 cursor-default'
// //                                   : 'text-blue-600 hover:bg-blue-50'
// //                               }`}
// //                               title={surveySubmittedComplaints.includes(c._id) ? "Survey Completed" : "Fill Survey"}
// //                               disabled={surveySubmittedComplaints.includes(c._id)}
// //                             >
// //                               <FaFileAlt />
// //                             </button>
// //                           )}
                          
// //                           {/* Delete button */}
// //                           {(isAdmin || isMyComplaint(c)) && (
// //                             <button
// //                               onClick={() => setDeleteTarget(c._id)}
// //                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
// //                               title={isAdmin ? "Delete (Admin)" : "Delete your complaint"}
// //                             >
// //                               <FaTrash />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Timeline Modal */}
// //       {showTimeline && selectedForTimeline && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
// //             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <h2 className="text-xl font-bold flex items-center gap-2">
// //                     <FaHistory /> Complaint Timeline
// //                   </h2>
// //                   <p className="text-purple-100 text-sm mt-1">
// //                     #{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}
// //                   </p>
// //                 </div>
// //                 <button
// //                   onClick={() => {
// //                     setShowTimeline(false);
// //                     setSelectedForTimeline(null);
// //                     setAdminComment("");
// //                   }}
// //                   className="text-white hover:bg-purple-800 p-2 rounded-full transition-colors"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>
// //             </div>
            
// //             <div className="p-6 max-h-96 overflow-y-auto">
// //               <div className="space-y-4">
// //                 {selectedForTimeline.timeline?.map((entry, index) => (
// //                   <div key={index} className="flex gap-4">
// //                     <div className="relative">
// //                       <div className={`w-3 h-3 rounded-full mt-1.5 ${
// //                         entry.status === 'Resolved' ? 'bg-green-500' :
// //                         entry.status === 'Processing' ? 'bg-blue-500' : 'bg-yellow-500'
// //                       }`}></div>
// //                       {index < (selectedForTimeline.timeline?.length - 1) && (
// //                         <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-300"></div>
// //                       )}
// //                     </div>
// //                     <div className="flex-1 pb-4">
// //                       <div className="flex items-center justify-between">
// //                         <p className="font-medium">{entry.status}</p>
// //                         <p className="text-xs text-gray-500">
// //                           {new Date(entry.date).toLocaleString()}
// //                         </p>
// //                       </div>
// //                       <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
// //                         {entry.comment}
// //                       </p>
// //                       <p className="text-xs text-gray-400 mt-1">Updated by: {entry.updatedBy}</p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Admin Only Status Update Section */}
// //               {isAdmin && selectedForTimeline.status !== "Resolved" && (
// //                 <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
// //                   <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
// //                     <FaShieldAlt /> Admin Actions
// //                   </h3>
// //                   <div className="space-y-4">
// //                     <div className="flex gap-2">
// //                       <select
// //                         className="flex-1 border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
// //                         value={adminComment.split('|')[0] || "Processing"}
// //                         onChange={(e) => {
// //                           const comment = adminComment.split('|')[1] || "";
// //                           setAdminComment(e.target.value + '|' + comment);
// //                         }}
// //                       >
// //                         <option value="Processing">⚙️ Mark as Processing</option>
// //                         <option value="Resolved">✅ Mark as Resolved</option>
// //                       </select>
// //                       <button
// //                         onClick={() => updateComplaintStatus(
// //                           selectedForTimeline._id, 
// //                           adminComment.split('|')[0] || "Processing"
// //                         )}
// //                         disabled={updatingStatus}
// //                         className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 font-medium"
// //                       >
// //                         {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />}
// //                         Update
// //                       </button>
// //                     </div>
// //                     <input
// //                       type="text"
// //                       placeholder="Add official comment (optional)"
// //                       className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
// //                       value={adminComment.split('|')[1] || ""}
// //                       onChange={(e) => setAdminComment(
// //                         (adminComment.split('|')[0] || "Processing") + '|' + e.target.value
// //                       )}
// //                     />
// //                     <p className="text-xs text-purple-600 flex items-center gap-1">
// //                       <FaShieldAlt /> Only administrators can update complaint status
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}

// //               {!isAdmin && selectedForTimeline.status !== "Resolved" && (
// //                 <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
// //                   <p className="text-sm text-yellow-700 flex items-center gap-2">
// //                     <FaClock /> Status updates can only be made by authorized government officials.
// //                     Please wait for official response.
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="p-6 border-t border-gray-200 flex justify-end">
// //               <button
// //                 onClick={() => {
// //                   setShowTimeline(false);
// //                   setSelectedForTimeline(null);
// //                   setAdminComment("");
// //                 }}
// //                 className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// // // Add Edit button in the actions column for user's own complaints
// // {(isAdmin || isMyComplaint(c)) && c.status !== 'Resolved' && (
// //   <button
// //     onClick={() => handleEditComplaint(c)}
// //     className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
// //     title="Edit Complaint"
// //   >
// //     <FaEdit />
// //   </button>
// // )}

// // // Add Edit Modal
// // {showEditModal && editingComplaint && (
// //   <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
// //     <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
// //       <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0">
// //         <div className="flex items-center justify-between">
// //           <h3 className="text-xl font-bold">Edit Complaint</h3>
// //           <button
// //             onClick={() => {
// //               setShowEditModal(false);
// //               setEditingComplaint(null);
// //             }}
// //             className="p-2 hover:bg-white/20 rounded-full"
// //           >
// //             <FaTimes />
// //           </button>
// //         </div>
// //       </div>
      
// //       <div className="p-6">
// //         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
// //           <p className="text-sm text-yellow-800">
// //             <strong>Note:</strong> Your edits will be reviewed by an administrator before being processed.
// //           </p>
// //         </div>
        
// //         <div className="space-y-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Reason for Editing *
// //             </label>
// //             <input
// //               type="text"
// //               value={editFormData.editReason}
// //               onChange={(e) => setEditFormData({...editFormData, editReason: e.target.value})}
// //               placeholder="e.g., Additional information, Correction, etc."
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
// //               required
// //             />
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Description
// //             </label>
// //             <textarea
// //               value={editFormData.description}
// //               onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
// //               rows="6"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
// //             />
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Official Template (Optional)
// //             </label>
// //             <textarea
// //               value={editFormData.formalTemplate}
// //               onChange={(e) => setEditFormData({...editFormData, formalTemplate: e.target.value})}
// //               rows="8"
// //               className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500"
// //             />
// //           </div>
// //         </div>
        
// //         <div className="flex gap-3 mt-6">
// //           <button
// //             onClick={handleSaveEdit}
// //             className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
// //           >
// //             Save Changes
// //           </button>
// //           <button
// //             onClick={() => {
// //               setShowEditModal(false);
// //               setEditingComplaint(null);
// //             }}
// //             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
// //           >
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // )}
// //       {/* View Modal */}
// //       {selectedComplaint && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
// //             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
// //               <div className="flex items-center justify-between">
// //                 <h2 className="text-xl font-bold flex items-center gap-2">
// //                   <FaEye /> Complaint Details
// //                 </h2>
// //                 <button
// //                   onClick={() => setSelectedComplaint(null)}
// //                   className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>
// //             </div>
// //             <div className="p-6">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Complaint Number</p>
// //                   <p className="font-mono font-medium">{selectedComplaint.complaintNumber || selectedComplaint._id}</p>
// //                 </div>
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Status</p>
// //                   <div className="mt-1">
// //                     {getStatusBadge(selectedComplaint.status)}
// //                     {!isAdmin && selectedComplaint.status === "Resolved" && surveySubmittedComplaints.includes(selectedComplaint._id) && (
// //                       <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// //                         <FaCheckCircle /> Survey Completed
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Citizen Name</p>
// //                   <p className="font-medium">{selectedComplaint.citizenName}</p>
// //                 </div>
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Contact</p>
// //                   <p>{selectedComplaint.contactNumber}</p>
// //                 </div>
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Department</p>
// //                   <p className="font-medium">{selectedComplaint.department}</p>
// //                 </div>
// //                 <div className="bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Priority</p>
// //                   <p>{getPriorityBadge(selectedComplaint.priority)}</p>
// //                 </div>
// //                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Issue</p>
// //                   <p className="font-medium">{selectedComplaint.issueKeyword}</p>
// //                 </div>
// //                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Description</p>
// //                   <p className="text-gray-700 mt-1">{selectedComplaint.description}</p>
// //                 </div>
// //                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
// //                   <p className="text-xs text-gray-500">Submitted On</p>
// //                   <p>{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-wrap">
// //               <button
// //                 onClick={() => {
// //                   setSelectedComplaint(null);
// //                   setSelectedForTimeline(selectedComplaint);
// //                   setShowTimeline(true);
// //                 }}
// //                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
// //               >
// //                 <FaHistory />
// //                 View Timeline
// //               </button>
              
// //               {/* Share Solution Button */}
// //               {canShareSolution(selectedComplaint) && (
// //                 <button
// //                   onClick={() => {
// //                     setSelectedForSolution(selectedComplaint);
// //                     setShowSolutionForm(true);
// //                     setSelectedComplaint(null);
// //                   }}
// //                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
// //                 >
// //                   <FaLightbulb />
// //                   Share Solution
// //                 </button>
// //               )}
              
// //               {/* Survey Button */}
// //               {!isAdmin && selectedComplaint?.status === "Resolved" && isMyComplaint(selectedComplaint) && !surveySubmittedComplaints.includes(selectedComplaint._id) && (
// //                 <button
// //                   onClick={() => {
// //                     openSurveyForComplaint(selectedComplaint);
// //                     setSelectedComplaint(null);
// //                   }}
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
// //                 >
// //                   <FaFileAlt />
// //                   Fill Survey
// //                 </button>
// //               )}
              
// //               <button
// //                 onClick={() => exportComplaintAsPDF(selectedComplaint)}
// //                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
// //               >
// //                 <FaFilePdf />
// //                 Export PDF
// //               </button>
// //               <button
// //                 onClick={() => setSelectedComplaint(null)}
// //                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Modal */}
// //       {deleteTarget && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
// //           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
// //             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
// //               <h2 className="text-xl font-bold flex items-center gap-2">
// //                 <FaTrash /> Confirm Deletion
// //               </h2>
// //             </div>
// //             <div className="p-6">
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete this complaint? This action cannot be undone.
// //               </p>
// //               <div className="flex justify-end gap-3">
// //                 <button
// //                   onClick={() => setDeleteTarget(null)}
// //                   className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={deleteComplaint}
// //                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
// //                 >
// //                   Delete Complaint
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { 
//   FaClipboardList, FaTrash, FaEye, FaPlus, FaSearch, FaFilter,
//   FaCheckCircle, FaClock, FaExclamationCircle, FaFileAlt, FaHistory,
//   FaSpinner, FaFilePdf, FaEdit, FaDownload, FaCopy, FaBuilding,
//   FaUserTie, FaCalendarAlt, FaIdCard, FaPhone, FaEnvelope,
//   FaMapMarkerAlt, FaCheckDouble, FaHourglassHalf, FaShieldAlt,
//   FaStamp, FaUser, FaPrint, FaLightbulb, FaThumbsUp, FaThumbsDown,
//   FaTimes, FaLanguage, FaRobot, FaExclamationTriangle, FaReply
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import SurveyModal from "../components/SurveyModal";
// import SolutionSuggestions from "../components/SolutionSuggestions";
// import SubmitSolution from "../components/SubmitSolution";
// import ViewSolutions from "../components/ViewSolutions";

// export default function Complaints({ user }) {
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [showTimeline, setShowTimeline] = useState(false);
//   const [selectedForTimeline, setSelectedForTimeline] = useState(null);
//   const [adminComment, setAdminComment] = useState("");
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [generatedTemplate, setGeneratedTemplate] = useState("");
//   const [editedTemplate, setEditedTemplate] = useState("");
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
//   const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [showSolutionForm, setShowSolutionForm] = useState(false);
//   const [selectedForSolution, setSelectedForSolution] = useState(null);
//   const [showMySolutions, setShowMySolutions] = useState(false);
//   const [userSolutions, setUserSolutions] = useState([]);
//   const [editingComplaint, setEditingComplaint] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     description: "",
//     formalTemplate: "",
//     editReason: ""
//   });
  
//   // Language state
//   const [formLanguage, setFormLanguage] = useState("en");
//   const [translating, setTranslating] = useState(false);
//   const [generatingAI, setGeneratingAI] = useState(false);
//   const [translatedSections, setTranslatedSections] = useState({
//     complainantInfo: "",
//     complaintDetails: "",
//     communitySolutions: "",
//     officialFormat: ""
//   });
  
//   // Translated user data
//   const [translatedUserData, setTranslatedUserData] = useState({
//     name: "",
//     address: ""
//   });
  
//   // Survey related states
//   const [showSurvey, setShowSurvey] = useState(false);
//   const [resolvedComplaint, setResolvedComplaint] = useState(null);
//   const [surveySubmittedComplaints, setSurveySubmittedComplaints] = useState([]);
//   const [hasShownSurveyPopup, setHasShownSurveyPopup] = useState(false);
  
//   // Report generation state
//   const [generatingReport, setGeneratingReport] = useState(false);

//   // Admin feedback states
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState("");
//   const [sendingFeedback, setSendingFeedback] = useState(false);
//   const [selectedForFeedback, setSelectedForFeedback] = useState(null);

//   const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

//   const getCurrentUser = () => {
//     return user || JSON.parse(localStorage.getItem("user") || "{}");
//   };

//   const currentUser = getCurrentUser();

//   const [formData, setFormData] = useState({
//     department: "",
//     issueKeyword: "",
//     description: "",
//     priority: "medium",
//     citizenName: currentUser?.name || "",
//     citizenId: currentUser?.nid || "",
//     contactNumber: currentUser?.phone || "",
//     email: currentUser?.email || "",
//     address: currentUser?.address || ""
//   });

//   // Fetch complaints
//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
      
//       // Fetch all complaints (public view)
//       const allRes = await axios.get("http://localhost:5000/api/complaints", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Fetch user's own complaints (full details)
//       const myRes = await axios.get("http://localhost:5000/api/complaints/my", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Merge the data - prioritize full details from myRes for user's own complaints
//       const myComplaintIds = new Set(myRes.data.map(complaint => complaint._id));
      
//       const mergedComplaints = allRes.data.map(complaint => {
//         if (myComplaintIds.has(complaint._id)) {
//           // This is user's own complaint - use full details from myRes
//           const fullComplaint = myRes.data.find(c => c._id === complaint._id);
//           return {
//             ...complaint,
//             ...fullComplaint,
//             // Ensure personal info is from the full complaint
//             citizenId: fullComplaint?.citizenId,
//             contactNumber: fullComplaint?.contactNumber,
//             email: fullComplaint?.email,
//             address: fullComplaint?.address
//           };
//         }
//         return complaint;
//       });
      
//       setComplaints(mergedComplaints);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserSolutions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get("http://localhost:5000/api/solutions/my", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserSolutions(res.data);
//     } catch (err) {
//       console.error("Error fetching solutions:", err);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   useEffect(() => {
//     const userData = getCurrentUser();
//     if (userData) {
//       setFormData(prev => ({
//         ...prev,
//         citizenName: userData.name || prev.citizenName || "",
//         citizenId: userData.nid || prev.citizenId || "",
//         contactNumber: userData.phone || prev.contactNumber || "",
//         email: userData.email || prev.email || "",
//         address: userData.address || prev.address || ""
//       }));
//     }
//   }, [user]);

//   // Load survey submitted complaints from localStorage
//   useEffect(() => {
//     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
//     const submitted = localStorage.getItem(userKey);
//     if (submitted) {
//       setSurveySubmittedComplaints(JSON.parse(submitted));
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
//     localStorage.setItem(userKey, JSON.stringify(surveySubmittedComplaints));
//   }, [surveySubmittedComplaints, currentUser]);

//   // Check for resolved complaints to show survey
//   useEffect(() => {
//     if (isAdmin) return;
//     if (hasShownSurveyPopup) return;
    
//     const userResolvedComplaints = complaints.filter(complaint => 
//       complaint.status === "Resolved" && 
//       isMyComplaint(complaint) &&
//       !surveySubmittedComplaints.includes(complaint._id)
//     );
    
//     if (userResolvedComplaints.length > 0 && !showSurvey && !resolvedComplaint) {
//       const latestResolved = userResolvedComplaints[0];
//       setResolvedComplaint(latestResolved);
//       setShowSurvey(true);
//       setHasShownSurveyPopup(true);
//     }
//   }, [complaints, surveySubmittedComplaints, isAdmin, showSurvey, resolvedComplaint, hasShownSurveyPopup]);

//   useEffect(() => {
//     setHasShownSurveyPopup(false);
//   }, [currentUser]);

//   const userId = currentUser?._id || "";

//   const canShareSolution = (complaint) => {
//     return complaint && 
//            complaint.status === "Resolved" && 
//            isMyComplaint(complaint);
//   };

//   const deleteComplaint = async () => {
//     try {
//       const complaintToDelete = complaints.find(comp => comp._id === deleteTarget);
      
//       if (!complaintToDelete) {
//         setDeleteSuccessMessage("Complaint not found");
//         setShowDeleteSuccess(true);
//         setTimeout(() => setShowDeleteSuccess(false), 3000);
//         setDeleteTarget(null);
//         return;
//       }
      
//       const isAuthorized = isAdmin || 
//         complaintToDelete.userId === currentUser?._id || 
//         complaintToDelete.userId?._id === currentUser?._id ||
//         complaintToDelete.email === currentUser?.email;
      
//       if (!isAuthorized) {
//         setDeleteSuccessMessage("You are not authorized to delete this complaint");
//         setShowDeleteSuccess(true);
//         setTimeout(() => setShowDeleteSuccess(false), 3000);
//         setDeleteTarget(null);
//         return;
//       }
      
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setComplaints(prevComplaints => prevComplaints.filter(comp => comp._id !== deleteTarget));
//       setDeleteTarget(null);
      
//       setDeleteSuccessMessage("Complaint deleted successfully");
//       setShowDeleteSuccess(true);
//       setTimeout(() => setShowDeleteSuccess(false), 3000);
      
//     } catch (error) {
//       console.error("Error deleting complaint:", error);
//       setDeleteSuccessMessage("Failed to delete complaint. Please try again.");
//       setShowDeleteSuccess(true);
//       setTimeout(() => setShowDeleteSuccess(false), 3000);
//     }
//   };

//   const updateComplaintStatus = async (complaintId, newStatus) => {
//     if (!isAdmin) {
//       alert("Only administrators can update complaint status");
//       return;
//     }

//     setUpdatingStatus(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:5000/api/complaints/${complaintId}/status`, 
//         {
//           status: newStatus
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       setComplaints(prevComplaints => 
//         prevComplaints.map(comp => 
//           comp._id === complaintId 
//             ? { ...comp, status: newStatus }
//             : comp
//         )
//       );

//       setAdminComment("");
//       setSelectedForTimeline(null);
//       setShowTimeline(false);
      
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status. Please try again.");
//     }
//     setUpdatingStatus(false);
//   };

//   const handleSurveySubmitted = async () => {
//     if (resolvedComplaint) {
//       setSurveySubmittedComplaints(prev => [...prev, resolvedComplaint._id]);
//     }
//     setShowSurvey(false);
//     setResolvedComplaint(null);
//     fetchComplaints();
//   };

//   const openSurveyForComplaint = (complaint) => {
//     if (surveySubmittedComplaints.includes(complaint._id)) {
//       alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
//       return;
//     }
//     setResolvedComplaint(complaint);
//     setShowSurvey(true);
//   };

//   // Handle editing complaint
//   const handleEditComplaint = (complaint) => {
//     setEditingComplaint(complaint);
//     setEditFormData({
//       description: complaint.description || "",
//       formalTemplate: complaint.formalTemplate || "",
//       editReason: ""
//     });
//     setShowEditModal(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!editFormData.editReason.trim()) {
//       alert("Please provide a reason for editing your complaint");
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:5000/api/complaints/${editingComplaint._id}`,
//         {
//           description: editFormData.description,
//           formalTemplate: editFormData.formalTemplate,
//           editReason: editFormData.editReason
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       alert("Complaint updated successfully. Admin will review your changes.");
//       setShowEditModal(false);
//       setEditingComplaint(null);
//       fetchComplaints();
//     } catch (error) {
//       console.error("Error updating complaint:", error);
//       alert(error.response?.data?.message || "Failed to update complaint");
//     }
//   };

//   // Handle sending feedback (admin only)
//   const handleSendFeedback = async () => {
//     if (!feedbackMessage.trim()) return;

//     setSendingFeedback(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5000/api/complaints/${selectedForFeedback._id}/feedback`,
//         {
//           message: feedbackMessage,
//           isQuestion: false,
//           requiresResponse: false
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFeedbackMessage("");
//       setShowFeedbackModal(false);
//       setSelectedForFeedback(null);
//       fetchComplaints();
//       alert("Feedback sent successfully");
//     } catch (err) {
//       console.error("Error sending feedback:", err);
//       alert(err.response?.data?.message || "Failed to send feedback");
//     } finally {
//       setSendingFeedback(false);
//     }
//   };

//   // Handle responding to admin feedback (citizen)
//   const handleRespondToFeedback = async (complaintId, feedbackId, response) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5000/api/complaints/${complaintId}/respond`,
//         {
//           feedbackId,
//           response
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       fetchComplaints();
//       alert("Response sent successfully");
//     } catch (err) {
//       console.error("Error sending response:", err);
//       alert(err.response?.data?.message || "Failed to send response");
//     }
//   };

//   // Check if complaint belongs to current user
//   const isMyComplaint = (complaint) => {
//     if (!currentUser || !complaint) return false;
    
//     const complaintUserId = typeof complaint.userId === 'object' 
//       ? complaint.userId?._id 
//       : complaint.userId;
//     const currentUserId = currentUser._id;
    
//     if (currentUserId && complaintUserId) {
//       return complaintUserId === currentUserId || complaintUserId?.toString() === currentUserId?.toString();
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

//   // Filter complaints based on search, status, and active tab
//   const filteredComplaints = complaints.filter(complaint => {
//     const matchesSearch = searchTerm === "" || 
//       (complaint.department?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (complaint.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (complaint.citizenName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (complaint.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesFilter = filterStatus === "all" || complaint.status === filterStatus;
    
//     let matchesTab = true;
//     if (activeTab === "my") {
//       matchesTab = isMyComplaint(complaint);
//     }
    
//     return matchesSearch && matchesFilter && matchesTab;
//   });

//   const userComplaints = complaints.filter(complaint => isMyComplaint(complaint));
//   const userPending = userComplaints.filter(complaint => complaint.status === "Pending").length;
//   const userResolved = userComplaints.filter(complaint => complaint.status === "Resolved").length;
//   const userInProgress = userComplaints.filter(complaint => complaint.status === "In Progress" || complaint.status === "Processing").length;

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'Resolved':
//         return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle size={12} /> Resolved</span>;
//       case 'Pending':
//         return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock size={12} /> Pending</span>;
//       case 'In Progress':
//       case 'Processing':
//         return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaSpinner size={12} className="animate-spin" /> Processing</span>;
//       default:
//         return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
//     }
//   };

//   const getPriorityBadge = (priority) => {
//     switch(priority) {
//       case 'high':
//         return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High</span>;
//       case 'medium':
//         return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium</span>;
//       case 'low':
//         return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low</span>;
//       default:
//         return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//       if (!formData.department || !formData.issueKeyword || !formData.description) {
//         alert("Please fill in all required fields");
//         setSubmitting(false);
//         return;
//       }

//       const complaintData = {
//         userId: userId,
//         citizenName: formData.citizenName,
//         citizenId: formData.citizenId,
//         contactNumber: formData.contactNumber,
//         email: formData.email || "",
//         address: formData.address || "",
//         department: formData.department,
//         issueKeyword: formData.issueKeyword,
//         description: formData.description,
//         priority: formData.priority || "medium",
//         formalTemplate: editedTemplate || ""
//       };

//       const token = localStorage.getItem('token');
      
//       const res = await axios.post(
//         "http://localhost:5000/api/complaints/create", 
//         complaintData,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       setComplaints(prevComplaints => [res.data, ...prevComplaints]);
      
//       setShowSuccessMessage(true);
//       setTimeout(() => setShowSuccessMessage(false), 5000);
      
//       setFormData({
//         department: "",
//         issueKeyword: "",
//         description: "",
//         priority: "medium",
//         citizenName: currentUser?.name || "",
//         citizenId: currentUser?.nid || "",
//         contactNumber: currentUser?.phone || "",
//         email: currentUser?.email || "",
//         address: currentUser?.address || ""
//       });
      
//       setShowForm(false);
//       setGeneratedTemplate("");
//       setEditedTemplate("");
      
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
      
//       if (error.response) {
//         alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
//       } else if (error.request) {
//         alert("Server is not responding. Please check if the backend is running.");
//       } else {
//         alert(`Error: ${error.message}`);
//       }
//     }
//     setSubmitting(false);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-4">
      
//       {/* Success Messages */}
//       {showSuccessMessage && (
//         <div className="fixed top-20 right-6 z-50 animate-slideIn">
//           <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
//             <FaCheckCircle className="text-2xl" />
//             <div>
//               <h4 className="font-bold">Complaint Submitted Successfully!</h4>
//               <p className="text-sm">Your complaint has been registered and will be processed soon.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDeleteSuccess && (
//         <div className="fixed top-20 right-6 z-50 animate-slideIn">
//           <div className={`${
//             deleteSuccessMessage.includes("successfully") 
//               ? "bg-green-500" 
//               : "bg-red-500"
//           } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
//             <div className="flex-shrink-0">
//               {deleteSuccessMessage.includes("successfully") ? (
//                 <FaCheckCircle className="text-2xl" />
//               ) : (
//                 <FaExclamationCircle className="text-2xl" />
//               )}
//             </div>
//             <div className="flex-1">
//               <p className="font-medium">{deleteSuccessMessage}</p>
//             </div>
//             <button
//               onClick={() => setShowDeleteSuccess(false)}
//               className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Survey Modal */}
//       {showSurvey && resolvedComplaint && isMyComplaint(resolvedComplaint) && (
//         <SurveyModal
//           complaint={resolvedComplaint}
//           onClose={() => {
//             setShowSurvey(false);
//             setResolvedComplaint(null);
//           }}
//           onSubmit={handleSurveySubmitted}
//         />
//       )}

//       {/* Solution Submission Modal */}
//       {showSolutionForm && selectedForSolution && canShareSolution(selectedForSolution) && (
//         <SubmitSolution
//           complaint={selectedForSolution}
//           onClose={() => {
//             setShowSolutionForm(false);
//             setSelectedForSolution(null);
//           }}
//           onSubmit={() => {
//             fetchUserSolutions();
//             fetchComplaints();
//           }}
//         />
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editingComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold">Edit Complaint</h3>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingComplaint(null);
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-full"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">
//                   <FaExclamationTriangle className="inline mr-1" />
//                   <strong>Note:</strong> Your edits will be reviewed by an administrator before being processed.
//                 </p>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Reason for Editing *
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.editReason}
//                     onChange={(e) => setEditFormData({...editFormData, editReason: e.target.value})}
//                     placeholder="e.g., Additional information, Correction, etc."
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={editFormData.description}
//                     onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
//                     rows="6"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Official Template (Optional)
//                   </label>
//                   <textarea
//                     value={editFormData.formalTemplate}
//                     onChange={(e) => setEditFormData({...editFormData, formalTemplate: e.target.value})}
//                     rows="8"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={handleSaveEdit}
//                   className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowEditModal(false);
//                     setEditingComplaint(null);
//                   }}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Feedback Modal (Admin) */}
//       {showFeedbackModal && selectedForFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold">Send Feedback</h3>
//                 <button
//                   onClick={() => {
//                     setShowFeedbackModal(false);
//                     setSelectedForFeedback(null);
//                     setFeedbackMessage("");
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-full"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <p className="text-sm text-gray-600 mb-4">
//                 Complaint #{selectedForFeedback.complaintNumber || selectedForFeedback._id?.slice(-6)}
//               </p>
//               <textarea
//                 value={feedbackMessage}
//                 onChange={(e) => setFeedbackMessage(e.target.value)}
//                 placeholder="Enter your feedback or question for the citizen..."
//                 rows="4"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               />
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={handleSendFeedback}
//                   disabled={sendingFeedback || !feedbackMessage.trim()}
//                   className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
//                 >
//                   {sendingFeedback ? <FaSpinner className="animate-spin inline mr-1" /> : null}
//                   Send Feedback
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowFeedbackModal(false);
//                     setSelectedForFeedback(null);
//                     setFeedbackMessage("");
//                   }}
//                   className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* My Solutions Modal */}
//       {showMySolutions && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <FaLightbulb className="text-3xl" />
//                   <div>
//                     <h2 className="text-xl font-bold">My Solutions</h2>
//                     <p className="text-sm text-purple-100">Solutions you've shared with the community</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowMySolutions(false)}
//                   className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {userSolutions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaLightbulb className="text-6xl text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">No solutions yet</h3>
//                   <p className="text-gray-500 mb-4">When you resolve a complaint, share your solution to help others!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {userSolutions.map((solution) => (
//                     <div key={solution._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
//                       <div className="flex items-start justify-between mb-2">
//                         <div>
//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
//                               {solution.department}
//                             </span>
//                             {solution.verified ? (
//                               <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                                 <FaCheckCircle size={12} /> Verified
//                               </span>
//                             ) : (
//                               <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
//                                 <FaHourglassHalf size={12} /> Pending
//                               </span>
//                             )}
//                           </div>
//                           <h3 className="font-semibold text-gray-800">{solution.title}</h3>
//                           <p className="text-sm text-gray-600 mt-1 line-clamp-2">{solution.description}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                         <span>Posted: {new Date(solution.createdAt).toLocaleDateString()}</span>
//                         <span>•</span>
//                         <span className="flex items-center gap-1">
//                           <FaThumbsUp size={12} /> {solution.helpfulCount || 0}
//                         </span>
//                         <span>•</span>
//                         <span className="flex items-center gap-1">
//                           <FaThumbsDown size={12} /> {solution.notHelpfulCount || 0}
//                         </span>
//                       </div>

//                       {solution.status === "Rejected" && (
//                         <div className="mt-3 p-3 bg-red-50 rounded-lg">
//                           <p className="text-sm text-red-700">
//                             <span className="font-semibold">Feedback:</span> {solution.adminFeedback}
//                           </p>
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

//       {/* Page Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-6 mb-6 shadow-lg">
//         <div className="container mx-auto">
//           <div className="flex items-center gap-4">
//             <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg">
//               <FaClipboardList className="text-4xl" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold mb-2">Complaint Services</h1>
//               <p className="text-blue-100 text-lg">Government of Bangladesh • Citizen Grievance Redressal System</p>
//               <div className="flex items-center gap-2 mt-2 text-sm text-blue-200">
//                 <FaShieldAlt />
//                 <span>Your complaints are securely handled as per the Digital Security Act, 2018</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-6">
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">My Complaints</p>
//                 <h3 className="text-3xl font-bold text-gray-800">{userComplaints.length}</h3>
//                 <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
//                   <FaClipboardList size={12} /> Total complaints filed
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaClipboardList className="text-blue-600 text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Pending</p>
//                 <h3 className="text-3xl font-bold text-yellow-500">{userPending}</h3>
//                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                   <FaHourglassHalf size={12} /> Awaiting review
//                 </p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-lg">
//                 <FaClock className="text-yellow-600 text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">In Progress</p>
//                 <h3 className="text-3xl font-bold text-blue-500">{userInProgress}</h3>
//                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                   <FaSpinner className="animate-spin" size={12} /> Being processed
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaExclamationCircle className="text-blue-600 text-2xl" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Resolved</p>
//                 <h3 className="text-3xl font-bold text-green-600">{userResolved}</h3>
//                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                   <FaCheckCircle size={12} /> Successfully closed
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <FaCheckCircle className="text-green-600 text-2xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6">
//           <button
//             onClick={() => setActiveTab("all")}
//             className={`px-6 py-3 rounded-lg font-medium transition-all ${
//               activeTab === "all" 
//                 ? "bg-blue-600 text-white shadow-lg" 
//                 : "bg-white text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             All Complaints
//           </button>
//           <button
//             onClick={() => setActiveTab("my")}
//             className={`px-6 py-3 rounded-lg font-medium transition-all ${
//               activeTab === "my" 
//                 ? "bg-blue-600 text-white shadow-lg" 
//                 : "bg-white text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             My Complaints
//           </button>
//         </div>

//         {/* Actions Bar */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
//             {/* Search and Filters */}
//             <div className="flex flex-1 items-center gap-4">
//               <div className="relative flex-1">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by complaint ID, citizen name, department, or issue..."
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <div className="relative">
//                 <select
//                   className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Processing">Processing</option>
//                   <option value="Resolved">Resolved</option>
//                 </select>
//                 <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => {
//                   fetchUserSolutions();
//                   setShowMySolutions(true);
//                 }}
//                 className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
//               >
//                 <FaLightbulb />
//                 My Solutions
//               </button>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
//               >
//                 <FaPlus />
//                 File New Complaint
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Complaint Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-8 border-b border-gray-200 sticky top-0 bg-white z-10">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                       <FaStamp className="text-blue-600" />
//                       File a Formal Complaint
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Your information is pre-filled from your profile as per government records
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="p-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   {/* Left Column - Citizen Information */}
//                   <div className="space-y-6">
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                       <h3 className="font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
//                         <FaUserTie /> Complainant Information (As per NID)
//                       </h3>
                      
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
//                             <FaUser className="text-blue-500" /> Full Name:
//                           </div>
//                           <div className="col-span-2">
//                             <input
//                               type="text"
//                               name="citizenName"
//                               value={formData.citizenName}
//                               readOnly
//                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
//                             <FaIdCard className="text-blue-500" /> NID Number:
//                           </div>
//                           <div className="col-span-2">
//                             <input
//                               type="text"
//                               name="citizenId"
//                               value={formData.citizenId}
//                               readOnly
//                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
//                             <FaPhone className="text-blue-500" /> Contact:
//                           </div>
//                           <div className="col-span-2">
//                             <input
//                               type="tel"
//                               name="contactNumber"
//                               value={formData.contactNumber}
//                               readOnly
//                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
//                             <FaEnvelope className="text-blue-500" /> Email:
//                           </div>
//                           <div className="col-span-2">
//                             <input
//                               type="email"
//                               name="email"
//                               value={formData.email}
//                               readOnly
//                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
//                             <FaMapMarkerAlt className="text-blue-500" /> Address:
//                           </div>
//                           <div className="col-span-2">
//                             <textarea
//                               name="address"
//                               value={formData.address}
//                               readOnly
//                               rows="2"
//                               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column - Complaint Details */}
//                   <div className="space-y-6">
//                     <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
//                       <h3 className="font-semibold text-orange-800 border-b border-orange-200 pb-2 mb-4 flex items-center gap-2">
//                         <FaBuilding /> Complaint Details
//                       </h3>

//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <FaBuilding className="text-orange-500" /> Department *
//                           </label>
//                           <select
//                             name="department"
//                             value={formData.department}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                             required
//                           >
//                             <option value="">Select Government Department</option>
//                             <option value="Passport Office">Passport Office</option>
//                             <option value="Electricity">Electricity (DESCO)</option>
//                             <option value="Road Maintenance">Roads & Highways</option>
//                             <option value="Waste Management">Waste Management</option>
//                             <option value="Health Services">Health Services</option>
//                             <option value="Education">Education</option>
//                             <option value="Revenue">Revenue</option>
//                             <option value="Municipal Services">Municipal Services</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <FaExclamationCircle className="text-orange-500" /> Issue Keyword *
//                           </label>
//                           <input
//                             type="text"
//                             name="issueKeyword"
//                             value={formData.issueKeyword}
//                             onChange={handleChange}
//                             placeholder="e.g., passport delay, power outage, bill issue"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <FaExclamationCircle className="text-orange-500" /> Priority Level
//                           </label>
//                           <select
//                             name="priority"
//                             value={formData.priority}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             <option value="low">Low Priority</option>
//                             <option value="medium">Medium Priority</option>
//                             <option value="high">High Priority (Urgent)</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <FaFileAlt className="text-orange-500" /> Detailed Description *
//                           </label>
//                           <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             placeholder="Please provide detailed description of your complaint including dates, locations, and any relevant information..."
//                             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             rows="4"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-4 pt-8 border-t mt-8">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
//                   >
//                     {submitting ? (
//                       <>
//                         <FaSpinner className="animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <FaStamp />
//                         Submit Formal Complaint
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Complaints Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                 <FaClipboardList className="text-blue-600" />
//                 Complaint Records
//               </h2>
//               <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
//                 Showing {filteredComplaints.length} of {complaints.length} complaints
//               </p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Complaint #</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Citizen Details</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Issue</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                   <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="p-12 text-center">
//                       <div className="flex justify-center items-center gap-3">
//                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                         <span className="text-gray-500">Loading complaints...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredComplaints.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="p-12 text-center text-gray-500">
//                       <FaClipboardList className="text-5xl mx-auto mb-3 text-gray-300" />
//                       {activeTab === "my" ? 
//                         "You haven't filed any complaints yet. Click 'File New Complaint' to get started." : 
//                         "No complaints found"}
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredComplaints.map((complaint) => (
//                     <tr key={complaint._id} className="border-t hover:bg-blue-50 transition-colors">
//                       <td className="p-4">
//                         <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                           {complaint.complaintNumber || `#${complaint._id?.slice(-6)}`}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <p className="font-medium text-gray-800">{complaint.citizenName}</p>
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                             <FaPhone size={10} /> {complaint.contactNumber}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <span className="text-sm">{complaint.department}</span>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <p className="font-medium text-sm">{complaint.issueKeyword}</p>
//                           <p className="text-xs text-gray-500 truncate max-w-xs mt-1">
//                             {complaint.description?.substring(0, 60)}...
//                           </p>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         {getPriorityBadge(complaint.priority)}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex flex-col gap-1">
//                           {getStatusBadge(complaint.status)}
//                           {!isAdmin && complaint.status === "Resolved" && surveySubmittedComplaints.includes(complaint._id) && (
//                             <span className="text-xs text-green-600 flex items-center gap-1">
//                               <FaCheckCircle size={10} />
//                               Survey Completed
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <FaCalendarAlt size={12} />
//                           {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "N/A"}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex gap-2 flex-wrap">
//                           <button
//                             onClick={() => {
//                               setSelectedForTimeline(complaint);
//                               setShowTimeline(true);
//                             }}
//                             className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                             title="View Timeline"
//                           >
//                             <FaHistory />
//                           </button>
//                           <button
//                             onClick={() => setSelectedComplaint(complaint)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="View Details"
//                           >
//                             <FaEye />
//                           </button>
                          
//                           {/* Edit button for user's own non-resolved complaints */}
//                           {!isAdmin && isMyComplaint(complaint) && complaint.status !== 'Resolved' && (
//                             <button
//                               onClick={() => handleEditComplaint(complaint)}
//                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                               title="Edit Complaint"
//                             >
//                               <FaEdit />
//                             </button>
//                           )}
                          
//                           {/* Admin feedback button */}
//                           {isAdmin && (
//                             <button
//                               onClick={() => {
//                                 setSelectedForFeedback(complaint);
//                                 setShowFeedbackModal(true);
//                               }}
//                               className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                               title="Send Feedback"
//                             >
//                               <FaComment />
//                             </button>
//                           )}
                          
//                           {/* Share Solution Button */}
//                           {canShareSolution(complaint) && (
//                             <button
//                               onClick={() => {
//                                 setSelectedForSolution(complaint);
//                                 setShowSolutionForm(true);
//                               }}
//                               className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
//                               title="Share Solution"
//                             >
//                               <FaLightbulb />
//                             </button>
//                           )}
                          
//                           {/* Survey Button */}
//                           {!isAdmin && complaint.status === "Resolved" && isMyComplaint(complaint) && (
//                             <button
//                               onClick={() => openSurveyForComplaint(complaint)}
//                               className={`p-2 rounded-lg transition-colors ${
//                                 surveySubmittedComplaints.includes(complaint._id)
//                                   ? 'text-green-600 bg-green-50 cursor-default'
//                                   : 'text-blue-600 hover:bg-blue-50'
//                               }`}
//                               title={surveySubmittedComplaints.includes(complaint._id) ? "Survey Completed" : "Fill Survey"}
//                               disabled={surveySubmittedComplaints.includes(complaint._id)}
//                             >
//                               <FaFileAlt />
//                             </button>
//                           )}
                          
//                           {/* Delete button */}
//                           {(isAdmin || isMyComplaint(complaint)) && (
//                             <button
//                               onClick={() => setDeleteTarget(complaint._id)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                               title={isAdmin ? "Delete (Admin)" : "Delete your complaint"}
//                             >
//                               <FaTrash />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Timeline Modal */}
//       {showTimeline && selectedForTimeline && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold flex items-center gap-2">
//                     <FaHistory /> Complaint Timeline
//                   </h2>
//                   <p className="text-purple-100 text-sm mt-1">
//                     #{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowTimeline(false);
//                     setSelectedForTimeline(null);
//                   }}
//                   className="text-white hover:bg-purple-800 p-2 rounded-full transition-colors"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <div className="space-y-4">
//                 {selectedForTimeline.timeline?.map((entry, index) => (
//                   <div key={index} className="flex gap-4">
//                     <div className="relative">
//                       <div className={`w-3 h-3 rounded-full mt-1.5 ${
//                         entry.status === 'Resolved' ? 'bg-green-500' :
//                         entry.status === 'Processing' ? 'bg-blue-500' : 'bg-yellow-500'
//                       }`}></div>
//                       {index < (selectedForTimeline.timeline?.length - 1) && (
//                         <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-300"></div>
//                       )}
//                     </div>
//                     <div className="flex-1 pb-4">
//                       <div className="flex items-center justify-between">
//                         <p className="font-medium">{entry.status}</p>
//                         <p className="text-xs text-gray-500">
//                           {new Date(entry.date).toLocaleString()}
//                         </p>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
//                         {entry.comment}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">Updated by: {entry.updatedBy}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Admin Only Status Update Section */}
//               {isAdmin && selectedForTimeline.status !== "Resolved" && (
//                 <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
//                   <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
//                     <FaShieldAlt /> Admin Actions
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex gap-2">
//                       <select
//                         className="flex-1 border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//                         value={adminComment.split('|')[0] || "Processing"}
//                         onChange={(e) => {
//                           const comment = adminComment.split('|')[1] || "";
//                           setAdminComment(e.target.value + '|' + comment);
//                         }}
//                       >
//                         <option value="Processing">Mark as Processing</option>
//                         <option value="Resolved">Mark as Resolved</option>
//                       </select>
//                       <button
//                         onClick={() => updateComplaintStatus(
//                           selectedForTimeline._id, 
//                           adminComment.split('|')[0] || "Processing"
//                         )}
//                         disabled={updatingStatus}
//                         className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 font-medium"
//                       >
//                         {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />}
//                         Update
//                       </button>
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Add official comment (optional)"
//                       className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//                       value={adminComment.split('|')[1] || ""}
//                       onChange={(e) => setAdminComment(
//                         (adminComment.split('|')[0] || "Processing") + '|' + e.target.value
//                       )}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end">
//               <button
//                 onClick={() => {
//                   setShowTimeline(false);
//                   setSelectedForTimeline(null);
//                 }}
//                 className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {selectedComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold flex items-center gap-2">
//                   <FaEye /> Complaint Details
//                 </h2>
//                 <button
//                   onClick={() => setSelectedComplaint(null)}
//                   className="text-white hover:bg-blue-800 p-2 rounded-full transition-colors"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Complaint Number</p>
//                   <p className="font-mono font-medium">{selectedComplaint.complaintNumber || selectedComplaint._id}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Status</p>
//                   <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Citizen Name</p>
//                   <p className="font-medium">{selectedComplaint.citizenName}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Contact</p>
//                   <p>{selectedComplaint.contactNumber}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Department</p>
//                   <p className="font-medium">{selectedComplaint.department}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Priority</p>
//                   <p>{getPriorityBadge(selectedComplaint.priority)}</p>
//                 </div>
//                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Issue</p>
//                   <p className="font-medium">{selectedComplaint.issueKeyword}</p>
//                 </div>
//                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Description</p>
//                   <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedComplaint.description}</p>
//                 </div>
                
//                 {/* Show admin feedback if any */}
//                 {selectedComplaint.adminFeedback && selectedComplaint.adminFeedback.length > 0 && (
//                   <div className="col-span-2 bg-purple-50 p-3 rounded-lg border border-purple-200">
//                     <p className="text-xs text-purple-600 font-medium mb-2">Admin Feedback</p>
//                     <div className="space-y-3">
//                       {selectedComplaint.adminFeedback.map((feedback, idx) => (
//                         <div key={idx} className="bg-white p-3 rounded-lg">
//                           <p className="text-sm text-gray-700">{feedback.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {new Date(feedback.askedAt).toLocaleString()}
//                           </p>
//                           {feedback.response ? (
//                             <div className="mt-2 pl-3 border-l-2 border-green-300">
//                               <p className="text-xs text-green-600">Your Response:</p>
//                               <p className="text-sm text-gray-600">{feedback.response.text}</p>
//                             </div>
//                           ) : (
//                             feedback.requiresResponse && isMyComplaint(selectedComplaint) && (
//                               <button
//                                 onClick={() => {
//                                   const response = prompt("Enter your response:");
//                                   if (response) {
//                                     handleRespondToFeedback(selectedComplaint._id, feedback._id, response);
//                                   }
//                                 }}
//                                 className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
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
                
//                 <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Submitted On</p>
//                   <p>{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-wrap">
//               <button
//                 onClick={() => {
//                   setSelectedComplaint(null);
//                   setSelectedForTimeline(selectedComplaint);
//                   setShowTimeline(true);
//                 }}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
//               >
//                 <FaHistory />
//                 View Timeline
//               </button>
              
//               {canShareSolution(selectedComplaint) && (
//                 <button
//                   onClick={() => {
//                     setSelectedForSolution(selectedComplaint);
//                     setShowSolutionForm(true);
//                     setSelectedComplaint(null);
//                   }}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//                 >
//                   <FaLightbulb />
//                   Share Solution
//                 </button>
//               )}
              
//               <button
//                 onClick={() => setSelectedComplaint(null)}
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
//               <h2 className="text-xl font-bold flex items-center gap-2">
//                 <FaTrash /> Confirm Deletion
//               </h2>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this complaint? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeleteTarget(null)}
//                   className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={deleteComplaint}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
//                 >
//                   Delete Complaint
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



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
  
  // Edit complaint states
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    description: "",
    formalTemplate: "",
    editReason: ""
  });
  
  // Admin feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [selectedForFeedback, setSelectedForFeedback] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedFeedbackForResponse, setSelectedFeedbackForResponse] = useState(null);
  
  // Language state
  const [formLanguage, setFormLanguage] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [translatedSections, setTranslatedSections] = useState({
    complainantInfo: "",
    complaintDetails: "",
    communitySolutions: "",
    officialFormat: ""
  });
  
  // Translated user data
  const [translatedUserData, setTranslatedUserData] = useState({
    name: "",
    address: ""
  });
  
  // Survey related states
  const [showSurvey, setShowSurvey] = useState(false);
  const [resolvedComplaint, setResolvedComplaint] = useState(null);
  const [surveySubmittedComplaints, setSurveySubmittedComplaints] = useState([]);
  const [hasShownSurveyPopup, setHasShownSurveyPopup] = useState(false);
  
  // Report generation state
  const [generatingReport, setGeneratingReport] = useState(false);

  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  const getCurrentUser = () => {
    return user || JSON.parse(localStorage.getItem("user") || "{}");
  };

  const currentUser = getCurrentUser();

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

  // ==================== AI & Translation Functions ====================
  
  const translateText = async (text, targetLang) => {
    if (targetLang !== "bn" || !text || text.trim() === "") return text;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:5000/api/ai/translate",
        { text, targetLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.translated || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.department || !formData.issueKeyword) {
      alert(formLanguage === "en" 
        ? "Please select department and enter issue keyword first"
        : "অনুগ্রহ করে প্রথমে বিভাগ নির্বাচন করুন এবং ইস্যু কীওয়ার্ড লিখুন");
      return;
    }

    setGeneratingAI(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-complaint",
        {
          department: formData.department,
          keyword: formData.issueKeyword,
          description: formData.description,
          citizenName: formData.citizenName,
          citizenId: formData.citizenId,
          address: formData.address,
          contactNumber: formData.contactNumber,
          language: formLanguage
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60000
        }
      );

      if (response.data.success) {
        if (response.data.translatedName) {
          setTranslatedUserData({
            name: response.data.translatedName,
            address: response.data.translatedAddress || formData.address
          });
        }
        
        const aiDescription = formLanguage === "bn" ? response.data.bangla : response.data.english;
        setFormData(prev => ({ ...prev, description: aiDescription }));
        
        const template = await generateDynamicComplaintTemplate(
          {
            citizenName: formData.citizenName,
            citizenId: formData.citizenId,
            contactNumber: formData.contactNumber,
            email: formData.email,
            address: formData.address,
            department: formData.department,
            issueKeyword: formData.issueKeyword,
            description: aiDescription,
            priority: formData.priority,
            complaintNumber: `CMP${Date.now().toString().slice(-8)}`
          },
          formLanguage,
          aiDescription
        );
        setGeneratedTemplate(template);
        setEditedTemplate(template);
        
        alert(formLanguage === "en" 
          ? "AI complaint generated successfully!"
          : "এআই অভিযোগ সফলভাবে তৈরি হয়েছে!");
      } else {
        alert(response.data.message || (formLanguage === "en" 
          ? "AI generation failed. Please try again."
          : "এআই জেনারেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
      }
    } catch (error) {
      console.error("AI generation error:", error);
      
      let errorMessage = formLanguage === "en" 
        ? "Failed to generate AI complaint. Please try again later."
        : "এআই অভিযোগ তৈরি করতে ব্যর্থ হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = formLanguage === "en" 
          ? "Server not responding. Please check if the backend is running."
          : "সার্ভার সাড়া দিচ্ছে না। অনুগ্রহ করে ব্যাকএন্ড চলছে কিনা পরীক্ষা করুন।";
      }
      
      alert(errorMessage);
    } finally {
      setGeneratingAI(false);
    }
  };

  const translateUserData = async () => {
    if (formLanguage !== "bn") {
      setTranslatedUserData({
        name: formData.citizenName,
        address: formData.address
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:5000/api/ai/translate-user-data",
        {
          name: formData.citizenName,
          address: formData.address,
          targetLang: "bn"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTranslatedUserData({
        name: response.data.translatedName || formData.citizenName,
        address: response.data.translatedAddress || formData.address
      });
    } catch (error) {
      console.error("User data translation error:", error);
      setTranslatedUserData({
        name: formData.citizenName,
        address: formData.address
      });
    }
  };

  const translateUISections = async () => {
    if (formLanguage !== "bn") return;
    
    setTranslating(true);
    try {
      const sections = {
        complainantInfo: "Complainant Information (As per NID)",
        complaintDetails: "Complaint Details",
        communitySolutions: "Community Solutions",
        officialFormat: "Official Government Complaint Format"
      };
      
      const translated = {};
      for (const [key, value] of Object.entries(sections)) {
        translated[key] = await translateText(value, "bn");
      }
      setTranslatedSections(translated);
    } catch (error) {
      console.error("Section translation error:", error);
    } finally {
      setTranslating(false);
    }
  };

  const generateDynamicComplaintTemplate = async (userData, lang = "en", aiGeneratedDescription = null) => {
    const currentDate = new Date().toLocaleDateString(lang === "en" ? 'en-GB' : 'bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const priorityText = {
      low: lang === "en" ? "Low" : "নিম্ন",
      medium: lang === "en" ? "Medium" : "মাঝারি",
      high: lang === "en" ? "High" : "উচ্চ",
      emergency: lang === "en" ? "Emergency" : "জরুরি"
    };

    const departmentMapBN = {
      "Passport Office": "পাসপোর্ট অফিস",
      "Electricity": "বিদ্যুৎ বিভাগ",
      "Road Maintenance": "সড়ক রক্ষণাবেক্ষণ বিভাগ",
      "Waste Management": "বর্জ্য ব্যবস্থাপনা বিভাগ",
      "Health Services": "স্বাস্থ্য সেবা বিভাগ",
      "Education": "শিক্ষা বিভাগ",
      "Revenue": "রাজস্ব বিভাগ",
      "Municipal Services": "পৌর সেবা বিভাগ"
    };

    const departmentName = lang === "bn" && departmentMapBN[userData.department] 
      ? departmentMapBN[userData.department] 
      : userData.department;

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

${lang === "en" ? "Name" : "নাম"}                    : ${citizenName}
${lang === "en" ? "Father's/Spouse's Name" : "পিতা/স্বামীর নাম"}  : ${lang === "en" ? "[Father's/Spouse's Name]" : "[পিতার/স্বামীর নাম]"}
${lang === "en" ? "National ID Number" : "জাতীয় পরিচয়পত্র নং"}      : ${userData.citizenId}
${lang === "en" ? "Present/Permanent Address" : "বর্তমান/স্থায়ী ঠিকানা"}: ${citizenAddress}
${lang === "en" ? "Contact Number" : "যোগাযোগ নম্বর"}          : ${userData.contactNumber}
${lang === "en" ? "Email Address" : "ইমেইল ঠিকানা"}           : ${userData.email || 'N/A'}

====================================================================
${lang === "en" ? "COMPLAINT DETAILS" : "অভিযোগের বিবরণ"}
====================================================================

${lang === "en" ? "Department Concerned" : "বিভাগ"}    : ${departmentName}
${lang === "en" ? "Nature of Complaint" : "অভিযোগের ধরন"}     : ${userData.issueKeyword}
${lang === "en" ? "Priority Level" : "অগ্রাধিকার স্তর"}          : ${priorityText[userData.priority]}
${lang === "en" ? "Date of Incident" : "ঘটনার তারিখ"}        : ${new Date().toLocaleDateString()}
${lang === "en" ? "Location of Incident" : "ঘটনার স্থান"}    : ${citizenAddress}

====================================================================
${lang === "en" ? "DETAILED DESCRIPTION" : "বিস্তারিত বিবরণ"}
====================================================================

${lang === "en" ? "Respected Sir/Madam," : "মাননীয় মহোদয়/মহোদয়া,"}

${lang === "en" ? "I" : "আমি"}, ${citizenName}, ${lang === "en" ? "son/daughter of" : "পুত্র/কন্যা"} [${lang === "en" ? "Father's Name" : "পিতার নাম"}], ${lang === "en" ? "bearing NID No" : "এনআইডি নং ধারী"} ${userData.citizenId}, ${lang === "en" ? "a resident of" : "এর বাসিন্দা"} ${citizenAddress}, ${lang === "en" ? "would like to draw your kind attention to the following matter" : "আপনার সদয় দৃষ্টি আকর্ষণ করে নিম্নোক্ত বিষয়টি জানাতে চাই"}:

${finalDescription}

${lang === "en" ? "This issue has been causing significant hardship and inconvenience." : "এই সমস্যাটি উল্লেখযোগ্য কষ্ট ও অসুবিধার সৃষ্টি করছে।"}

====================================================================
${lang === "en" ? "SPECIFIC REQUESTS" : "নির্দিষ্ট অনুরোধ"}
====================================================================

${lang === "en" ? "Therefore, I humbly request your esteemed office to" : "অতএব, আমি আপনার কার্যালয়ের কাছে বিনীতভাবে অনুরোধ করছি"}:

1. ${lang === "en" ? "Investigate the matter thoroughly at the earliest convenience." : "বিষয়টি দ্রুত তদন্ত করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করা।"}
2. ${lang === "en" ? "Take necessary action against the concerned parties (if applicable)." : "প্রয়োজনীয় ব্যবস্থা গ্রহণ করা (যদি প্রযোজ্য হয়)।"}
3. ${lang === "en" ? "Provide a written update on the action taken within 7 working days." : "গৃহীত ব্যবস্থার একটি লিখিত আপডেট ৭ কার্যদিবসের মধ্যে প্রদান করা।"}
4. ${lang === "en" ? "Implement preventive measures to avoid recurrence of such issues." : "এ ধরনের সমস্যার পুনরাবৃত্তি রোধে প্রতিরোধমূলক ব্যবস্থা গ্রহণ করা।"}

====================================================================
${lang === "en" ? "DECLARATION" : "ঘোষণা"}
====================================================================

${lang === "en" ? "I" : "আমি"}, ${citizenName}, ${lang === "en" ? "do hereby declare that the information provided above is true and correct to the best of my knowledge and belief." : "এতদ্বারা ঘোষণা করছি যে উপরোক্ত প্রদত্ত তথ্যগুলি সম্পূর্ণ সত্য ও সঠিক।"}

                                            .....................
                                            (${lang === "en" ? "Signature of Complainant" : "স্বাক্ষরকারীর স্বাক্ষর"})

====================================================================
${lang === "en" ? "OFFICIAL USE ONLY" : "অফিসিয়াল ব্যবহারের জন্য"}
====================================================================

${lang === "en" ? "Complaint Registered By" : "অভিযোগ নিবন্ধনকারী"}: [${lang === "en" ? "Officer Name" : "কর্মকর্তার নাম"}]
${lang === "en" ? "Registration Date" : "নিবন্ধনের তারিখ"}      : ${currentDate}
${lang === "en" ? "Complaint Number" : "অভিযোগ নম্বর"}       : ${userData.complaintNumber || `CMP${Date.now().toString().slice(-8)}`}

                                                           ${lang === "en" ? "OFFICIAL STAMP" : "সরকারী সিলমোহর"}

====================================================================

${lang === "en" ? "Thanking you," : "ধন্যবাদান্তে,"}

${lang === "en" ? "Yours faithfully," : "আন্তরিকভাবে,"}
${citizenName}
${lang === "en" ? "Contact" : "যোগাযোগ"}: ${userData.contactNumber}
${lang === "en" ? "NID" : "এনআইডি"}: ${userData.citizenId}

====================================================================`;

    if (lang === "bn") {
      return await translateText(template, "bn");
    }
    return template;
  };

  const toggleFormLanguage = async () => {
    const newLang = formLanguage === "en" ? "bn" : "en";
    setFormLanguage(newLang);
    
    if (generatedTemplate) {
      setTranslating(true);
      try {
        if (newLang === "bn") {
          const translated = await translateText(generatedTemplate, "bn");
          setEditedTemplate(translated);
        } else {
          const englishTemplate = await generateDynamicComplaintTemplate(
            {
              citizenName: formData.citizenName,
              citizenId: formData.citizenId,
              contactNumber: formData.contactNumber,
              email: formData.email,
              address: formData.address,
              department: formData.department,
              issueKeyword: formData.issueKeyword,
              description: formData.description,
              priority: formData.priority,
              complaintNumber: `CMP${Date.now().toString().slice(-8)}`
            },
            "en"
          );
          setEditedTemplate(englishTemplate);
        }
      } catch (error) {
        console.error("Language toggle translation error:", error);
      } finally {
        setTranslating(false);
      }
    }
  };

  // ==================== Form Handlers ====================
  
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

      const timeline = [
        {
          status: "Pending",
          comment: "Complaint submitted successfully",
          updatedBy: formData.citizenName || "Citizen",
          date: new Date()
        }
      ];

      const complaintData = {
        userId: currentUser?._id,
        citizenName: formData.citizenName,
        citizenId: formData.citizenId,
        contactNumber: formData.contactNumber,
        email: formData.email || "",
        address: formData.address || "",
        department: formData.department,
        issueKeyword: formData.issueKeyword,
        description: formData.description,
        priority: formData.priority || "medium",
        timeline: timeline,
        language: formLanguage,
        formalTemplate: editedTemplate
      };

      const token = localStorage.getItem('token');
      const res = await axios.post(
        "http://localhost:5000/api/complaints/create", 
        complaintData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
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
      setFormLanguage("en");
      
    } catch (error) {
      console.error("Error details:", error);
      
      if (error.response) {
        alert(`Server error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert("Server is not responding. Please check if the backend is running on port 5000");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
    setSubmitting(false);
  };

  // ==================== Edit Complaint Functions ====================
  
  const handleEditComplaint = (complaint) => {
    if (complaint.status === 'Resolved') {
      alert("Cannot edit a resolved complaint.");
      return;
    }
    setEditingComplaint(complaint);
    setEditFormData({
      description: complaint.description || "",
      formalTemplate: complaint.formalTemplate || "",
      editReason: ""
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editFormData.editReason.trim()) {
      alert("Please provide a reason for editing your complaint");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${editingComplaint._id}`,
        {
          description: editFormData.description,
          formalTemplate: editFormData.formalTemplate,
          editReason: editFormData.editReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComplaints(prevComplaints => 
        prevComplaints.map(c => 
          c._id === editingComplaint._id ? response.data : c
        )
      );
      
      alert("Complaint updated successfully. Admin will review your changes.");
      setShowEditModal(false);
      setEditingComplaint(null);
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert(error.response?.data?.message || "Failed to update complaint");
    }
  };

  // ==================== Admin Feedback Functions ====================
  
  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    setSendingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/complaints/${selectedForFeedback._id}/feedback`,
        {
          message: feedbackMessage,
          isQuestion: false,
          requiresResponse: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackMessage("");
      setShowFeedbackModal(false);
      setSelectedForFeedback(null);
      fetchComplaints();
      alert("Feedback sent successfully");
    } catch (err) {
      console.error("Error sending feedback:", err);
      alert(err.response?.data?.message || "Failed to send feedback");
    } finally {
      setSendingFeedback(false);
    }
  };

  const handleRespondToFeedback = async () => {
    if (!responseMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/complaints/${selectedComplaint._id}/respond`,
        {
          feedbackId: selectedFeedbackForResponse._id,
          response: responseMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResponseMessage("");
      setShowResponseModal(false);
      setSelectedFeedbackForResponse(null);
      fetchComplaints();
      alert("Response sent successfully");
    } catch (err) {
      console.error("Error sending response:", err);
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  // ==================== Fetch Functions ====================
  
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all complaints
      const allRes = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch user's own complaints for full details
      const myRes = await axios.get("http://localhost:5000/api/complaints/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Merge data - prioritize full details for user's own complaints
      const myComplaintIds = new Set(myRes.data.map(c => c._id));
      
      const mergedComplaints = allRes.data.map(complaint => {
        if (myComplaintIds.has(complaint._id)) {
          const fullComplaint = myRes.data.find(c => c._id === complaint._id);
          return {
            ...complaint,
            ...fullComplaint,
            citizenId: fullComplaint?.citizenId || complaint.citizenId,
            contactNumber: fullComplaint?.contactNumber || complaint.contactNumber,
            email: fullComplaint?.email || complaint.email,
            address: fullComplaint?.address || complaint.address
          };
        }
        return {
          ...complaint,
          citizenName: complaint.citizenName || complaint.userId?.name || "Not Provided",
          complaintNumber: complaint.complaintNumber || `CMP${complaint._id?.slice(-6)}`
        };
      });
      
      setComplaints(mergedComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
    setLoading(false);
  };

  const fetchUserSolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:5000/api/solutions/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSolutions(res.data);
    } catch (err) {
      console.error("Error fetching solutions:", err);
    }
  };

  // ==================== Delete & Status Functions ====================
  
  const deleteComplaint = async () => {
    try {
      const complaintToDelete = complaints.find(c => c._id === deleteTarget);
      
      if (!complaintToDelete) {
        setDeleteSuccessMessage("Complaint not found");
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
        setDeleteTarget(null);
        return;
      }
      
      const isAuthorized = isAdmin || isMyComplaint(complaintToDelete);
      
      if (!isAuthorized) {
        setDeleteSuccessMessage("You are not authorized to delete this complaint");
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
        setDeleteTarget(null);
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/complaints/${deleteTarget}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== deleteTarget));
      setDeleteTarget(null);
      
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

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!isAdmin) {
      alert("Only administrators can update complaint status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints(prevComplaints => 
        prevComplaints.map(c => 
          c._id === complaintId ? { ...c, status: newStatus } : c
        )
      );

      setAdminComment("");
      setSelectedForTimeline(null);
      setShowTimeline(false);
      
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
    setUpdatingStatus(false);
  };

  // ==================== Survey Functions ====================
  
  const handleSurveySubmitted = async () => {
    if (resolvedComplaint) {
      setSurveySubmittedComplaints(prev => [...prev, resolvedComplaint._id]);
    }
    setShowSurvey(false);
    setResolvedComplaint(null);
    fetchComplaints();
  };

  const openSurveyForComplaint = (complaint) => {
    if (surveySubmittedComplaints.includes(complaint._id)) {
      alert("You have already submitted a survey for this complaint. Thank you for your feedback!");
      return;
    }
    setResolvedComplaint(complaint);
    setShowSurvey(true);
  };

  // ==================== PDF & Export Functions ====================
  
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
    const file = new Blob([editedTemplate], {type: 'text/plain'});
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

  const generateReport = async () => {
    if (!user) return;

    const myComplaints = complaints.filter(c => isMyComplaint(c));
    if (myComplaints.length === 0) {
      alert('No complaints to report.');
      return;
    }

    const stats = {
      total: myComplaints.length,
      pending: myComplaints.filter(c => c.status === 'Pending').length,
      processing: myComplaints.filter(c => c.status === 'Processing').length,
      resolved: myComplaints.filter(c => c.status === 'Resolved').length,
    };

    const deptCount = {};
    myComplaints.forEach(c => {
      deptCount[c.department] = (deptCount[c.department] || 0) + 1;
    });

    const priorityCount = { low: 0, medium: 0, high: 0 };
    myComplaints.forEach(c => {
      if (c.priority) priorityCount[c.priority] = (priorityCount[c.priority] || 0) + 1;
    });

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
            'x-api-key': 'YOUR_PDF_CO_API_KEY_HERE',
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

  // ==================== Helper Functions ====================
  
  const isMyComplaint = (complaint) => {
    if (!currentUser || !complaint) return false;
    
    const complaintUserId = typeof complaint.userId === 'object' 
      ? complaint.userId?._id 
      : complaint.userId;
    const currentUserId = currentUser._id;
    
    if (currentUserId && complaintUserId) {
      return complaintUserId === currentUserId || complaintUserId?.toString() === currentUserId?.toString();
    }
    
    if (currentUser.email && complaint.email && complaint.email !== "N/A") {
      return complaint.email.toLowerCase() === currentUser.email.toLowerCase();
    }
    
    return false;
  };

  const canShareSolution = (complaint) => {
    return complaint && 
           normalizeComplaintStatus(complaint.status) === "Resolved" && 
           isMyComplaint(complaint);
  };

  const normalizeComplaintStatus = (status) => {
    const raw = (status || "").toString().trim();
    const lowered = raw.toLowerCase();

    if (lowered === "in progress" || lowered === "processing") return "Processing";
    if (lowered === "pending") return "Pending";
    if (lowered === "resolved") return "Resolved";

    return raw;
  };

  const getStatusBadge = (status) => {
    switch(normalizeComplaintStatus(status)) {
      case 'Resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle size={12} /> Resolved</span>;
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaClock size={12} /> Pending</span>;
      case 'In Progress':
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaSpinner size={12} className="animate-spin" /> Processing</span>;
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

  // ==================== useEffect Hooks ====================
  
  useEffect(() => {
    const generateTemplate = async () => {
      if (formData.department && formData.issueKeyword) {
        const template = await generateDynamicComplaintTemplate(
          {
            citizenName: formData.citizenName,
            citizenId: formData.citizenId,
            contactNumber: formData.contactNumber,
            email: formData.email,
            address: formData.address,
            department: formData.department,
            issueKeyword: formData.issueKeyword,
            description: formData.description,
            priority: formData.priority,
            complaintNumber: `CMP${Date.now().toString().slice(-8)}`
          },
          formLanguage
        );
        setGeneratedTemplate(template);
        setEditedTemplate(template);
      }
    };
    
    generateTemplate();
  }, [formData.department, formData.issueKeyword, formData.description, formData.priority, formLanguage]);

  useEffect(() => {
    translateUserData();
  }, [formLanguage, formData.citizenName, formData.address]);

  useEffect(() => {
    translateUISections();
  }, [formLanguage]);

  useEffect(() => {
    const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
    const submitted = localStorage.getItem(userKey);
    if (submitted) {
      setSurveySubmittedComplaints(JSON.parse(submitted));
    }
  }, [currentUser]);

  useEffect(() => {
    const userKey = `surveySubmitted_${currentUser?._id || currentUser?.email}`;
    localStorage.setItem(userKey, JSON.stringify(surveySubmittedComplaints));
  }, [surveySubmittedComplaints, currentUser]);

  useEffect(() => {
    if (isAdmin) return;
    if (hasShownSurveyPopup) return;
    
    const userResolvedComplaints = complaints.filter(c => 
      c.status === "Resolved" && 
      isMyComplaint(c) &&
      !surveySubmittedComplaints.includes(c._id)
    );
    
    if (userResolvedComplaints.length > 0 && !showSurvey && !resolvedComplaint) {
      const latestResolved = userResolvedComplaints[0];
      setResolvedComplaint(latestResolved);
      setShowSurvey(true);
      setHasShownSurveyPopup(true);
    }
  }, [complaints, surveySubmittedComplaints, isAdmin, showSurvey, resolvedComplaint, hasShownSurveyPopup]);

  useEffect(() => {
    setHasShownSurveyPopup(false);
  }, [currentUser]);

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

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==================== Filtered Data ====================
  
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === "" || 
      (c.department?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.issueKeyword?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const normalizedStatus = normalizeComplaintStatus(c.status);
    const matchesFilter = filterStatus === "all" || normalizedStatus === filterStatus;
    
    let matchesTab = true;
    if (activeTab === "my") {
      matchesTab = isMyComplaint(c);
    }
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const userComplaints = complaints.filter(c => isMyComplaint(c));
  const userPending = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Pending").length;
  const userResolved = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Resolved").length;
  const userInProgress = userComplaints.filter(c => normalizeComplaintStatus(c.status) === "Processing").length;

  // ==================== Render ====================
  
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

      {/* Success Messages */}
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

      {showDeleteSuccess && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn">
          <div className={`${
            deleteSuccessMessage.includes("successfully") ? "bg-green-500" : "bg-red-500"
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
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Survey Modal */}
      {showSurvey && resolvedComplaint && isMyComplaint(resolvedComplaint) && (
        <SurveyModal
          complaint={resolvedComplaint}
          onClose={() => {
            setShowSurvey(false);
            setResolvedComplaint(null);
          }}
          onSubmit={handleSurveySubmitted}
        />
      )}

      {/* Solution Submission Modal */}
      {showSolutionForm && selectedForSolution && canShareSolution(selectedForSolution) && (
        <SubmitSolution
          complaint={selectedForSolution}
          onClose={() => {
            setShowSolutionForm(false);
            setSelectedForSolution(null);
          }}
          onSubmit={() => {
            fetchUserSolutions();
            fetchComplaints();
          }}
        />
      )}

      {/* Edit Complaint Modal */}
      {showEditModal && editingComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Edit Complaint</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingComplaint(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <FaExclamationTriangle className="inline mr-1" />
                  <strong>Note:</strong> Your edits will be reviewed by an administrator.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Editing *
                  </label>
                  <input
                    type="text"
                    value={editFormData.editReason}
                    onChange={(e) => setEditFormData({...editFormData, editReason: e.target.value})}
                    placeholder="e.g., Additional information, Correction, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingComplaint(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Feedback Modal */}
      {showFeedbackModal && selectedForFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Send Feedback</h3>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedForFeedback(null);
                    setFeedbackMessage("");
                  }}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Complaint #{selectedForFeedback.complaintNumber || selectedForFeedback._id?.slice(-6)}
              </p>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Enter your feedback for the citizen..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSendFeedback}
                  disabled={sendingFeedback || !feedbackMessage.trim()}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {sendingFeedback ? <FaSpinner className="animate-spin inline mr-1" /> : null}
                  Send Feedback
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedForFeedback(null);
                    setFeedbackMessage("");
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Solutions Modal */}
      {showMySolutions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaLightbulb className="text-3xl" />
                  <div>
                    <h2 className="text-xl font-bold">My Solutions</h2>
                    <p className="text-sm text-purple-100">Solutions you've shared with the community</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMySolutions(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              {userSolutions.length === 0 ? (
                <div className="text-center py-12">
                  <FaLightbulb className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No solutions yet</h3>
                  <p className="text-gray-500">When you resolve a complaint, share your solution to help others!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSolutions.map((solution) => (
                    <div key={solution._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{solution.department}</span>
                            {solution.verified ? (
                              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <FaCheckCircle size={12} /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                <FaHourglassHalf size={12} /> Pending
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800">{solution.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{solution.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Posted: {new Date(solution.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FaThumbsUp size={12} /> {solution.helpfulCount || 0}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FaThumbsDown size={12} /> {solution.notHelpfulCount || 0}</span>
                      </div>

                      {solution.status === "Rejected" && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-semibold">Feedback:</span> {solution.adminFeedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                <p className="text-sm text-gray-500 mb-1">My Complaints</p>
                <h3 className="text-3xl font-bold text-gray-800">{userComplaints.length}</h3>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <FaClipboardList size={12} /> Total complaints filed
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
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-yellow-500">{userPending}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaHourglassHalf size={12} /> Awaiting review
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
                <h3 className="text-3xl font-bold text-blue-500">{userInProgress}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaSpinner className="animate-spin" size={12} /> Being processed
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
                <h3 className="text-3xl font-bold text-green-600">{userResolved}</h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FaCheckCircle size={12} /> Successfully closed
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
              activeTab === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Complaints
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "my" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            My Complaints
          </button>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by complaint ID, citizen name, department, or issue..."
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
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generateReport}
                disabled={generatingReport}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {generatingReport ? <><FaSpinner className="animate-spin" /> Generating...</> : <><FaFilePdf /> Download Report</>}
              </button>

              <button
                onClick={() => {
                  fetchUserSolutions();
                  setShowMySolutions(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <FaLightbulb /> My Solutions
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setShowSolutions(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <FaPlus /> File New Complaint
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
                      {formLanguage === "en" ? "File a Formal Complaint" : "আনুষ্ঠানিক অভিযোগ দায়ের করুন"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {formLanguage === "en" 
                        ? "Your information is pre-filled from your profile as per government records" 
                        : "সরকারি রেকর্ড অনুযায়ী আপনার তথ্য প্রোফাইল থেকে পূর্বে পূরণ করা হয়েছে"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleFormLanguage}
                      disabled={translating}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FaLanguage />
                      <span className="text-sm font-medium">{formLanguage === "en" ? "বাংলা" : "English"}</span>
                      {translating && <FaSpinner className="animate-spin ml-1" />}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setShowSolutions(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
                        <FaUserTie /> 
                        {formLanguage === "en" ? "Complainant Information (As per NID)" : (translatedSections.complainantInfo || "অভিযোগকারীর তথ্য (এনআইডি অনুযায়ী)")}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaUser className="text-blue-500" /> {formLanguage === "en" ? "Full Name:" : "পুরো নাম:"}
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              name="citizenName"
                              value={formLanguage === "bn" ? translatedUserData.name || formData.citizenName : formData.citizenName}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              required
                              className={`w-full border rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${formData.citizenName ? "bg-white border-gray-200" : "bg-yellow-50 border-yellow-400"}`}
                            />
                            {!formData.citizenName && (
                              <p className="text-xs text-yellow-600 mt-1">⚠ Required — please enter your name</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaIdCard className="text-blue-500" /> {formLanguage === "en" ? "NID Number:" : "এনআইডি নম্বর:"}
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              name="citizenId"
                              value={formData.citizenId}
                              onChange={handleChange}
                              placeholder="Enter your NID number"
                              required
                              className={`w-full border rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${formData.citizenId ? "bg-white border-gray-200" : "bg-yellow-50 border-yellow-400"}`}
                            />
                            {!formData.citizenId && (
                              <p className="text-xs text-yellow-600 mt-1">⚠ Required — please enter your NID number</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaPhone className="text-blue-500" /> {formLanguage === "en" ? "Contact:" : "যোগাযোগ:"}
                          </div>
                          <div className="col-span-2">
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleChange}
                              placeholder="Enter your contact number"
                              required
                              className={`w-full border rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${formData.contactNumber ? "bg-white border-gray-200" : "bg-yellow-50 border-yellow-400"}`}
                            />
                            {!formData.contactNumber && (
                              <p className="text-xs text-yellow-600 mt-1">⚠ Required — please enter your contact number</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1 text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaEnvelope className="text-blue-500" /> {formLanguage === "en" ? "Email:" : "ইমেইল:"}
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
                            <FaMapMarkerAlt className="text-blue-500" /> {formLanguage === "en" ? "Address:" : "ঠিকানা:"}
                          </div>
                          <div className="col-span-2">
                            <textarea
                              name="address"
                              value={formLanguage === "bn" ? translatedUserData.address || formData.address : formData.address}
                              readOnly
                              rows="2"
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
                      <h3 className="font-semibold text-orange-800 border-b border-orange-200 pb-2 mb-4 flex items-center gap-2">
                        <FaBuilding /> 
                        {formLanguage === "en" ? "Complaint Details" : (translatedSections.complaintDetails || "অভিযোগের বিবরণ")}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaBuilding className="text-orange-500" /> {formLanguage === "en" ? "Department *" : "বিভাগ *"}
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                          >
                            <option value="">{formLanguage === "en" ? "Select Government Department" : "সরকারি বিভাগ নির্বাচন করুন"}</option>
                            <option value="Passport Office">🏛️ {formLanguage === "en" ? "Passport Office" : "পাসপোর্ট অফিস"}</option>
                            <option value="Electricity">⚡ {formLanguage === "en" ? "Electricity (DESCO)" : "বিদ্যুৎ (ডেসকো)"}</option>
                            <option value="Road Maintenance">🛣️ {formLanguage === "en" ? "Roads & Highways" : "সড়ক ও মহাসড়ক"}</option>
                            <option value="Waste Management">🗑️ {formLanguage === "en" ? "Waste Management" : "বর্জ্য ব্যবস্থাপনা"}</option>
                            <option value="Health Services">🏥 {formLanguage === "en" ? "Health Services" : "স্বাস্থ্য সেবা"}</option>
                            <option value="Education">📚 {formLanguage === "en" ? "Education" : "শিক্ষা"}</option>
                            <option value="Revenue">💰 {formLanguage === "en" ? "Revenue" : "রাজস্ব"}</option>
                            <option value="Municipal Services">🏙️ {formLanguage === "en" ? "Municipal Services" : "পৌর সেবা"}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaExclamationCircle className="text-orange-500" /> {formLanguage === "en" ? "Issue Keyword *" : "ইস্যু কীওয়ার্ড *"}
                          </label>
                          <input
                            type="text"
                            name="issueKeyword"
                            value={formData.issueKeyword}
                            onChange={handleChange}
                            placeholder={formLanguage === "en" ? "e.g., passport delay, power outage, bill issue" : "যেমন: পাসপোর্ট বিলম্ব, বিদ্যুৎ বিভ্রাট, বিল সমস্যা"}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaExclamationCircle className="text-orange-500" /> {formLanguage === "en" ? "Priority Level" : "অগ্রাধিকার স্তর"}
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">🟢 {formLanguage === "en" ? "Low Priority" : "নিম্ন অগ্রাধিকার"}</option>
                            <option value="medium">🟡 {formLanguage === "en" ? "Medium Priority" : "মাঝারি অগ্রাধিকার"}</option>
                            <option value="high">🔴 {formLanguage === "en" ? "High Priority (Urgent)" : "উচ্চ অগ্রাধিকার (জরুরি)"}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaFileAlt className="text-orange-500" /> {formLanguage === "en" ? "Detailed Description *" : "বিস্তারিত বিবরণ *"}
                          </label>
                          <div className="flex gap-2">
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              placeholder={formLanguage === "en"
                                ? "Please provide detailed description of your complaint..."
                                : "অনুগ্রহ করে আপনার অভিযোগের বিস্তারিত বিবরণ দিন..."}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="4"
                              required
                            />
                            <button
                              type="button"
                              onClick={handleAIGenerate}
                              disabled={generatingAI}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 h-fit"
                            >
                              {generatingAI ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                              AI Generate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.department && formData.issueKeyword && showSolutions && (
                  <div className="mt-6">
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
                        if (window.confirm(formLanguage === "en" 
                          ? "Would you like to use this solution as reference?" 
                          : "আপনি কি এই সমাধানটি রেফারেন্স হিসাবে ব্যবহার করতে চান?")) {
                          setFormData({...formData, description: solution.description || formData.description});
                        }
                      }}
                    />
                  </div>
                )}

                {generatedTemplate && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-blue-800 flex items-center gap-2 text-lg">
                        <FaStamp className="text-blue-600" />
                        {formLanguage === "en" ? "Official Government Complaint Format" : (translatedSections.officialFormat || "সরকারি অভিযোগের ফরম্যাট")}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {formLanguage === "en" ? "English" : "বাংলা"}
                        </span>
                      </h3>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => navigator.clipboard.writeText(editedTemplate)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                          <FaCopy /> {formLanguage === "en" ? "Copy" : "অনুলিপি করুন"}
                        </button>
                        <button type="button" onClick={downloadTemplateAsPDF} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2">
                          <FaFilePdf /> PDF
                        </button>
                        <button type="button" onClick={downloadTemplateAsText} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2">
                          <FaDownload /> {formLanguage === "en" ? "Text" : "টেক্সট"}
                        </button>
                        <button type="button" onClick={printTemplate} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2">
                          <FaPrint /> {formLanguage === "en" ? "Print" : "প্রিন্ট"}
                        </button>
                      </div>
                    </div>
                    {translating ? (
                      <div className="flex justify-center items-center h-96">
                        <FaSpinner className="animate-spin text-3xl text-blue-600" />
                        <span className="ml-3 text-gray-600">{formLanguage === "en" ? "Translating..." : "অনুবাদ করা হচ্ছে..."}</span>
                      </div>
                    ) : (
                      <textarea
                        value={editedTemplate}
                        onChange={handleTemplateEdit}
                        className="w-full h-96 p-4 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <FaShieldAlt className="text-green-500" />
                      {formLanguage === "en" 
                        ? "This format complies with the Government of Bangladesh official correspondence guidelines" 
                        : "এই ফরম্যাটটি বাংলাদেশ সরকারের অফিসিয়াল চিঠিপত্র নির্দেশিকা মেনে চলে"}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-8 border-t mt-8">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setShowSolutions(false); }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    {formLanguage === "en" ? "Cancel" : "বাতিল করুন"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg"
                  >
                    {submitting ? <><FaSpinner className="animate-spin" /> {formLanguage === "en" ? "Submitting..." : "জমা দেওয়া হচ্ছে..."}</> : <><FaStamp /> {formLanguage === "en" ? "Submit Formal Complaint" : "আনুষ্ঠানিক অভিযোগ জমা দিন"}</>}
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
                        <span className="text-gray-500">Loading complaints...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500">
                      <FaClipboardList className="text-5xl mx-auto mb-3 text-gray-300" />
                      {activeTab === "my" ? "You haven't filed any complaints yet." : "No complaints found"}
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
                            <FaPhone size={10} /> {c.contactNumber}
                          </p>
                        </div>
                      </td>
                      <td className="p-4"><span className="text-sm">{c.department}</span></td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{c.issueKeyword}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs mt-1">{c.description?.substring(0, 60)}...</p>
                        </div>
                      </td>
                      <td className="p-4">{getPriorityBadge(c.priority)}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(c.status)}
                          {!isAdmin && c.status === "Resolved" && surveySubmittedComplaints.includes(c._id) && (
                            <span className="text-xs text-green-600 flex items-center gap-1"><FaCheckCircle size={10} /> Survey Completed</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt size={12} />
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => { setSelectedForTimeline(c); setShowTimeline(true); }} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="View Timeline">
                            <FaHistory />
                          </button>
                          <button onClick={() => setSelectedComplaint(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                            <FaEye />
                          </button>
                          <button onClick={() => exportComplaintAsPDF(c)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Export as PDF">
                            <FaFilePdf />
                          </button>
                          
                          {/* Edit button for user's own non-resolved complaints */}
                          {!isAdmin && isMyComplaint(c) && c.status !== 'Resolved' && (
                            <button onClick={() => handleEditComplaint(c)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit Complaint">
                              <FaEdit />
                            </button>
                          )}
                          
                          {/* Admin feedback button */}
                          {isAdmin && (
                            <button onClick={() => { setSelectedForFeedback(c); setShowFeedbackModal(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Send Feedback">
                              <FaComment />
                            </button>
                          )}
                          
                          {/* Share Solution Button */}
                          {canShareSolution(c) && (
                            <button onClick={() => { setSelectedForSolution(c); setShowSolutionForm(true); }} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg" title="Share Solution">
                              <FaLightbulb />
                            </button>
                          )}
                          
                          {/* Survey Button */}
                          {!isAdmin && c.status === "Resolved" && isMyComplaint(c) && (
                            <button onClick={() => openSurveyForComplaint(c)} className={`p-2 rounded-lg ${surveySubmittedComplaints.includes(c._id) ? 'text-green-600 bg-green-50' : 'text-blue-600 hover:bg-blue-50'}`} disabled={surveySubmittedComplaints.includes(c._id)}>
                              <FaFileAlt />
                            </button>
                          )}
                          
                          {/* Delete button */}
                          {(isAdmin || isMyComplaint(c)) && (
                            <button onClick={() => setDeleteTarget(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
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
                  <h2 className="text-xl font-bold flex items-center gap-2"><FaHistory /> Complaint Timeline</h2>
                  <p className="text-purple-100 text-sm mt-1">#{selectedForTimeline.complaintNumber || selectedForTimeline._id?.slice(-6)}</p>
                </div>
                <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }} className="text-white hover:bg-purple-800 p-2 rounded-full">
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedForTimeline.timeline?.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${entry.status === 'Resolved' ? 'bg-green-500' : entry.status === 'Processing' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                      {index < (selectedForTimeline.timeline?.length - 1) && <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-300"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.status}</p>
                        <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">{entry.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">Updated by: {entry.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isAdmin && selectedForTimeline.status !== "Resolved" && (
                <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2"><FaShieldAlt /> Admin Actions</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        value={adminComment.split('|')[0] || "Processing"}
                        onChange={(e) => setAdminComment(e.target.value + '|' + (adminComment.split('|')[1] || ""))}
                      >
                        <option value="Processing">Mark as Processing</option>
                        <option value="Resolved">Mark as Resolved</option>
                      </select>
                      <button
                        onClick={() => updateComplaintStatus(selectedForTimeline._id, adminComment.split('|')[0] || "Processing")}
                        disabled={updatingStatus}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? <FaSpinner className="animate-spin" /> : <FaEdit />} Update
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Add official comment (optional)"
                      className="w-full border-2 border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      value={adminComment.split('|')[1] || ""}
                      onChange={(e) => setAdminComment((adminComment.split('|')[0] || "Processing") + '|' + e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button onClick={() => { setShowTimeline(false); setSelectedForTimeline(null); }} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2"><FaEye /> Complaint Details</h2>
                <button onClick={() => setSelectedComplaint(null)} className="text-white hover:bg-blue-800 p-2 rounded-full">
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Complaint Number</p><p className="font-mono font-medium">{selectedComplaint.complaintNumber || selectedComplaint._id}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Status</p><div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Citizen Name</p><p className="font-medium">{selectedComplaint.citizenName}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Contact</p><p>{selectedComplaint.contactNumber}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Department</p><p className="font-medium">{selectedComplaint.department}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Priority</p><p>{getPriorityBadge(selectedComplaint.priority)}</p></div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Issue</p><p className="font-medium">{selectedComplaint.issueKeyword}</p></div>
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Description</p><p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedComplaint.description}</p></div>
                
                {/* Admin Feedback Display */}
                {selectedComplaint.adminFeedback && selectedComplaint.adminFeedback.length > 0 && (
                  <div className="col-span-2 bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-2">Admin Feedback</p>
                    <div className="space-y-3">
                      {selectedComplaint.adminFeedback.map((feedback, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{feedback.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(feedback.askedAt).toLocaleString()}</p>
                          {feedback.response ? (
                            <div className="mt-2 pl-3 border-l-2 border-green-300">
                              <p className="text-xs text-green-600">Your Response:</p>
                              <p className="text-sm text-gray-600">{feedback.response.text}</p>
                            </div>
                          ) : (
                            feedback.requiresResponse && isMyComplaint(selectedComplaint) && (
                              <button
                                onClick={() => {
                                  setSelectedFeedbackForResponse(feedback);
                                  setShowResponseModal(true);
                                }}
                                className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                              >
                                <FaReply size={10} /> Respond
                              </button>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Submitted On</p><p>{selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString() : "N/A"}</p></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => { setSelectedComplaint(null); setSelectedForTimeline(selectedComplaint); setShowTimeline(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <FaHistory /> View Timeline
              </button>
              {canShareSolution(selectedComplaint) && (
                <button onClick={() => { setSelectedForSolution(selectedComplaint); setShowSolutionForm(true); setSelectedComplaint(null); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <FaLightbulb /> Share Solution
                </button>
              )}
              <button onClick={() => exportComplaintAsPDF(selectedComplaint)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                <FaFilePdf /> Export PDF
              </button>
              <button onClick={() => setSelectedComplaint(null)} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedFeedbackForResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Respond to Admin</h3>
                <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); setResponseMessage(""); }} className="p-2 hover:bg-white/20 rounded-full">
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Admin message: "{selectedFeedbackForResponse.message}"</p>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={handleRespondToFeedback} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send Response
                </button>
                <button onClick={() => { setShowResponseModal(false); setSelectedFeedbackForResponse(null); }} className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-2"><FaTrash /> Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Are you sure you want to delete this complaint? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={deleteComplaint} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}