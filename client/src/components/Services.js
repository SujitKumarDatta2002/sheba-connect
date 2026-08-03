import React, { useState, useEffect } from 'react';
import './Services.css';

const Services = ({ userId }) => {
  const [savedServices, setSavedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedServices();
    fetchAvailableServices();
    fetchWarnings();
  }, [userId]);

  const fetchSavedServices = async () => {
    try {
      const response = await fetch(`/api/services/saved/${userId}`);
      const data = await response.json();
      setSavedServices(data);
    } catch (error) {
      console.error('Error fetching saved services:', error);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setAvailableServices(data);
    } catch (error) {
      console.error('Error fetching available services:', error);
    }
  };

  const fetchWarnings = async () => {
    try {
      const response = await fetch(`/api/services/warnings/${userId}`);
      const data = await response.json();
      setWarnings(data);
    } catch (error) {
      console.error('Error fetching warnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeService = async (serviceId) => {
    try {
      await fetch('/api/services/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, serviceId }),
      });
      fetchSavedServices();
      fetchWarnings();
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  const saveService = async (serviceId) => {
    try {
      await fetch('/api/services/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, serviceId }),
      });
      fetchSavedServices();
      fetchWarnings();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="services-container">
      <section className="saved-services">
        <h2>Saved Services</h2>
        <div className="services-grid">
          {savedServices.length > 0 ? (
            savedServices.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => removeService(service._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No saved services yet.</p>
          )}
        </div>
      </section>

      <section className="available-services">
        <h2>Available Services</h2>
        <div className="services-grid">
          {availableServices
            .filter(service => !savedServices.some(saved => saved._id === service._id))
            .map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-actions">
                  <button 
                    className="save-btn"
                    onClick={() => saveService(service._id)}
                  >
                    Save Service
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="alerts-warnings">
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
            <p>No alerts or warnings at this time.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
