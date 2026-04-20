import { Link } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";

export default function NavbarAnalyticsLink({ className = "", onClick, user }) {
  const role = user?.role;
  const canView = role === "admin" || role === "user";

  if (!canView) return null;

  return (
    <Link
      to="/analytics"
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`.trim()}
    >
      <FaChartBar size={16} />
      <span>Analytics Dashboard</span>
    </Link>
    
  );
}
