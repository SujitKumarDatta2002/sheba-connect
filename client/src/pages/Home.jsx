// // // // import React, { useState, useEffect } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { 
// // // //   FaClipboardList, 
// // // //   FaCogs, 
// // // //   FaFileAlt, 
// // // //   FaArrowRight,
// // // //   FaExclamationCircle,
// // // //   FaCheckCircle,
// // // //   FaClock,
// // // //   FaChartLine
// // // // } from "react-icons/fa";

// // // // export default function Home() {
// // // //   const navigate = useNavigate();
// // // //   const [stats, setStats] = useState({
// // // //     total: 24,
// // // //     pending: 8,
// // // //     resolved: 16
// // // //   });
  
// // // //   const [recentComplaints, setRecentComplaints] = useState([
// // // //     { id: 1, department: "Water Supply", issue: "No water supply", status: "Pending", date: "2026-03-10" },
// // // //     { id: 2, department: "Electricity", issue: "Power outage", status: "Resolved", date: "2026-03-09" },
// // // //     { id: 3, department: "Road Maintenance", issue: "Pothole repair", status: "In Progress", date: "2026-03-08" },
// // // //     { id: 4, department: "Waste Management", issue: "Garbage collection", status: "Pending", date: "2026-03-07" }
// // // //   ]);

// // // //   const [showQuickTip, setShowQuickTip] = useState(true);
// // // //   const [activeFeature, setActiveFeature] = useState(0);

// // // //   const features = [
// // // //     {
// // // //       icon: <FaClipboardList className="text-4xl text-blue-600" />,
// // // //       title: "Complaint Tracking",
// // // //       description: "Submit and track complaints with real-time status updates",
// // // //       path: "/complaints",
// // // //       color: "blue"
// // // //     },
// // // //     {
// // // //       icon: <FaCogs className="text-4xl text-green-600" />,
// // // //       title: "Service Guidance",
// // // //       description: "Get recommendations for government services",
// // // //       path: "/services",
// // // //       color: "green"
// // // //     },
// // // //     {
// // // //       icon: <FaFileAlt className="text-4xl text-purple-600" />,
// // // //       title: "Document Management",
// // // //       description: "Store and manage your documents securely",
// // // //       path: "/documents",
// // // //       color: "purple"
// // // //     }
// // // //   ];

// // // //   // Auto-rotate features for the carousel
// // // //   useEffect(() => {
// // // //     const interval = setInterval(() => {
// // // //       setActiveFeature((prev) => (prev + 1) % features.length);
// // // //     }, 5000);
// // // //     return () => clearInterval(interval);
// // // //   }, [features.length]);

// // // //   const getStatusColor = (status) => {
// // // //     switch(status) {
// // // //       case 'Resolved': return 'bg-green-100 text-green-800';
// // // //       case 'Pending': return 'bg-yellow-100 text-yellow-800';
// // // //       case 'In Progress': return 'bg-blue-100 text-blue-800';
// // // //       default: return 'bg-gray-100 text-gray-800';
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
      
// // // //       {/* HERO SECTION with Animation */}
// // // //       <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
// // // //         <div className="container mx-auto px-6 py-20">
// // // //           <div className="flex flex-col md:flex-row items-center justify-between">
// // // //             <div className="md:w-1/2 mb-10 md:mb-0">
// // // //               <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
// // // //                 ShebaConnect
// // // //               </h1>
// // // //               <p className="text-xl md:text-2xl mb-8 text-blue-100">
// // // //                 Smart Government Service Navigation & Assistance Platform
// // // //               </p>
// // // //               <p className="text-lg mb-8 text-blue-50">
// // // //                 Your one-stop solution for all government services, complaints, 
// // // //                 and document management. Fast, secure, and reliable.
// // // //               </p>
// // // //               <div className="flex flex-wrap gap-4">
// // // //                 <button 
// // // //                   onClick={() => navigate('/complaints')}
// // // //                   className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
// // // //                            hover:bg-blue-50 transition-all transform hover:scale-105 
// // // //                            flex items-center gap-2 shadow-lg"
// // // //                 >
// // // //                   Get Started <FaArrowRight />
// // // //                 </button>
// // // //                 <button 
// // // //                   onClick={() => navigate('/services')}
// // // //                   className="border-2 border-white text-white px-8 py-3 rounded-lg 
// // // //                            font-semibold hover:bg-white hover:text-blue-600 
// // // //                            transition-all transform hover:scale-105"
// // // //                 >
// // // //                   Learn More
// // // //                 </button>
// // // //               </div>
// // // //             </div>
            
// // // //             {/* Stats Overview */}
// // // //             <div className="md:w-1/3 bg-white/10 backdrop-blur-lg rounded-xl p-6">
// // // //               <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
// // // //                 <FaChartLine /> Quick Stats
// // // //               </h3>
// // // //               <div className="space-y-4">
// // // //                 <div className="flex justify-between items-center">
// // // //                   <span className="flex items-center gap-2">
// // // //                     <FaClipboardList /> Total Complaints
// // // //                   </span>
// // // //                   <span className="font-bold text-2xl">{stats.total}</span>
// // // //                 </div>
// // // //                 <div className="flex justify-between items-center">
// // // //                   <span className="flex items-center gap-2">
// // // //                     <FaClock className="text-yellow-300" /> Pending
// // // //                   </span>
// // // //                   <span className="font-bold text-2xl text-yellow-300">{stats.pending}</span>
// // // //                 </div>
// // // //                 <div className="flex justify-between items-center">
// // // //                   <span className="flex items-center gap-2">
// // // //                     <FaCheckCircle className="text-green-300" /> Resolved
// // // //                   </span>
// // // //                   <span className="font-bold text-2xl text-green-300">{stats.resolved}</span>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* Quick Tip Banner */}
// // // //       {showQuickTip && (
// // // //         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 my-4 rounded-lg shadow-md">
// // // //           <div className="flex items-center justify-between">
// // // //             <div className="flex items-center gap-3">
// // // //               <FaExclamationCircle className="text-yellow-500 text-xl" />
// // // //               <p className="text-yellow-700">
// // // //                 <span className="font-semibold">Quick Tip:</span> You can track your complaints 
// // // //                 in real-time from the Complaints dashboard!
// // // //               </p>
// // // //             </div>
// // // //             <button 
// // // //               onClick={() => setShowQuickTip(false)}
// // // //               className="text-yellow-500 hover:text-yellow-700"
// // // //             >
// // // //               ×
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* FEATURES SECTION with Interactive Carousel */}
// // // //       <section className="py-16 px-6 bg-white">
// // // //         <div className="container mx-auto">
// // // //           <h2 className="text-3xl font-bold text-center mb-4">Our Features</h2>
// // // //           <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
// // // //             Discover how ShebaConnect can help you navigate government services efficiently
// // // //           </p>

// // // //           {/* Mobile Carousel View */}
// // // //           <div className="md:hidden">
// // // //             <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
// // // //               <div className="flex justify-center mb-4">
// // // //                 {features[activeFeature].icon}
// // // //               </div>
// // // //               <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
// // // //               <p className="text-gray-600 mb-6">{features[activeFeature].description}</p>
// // // //               <button
// // // //                 onClick={() => navigate(features[activeFeature].path)}
// // // //                 className={`bg-${features[activeFeature].color}-600 text-white px-6 py-2 
// // // //                          rounded-lg hover:bg-${features[activeFeature].color}-700 
// // // //                          transition-all transform hover:scale-105`}
// // // //               >
// // // //                 Explore
// // // //               </button>
// // // //               <div className="flex justify-center gap-2 mt-4">
// // // //                 {features.map((_, index) => (
// // // //                   <button
// // // //                     key={index}
// // // //                     onClick={() => setActiveFeature(index)}
// // // //                     className={`w-2 h-2 rounded-full transition-all ${
// // // //                       activeFeature === index ? 'w-8 bg-blue-600' : 'bg-gray-300'
// // // //                     }`}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Desktop Grid View */}
// // // //           <div className="hidden md:grid md:grid-cols-3 gap-8">
// // // //             {features.map((feature, index) => (
// // // //               <div
// // // //                 key={index}
// // // //                 className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
// // // //                          transition-all transform hover:-translate-y-2 cursor-pointer
// // // //                          border border-gray-100"
// // // //                 onClick={() => navigate(feature.path)}
// // // //               >
// // // //                 <div className="mb-4">{feature.icon}</div>
// // // //                 <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
// // // //                 <p className="text-gray-600 mb-4">{feature.description}</p>
// // // //                 <button 
// // // //                   className={`text-${feature.color}-600 font-semibold flex items-center gap-2 
// // // //                            hover:gap-3 transition-all`}
// // // //                 >
// // // //                   Learn More <FaArrowRight />
// // // //                 </button>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* RECENT COMPLAINTS PREVIEW */}
// // // //       <section className="py-16 px-6 bg-gray-50">
// // // //         <div className="container mx-auto">
// // // //           <div className="flex justify-between items-center mb-8">
// // // //             <h2 className="text-3xl font-bold">Recent Complaints</h2>
// // // //             <button
// // // //               onClick={() => navigate('/complaints')}
// // // //               className="text-blue-600 font-semibold flex items-center gap-2 
// // // //                        hover:gap-3 transition-all"
// // // //             >
// // // //               View All <FaArrowRight />
// // // //             </button>
// // // //           </div>

