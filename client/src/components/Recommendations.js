import React, { useState, useEffect } from 'react';
import './Recommendations.css';

const Recommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations/personalized/${userId}`);
      const data = await response.json();
      
      if (data.length === 0) {
        // Generate sample recommendations if none exist
        await generateSampleRecommendations();
        const newResponse = await fetch(`/api/recommendations/personalized/${userId}`);
        const newData = await newResponse.json();
        setRecommendations(newData);
      } else {
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleRecommendations = async () => {
    try {
      await fetch(`/api/recommendations/generate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Personalized Suggestions</h2>
        <p>Based on your profile and activity, here are some recommendations for you:</p>
      </div>
      
      <div className="recommendations-grid">
        {recommendations.map((recommendation) => (
          <div key={recommendation._id} className="recommendation-card">
            <div className="recommendation-header">
              <span className="recommendation-category">{recommendation.category}</span>
              <span className={`priority-badge priority-${recommendation.priority.toLowerCase()}`}>
                {recommendation.priority}
              </span>
            </div>
            <h3>{recommendation.title}</h3>
            <p>{recommendation.description}</p>
            <div className="recommendation-footer">
              <button className="action-btn">Learn More</button>
              <span className="date">
                {new Date(recommendation.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {recommendations.length === 0 && (
        <div className="empty-state">
          <p>No recommendations available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
