import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css';

const DashBoard = () => {
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const response = await axios.get('http://139.59.46.75/api/startup/list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStartupData(response.data[0]); // Assuming we're showing the first startup
      } catch (err) {
        setError('Failed to fetch startup data');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!startupData) return <div className="no-data">No startup data available</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">DashBoard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Incubator Funding</h3>
            <div className="metric-value">
              {startupData.Startup_IncubatorFunding.reduce((sum, fund) => sum + fund.amount, 0)}
              <span className="metric-unit">Rupees</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💸</div>
          <div className="metric-content">
            <h3>External Funding</h3>
            <div className="metric-value">
              {startupData.Startup_ExternalFunding.reduce((sum, fund) => sum + fund.amount, 0)}
              <span className="metric-unit">Rupees</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Employment Generated</h3>
            <div className="metric-value">
              {startupData.Startup_People.length}
              <span className="metric-unit">Total Employees</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Annual Revenue</h3>
            <div className="metric-value">
              {startupData.annual_revenue || '0'}
              <span className="metric-unit">Rupees</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-sections">
        <div className="startup-info">
          <h2>Startup Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Industry:</label>
              <span>{startupData.industry}</span>
            </div>
            <div className="info-item">
              <label>CIN Number:</label>
              <span>{startupData.cin_no}</span>
            </div>
            <div className="info-item">
              <label>Sector:</label>
              <span>{startupData.sector}</span>
            </div>
            <div className="info-item">
              <label>CIN Date:</label>
              <span>{new Date(startupData.cin_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Registration Address:</label>
              <span>{startupData.address}</span>
            </div>
            <div className="info-item">
              <label>DIIT No:</label>
              <span>{startupData.dpiit_no}</span>
            </div>
          </div>
        </div>

        <div className="team-members">
          <h2>Team Members</h2>
          <div className="team-grid">
            {startupData.Startup_People.map((member) => (
              <div key={member.id} className="team-member-card">
                <img src={member.image_url} alt={`${member.first_name} ${member.last_name}`} />
                <div className="member-info">
                  <h3>{`${member.first_name} ${member.last_name}`}</h3>
                  <p>{member.primary_role}</p>
                  <div className="social-links">
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
                    {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