// // // //           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// // // //             <div className="overflow-x-auto">
// // // //               <table className="w-full">
// // // //                 <thead className="bg-gray-100">
// // // //                   <tr>
// // // //                     <th className="p-4 text-left">Department</th>
// // // //                     <th className="p-4 text-left">Issue</th>
// // // //                     <th className="p-4 text-left">Status</th>
// // // //                     <th className="p-4 text-left">Date</th>
// // // //                     <th className="p-4 text-left">Action</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {recentComplaints.map((complaint) => (
// // // //                     <tr key={complaint.id} className="border-t hover:bg-gray-50">
// // // //                       <td className="p-4 font-medium">{complaint.department}</td>
// // // //                       <td className="p-4">{complaint.issue}</td>
// // // //                       <td className="p-4">
// // // //                         <span className={`px-3 py-1 rounded-full text-sm font-medium 
// // // //                                        ${getStatusColor(complaint.status)}`}>
// // // //                           {complaint.status}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td className="p-4 text-gray-600">{complaint.date}</td>
// // // //                       <td className="p-4">
// // // //                         <button
// // // //                           onClick={() => navigate('/complaints')}
// // // //                           className="text-blue-600 hover:text-blue-800"
// // // //                         >
// // // //                           Track
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* QUICK ACTIONS with Statistics */}
// // // //       <section className="py-16 px-6 bg-blue-600 text-white">
// // // //         <div className="container mx-auto text-center">
// // // //           <h2 className="text-3xl font-bold mb-12">Quick Actions</h2>
          
// // // //           <div className="grid md:grid-cols-3 gap-8 mb-12">
// // // //             <div className="text-center">
// // // //               <div className="text-4xl font-bold mb-2">500+</div>
// // // //               <div className="text-blue-200">Daily Users</div>
// // // //             </div>
// // // //             <div className="text-center">
// // // //               <div className="text-4xl font-bold mb-2">1000+</div>
// // // //               <div className="text-blue-200">Complaints Resolved</div>
// // // //             </div>
// // // //             <div className="text-center">
// // // //               <div className="text-4xl font-bold mb-2">50+</div>
// // // //               <div className="text-blue-200">Services Available</div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex flex-wrap justify-center gap-6">
// // // //             <button
// // // //               onClick={() => navigate('/complaints')}
// // // //               className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
// // // //                        hover:bg-blue-50 transition-all transform hover:scale-105
// // // //                        flex items-center gap-2 shadow-lg"
// // // //             >
// // // //               <FaClipboardList /> File Complaint
// // // //             </button>
// // // //             <button
// // // //               onClick={() => navigate('/services')}
// // // //               className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold 
// // // //                        hover:bg-green-600 transition-all transform hover:scale-105
// // // //                        flex items-center gap-2 shadow-lg"
// // // //             >
// // // //               <FaCogs /> Browse Services
// // // //             </button>
// // // //             <button
// // // //               onClick={() => navigate('/documents')}
// // // //               className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold 
// // // //                        hover:bg-purple-600 transition-all transform hover:scale-105
// // // //                        flex items-center gap-2 shadow-lg"
// // // //             >
// // // //               <FaFileAlt /> View Documents
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // //       // {/* NEWSLETTER SECTION */}
// // //       // <section className="py-16 px-6 bg-white">
// // //       //   <div className="container mx-auto max-w-2xl text-center">
// // //       //     <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
// // //       //     <p className="text-gray-600 mb-8">
// // //       //       Subscribe to receive updates about new services and features
// // //       //     </p>
// // //       //     <div className="flex flex-col sm:flex-row gap-4">
// // //       //       <input
// // //       //         type="email"
// // //       //         placeholder="Enter your email"
// // //       //         className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
// // //       //                  focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //       //       />
// // //       //       <button
// // //       //         className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold 
// // //       //                  hover:bg-blue-700 transition-all transform hover:scale-105"
// // //       //       >
// // //       //         Subscribe
// // //       //       </button>
// // //       //     </div>
// // //       //   </div>
// // //       // </section>

// // // //       {/* Add animation styles */}
// // // //       <style jsx>{`
// // // //         @keyframes fadeIn {
// // // //           from { opacity: 0; transform: translateY(20px); }
// // // //           to { opacity: 1; transform: translateY(0); }
// // // //         }
// // // //         .animate-fade-in {
// // // //           animation: fadeIn 1s ease-out;
// // // //         }
// // // //       `}</style>
// // // //     </div>
// // // //   );
// // // // }



// // import API from "../config/api";
// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import {
// //   FaClipboardList,
// //   FaCogs,
// //   FaFileAlt,
// //   FaArrowRight,
// //   FaCheckCircle,
// //   FaClock,
// //   FaChartLine,
// //   FaUsers,
// //   FaShieldAlt,
// //   FaChevronLeft,
// //   FaChevronRight,
// //   FaPlay,
// //   FaPause,
// //   FaExclamationTriangle,
// //   FaBuilding,
// //   FaBolt,
// //   FaLeaf
// // } from "react-icons/fa";

// // const slides = [
// //   {
// //     id: 1,
// //     badge: "Government of Bangladesh",
// //     title: "Your Voice,",
// //     titleAccent: "Government's Action",
// //     subtitle: "Submit complaints, track progress, and get resolutions — all in one secure platform built for citizens of Bangladesh.",
// //     cta: "File a Complaint",
// //     ctaPath: "/complaints",
// //     secondaryCta: "Browse Services",
// //     secondaryPath: "/services",
// //     bg: "from-slate-900 via-blue-950 to-blue-900",
// //     accent: "bg-blue-500",
// //     pattern: "circles",
// //   },
// //   {
// //     id: 2,
// //     badge: "Smart Service Navigation",
// //     title: "Find the Right",
// //     titleAccent: "Government Service",
// //     subtitle: "Navigate hundreds of government services effortlessly. Get AI-powered guidance tailored to your specific needs.",
// //     cta: "Explore Services",
// //     ctaPath: "/services",
// //     secondaryCta: "Learn More",
// //     secondaryPath: "/",
// //     bg: "from-slate-900 via-indigo-950 to-indigo-900",
// //     accent: "bg-indigo-500",
// //     pattern: "grid",
// //   },
// //   {
// //     id: 3,
// //     badge: "Document Management",
// //     title: "Secure Digital",
// //     titleAccent: "Document Vault",
// //     subtitle: "Store, manage, and access your important government documents anytime. Your data is encrypted and always available.",
// //     cta: "Manage Documents",
// //     ctaPath: "/documents",
// //     secondaryCta: "Learn More",
// //     secondaryPath: "/",
// //     bg: "from-slate-900 via-teal-950 to-teal-900",
// //     accent: "bg-teal-500",
// //     pattern: "dots",
// //   },
// // ];

// // const features = [
// //   {
// //     icon: <FaClipboardList />,
// //     title: "Complaint Tracking",
// //     description: "Submit and track complaints with real-time status updates and transparent timelines.",
// //     path: "/complaints",
// //     color: "blue",
// //     stat: "Real-time updates",
// //   },
// //   {
// //     icon: <FaCogs />,
// //     title: "Service Guidance",
// //     description: "AI-powered recommendations to navigate government services quickly and efficiently.",
// //     path: "/services",
// //     color: "indigo",
// //     stat: "50+ services",
// //   },
// //   {
// //     icon: <FaFileAlt />,
// //     title: "Document Management",
// //     description: "Securely store and manage your government documents in one centralized location.",
// //     path: "/documents",
// //     color: "teal",
// //     stat: "256-bit encryption",
// //   },
// // ];

// // const departments = [
// //   { name: "Passport Office", icon: "🛂", color: "bg-blue-50 text-blue-700 border-blue-200" },
// //   { name: "Electricity Board", icon: "⚡", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
// //   { name: "Water Supply", icon: "💧", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
// //   { name: "Road Maintenance", icon: "🛣️", color: "bg-orange-50 text-orange-700 border-orange-200" },
// //   { name: "Health Services", icon: "🏥", color: "bg-red-50 text-red-700 border-red-200" },
// //   { name: "Education Dept.", icon: "📚", color: "bg-green-50 text-green-700 border-green-200" },
// //   { name: "Revenue Office", icon: "🏛️", color: "bg-purple-50 text-purple-700 border-purple-200" },
// //   { name: "Municipal Corp.", icon: "🏙️", color: "bg-pink-50 text-pink-700 border-pink-200" },
// // ];

