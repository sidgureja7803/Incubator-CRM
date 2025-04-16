import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './StartupDetailView.css';
import ThaparInnovate from '../Incubated/TIETInnovate.png';

// Tab Components
import StartupBasicInfo from '../Info/Info';
import StartupAwards from '../Awards/Awards';
import StartupFunding from '../Funding/Funding';
import StartupTeam from '../Team/Team';
import StartupProperties from '../IP/IntellectualProperties';
import StartupUpdates from '../Updates/Updates';
import StartupFees from '../Fees/Fees';

const StartupDetailView = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStartupDetails();
  }, [startupId]);

  const fetchStartupDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/detail/${startupId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStartup(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching startup details:", err);
      setError('Failed to load startup details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/incubator/startups/incubated');
  };

  if (loading) {
    return (
      <div className="startup-detail-container">
        <div className="startup-detail-loading">
          <div className="spinner"></div>
          <p>Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="startup-detail-container">
        <div className="startup-detail-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchStartupDetails}>Retry</button>
          <button className="back-button" onClick={goBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="startup-detail-container">
      <div className="startup-tabs">
        <NavLink to={`/incubator/startups/incubated/${startupId}/info`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Startup Info
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/awards`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Awards
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/funding`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Funding
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/team`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Team
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/properties`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Intellectual Properties
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/updates`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Updates
        </NavLink>
        <NavLink to={`/incubator/startups/incubated/${startupId}/fee`} className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>
          Fee
        </NavLink>
      </div>

      <div className="startup-tab-content">
        <Outlet context={{ startup }} />
      </div>
    </div>
  );
};

export default StartupDetailView; 