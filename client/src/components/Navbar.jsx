import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold">ShebaConnect</h1>

      <div className="space-x-6">

        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/complaints" className="hover:underline">Complaints</Link>
        <Link to="/services" className="hover:underline">Services</Link>
        <Link to="/documents" className="hover:underline">Documents</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>

      </div>
    </nav>
  );
}