// // export default function Home({ user }) {
// //   const navigate = useNavigate();
// //   const [currentSlide, setCurrentSlide] = useState(0);
// //   const [isPlaying, setIsPlaying] = useState(true);
// //   const [systemStats, setSystemStats] = useState({
// //     totalUsers: 0,
// //     totalComplaints: 0,
// //     pendingComplaints: 0,
// //     resolvedComplaints: 0,
// //     resolutionRate: 0
// //   });
// //   const [statsLoading, setStatsLoading] = useState(true);
// //   const [recentComplaints] = useState([
// //     { id: 1, department: "Water Supply", issue: "No water supply for 3 days", status: "Pending", date: "2026-04-10", priority: "high" },
// //     { id: 2, department: "Electricity", issue: "Power outage in block C", status: "Resolved", date: "2026-04-09", priority: "medium" },
// //     { id: 3, department: "Road Maintenance", issue: "Large pothole near school", status: "In Progress", date: "2026-04-08", priority: "high" },
// //     { id: 4, department: "Waste Management", issue: "Garbage not collected", status: "Pending", date: "2026-04-07", priority: "low" },
// //   ]);
// //   const intervalRef = useRef(null);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const res = await axios.get(`${API}/api/stats/system`);
// //         setSystemStats(res.data);
// //       } catch (err) {
// //         console.error("Error fetching stats:", err);
// //       } finally {
// //         setStatsLoading(false);
// //       }
// //     };
// //     fetchStats();
// //   }, []);

// //   useEffect(() => {
// //     if (isPlaying) {
// //       intervalRef.current = setInterval(() => {
// //         setCurrentSlide(prev => (prev + 1) % slides.length);
// //       }, 5000);
// //     }
// //     return () => clearInterval(intervalRef.current);
// //   }, [isPlaying]);

// //   const goToSlide = (index) => {
// //     setCurrentSlide(index);
// //     setIsPlaying(false);
// //     setTimeout(() => setIsPlaying(true), 8000);
// //   };

// //   const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
// //   const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case "Resolved": return "bg-green-100 text-green-800 border border-green-200";
// //       case "Pending": return "bg-amber-100 text-amber-800 border border-amber-200";
// //       case "In Progress": return "bg-blue-100 text-blue-800 border border-blue-200";
// //       default: return "bg-gray-100 text-gray-700";
// //     }
// //   };

// //   const getPriorityDot = (priority) => {
// //     switch (priority) {
// //       case "high": return "bg-red-500";
// //       case "medium": return "bg-yellow-500";
// //       case "low": return "bg-green-500";
// //       default: return "bg-gray-400";
// //     }
// //   };

// //   const slide = slides[currentSlide];

// //   return (
// //     <div className="min-h-screen bg-gray-50">

// //       {/* ── HERO SLIDER ─────────────────────────────────────────── */}
// //       <section className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-700`} style={{ minHeight: "580px" }}>

// //         {/* Decorative background pattern */}
// //         <div className="absolute inset-0 opacity-5 pointer-events-none">
// //           {slide.pattern === "circles" && (
// //             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
// //               <defs><pattern id="p1" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
// //                 <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="1"/>
// //                 <circle cx="0" cy="0" r="15" fill="none" stroke="white" strokeWidth="0.5"/>
// //               </pattern></defs>
// //               <rect width="100%" height="100%" fill="url(#p1)"/>
// //             </svg>
// //           )}
// //           {slide.pattern === "grid" && (
// //             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
// //               <defs><pattern id="p2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
// //                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8"/>
// //               </pattern></defs>
// //               <rect width="100%" height="100%" fill="url(#p2)"/>
// //             </svg>
// //           )}
// //           {slide.pattern === "dots" && (
// //             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
// //               <defs><pattern id="p3" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
// //                 <circle cx="3" cy="3" r="1.5" fill="white"/>
// //               </pattern></defs>
// //               <rect width="100%" height="100%" fill="url(#p3)"/>
// //             </svg>
// //           )}
// //         </div>

// //         {/* Glowing orb */}
// //         <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-white pointer-events-none" />
// //         <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-2xl bg-blue-300 pointer-events-none" />

// //         <div className="relative z-10 container mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-16">

// //           {/* Left content */}
// //           <div className="flex-1 text-white" key={currentSlide}>
// //             {/* Badge */}
// //             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-100 mb-6 font-medium">
// //               <FaShieldAlt className="text-xs" />
// //               {slide.badge}
// //             </div>

// //             {/* Headline */}
// //             <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight"
// //               style={{ fontFamily: "'Georgia', serif" }}>
// //               {slide.title}<br />
// //               <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">
// //                 {slide.titleAccent}
// //               </span>
// //             </h1>

// //             <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-xl">
// //               {slide.subtitle}
// //             </p>

// //             <div className="flex flex-wrap gap-4">
// //               <button
// //                 onClick={() => navigate(slide.ctaPath)}
// //                 className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm"
// //               >
// //                 {slide.cta} <FaArrowRight />
// //               </button>
// //               <button
// //                 onClick={() => navigate(slide.secondaryPath)}
// //                 className="border border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
// //               >
// //                 {slide.secondaryCta}
// //               </button>
// //             </div>
// //           </div>

// //           {/* Right: stat panel */}
// //           <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
// //             <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-5 flex items-center gap-2">
// //               <FaChartLine /> Platform Statistics
// //             </h3>
// //             <div className="space-y-4">
// //               {[
// //                 { label: "Registered Citizens", value: statsLoading ? "—" : `${systemStats.totalUsers}+`, icon: <FaUsers className="text-sky-300" /> },
// //                 { label: "Complaints Resolved", value: statsLoading ? "—" : `${systemStats.resolvedComplaints}+`, icon: <FaCheckCircle className="text-green-300" /> },
// //                 { label: "Pending Cases", value: statsLoading ? "—" : systemStats.pendingComplaints, icon: <FaClock className="text-yellow-300" /> },
// //                 { label: "Resolution Rate", value: statsLoading ? "—" : `${systemStats.resolutionRate}%`, icon: <FaChartLine className="text-blue-300" /> },
// //               ].map((item, i) => (
// //                 <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
// //                   <div className="flex items-center gap-2 text-sm text-blue-100">
// //                     {item.icon}
// //                     {item.label}
// //                   </div>
// //                   <span className="font-bold text-lg">{item.value}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Slide controls */}
// //         <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-20">
// //           <button onClick={prevSlide} className="text-white/60 hover:text-white transition p-1">
// //             <FaChevronLeft />
// //           </button>
// //           <div className="flex gap-2">
// //             {slides.map((_, i) => (
// //               <button
// //                 key={i}
// //                 onClick={() => goToSlide(i)}
// //                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-3 bg-white/40"}`}
// //               />
// //             ))}
// //           </div>
// //           <button onClick={nextSlide} className="text-white/60 hover:text-white transition p-1">
// //             <FaChevronRight />
// //           </button>
// //           <button
// //             onClick={() => setIsPlaying(p => !p)}
// //             className="text-white/50 hover:text-white transition ml-1 p-1"
// //           >
// //             {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
// //           </button>
// //         </div>
// //       </section>

// //       {/* ── QUICK ACTIONS STRIP ────────────────────────────────── */}
// //       <section className="bg-white border-b border-gray-200 shadow-sm">
// //         <div className="container mx-auto px-8">
// //           <div className="flex flex-wrap divide-x divide-gray-100">
// //             {[
// //               { label: "File a Complaint", icon: <FaClipboardList />, path: "/complaints", color: "text-blue-600" },
// //               { label: "Browse Services", icon: <FaCogs />, path: "/services", color: "text-indigo-600" },
// //               { label: "My Documents", icon: <FaFileAlt />, path: "/documents", color: "text-teal-600" },
// //             ].map((item, i) => (
// //               <button
// //                 key={i}
// //                 onClick={() => navigate(item.path)}
// //                 className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold ${item.color} hover:bg-gray-50 transition`}
// //               >
// //                 {item.icon} {item.label}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── FEATURES ───────────────────────────────────────────── */}
// //       <section className="py-20 px-8 bg-gray-50">
// //         <div className="container mx-auto">
// //           <div className="text-center mb-14">
// //             <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
// //             <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
// //               One Platform, All Services
// //             </h2>
// //             <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
// //               ShebaConnect brings together the most important government services into a single, easy-to-use platform.
// //             </p>
// //           </div>

