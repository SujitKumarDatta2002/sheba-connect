import React, { useState, useEffect } from 'react';
import './Complaints.css';

const Complaints = ({ userId }) => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`/api/complaints/user/${userId}`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user: userId
        }),
      });
      
      setFormData({ subject: '', description: '', priority: 'Medium' });
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return '#48bb78';
      case 'In Progress': return '#4299e1';
      case 'Pending': return '#ed8936';
      case 'Demoted': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <h2>Complaint History</h2>
        <button 
          className="new-complaint-btn"
          onClick={() => setShowForm(true)}
        >
          + New Complaint
        </button>
      </div>

      {showForm && (
        <div className="complaint-form-overlay">
          <div className="complaint-form">
            <h3>Submit New Complaint</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint._id.slice(-6)}</td>
                <td>{complaint.subject}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(complaint.status) }}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge priority-${complaint.priority.toLowerCase()}`}>
                    {complaint.priority}
                  </span>
                </td>
                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {complaints.length === 0 && (
          <div className="empty-state">
            <p>No complaints found. Submit your first complaint!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
