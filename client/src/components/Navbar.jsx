
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { 
//   FaClipboardList, 
//   FaCogs, 
//   FaFileAlt, 
//   FaHome, 
//   FaUser,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaBell,
//   FaChevronDown,
//   FaShieldAlt,
//   FaChartBar,
//   FaUsers,
//   FaLightbulb,
//   FaPhone
// } from "react-icons/fa";
// import axios from "axios";
// import { useEffect } from "react";
// import API from "../config/api";

// export default function Navbar({ user, setUser }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const navigate = useNavigate();

//   // Fetch unread notification count
//   useEffect(() => {
//     if (user && user.role !== 'admin') {
//       fetchUnreadCount();
//       // Poll every 30 seconds for new notifications
//       const interval = setInterval(fetchUnreadCount, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [user]);

//   const fetchUnreadCount = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `${API}/api/users/notifications/unread-count`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUnreadCount(response.data.total || 0);
//     } catch (error) {
//       console.warn('Error fetching unread count:', error.message);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/");
//     setIsProfileOpen(false);
//   };

//   // Navigation items for regular users
//   const userNavigation = [
//     { name: "Home", path: "/", icon: <FaHome /> },
//     { name: "Complaints", path: "/complaints", icon: <FaClipboardList /> },
//     { name: "Services", path: "/services", icon: <FaCogs /> },
//     { name: "Documents", path: "/documents", icon: <FaFileAlt /> },
//   ];

//   // Navigation items for admin users
//   const adminNavigation = [
//     { name: "Home", path: "/", icon: <FaHome /> },
//     { name: "Dashboard", path: "/admin", icon: <FaChartBar /> },
//     { name: "Users", path: "/admin/users", icon: <FaUsers /> },
//     { name: "Services", path: "/admin/services", icon: <FaCogs /> },
//     { name: "Solutions", path: "/admin/solutions", icon: <FaLightbulb /> },
//     { name: "Helplines", path: "/admin/helplines", icon: <FaPhone /> },
//   ];

//   // Determine which navigation to show
//   const navigation = user?.role === 'admin' ? adminNavigation : userNavigation;

//   return (
//     <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white sticky top-0 z-50 shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <div className="bg-white p-1.5 rounded-lg">
//               <span className="text-blue-700 font-bold text-xl">SC</span>
//             </div>
//             <span className="font-bold text-xl hidden sm:block">ShebaConnect</span>
//           </Link>

//           {/* Desktop Navigation - Center */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 <span>{item.name}</span>
//               </Link>
//             ))}
//           </div>

//           {/* Desktop Right Section */}
//           <div className="hidden md:flex items-center gap-4">
//             {user ? (
//               <>
//                 {/* Notification Bell - Only for regular users */}
//                 {user.role !== 'admin' && (
//                   <Link
//                     to="/notifications"
//                     className="relative p-2 hover:bg-blue-800 rounded-full transition-colors"
//                     title="View your messages and notifications"
//                   >
//                     <FaBell className="text-xl" />
//                     {unreadCount > 0 && (
//                       <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                         {unreadCount > 99 ? '99+' : unreadCount}
//                       </span>
//                     )}
//                   </Link>
//                 )}

//                 {/* Profile Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center gap-3 bg-blue-800 hover:bg-blue-950 rounded-lg px-3 py-2 transition-colors"
//                   >
//                     <div className="bg-blue-500 p-1 rounded-full">
//                       <FaUser />
//                     </div>
//                     <div className="text-left">
//                       <p className="text-sm font-medium">{user.name}</p>
//                       <p className="text-xs text-blue-300">{user.email}</p>
//                     </div>
//                     <FaChevronDown className={`text-sm transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {/* Dropdown Menu */}
//                   {isProfileOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
//                       <div className="px-4 py-2 border-b border-gray-200">
//                         <p className="text-sm text-gray-600">Signed in as</p>
//                         <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
//                       </div>
//                       {user.role === 'admin' ? (
//                         <>
//                           <Link
//                             to="/admin"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             Admin Dashboard
//                           </Link>
//                           <Link
//                             to="/admin/users"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             User Management
//                           </Link>
//                           <Link
//                             to="/admin/services"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             Service Management
//                           </Link>
//                         </>
//                       ) : (
//                         <>
//                           <Link
//                             to="/notifications"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <FaBell /> {unreadCount > 0 ? `Messages (${unreadCount})` : 'Messages'}
//                           </Link>
//                           <Link
//                             to="/profile"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             Your Profile
//                           </Link>
//                         </>
//                       )}
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
//                       >
//                         <FaSignOutAlt /> Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 hover:bg-blue-800 rounded-lg"
//           >
//             {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-blue-600">
//             <div className="flex flex-col space-y-2">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                 >
//                   <span className="text-xl">{item.icon}</span>
//                   <span>{item.name}</span>
//                 </Link>
//               ))}
              
//               {user ? (
//                 <>
//                   <div className="border-t border-blue-600 pt-2 mt-2">
//                     <div className="px-4 py-2">
//                       <p className="text-sm text-blue-300">Logged in as</p>
//                       <p className="font-medium">{user.name}</p>
//                       <p className="text-sm text-blue-300">{user.email}</p>
//                     </div>
                    
//                     {/* Mobile admin links */}
//                     {user.role === 'admin' && (
//                       <>
//                         <Link
//                           to="/admin"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                         >
//                           <FaChartBar className="text-xl" />
//                           <span>Admin Dashboard</span>
//                         </Link>
//                         <Link
//                           to="/admin/users"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                         >
//                           <FaUsers className="text-xl" />
//                           <span>User Management</span>
//                         </Link>
//                         <Link
//                           to="/admin/services"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                         >
//                           <FaCogs className="text-xl" />
//                           <span>Service Management</span>
//                         </Link>
//                       </>
//                     )}
                    
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900 hover:text-white rounded-lg"
//                     >
//                       <FaSignOutAlt className="text-xl" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="border-t border-blue-600 pt-2 mt-2 flex gap-2">
//                   <Link
//                     to="/login"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex-1 text-center px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex-1 text-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50"
//                   >
//                     Register
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaCogs, FaFileAlt, 
  FaUserCircle, FaSignOutAlt, FaBell, FaChartBar,
  FaShieldAlt, FaBars, FaTimes, FaTachometerAlt
} from "react-icons/fa";
import { useState } from "react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  // Regular user navigation links
  const userNavLinks = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/complaints", label: "Complaints", icon: FaClipboardList },
    { path: "/services", label: "Services", icon: FaCogs },
    { path: "/documents", label: "Documents", icon: FaFileAlt },
    { path: "/notifications", label: "Alerts", icon: FaBell },
  ];

  // Admin navigation links - only Home and Dashboard
  const adminNavLinks = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  ];

  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <span className="text-xl font-black text-gray-800 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              Sheba<span className="text-blue-600">Connect</span>
            </span>
            {isAdmin && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                Admin
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <FaUserCircle className="text-blue-600 text-lg" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  {isAdmin ? (
                    <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <FaShieldAlt size={8} /> Admin
                    </span>
                  ) : (
                    <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Citizen
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                >
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 mt-2 pt-3">
                    <FaUserCircle className="text-blue-600 text-xl" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isAdmin ? (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <FaShieldAlt size={8} /> Admin
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Citizen
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                  >
                    <FaSignOutAlt size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-4 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}