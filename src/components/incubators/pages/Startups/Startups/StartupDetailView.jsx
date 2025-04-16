import React from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
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
  const { startups, isLoading } = useIncubatorContext();
  
  // Find the startup from context
  const startupWithDetails = startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId);
  const startup = startupWithDetails?.details;

  const goBack = () => {
    navigate('/incubator/startups/incubated');
  };

  if (isLoading.startups) {
    return (
      <div className="startup-detail-container">
        <div className="startup-detail-loading">
          <div className="spinner"></div>
          <p>Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="startup-detail-container">
        <div className="startup-detail-error">
          <h3>Error</h3>
          <p>Startup not found</p>
          <button className="back-button" onClick={goBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="startup-detail-container">
      <div className="startup-header">
        <img 
          src={startup.image_url || ThaparInnovate} 
          alt={startup.startup_name} 
          className="startup-logo"
        />
        <h2>{startup.startup_name}</h2>
      </div>

      <div className="startup-tabs">
        <NavLink 
          to="info" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Startup Info
        </NavLink>
        <NavLink 
          to="awards" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Awards
        </NavLink>
        <NavLink 
          to="funding" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Funding
        </NavLink>
        <NavLink 
          to="team" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Team
        </NavLink>
        <NavLink 
          to="properties" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Intellectual Properties
        </NavLink>
        <NavLink 
          to="updates" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Updates
        </NavLink>
        <NavLink 
          to="fee" 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Fee
        </NavLink>
      </div>

      <div className="startup-tab-content">
        <Outlet context={{ startup: startup }} />
      </div>
    </div>
  );
};

export default StartupDetailView; 