// //           <div className="grid md:grid-cols-3 gap-8">
// //             {features.map((f, i) => (
// //               <div
// //                 key={i}
// //                 onClick={() => navigate(f.path)}
// //                 className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
// //               >
// //                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl mb-6 bg-${f.color}-600 group-hover:scale-110 transition-transform`}>
// //                   {f.icon}
// //                 </div>
// //                 <div className={`text-xs font-bold text-${f.color}-600 uppercase tracking-wider mb-2`}>{f.stat}</div>
// //                 <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
// //                 <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.description}</p>
// //                 <div className={`flex items-center gap-1 text-${f.color}-600 text-sm font-semibold group-hover:gap-2 transition-all`}>
// //                   Access Now <FaArrowRight size={12} />
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── HOW IT WORKS ───────────────────────────────────────── */}
// //       <section className="py-20 px-8 bg-white">
// //         <div className="container mx-auto">
// //           <div className="text-center mb-14">
// //             <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Process</p>
// //             <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
// //               How It Works
// //             </h2>
// //           </div>
// //           <div className="grid md:grid-cols-4 gap-6">
// //             {[
// //               { step: "01", title: "Register", desc: "Create your account with your NID and contact details.", icon: "👤" },
// //               { step: "02", title: "Submit", desc: "File a complaint or request a service in minutes.", icon: "📋" },
// //               { step: "03", title: "Track", desc: "Monitor real-time updates and status changes.", icon: "🔍" },
// //               { step: "04", title: "Resolve", desc: "Receive resolution and provide feedback.", icon: "✅" },
// //             ].map((item, i) => (
// //               <div key={i} className="relative text-center">
// //                 {i < 3 && (
// //                   <div className="hidden md:block absolute top-8 left-2/3 right-0 h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
// //                 )}
// //                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-blue-100">
// //                   {item.icon}
// //                 </div>
// //                 <div className="text-xs font-black text-blue-300 tracking-widest mb-2">{item.step}</div>
// //                 <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
// //                 <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── DEPARTMENTS ────────────────────────────────────────── */}
// //       <section className="py-20 px-8 bg-gray-50">
// //         <div className="container mx-auto">
// //           <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
// //             <div>
// //               <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Coverage</p>
// //               <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
// //                 Departments We Cover
// //               </h2>
// //             </div>
// //             <button
// //               onClick={() => navigate("/services")}
// //               className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
// //             >
// //               View All Services <FaArrowRight size={12} />
// //             </button>
// //           </div>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             {departments.map((dept, i) => (
// //               <button
// //                 key={i}
// //                 onClick={() => navigate("/complaints")}
// //                 className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold hover:shadow-md transition-all text-left ${dept.color}`}
// //               >
// //                 <span className="text-xl">{dept.icon}</span>
// //                 {dept.name}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── RECENT COMPLAINTS ──────────────────────────────────── */}
// //       <section className="py-20 px-8 bg-white">
// //         <div className="container mx-auto">
// //           <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
// //             <div>
// //               <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Activity</p>
// //               <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
// //                 Recent Complaints
// //               </h2>
// //             </div>
// //             <button
// //               onClick={() => navigate("/complaints")}
// //               className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
// //             >
// //               View All <FaArrowRight size={12} />
// //             </button>
// //           </div>

// //           <div className="space-y-3">
// //             {recentComplaints.map((c) => (
// //               <div
// //                 key={c.id}
// //                 className="flex items-center gap-5 bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 hover:shadow-sm hover:border-blue-100 transition cursor-pointer group"
// //                 onClick={() => navigate("/complaints")}
// //               >
// //                 <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getPriorityDot(c.priority)}`} />
// //                 <div className="flex-1 min-w-0">
// //                   <div className="flex items-center gap-2 mb-0.5">
// //                     <span className="font-semibold text-gray-900 text-sm truncate">{c.issue}</span>
// //                   </div>
// //                   <span className="text-xs text-gray-400">{c.department} · {c.date}</span>
// //                 </div>
// //                 <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${getStatusStyle(c.status)}`}>
// //                   {c.status}
// //                 </span>
// //                 <FaArrowRight size={12} className="text-gray-300 group-hover:text-blue-500 transition flex-shrink-0" />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ── CTA BANNER ─────────────────────────────────────────── */}
// //       <section className="py-20 px-8 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
// //         <div className="container mx-auto text-center">
// //           <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
// //             <FaShieldAlt size={12} /> Secure · Transparent · Accountable
// //           </div>
// //           <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Georgia', serif" }}>
// //             Ready to Get Started?
// //           </h2>
// //           <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
// //             Join thousands of citizens already using ShebaConnect to access government services faster and more efficiently.
// //           </p>

// //           {/* Live stats row */}
// //           <div className="flex flex-wrap justify-center gap-10 mb-12">
// //             {[
// //               { val: statsLoading ? "—" : `${systemStats.totalUsers}+`, label: "Citizens Registered" },
// //               { val: statsLoading ? "—" : `${systemStats.resolvedComplaints}+`, label: "Complaints Resolved" },
// //               { val: "50+", label: "Services Available" },
// //             ].map((s, i) => (
// //               <div key={i} className="text-center">
// //                 <div className="text-4xl font-black mb-1">{s.val}</div>
// //                 <div className="text-blue-300 text-sm">{s.label}</div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="flex flex-wrap justify-center gap-4">
// //             <button
// //               onClick={() => navigate(user ? "/complaints" : "/register")}
// //               className="bg-white text-blue-900 px-10 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
// //             >
// //               <FaClipboardList /> {user ? "File a Complaint" : "Create Account"}
// //             </button>
// //             <button
// //               onClick={() => navigate("/services")}
// //               className="border border-white/30 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
// //             >
// //               <FaCogs /> Browse Services
// //             </button>
// //           </div>
// //         </div>
// //       </section>

// //       <style>{`
// //         @keyframes fadeSlideUp {
// //           from { opacity: 0; transform: translateY(24px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }
// //         section { animation: fadeSlideUp 0.5s ease-out; }
// //       `}</style>
// //     </div>
// //   );
// // }


// import API from "../config/api";
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useInView } from "react-intersection-observer";
// import {
//   FaClipboardList,
//   FaCogs,
//   FaFileAlt,
//   FaArrowRight,
//   FaCheckCircle,
//   FaClock,
//   FaChartLine,
//   FaUsers,
//   FaShieldAlt,
//   FaChevronLeft,
//   FaChevronRight,
//   FaPlay,
//   FaPause,
// } from "react-icons/fa";

// // ─── Animated Section Component ───────────────────────────────
// function AnimatedSection({ children, className = "", delay = 0 }) {
//   const { ref, inView } = useInView({
//     threshold: 0.15,
//     triggerOnce: false,
//   });

//   return (
//     <div
//       ref={ref}
//       className={`scroll-section ${inView ? "in-view" : "out-of-view"} ${className}`}
//       style={{ transitionDelay: `${delay}ms` }}
//     >
//       {children}
//     </div>
//   );
// }

// // ─── Counter animation ─────────────────────────────────────────
// function useCounter(target, duration = 2000) {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const startTime = performance.now();
//     const startValue = 0;
//     const endValue = target;
//     const animate = (time) => {
//       const elapsed = time - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.floor(startValue + (endValue - startValue) * eased));
//       if (progress < 1) requestAnimationFrame(animate);
//     };
//     requestAnimationFrame(animate);
//   }, [target, duration]);
//   return count;
// }

// // ─── Slide data ──────────────────────────────────────────────
// const slides = [
//   {
//     id: 1,
//     badge: "Government of Bangladesh",
//     title: "Your Voice,",
//     titleAccent: "Government's Action",
//     subtitle:
//       "Submit complaints, track progress, and get resolutions — all in one secure platform built for citizens of Bangladesh.",
//     cta: "File a Complaint",
//     ctaPath: "/complaints",
//     secondaryCta: "Browse Services",
//     secondaryPath: "/services",
//     bg: `bg-gradient-to-br from-[#1A2A24] via-[#2A3A34] to-[#3A4A44]`,
//     accent: `bg-gradient-to-r from-[#A1BC98] to-[#778873]`,
//   },
//   {
//     id: 2,
//     badge: "Smart Service Navigation",
//     title: "Find the Right",
//     titleAccent: "Government Service",
//     subtitle:
//       "Navigate hundreds of government services effortlessly. Get AI-powered guidance tailored to your specific needs.",
//     cta: "Explore Services",
//     ctaPath: "/services",
//     secondaryCta: "Learn More",
//     secondaryPath: "/",
//     bg: `bg-gradient-to-br from-[#1A2A24] via-[#2A3A34] to-[#778873]`,
//     accent: `bg-gradient-to-r from-[#A1BC98] to-[#DCCFC0]`,
//   },
//   {
//     id: 3,
//     badge: "Document Management",
//     title: "Secure Digital",
//     titleAccent: "Document Vault",
//     subtitle:
//       "Store, manage, and access your important government documents anytime. Your data is encrypted and always available.",
//     cta: "Manage Documents",
//     ctaPath: "/documents",
//     secondaryCta: "Learn More",
//     secondaryPath: "/",
//     bg: `bg-gradient-to-br from-[#1A2A24] via-[#2A3A34] to-[#A1BC98]`,
//     accent: `bg-gradient-to-r from-[#778873] to-[#DCCFC0]`,
//   },
// ];

