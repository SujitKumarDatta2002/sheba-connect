import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaClipboardList, 
  FaCogs, 
  FaFileAlt, 
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaChartLine
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 24,
    pending: 8,
    resolved: 16
  });
  
  const [recentComplaints, setRecentComplaints] = useState([
    { id: 1, department: "Water Supply", issue: "No water supply", status: "Pending", date: "2026-03-10" },
    { id: 2, department: "Electricity", issue: "Power outage", status: "Resolved", date: "2026-03-09" },
    { id: 3, department: "Road Maintenance", issue: "Pothole repair", status: "In Progress", date: "2026-03-08" },
    { id: 4, department: "Waste Management", issue: "Garbage collection", status: "Pending", date: "2026-03-07" }
  ]);

  const [showQuickTip, setShowQuickTip] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaClipboardList className="text-4xl text-blue-600" />,
      title: "Complaint Tracking",
      description: "Submit and track complaints with real-time status updates",
      path: "/complaints",
      color: "blue"
    },
    {
      icon: <FaCogs className="text-4xl text-green-600" />,
      title: "Service Guidance",
      description: "Get recommendations for government services",
      path: "/services",
      color: "green"
    },
    {
      icon: <FaFileAlt className="text-4xl text-purple-600" />,
      title: "Document Management",
      description: "Store and manage your documents securely",
      path: "/documents",
      color: "purple"
    }
  ];

  // Auto-rotate features for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION with Animation */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                ShebaConnect
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Smart Government Service Navigation & Assistance Platform
              </p>
              <p className="text-lg mb-8 text-blue-50">
                Your one-stop solution for all government services, complaints, 
                and document management. Fast, secure, and reliable.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/complaints')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
                           hover:bg-blue-50 transition-all transform hover:scale-105 
                           flex items-center gap-2 shadow-lg"
                >
                  Get Started <FaArrowRight />
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg 
                           font-semibold hover:bg-white hover:text-blue-600 
                           transition-all transform hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="md:w-1/3 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaChartLine /> Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaClipboardList /> Total Complaints
                  </span>
                  <span className="font-bold text-2xl">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaClock className="text-yellow-300" /> Pending
                  </span>
                  <span className="font-bold text-2xl text-yellow-300">{stats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-300" /> Resolved
                  </span>
                  <span className="font-bold text-2xl text-green-300">{stats.resolved}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tip Banner */}
      {showQuickTip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 my-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-yellow-500 text-xl" />
              <p className="text-yellow-700">
                <span className="font-semibold">Quick Tip:</span> You can track your complaints 
                in real-time from the Complaints dashboard!
              </p>
            </div>
            <button 
              onClick={() => setShowQuickTip(false)}
              className="text-yellow-500 hover:text-yellow-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* FEATURES SECTION with Interactive Carousel */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Features</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover how ShebaConnect can help you navigate government services efficiently
          </p>

          {/* Mobile Carousel View */}
          <div className="md:hidden">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                {features[activeFeature].icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
              <p className="text-gray-600 mb-6">{features[activeFeature].description}</p>
              <button
                onClick={() => navigate(features[activeFeature].path)}
                className={`bg-${features[activeFeature].color}-600 text-white px-6 py-2 
                         rounded-lg hover:bg-${features[activeFeature].color}-700 
                         transition-all transform hover:scale-105`}
              >
                Explore
              </button>
              <div className="flex justify-center gap-2 mt-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeFeature === index ? 'w-8 bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
                         transition-all transform hover:-translate-y-2 cursor-pointer
                         border border-gray-100"
                onClick={() => navigate(feature.path)}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button 
                  className={`text-${feature.color}-600 font-semibold flex items-center gap-2 
                           hover:gap-3 transition-all`}
                >
                  Learn More <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT COMPLAINTS PREVIEW */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Complaints</h2>
            <button
              onClick={() => navigate('/complaints')}
              className="text-blue-600 font-semibold flex items-center gap-2 
                       hover:gap-3 transition-all"
            >
              View All <FaArrowRight />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Department</th>
                    <th className="p-4 text-left">Issue</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{complaint.department}</td>
                      <td className="p-4">{complaint.issue}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                       ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{complaint.date}</td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate('/complaints')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS with Statistics */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Quick Actions</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Daily Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Complaints Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Services Available</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate('/complaints')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
                       hover:bg-blue-50 transition-all transform hover:scale-105
                       flex items-center gap-2 shadow-lg"
            >
              <FaClipboardList /> File Complaint
            </button>
            <button
              onClick={() => navigate('/services')}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold 
                       hover:bg-green-600 transition-all transform hover:scale-105
                       flex items-center gap-2 shadow-lg"
            >
              <FaCogs /> Browse Services
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold 
                       hover:bg-purple-600 transition-all transform hover:scale-105
                       flex items-center gap-2 shadow-lg"
            >
              <FaFileAlt /> View Documents
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive updates about new services and features
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold 
                       hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}