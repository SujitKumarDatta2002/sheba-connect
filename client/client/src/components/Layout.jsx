import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaClipboardList, FaCogs, FaFileAlt, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Layout({ children, user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navigation = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Complaints", path: "/complaints", icon: <FaClipboardList /> },
    { name: "Services", path: "/services", icon: <FaCogs /> },
    { name: "Documents", path: "/documents", icon: <FaFileAlt /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 fixed h-full">
        <h1 className="text-2xl font-bold mb-10 text-center">
          ShebaConnect
        </h1>
        
        {/* User Info */}
        {user && (
          <div className="mb-6 p-3 bg-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-300" />
              <div className="truncate">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-blue-300">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-700 text-yellow-300"
                      : "hover:bg-blue-800 hover:text-gray-200"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
            
            {/* Logout button for logged in users */}
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-300 hover:bg-red-900 hover:text-white transition-all"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Login/Register links for guests */}
        {!user && (
          <div className="absolute bottom-6 left-6 right-6">
            <Link
              to="/login"
              className="block text-center bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg mb-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block text-center border border-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main>{children}</main>
      </div>
    </div>
  );
}