// // ─── Feature data ────────────────────────────────────────────
// const features = [
//   {
//     icon: <FaClipboardList />,
//     title: "Complaint Tracking",
//     description:
//       "Submit and track complaints with real‑time status updates and transparent timelines.",
//     path: "/complaints",
//     color: "text-[#DCCFC0]",
//     stat: "Real‑time updates",
//     gradient: "from-[#A1BC98] to-[#778873]",
//   },
//   {
//     icon: <FaCogs />,
//     title: "Service Guidance",
//     description:
//       "AI‑powered recommendations to navigate government services quickly and efficiently.",
//     path: "/services",
//     color: "text-[#DCCFC0]",
//     stat: "50+ services",
//     gradient: "from-[#778873] to-[#A1BC98]",
//   },
//   {
//     icon: <FaFileAlt />,
//     title: "Document Management",
//     description:
//       "Securely store and manage your government documents in one centralized location.",
//     path: "/documents",
//     color: "text-[#DCCFC0]",
//     stat: "256‑bit encryption",
//     gradient: "from-[#A1BC98] to-[#2A3A34]",
//   },
// ];

// const departments = [
//   { name: "Passport Office", icon: "🛂", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Electricity Board", icon: "⚡", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Water Supply", icon: "💧", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Road Maintenance", icon: "🛣️", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Health Services", icon: "🏥", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Education Dept.", icon: "📚", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Revenue Office", icon: "🏛️", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
//   { name: "Municipal Corp.", icon: "🏙️", color: "bg-[#2A3A34] text-[#DCCFC0] border-[#A1BC98] hover:bg-[#3A4A44]" },
// ];

