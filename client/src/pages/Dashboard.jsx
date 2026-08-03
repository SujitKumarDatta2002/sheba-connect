import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config/api";
import UserApplicationCard from "../components/UserApplicationCard";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API}/api/applications/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">My Applications</h2>
          {loading ? (
            <p className="text-gray-500">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-500">No applications found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {applications.map((app) => (
                <UserApplicationCard key={app._id} app={app} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}