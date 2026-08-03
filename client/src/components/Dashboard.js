import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ userId }) => {
  const [stats, setStats] = useState({
    savedServices: 0,
    totalComplaints: 0,
    uploadedDocuments: 0,
    pendingRecommendations: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch saved services
      const servicesResponse = await fetch(`/api/services/saved/${userId}`);
      const services = await servicesResponse.json();
      
      // Fetch complaints
      const complaintsResponse = await fetch(`/api/complaints/user/${userId}`);
      const complaints = await complaintsResponse.json();
      
      // Fetch documents
      const documentsResponse = await fetch(`/api/documents/user/${userId}`);
      const documents = await documentsResponse.json();
      
      // Fetch recommendations
      const recommendationsResponse = await fetch(`/api/recommendations/personalized/${userId}`);
      const recommendations = await recommendationsResponse.json();
      
      // Fetch warnings
      const warningsResponse = await fetch(`/api/services/warnings/${userId}`);
      const warningsData = await warningsResponse.json();
      
      setStats({
        savedServices: services.length,
        totalComplaints: complaints.length,
        uploadedDocuments: documents.length,
        pendingRecommendations: recommendations.length
      });
      
      setRecentComplaints(complaints.slice(0, 3));
      setRecentDocuments(documents.slice(0, 3));
      setWarnings(warningsData.slice(0, 2));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛠️</div>
          <div className="stat-content">
            <h3>{stats.savedServices}</h3>
            <p>Saved Services</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalComplaints}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats.uploadedDocuments}</h3>
            <p>Uploaded Documents</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>{stats.pendingRecommendations}</h3>
            <p>Recommendations</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="recent-complaints">
          <h2>Recent Complaints</h2>
          <div className="complaint-list">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <div key={complaint._id} className="complaint-item">
                  <div className="complaint-info">
                    <h4>{complaint.subject}</h4>
                    <p className="complaint-status">{complaint.status}</p>
                  </div>
                  <span className="complaint-date">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p>No recent complaints</p>
            )}
          </div>
        </section>

        <section className="recent-documents">
          <h2>Recent Documents</h2>
          <div className="document-list">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((document) => (
                <div key={document._id} className="document-item">
                  <div className="document-info">
                    <h4>{document.fileName}</h4>
                    <p className="document-service">{document.serviceName}</p>
                  </div>
                  <span className="document-date">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p>No recent documents</p>
            )}
          </div>
        </section>

        <section className="alerts-section">
          <h2>Alerts & Warnings</h2>
          <div className="warnings-list">
            {warnings.length > 0 ? (
              warnings.map((warning, index) => (
                <div key={index} className={`warning-item ${warning.type.toLowerCase()}`}>
                  <span className="warning-icon">
                    {warning.type === 'Warning' ? '⚠️' : '🚨'}
                  </span>
                  <span className="warning-message">{warning.message}</span>
                </div>
              ))
            ) : (
              <p>No alerts or warnings at this time</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