// export default function Home({ user }) {
//   const navigate = useNavigate();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [systemStats, setSystemStats] = useState({
//     totalUsers: 0,
//     resolvedComplaints: 0,
//     pendingComplaints: 0,
//     resolutionRate: 0,
//   });
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [recentComplaints] = useState([
//     { id: 1, department: "Water Supply", issue: "No water supply for 3 days", status: "Pending", date: "2026-04-10", priority: "high" },
//     { id: 2, department: "Electricity", issue: "Power outage in block C", status: "Resolved", date: "2026-04-09", priority: "medium" },
//     { id: 3, department: "Road Maintenance", issue: "Large pothole near school", status: "In Progress", date: "2026-04-08", priority: "high" },
//     { id: 4, department: "Waste Management", issue: "Garbage not collected", status: "Pending", date: "2026-04-07", priority: "low" },
//   ]);
//   const intervalRef = useRef(null);

//   const animatedTotalUsers = useCounter(systemStats.totalUsers, 1500);
//   const animatedResolved = useCounter(systemStats.resolvedComplaints, 1500);
//   const animatedPending = useCounter(systemStats.pendingComplaints, 1500);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axios.get(`${API}/api/stats/system`);
//         setSystemStats(res.data);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       } finally {
//         setStatsLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     if (isPlaying) {
//       intervalRef.current = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//       }, 5000);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [isPlaying]);

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     setIsPlaying(false);
//     setTimeout(() => setIsPlaying(true), 8000);
//   };

//   const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
//   const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Resolved":
//         return "bg-[#A1BC98] text-[#1A2A24] border-[#778873]";
//       case "Pending":
//         return "bg-[#DCCFC0] text-[#1A2A24] border-[#DCCFC0]";
//       case "In Progress":
//         return "bg-[#778873] text-[#FDF6ED] border-[#778873]";
//       default:
//         return "bg-[#2A3A34] text-[#DCCFC0]";
//     }
//   };

//   const getPriorityDot = (priority) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-400";
//       case "medium":
//         return "bg-yellow-400";
//       case "low":
//         return "bg-green-400";
//       default:
//         return "bg-gray-400";
//     }
//   };

//   const slide = slides[currentSlide];

//   return (
//     <div className="min-h-screen bg-[#1A2A24] text-[#DCCFC0] overflow-x-hidden">

//       {/* ── HERO SLIDER ─────────────────────────────────────────── */}
//       <section
//         className={`relative overflow-hidden ${slide.bg} transition-colors duration-700`}
//         style={{ minHeight: "620px" }}
//       >
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="heroPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
//                 <path d="M 30 0 L 0 30 30 60 60 30 Z" fill="none" stroke="#A1BC98" strokeWidth="0.8" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#heroPattern)" />
//           </svg>
//         </div>
//         <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-[#A1BC98] pointer-events-none" />

//         <div className="relative z-10 container mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-16">
//           {/* ── Left content with fade‑in animation ── */}
//           <div
//             className="flex-1 text-white animate-fadeInUp"
//             key={currentSlide}
//           >
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-[#DCCFC0] mb-6 font-medium">
//               <FaShieldAlt className="text-xs" />
//               {slide.badge}
//             </div>
//             <h1
//               className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight"
//               style={{ fontFamily: "'Georgia', serif" }}
//             >
//               {slide.title}<br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A1BC98] to-[#DCCFC0]">
//                 {slide.titleAccent}
//               </span>
//             </h1>
//             <p className="text-[#DCCFC0] text-lg leading-relaxed mb-10 max-w-xl">
//               {slide.subtitle}
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => navigate(slide.ctaPath)}
//                 className={`${slide.accent} text-[#FDF6ED] px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 text-sm`}
//               >
//                 {slide.cta} <FaArrowRight />
//               </button>
//               <button
//                 onClick={() => navigate(slide.secondaryPath)}
//                 className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
//               >
//                 {slide.secondaryCta}
//               </button>
//             </div>
//           </div>

//           {/* Stats panel */}
//           <div className="w-full lg:w-80 bg-[#2A3A34]/80 backdrop-blur-xl border border-[#A1BC98]/40 rounded-2xl p-6 text-[#DCCFC0] shadow-2xl">
//             <h3 className="text-sm font-semibold text-[#A1BC98] uppercase tracking-wider mb-5 flex items-center gap-2">
//               <FaChartLine /> Platform Stats
//             </h3>
//             <div className="space-y-4">
//               {[
//                 { label: "Registered Citizens", value: statsLoading ? "—" : animatedTotalUsers + "+", icon: <FaUsers className="text-[#A1BC98]" /> },
//                 { label: "Complaints Resolved", value: statsLoading ? "—" : animatedResolved + "+", icon: <FaCheckCircle className="text-[#A1BC98]" /> },
//                 { label: "Pending Cases", value: statsLoading ? "—" : animatedPending, icon: <FaClock className="text-[#A1BC98]" /> },
//                 { label: "Resolution Rate", value: statsLoading ? "—" : `${systemStats.resolutionRate}%`, icon: <FaChartLine className="text-[#A1BC98]" /> },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm hover:bg-white/15 transition">
//                   <div className="flex items-center gap-2 text-sm text-[#DCCFC0]">
//                     {item.icon} {item.label}
//                   </div>
//                   <span className="font-bold text-lg text-[#FDF6ED]">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Slider controls */}
//         <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-20">
//           <button onClick={prevSlide} className="text-white/60 hover:text-white transition p-1">
//             <FaChevronLeft />
//           </button>
//           <div className="flex gap-2">
//             {slides.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => goToSlide(i)}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-[#A1BC98]" : "w-3 bg-white/40"}`}
//               />
//             ))}
//           </div>
//           <button onClick={nextSlide} className="text-white/60 hover:text-white transition p-1">
//             <FaChevronRight />
//           </button>
//           <button
//             onClick={() => setIsPlaying((p) => !p)}
//             className="text-white/50 hover:text-white transition ml-1 p-1"
//           >
//             {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
//           </button>
//         </div>
//       </section>

//       {/* ── QUICK ACTIONS STRIP ────────────────────────────────── */}
//       <AnimatedSection className="bg-[#2A3A34]/90 backdrop-blur border-b border-[#A1BC98]/30 sticky top-0 z-30">
//         <div className="container mx-auto px-8">
//           <div className="flex flex-wrap divide-x divide-[#A1BC98]/30">
//             {[
//               { label: "File a Complaint", icon: <FaClipboardList />, path: "/complaints" },
//               { label: "Browse Services", icon: <FaCogs />, path: "/services" },
//               { label: "My Documents", icon: <FaFileAlt />, path: "/documents" },
//             ].map((item, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate(item.path)}
//                 className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[#DCCFC0] hover:text-[#FDF6ED] hover:bg-[#3A4A44] transition"
//               >
//                 {item.icon} {item.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── FEATURES ───────────────────────────────────────────── */}
//       <AnimatedSection className="py-20 px-8 bg-[#1A2A24]">
//         <div className="container mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#A1BC98] text-[#1A2A24] rounded-full mb-3">
//               What We Offer
//             </span>
//             <h2 className="text-4xl font-black text-[#DCCFC0] mb-4" style={{ fontFamily: "'Georgia', serif" }}>
//               One Platform, All Services
//             </h2>
//             <p className="text-[#DCCFC0]/70 max-w-xl mx-auto leading-relaxed">
//               ShebaConnect brings together the most important government services into a single, easy-to-use platform.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((f, i) => (
//               <div
//                 key={i}
//                 onClick={() => navigate(f.path)}
//                 className="group relative bg-[#2A3A34] rounded-2xl p-8 border border-[#A1BC98]/30 shadow-lg hover:shadow-[#A1BC98]/20 hover:border-[#A1BC98] transition-all cursor-pointer hover:-translate-y-2"
//               >
//                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[#FDF6ED] text-xl mb-6 bg-gradient-to-br ${f.gradient} group-hover:scale-110 transition-transform shadow-lg`}>
//                   {f.icon}
//                 </div>
//                 <div className="text-xs font-bold text-[#A1BC98] uppercase tracking-wider mb-2">{f.stat}</div>
//                 <h3 className="text-xl font-bold text-[#FDF6ED] mb-3">{f.title}</h3>
//                 <p className="text-[#DCCFC0]/80 text-sm leading-relaxed mb-5">{f.description}</p>
//                 <div className="flex items-center gap-1 text-[#A1BC98] text-sm font-semibold group-hover:gap-3 transition-all">
//                   Access Now <FaArrowRight size={12} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── HOW IT WORKS ───────────────────────────────────────── */}
//       <AnimatedSection className="py-20 px-8 bg-[#2A3A34]">
//         <div className="container mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#778873] text-[#FDF6ED] rounded-full mb-3">
//               Process
//             </span>
//             <h2 className="text-4xl font-black text-[#DCCFC0]" style={{ fontFamily: "'Georgia', serif" }}>
//               How It Works
//             </h2>
//           </div>
//           <div className="grid md:grid-cols-4 gap-6">
//             {[
//               { step: "01", title: "Register", desc: "Create your account with your NID and contact details.", icon: "👤" },
//               { step: "02", title: "Submit", desc: "File a complaint or request a service in minutes.", icon: "📋" },
//               { step: "03", title: "Track", desc: "Monitor real‑time updates and status changes.", icon: "🔍" },
//               { step: "04", title: "Resolve", desc: "Receive resolution and provide feedback.", icon: "✅" },
//             ].map((item, i) => (
//               <div key={i} className="relative text-center group">
//                 {i < 3 && (
//                   <div className="hidden md:block absolute top-8 left-2/3 right-0 h-0.5 bg-gradient-to-r from-[#A1BC98] to-transparent" />
//                 )}
//                 <div className="w-16 h-16 bg-[#1A2A24] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-[#A1BC98] group-hover:scale-110 transition-transform shadow-md">
//                   {item.icon}
//                 </div>
//                 <div className="text-xs font-black text-[#A1BC98] tracking-widest mb-2">{item.step}</div>
//                 <h4 className="font-bold text-[#FDF6ED] mb-2">{item.title}</h4>
//                 <p className="text-[#DCCFC0]/80 text-sm leading-relaxed">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── DEPARTMENTS ────────────────────────────────────────── */}
//       <AnimatedSection className="py-20 px-8 bg-[#1A2A24]">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
//             <div>
//               <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#A1BC98] text-[#1A2A24] rounded-full mb-3">
//                 Coverage
//               </span>
//               <h2 className="text-4xl font-black text-[#DCCFC0]" style={{ fontFamily: "'Georgia', serif" }}>
//                 Departments We Cover
//               </h2>
//             </div>
//             <button
//               onClick={() => navigate("/services")}
//               className="text-[#A1BC98] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
//             >
//               View All Services <FaArrowRight size={12} />
//             </button>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {departments.map((dept, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate("/complaints")}
//                 className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold hover:shadow-md transition-all text-left ${dept.color}`}
//               >
//                 <span className="text-xl">{dept.icon}</span>
//                 {dept.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── RECENT COMPLAINTS ──────────────────────────────────── */}
//       <AnimatedSection className="py-20 px-8 bg-[#2A3A34]">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//             <div>
//               <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#778873] text-[#FDF6ED] rounded-full mb-3">
//                 Activity
//               </span>
//               <h2 className="text-4xl font-black text-[#DCCFC0]" style={{ fontFamily: "'Georgia', serif" }}>
//                 Recent Complaints
//               </h2>
//             </div>
//             <button
//               onClick={() => navigate("/complaints")}
//               className="inline-flex items-center gap-2 bg-gradient-to-r from-[#A1BC98] to-[#778873] text-[#1A2A24] px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md text-sm"
//             >
//               View All <FaArrowRight size={12} />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {recentComplaints.map((c) => (
//               <div
//                 key={c.id}
//                 className="flex items-center gap-5 bg-[#1A2A24] border border-[#A1BC98]/30 rounded-xl px-6 py-4 hover:shadow-lg hover:border-[#A1BC98] transition-all cursor-pointer group"
//                 onClick={() => navigate("/complaints")}
//               >
//                 <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getPriorityDot(c.priority)}`} />
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-0.5">
//                     <span className="font-semibold text-[#FDF6ED] text-sm truncate">{c.issue}</span>
//                   </div>
//                   <span className="text-xs text-[#DCCFC0]">{c.department} · {c.date}</span>
//                 </div>
//                 <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${getStatusStyle(c.status)}`}>
//                   {c.status}
//                 </span>
//                 <FaArrowRight size={12} className="text-[#A1BC98] group-hover:text-[#FDF6ED] transition flex-shrink-0" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── CTA BANNER ──────────────────────────────────────────── */}
//       <AnimatedSection className="py-20 px-8 bg-gradient-to-br from-[#1A2A24] via-[#2A3A34] to-[#1A2A24] text-[#FDF6ED] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-5">
//           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="ctaGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#A1BC98" strokeWidth="0.5" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#ctaGrid)" />
//           </svg>
//         </div>
//         <div className="relative z-10 container mx-auto text-center">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-[#DCCFC0] mb-6">
//             <FaShieldAlt size={12} /> Secure · Transparent · Accountable
//           </div>
//           <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Georgia', serif" }}>
//             Ready to Get Started?
//           </h2>
//           <p className="text-[#DCCFC0] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
//             Join thousands of citizens already using ShebaConnect to access government services faster and more efficiently.
//           </p>

//           <div className="flex flex-wrap justify-center gap-10 mb-12">
//             {[
//               { val: statsLoading ? "—" : `${systemStats.totalUsers}+`, label: "Citizens Registered" },
//               { val: statsLoading ? "—" : `${systemStats.resolvedComplaints}+`, label: "Complaints Resolved" },
//               { val: "50+", label: "Services Available" },
//             ].map((s, i) => (
//               <div key={i} className="text-center">
//                 <div className="text-4xl font-black mb-1 bg-gradient-to-r from-[#A1BC98] to-[#DCCFC0] text-transparent bg-clip-text">
//                   {s.val}
//                 </div>
//                 <div className="text-[#DCCFC0] text-sm">{s.label}</div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4">
//             <button
//               onClick={() => navigate(user ? "/complaints" : "/register")}
//               className="bg-[#A1BC98] text-[#1A2A24] px-10 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
//             >
//               <FaClipboardList /> {user ? "File a Complaint" : "Create Account"}
//             </button>
//             <button
//               onClick={() => navigate("/services")}
//               className="border border-white/30 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
//             >
//               <FaCogs /> Browse Services
//             </button>
//           </div>
//         </div>
//       </AnimatedSection>

//       {/* ── FOOTER ──────────────────────────────────────────────── */}
//       <AnimatedSection className="bg-[#1A2A24] text-[#DCCFC0] py-12 px-8 border-t border-[#A1BC98]/30">
//         <div className="container mx-auto grid md:grid-cols-4 gap-8">
//           <div>
//             <h4 className="text-[#FDF6ED] font-bold text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>
//               Sheba<span className="text-[#A1BC98]">Connect</span>
//             </h4>
//             <p className="text-sm leading-relaxed">Government of Bangladesh · Citizen Grievance Redressal System</p>
//           </div>
//           <div>
//             <h5 className="text-[#FDF6ED] font-semibold mb-3">Quick Links</h5>
//             <ul className="space-y-2 text-sm">
//               <li><button onClick={() => navigate("/complaints")} className="hover:text-[#FDF6ED] transition">Complaints</button></li>
//               <li><button onClick={() => navigate("/services")} className="hover:text-[#FDF6ED] transition">Services</button></li>
//               <li><button onClick={() => navigate("/documents")} className="hover:text-[#FDF6ED] transition">Documents</button></li>
//             </ul>
//           </div>
//           <div>
//             <h5 className="text-[#FDF6ED] font-semibold mb-3">Support</h5>
//             <ul className="space-y-2 text-sm">
//               <li>📞 16182</li>
//               <li>✉️ support@shebaconnect.gov.bd</li>
//             </ul>
//           </div>
//           <div>
//             <h5 className="text-[#FDF6ED] font-semibold mb-3">Follow Us</h5>
//             <div className="flex gap-3 text-xl">
//               <span className="hover:text-[#FDF6ED] transition">🐦</span>
//               <span className="hover:text-[#FDF6ED] transition">📘</span>
//               <span className="hover:text-[#FDF6ED] transition">📸</span>
//             </div>
//           </div>
//         </div>
//         <div className="container mx-auto mt-8 pt-6 border-t border-[#A1BC98]/30 text-xs text-[#DCCFC0]/50 text-center">
//           © {new Date().getFullYear()} ShebaConnect. All rights reserved.
//         </div>
//       </AnimatedSection>

//       {/* ── Global Scroll Animation Styles ────────────────────── */}
//       <style>{`
//         /* Default hidden state */
//         .scroll-section {
//           opacity: 0;
//           transform: translateY(40px) scale(0.95);
//           transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
//                       transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//           will-change: transform, opacity;
//         }

//         /* In view: pop up */
//         .scroll-section.in-view {
//           opacity: 1;
//           transform: translateY(0) scale(1);
//         }

//         /* Out of view: merge */
//         .scroll-section.out-of-view {
//           opacity: 0;
//           transform: translateY(-20px) scale(0.95);
//         }

//         /* Hero slider text animation */
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeInUp {
//           animation: fadeInUp 0.8s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }



import API from "../config/api";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import {
  FaClipboardList,
  FaCogs,
  FaFileAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";

function AnimatedSection({ children, className = "", delay = 0 }) {
  const { ref, inView } = useInView({
    threshold: 0.15,
    triggerOnce: false,
  });

  return (
    <div
      ref={ref}
      className={`scroll-section ${inView ? "in-view" : "out-of-view"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;
    const endValue = target;
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (endValue - startValue) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return count;
}

const slides = [
  {
    id: 1,
    badge: "Government of Bangladesh",
    title: "Your Voice,",
    titleAccent: "Government's Action",
    subtitle:
      "Submit complaints, track progress, and get resolutions — all in one secure platform built for citizens of Bangladesh.",
    cta: "File a Complaint",
    ctaPath: "/complaints",
    secondaryCta: "Browse Services",
    secondaryPath: "/services",
    bg: `bg-gradient-to-br from-[#14373D] via-[#21464B] to-[#3E5758]`,
    accent: `bg-gradient-to-r from-[#EAB29F] to-[#CCE3DE]`,
  },
  {
    id: 2,
    badge: "Smart Service Navigation",
    title: "Find the Right",
    titleAccent: "Government Service",
    subtitle:
      "Navigate hundreds of government services effortlessly. Get AI-powered guidance tailored to your specific needs.",
    cta: "Explore Services",
    ctaPath: "/services",
    secondaryCta: "Learn More",
    secondaryPath: "/",
    bg: `bg-gradient-to-br from-[#14373D] via-[#21464B] to-[#3E5758]`,
    accent: `bg-gradient-to-r from-[#EAB29F] to-[#E5D4C0]`,
  },
  {
    id: 3,
    badge: "Document Management",
    title: "Secure Digital",
    titleAccent: "Document Vault",
    subtitle:
      "Store, manage, and access your important government documents anytime. Your data is encrypted and always available.",
    cta: "Manage Documents",
    ctaPath: "/documents",
    secondaryCta: "Learn More",
    secondaryPath: "/",
    bg: `bg-gradient-to-br from-[#14373D] via-[#21464B] to-[#3E5758]`,
    accent: `bg-gradient-to-r from-[#CCE3DE] to-[#EAB29F]`,
  },
];

const features = [
  {
    icon: <FaClipboardList />,
    title: "Complaint Tracking",
    description:
      "Submit and track complaints with real‑time status updates and transparent timelines.",
    path: "/complaints",
    stat: "Real‑time updates",
    gradient: "from-[#769e7c] to-[#9dc8b9]",
  },
  {
    icon: <FaCogs />,
    title: "Service Guidance",
    description:
      "AI‑powered recommendations to navigate government services quickly and efficiently.",
    path: "/services",
    stat: "50+ services",
    gradient: "from-[#9dc8b9] to-[#769e7c]",
  },
  {
    icon: <FaFileAlt />,
    title: "Document Management",
    description:
      "Securely store and manage your government documents in one centralized location.",
    path: "/documents",
    stat: "256‑bit encryption",
    gradient: "from-[#769e7c] to-[#2a332b]",
  },
];

const departments = [
  { name: "Passport Office", icon: "🛂", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Electricity Board", icon: "⚡", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Water Supply", icon: "💧", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Road Maintenance", icon: "🛣️", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Health Services", icon: "🏥", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Education Dept.", icon: "📚", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Revenue Office", icon: "🏛️", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
  { name: "Municipal Corp.", icon: "🏙️", color: "bg-[#3A4A3A] text-[#fee8c8] border-[#769e7c] hover:bg-[#4A5A4A]" },
];

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    resolutionRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentComplaints] = useState([
    { id: 1, department: "Water Supply", issue: "No water supply for 3 days", status: "Pending", date: "2026-04-10", priority: "high" },
    { id: 2, department: "Electricity", issue: "Power outage in block C", status: "Resolved", date: "2026-04-09", priority: "medium" },
    { id: 3, department: "Road Maintenance", issue: "Large pothole near school", status: "In Progress", date: "2026-04-08", priority: "high" },
    { id: 4, department: "Waste Management", issue: "Garbage not collected", status: "Pending", date: "2026-04-07", priority: "low" },
  ]);
  const intervalRef = useRef(null);

  const animatedTotalUsers = useCounter(systemStats.totalUsers, 1500);
  const animatedResolved = useCounter(systemStats.resolvedComplaints, 1500);
  const animatedPending = useCounter(systemStats.pendingComplaints, 1500);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/stats/system`);
        setSystemStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-[#769e7c] text-[#2a332b] border-[#9dc8b9]";
      case "Pending":
        return "bg-[#eab29f] text-[#2a332b] border-[#eab29f]";
      case "In Progress":
        return "bg-[#9dc8b9] text-[#2a332b] border-[#9dc8b9]";
      default:
        return "bg-[#3A4A3A] text-[#fee8c8]";
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#2a332b] text-[#fee8c8] overflow-x-hidden">
      {/* Hero Slider */}
      <section
        className={`relative overflow-hidden ${slide.bg} transition-colors duration-700`}
        style={{ minHeight: "620px" }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 30 30 60 60 30 Z" fill="none" stroke="#769e7c" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroPattern)" />
          </svg>
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-[#769e7c] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-[#fee8c8] animate-fadeInUp" key={currentSlide}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-[#9dc8b9] mb-6 font-medium">
              <FaShieldAlt className="text-xs" />
              {slide.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              {slide.title}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab29f] to-[#769e7c]">
                {slide.titleAccent}
              </span>
            </h1>
            <p className="text-[#9dc8b9] text-lg leading-relaxed mb-10 max-w-xl">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(slide.ctaPath)}
                className={`${slide.accent} text-[#2a332b] px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 text-sm`}
              >
                {slide.cta} <FaArrowRight />
              </button>
              <button
                onClick={() => navigate(slide.secondaryPath)}
                className="border border-white/30 text-[#fee8c8] px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
              >
                {slide.secondaryCta}
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <div className="w-full lg:w-80 bg-[#3A4A3A]/80 backdrop-blur-xl border border-[#769e7c]/40 rounded-2xl p-6 text-[#fee8c8] shadow-2xl">
            <h3 className="text-sm font-semibold text-[#9dc8b9] uppercase tracking-wider mb-5 flex items-center gap-2">
              <FaChartLine /> Platform Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: "Registered Citizens", value: statsLoading ? "—" : animatedTotalUsers + "+", icon: <FaUsers className="text-[#9dc8b9]" /> },
                { label: "Complaints Resolved", value: statsLoading ? "—" : animatedResolved + "+", icon: <FaCheckCircle className="text-[#9dc8b9]" /> },
                { label: "Pending Cases", value: statsLoading ? "—" : animatedPending, icon: <FaClock className="text-[#9dc8b9]" /> },
                { label: "Resolution Rate", value: statsLoading ? "—" : `${systemStats.resolutionRate}%`, icon: <FaChartLine className="text-[#9dc8b9]" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm hover:bg-white/15 transition">
                  <div className="flex items-center gap-2 text-sm text-[#fee8c8]">
                    {item.icon} {item.label}
                  </div>
                  <span className="font-bold text-lg text-[#fee8c8]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-20">
          <button onClick={prevSlide} className="text-white/60 hover:text-white transition p-1">
            <FaChevronLeft />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-[#eab29f]" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="text-white/60 hover:text-white transition p-1">
            <FaChevronRight />
          </button>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="text-white/50 hover:text-white transition ml-1 p-1"
          >
            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
          </button>
        </div>
      </section>

      {/* Quick Actions Strip */}
      <AnimatedSection className="bg-[#3A4A3A]/90 backdrop-blur border-b border-[#769e7c]/30 sticky top-0 z-30">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap divide-x divide-[#769e7c]/30">
            {[
              { label: "File a Complaint", icon: <FaClipboardList />, path: "/complaints" },
              { label: "Browse Services", icon: <FaCogs />, path: "/services" },
              { label: "My Documents", icon: <FaFileAlt />, path: "/documents" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[#9dc8b9] hover:text-[#fee8c8] hover:bg-[#4A5A4A] transition"
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection className="py-20 px-8 bg-[#2a332b]">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#769e7c] text-[#2a332b] rounded-full mb-3">
              What We Offer
            </span>
            <h2 className="text-4xl font-black text-[#fee8c8] mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              One Platform, All Services
            </h2>
            <p className="text-[#9dc8b9]/70 max-w-xl mx-auto leading-relaxed">
              ShebaConnect brings together the most important government services into a single, easy-to-use platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => navigate(f.path)}
                className="group relative bg-[#3A4A3A] rounded-2xl p-8 border border-[#769e7c]/30 shadow-lg hover:shadow-[#769e7c]/20 hover:border-[#769e7c] transition-all cursor-pointer hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[#2a332b] text-xl mb-6 bg-gradient-to-br ${f.gradient} group-hover:scale-110 transition-transform shadow-lg`}>
                  {f.icon}
                </div>
                <div className="text-xs font-bold text-[#9dc8b9] uppercase tracking-wider mb-2">{f.stat}</div>
                <h3 className="text-xl font-bold text-[#fee8c8] mb-3">{f.title}</h3>
                <p className="text-[#9dc8b9]/80 text-sm leading-relaxed mb-5">{f.description}</p>
                <div className="flex items-center gap-1 text-[#eab29f] text-sm font-semibold group-hover:gap-3 transition-all">
                  Access Now <FaArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="py-20 px-8 bg-[#3A4A3A]">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#9dc8b9] text-[#2a332b] rounded-full mb-3">
              Process
            </span>
            <h2 className="text-4xl font-black text-[#fee8c8]" style={{ fontFamily: "'Georgia', serif" }}>
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register", desc: "Create your account with your NID and contact details.", icon: "👤" },
              { step: "02", title: "Submit", desc: "File a complaint or request a service in minutes.", icon: "📋" },
              { step: "03", title: "Track", desc: "Monitor real‑time updates and status changes.", icon: "🔍" },
              { step: "04", title: "Resolve", desc: "Receive resolution and provide feedback.", icon: "✅" },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-2/3 right-0 h-0.5 bg-gradient-to-r from-[#769e7c] to-transparent" />
                )}
                <div className="w-16 h-16 bg-[#2a332b] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-[#769e7c] group-hover:scale-110 transition-transform shadow-md">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-[#769e7c] tracking-widest mb-2">{item.step}</div>
                <h4 className="font-bold text-[#fee8c8] mb-2">{item.title}</h4>
                <p className="text-[#9dc8b9]/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Departments */}
      <AnimatedSection className="py-20 px-8 bg-[#2a332b]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#769e7c] text-[#2a332b] rounded-full mb-3">
                Coverage
              </span>
              <h2 className="text-4xl font-black text-[#fee8c8]" style={{ fontFamily: "'Georgia', serif" }}>
                Departments We Cover
              </h2>
            </div>
            <button
              onClick={() => navigate("/services")}
              className="text-[#9dc8b9] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm"
            >
              View All Services <FaArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept, i) => (
              <button
                key={i}
                onClick={() => navigate("/complaints")}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold hover:shadow-md transition-all text-left ${dept.color}`}
              >
                <span className="text-xl">{dept.icon}</span>
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Recent Complaints */}
      <AnimatedSection className="py-20 px-8 bg-[#3A4A3A]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#9dc8b9] text-[#2a332b] rounded-full mb-3">
                Activity
              </span>
              <h2 className="text-4xl font-black text-[#fee8c8]" style={{ fontFamily: "'Georgia', serif" }}>
                Recent Complaints
              </h2>
            </div>
            <button
              onClick={() => navigate("/complaints")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#769e7c] to-[#9dc8b9] text-[#2a332b] px-6 py-2.5 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md text-sm"
            >
              View All <FaArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentComplaints.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-5 bg-[#2a332b] border border-[#769e7c]/30 rounded-xl px-6 py-4 hover:shadow-lg hover:border-[#769e7c] transition-all cursor-pointer group"
                onClick={() => navigate("/complaints")}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getPriorityDot(c.priority)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#fee8c8] text-sm truncate">{c.issue}</span>
                  </div>
                  <span className="text-xs text-[#9dc8b9]">{c.department} · {c.date}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${getStatusStyle(c.status)}`}>
                  {c.status}
                </span>
                <FaArrowRight size={12} className="text-[#769e7c] group-hover:text-[#fee8c8] transition flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-20 px-8 bg-gradient-to-br from-[#2a332b] via-[#3A4A3A] to-[#2a332b] text-[#fee8c8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ctaGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#769e7c" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaGrid)" />
          </svg>
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm text-[#9dc8b9] mb-6">
            <FaShieldAlt size={12} /> Secure · Transparent · Accountable
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            Ready to Get Started?
          </h2>
          <p className="text-[#9dc8b9] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of citizens already using ShebaConnect to access government services faster and more efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {[
              { val: statsLoading ? "—" : `${systemStats.totalUsers}+`, label: "Citizens Registered" },
              { val: statsLoading ? "—" : `${systemStats.resolvedComplaints}+`, label: "Complaints Resolved" },
              { val: "50+", label: "Services Available" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black mb-1 bg-gradient-to-r from-[#769e7c] to-[#eab29f] text-transparent bg-clip-text">
                  {s.val}
                </div>
                <div className="text-[#9dc8b9] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate(user ? "/complaints" : "/register")}
              className="bg-[#769e7c] text-[#2a332b] px-10 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
            >
              <FaClipboardList /> {user ? "File a Complaint" : "Create Account"}
            </button>
            <button
              onClick={() => navigate("/services")}
              className="border border-white/30 text-[#fee8c8] px-10 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <FaCogs /> Browse Services
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <AnimatedSection className="bg-[#2a332b] text-[#9dc8b9] py-12 px-8 border-t border-[#769e7c]/30">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#fee8c8] font-bold text-lg mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              Sheba<span className="text-[#769e7c]">Connect</span>
            </h4>
            <p className="text-sm leading-relaxed">Government of Bangladesh · Citizen Grievance Redressal System</p>
          </div>
          <div>
            <h5 className="text-[#fee8c8] font-semibold mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate("/complaints")} className="hover:text-[#fee8c8] transition">Complaints</button></li>
              <li><button onClick={() => navigate("/services")} className="hover:text-[#fee8c8] transition">Services</button></li>
              <li><button onClick={() => navigate("/documents")} className="hover:text-[#fee8c8] transition">Documents</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#fee8c8] font-semibold mb-3">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>📞 16182</li>
              <li>✉️ support@shebaconnect.gov.bd</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#fee8c8] font-semibold mb-3">Follow Us</h5>
            <div className="flex gap-3 text-xl">
              <span className="hover:text-[#fee8c8] transition">🐦</span>
              <span className="hover:text-[#fee8c8] transition">📘</span>
              <span className="hover:text-[#fee8c8] transition">📸</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-6 border-t border-[#769e7c]/30 text-xs text-[#9dc8b9]/50 text-center">
          © {new Date().getFullYear()} ShebaConnect. All rights reserved.
        </div>
      </AnimatedSection>

      <style>{`
        .scroll-section {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, opacity;
        }
        .scroll-section.in-view {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .scroll-section.out-of-view {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
