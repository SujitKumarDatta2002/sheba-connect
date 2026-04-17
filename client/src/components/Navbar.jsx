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
//   FaShieldAlt
// } from "react-icons/fa";

// export default function Navbar({ user, setUser }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/");
//     setIsProfileOpen(false);
//   };

//   const navigation = [
//     { name: "Home", path: "/", icon: <FaHome /> },
//     { name: "Complaints", path: "/complaints", icon: <FaClipboardList /> },
//     { name: "Services", path: "/services", icon: <FaCogs /> },
//     { name: "Documents", path: "/documents", icon: <FaFileAlt /> },
//   ];

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

//             {/* Admin Dashboard Link (Desktop) */}
//             {user?.role === 'admin' && (
//               <>
//                 <Link
//                   to="/admin"
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
//                 >
//                   <span className="text-lg"><FaShieldAlt /></span>
//                   <span>Admin Dashboard</span>
//                 </Link>
//                 <Link
//                   to="/admin/services"
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
//                 >
//                   <span className="text-lg"><FaCogs /></span>
//                   <span>Service Mgmt</span>
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Desktop Right Section */}
//           <div className="hidden md:flex items-center gap-4">
//             {user ? (
//               <>
//                 {/* Notification Bell */}
//                 <button className="relative p-2 hover:bg-blue-800 rounded-full">
//                   <FaBell className="text-xl" />
//                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                 </button>

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
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setIsProfileOpen(false)}
//                       >
//                         Your Profile
//                       </Link>
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
//               {/* Admin Dashboard & Service Management Links (Mobile) */}
//               {user?.role === 'admin' && (
//                 <>
//                   <Link
//                     to="/admin"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                   >
//                     <FaShieldAlt className="text-xl" />
//                     <span>Admin Dashboard</span>
//                   </Link>
//                   <Link
//                     to="/admin/services"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
//                   >
//                     <FaCogs className="text-xl" />
//                     <span>Service Management</span>
//                   </Link>
//                 </>
//               )}
              
//               {user ? (
//                 <>
//                   <div className="border-t border-blue-600 pt-2 mt-2">
//                     <div className="px-4 py-2">
//                       <p className="text-sm text-blue-300">Logged in as</p>
//                       <p className="font-medium">{user.name}</p>
//                       <p className="text-sm text-blue-300">{user.email}</p>
//                     </div>
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



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaClipboardList, 
  FaCogs, 
  FaFileAlt, 
  FaHome, 
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaChevronDown,
  FaShieldAlt,
  FaChartBar,
  FaUsers,
  FaLightbulb,
  FaPhone
} from "react-icons/fa";

export default function Navbar({ user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsProfileOpen(false);
  };

  // Navigation items for regular users
  const userNavigation = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Complaints", path: "/complaints", icon: <FaClipboardList /> },
    { name: "Services", path: "/services", icon: <FaCogs /> },
    { name: "Documents", path: "/documents", icon: <FaFileAlt /> },
  ];

  // Navigation items for admin users
  const adminNavigation = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/admin", icon: <FaChartBar /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Services", path: "/admin/services", icon: <FaCogs /> },
    { name: "Solutions", path: "/admin/solutions", icon: <FaLightbulb /> },
    { name: "Helplines", path: "/admin/helplines", icon: <FaPhone /> },
  ];

  // Determine which navigation to show
  const navigation = user?.role === 'admin' ? adminNavigation : userNavigation;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
              <span className="text-blue-700 font-bold text-xl">SC</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">ShebaConnect</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Notification Bell - Only for regular users */}
                {user.role !== 'admin' && (
                  <button className="relative p-2 hover:bg-blue-800 rounded-full">
                    <FaBell className="text-xl" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 bg-blue-800 hover:bg-blue-950 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="bg-blue-500 p-1 rounded-full">
                      <FaUser />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-blue-300">{user.email}</p>
                    </div>
                    <FaChevronDown className={`text-sm transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                      </div>
                      {user.role === 'admin' ? (
                        <>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            User Management
                          </Link>
                          <Link
                            to="/admin/services"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Service Management
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Your Profile
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-blue-800 rounded-lg"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-600">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="border-t border-blue-600 pt-2 mt-2">
                    <div className="px-4 py-2">
                      <p className="text-sm text-blue-300">Logged in as</p>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-blue-300">{user.email}</p>
                    </div>
                    
                    {/* Mobile admin links */}
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          <FaChartBar className="text-xl" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          <FaUsers className="text-xl" />
                          <span>User Management</span>
                        </Link>
                        <Link
                          to="/admin/services"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          <FaCogs className="text-xl" />
                          <span>Service Management</span>
                        </Link>
                      </>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900 hover:text-white rounded-lg"
                    >
                      <FaSignOutAlt className="text-xl" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-blue-600 pt-2 mt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}