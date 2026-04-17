import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaCogs, FaFileAlt } from "react-icons/fa";

export default function Sidebar() {

  return (

    <aside className="bg-blue-900 text-white w-64 min-h-screen p-6">

      <h2 className="text-xl font-bold mb-10">
        Navigation
      </h2>

      <nav className="space-y-6">

        <Link to="/" className="flex items-center gap-3 hover:text-gray-300">
          <FaHome />
          Home
        </Link>

        <Link to="/complaints" className="flex items-center gap-3 hover:text-gray-300">
          <FaClipboardList />
          Complaints
        </Link>

        <Link to="/services" className="flex items-center gap-3 hover:text-gray-300">
          <FaCogs />
          Services
        </Link>

        <Link to="/documents" className="flex items-center gap-3 hover:text-gray-300">
          <FaFileAlt />
          Documents
        </Link>

      </nav>

    </aside>

  );

}