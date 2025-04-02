import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import './StartupInfo.css';

const StartupInfo = () => {
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStartupData();
  }, []);

  const fetchStartupData = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get('http://139.59.46.75/api/startup/list/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStartupData(response.data[0]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch startup data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!startupData) return <div className="no-data">No startup data available</div>;

  return (
    <div className="startup-info-container">
      <div className="info-header">
        <div className="startup-identity">
          <img src={startupData.image_url} alt={startupData.startup_name} className="startup-logo" />
          <h2>{startupData.startup_name}</h2>
        </div>
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit Info
        </button>
      </div>

      <div className="info-sections">
        <div className="info-section">
          <h3>Company Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Sector:</label>
              <span>{startupData.sector}</span>
            </div>
            <div className="info-item">
              <label>Industry:</label>
              <span>{startupData.industry}</span>
            </div>
            <div className="info-item">
              <label>Registration Address:</label>
              <span>{startupData.address}</span>
            </div>
            <div className="info-item">
              <label>Business Transaction Type:</label>
              <span>{startupData.startup_business_transaction}</span>
            </div>
            <div className="info-item">
              <label>Startup Registration Type:</label>
              <span>{startupData.startup_registration_type || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Communication</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email Address:</label>
              <span>{startupData.email}</span>
            </div>
            <div className="info-item">
              <label>Phone Number:</label>
              <span>{startupData.phone}</span>
            </div>
            <div className="info-item">
              <label>Website:</label>
              <a href={startupData.website} target="_blank" rel="noopener noreferrer">
                {startupData.website}
              </a>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Registration & Certifications</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>CIN No:</label>
              <span>{startupData.cin_no}</span>
            </div>
            <div className="info-item">
              <label>CIN Date:</label>
              <span>{new Date(startupData.cin_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>DPIIT No:</label>
              <span>{startupData.dpiit_no}</span>
            </div>
            <div className="info-item">
              <label>DPIIT Date:</label>
              <span>{new Date(startupData.dpiit_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>TAN No:</label>
              <span>{startupData.TAN_no}</span>
            </div>
            <div className="info-item">
              <label>PAN No:</label>
              <span>{startupData.PAN_no}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Growth Statistics</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Stage:</label>
              <span>{startupData.stage}</span>
            </div>
            <div className="info-item">
              <label>Product Demo URL:</label>
              <a href={startupData.product_demo_url} target="_blank" rel="noopener noreferrer">
                {startupData.product_demo_url}
              </a>
            </div>
            <div className="info-item">
              <label>Annual Revenue:</label>
              <span>{startupData.annual_revenue || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Employment Generated:</label>
              <span>{startupData.employment_generated || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditStartupInfoModal
          startupData={startupData}
          onClose={() => setIsEditing(false)}
          onUpdate={fetchStartupData}
        />
      )}
    </div>
  );
};

export default StartupInfo; 