import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaCogs,
  FaFileAlt,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import NotificationBell from "./NotificationBell";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  const userNavLinks = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/complaints", label: "Complaints", icon: FaClipboardList },
    { path: "/services", label: "Services", icon: FaCogs },
    { path: "/documents", label: "Documents", icon: FaFileAlt },
    { path: "/notifications", label: "Alerts", icon: FaBell },
    { path: "/analytics", label: "World Statistics", icon: FaChartBar },
  ];

  const adminNavLinks = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/admin/applications", label: "Applications", icon: FaClipboardList },
    { path: "/admin/users", label: "Users", icon: FaUsers },
    { path: "/admin/services", label: "Services", icon: FaCogs },
    { path: "/analytics", label: "World Statistics", icon: FaChartBar },
  ];

  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {!isAdmin && <NotificationBell />}
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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            type="button"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

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
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                    type="button"
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
