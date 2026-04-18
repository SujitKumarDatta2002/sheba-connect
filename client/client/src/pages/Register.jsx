// import API from "../config/api";
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaMapMarkerAlt } from "react-icons/fa";

// export default function Register({ setUser }) {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     nid: "",
//     address: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { confirmPassword, ...registrationData } = formData;
      
//       console.log("Sending registration data:", registrationData); // Debug log
      
//       const res = await axios.post(`${API}/api/auth/register`, registrationData);
      
//       console.log("Registration response:", res.data); // Debug log
      
//       // Save to localStorage
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
      
//       // Update App.jsx state immediately
//       if (setUser && typeof setUser === 'function') {
//         setUser(res.data.user);
//       } else {
//         console.error("setUser is not a function:", setUser);
//       }
      
//       // Redirect to home
//       navigate("/");
      
//     } catch (error) {
//       console.error("Registration error:", error);
//       setError(error.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
//       <div className="max-w-2xl w-full">
//         {/* Logo at top */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-block">
//             <div className="bg-blue-600 text-white p-3 rounded-2xl inline-block mb-4">
//               <span className="text-3xl font-bold">SC</span>
//             </div>
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
//           <p className="text-gray-600 mt-2">Join ShebaConnect today</p>
//         </div>

//         {/* Registration Card */}
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
//               <p className="font-medium">Error</p>
//               <p className="text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <div className="relative">
//                     <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your phone number"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     NID Number *
//                   </label>
//                   <div className="relative">
//                     <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       name="nid"
//                       value={formData.nid}
//                       onChange={handleChange}
//                       required
//                       className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your NID number"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <div className="relative">
//                     <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <textarea
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       required
//                       rows="3"
//                       className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your address"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Password Fields - Full Width */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password *
//                 </label>
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Create a password"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password *
//                 </label>
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Confirm your password"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center mt-8 text-sm text-gray-500">
//           © 2026 ShebaConnect. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }



import API from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaMapMarkerAlt,
  FaShieldAlt, FaArrowRight, FaCheckCircle, FaUsers, FaClock,
  FaChevronLeft, FaChevronRight, FaBuilding, FaStar
} from "react-icons/fa";

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    nid: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Join ShebaConnect",
      subtitle: "Access all government services in one place",
      features: ["File Complaints", "Track Status", "Get Resolutions"],
      gradient: "from-blue-600 to-indigo-700",
      icon: FaUsers
    },
    {
      title: "Digital Bangladesh",
      subtitle: "Smart service delivery at your fingertips",
      features: ["Secure Documents", "Real-time Updates", "24/7 Access"],
      gradient: "from-emerald-600 to-teal-700",
      icon: FaBuilding
    },
    {
      title: "Citizen First",
      subtitle: "Your voice matters to us",
      features: ["Transparent Process", "Quick Response", "Satisfaction Guaranteed"],
      gradient: "from-purple-600 to-pink-700",
      icon: FaStar
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const res = await axios.post(`${API}/api/auth/register`, registrationData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (setUser && typeof setUser === 'function') {
        setUser(res.data.user);
      }
      
      navigate("/");
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full">
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - Sliding Hero Content */}
            <div className="text-white space-y-8 sticky top-12">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <span className="text-xl font-black tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  Sheba<span className="text-blue-300">Connect</span>
                </span>
              </Link>

              {/* Animated Slide Content */}
              <div className="relative min-h-[320px] overflow-hidden">
                <div 
                  className="transition-all duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)`, display: 'flex' }}
                >
                  {slides.map((s, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 space-y-6">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5">
                          <span className="text-xs font-semibold tracking-wider uppercase">Government of Bangladesh</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                          {s.title}
                        </h1>
                        <p className="text-blue-200 text-lg">{s.subtitle}</p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {s.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <FaCheckCircle className="text-emerald-400 text-sm" />
                            </div>
                            <span className="text-blue-100">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-300 text-sm mb-1">Active Users</p>
                            <p className="text-3xl font-bold">100K+</p>
                          </div>
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <s.icon className="text-2xl text-blue-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slide Navigation Dots */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-6">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx ? "w-8 bg-white" : "w-3 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Controls */}
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <FaCheckCircle className="text-emerald-400" />
                  <span>Govt. Authorized</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <FaCheckCircle className="text-emerald-400" />
                  <span>Data Protected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <FaCheckCircle className="text-emerald-400" />
                  <span>Free Service</span>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-blue-200 text-sm">Join thousands of satisfied citizens</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded mb-6 backdrop-blur">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      NID Number *
                    </label>
                    <div className="relative">
                      <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="text"
                        name="nid"
                        value={formData.nid}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Enter your NID number"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Address *
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-blue-300 text-sm" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="2"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm resize-none"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 text-sm" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 text-sm"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-4"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <FaArrowRight />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-blue-200">
                  Already have an account?{" "}
                  <Link to="/login" className="text-white font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <p className="text-xs text-blue-300">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-sm text-blue-300/60">
              © 2026 ShebaConnect. All rights reserved. A Government of Bangladesh Initiative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}