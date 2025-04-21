import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './StartupInfo.css';

// Tab Components
import StartupBasicInfo from './Tabs/BasicInfo';
import StartupAwards from '../Awards/Awards';
import StartupFunding from '../Funding/Funding';
import StartupTeam from '../Team/StartupTeam';
import StartupProperties from '../IP/IntellectualProperties';
import StartupUpdates from '../Updates/Updates';
import StartupFee from '../Funding/Funding';

const StartupInfo = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'info', label: 'Basic Info', path: `/incubator/startups/incubated/${startupId}/info` },
    { id: 'awards', label: 'Awards', path: `/incubator/startups/incubated/${startupId}/awards` },
    { id: 'funding', label: 'Funding', path: `/incubator/startups/incubated/${startupId}/funding` },
    { id: 'team', label: 'Team', path: `/incubator/startups/incubated/${startupId}/team` },
    { id: 'properties', label: 'Intellectual Properties', path: `/incubator/startups/incubated/${startupId}/properties` },
    { id: 'updates', label: 'Updates', path: `/incubator/startups/incubated/${startupId}/updates` },
    { id: 'fee', label: 'Fee', path: `/incubator/startups/incubated/${startupId}/fee` },
  ];

  const goBack = () => {
    navigate('/incubator/startups/incubated');
  };

  if (loading) {
    return (
      <div className="startup-info-container">
        <div className="startup-info-loading">
          <div className="spinner"></div>
          <p>Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="startup-info-container">
        <div className="startup-info-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchStartupDetails}>Retry</button>
          <button className="back-button" onClick={goBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="startup-info-container">
      <div className="startup-info-header">
        <div className="startup-info-title">
          <button className="back-button" onClick={goBack}>
            <span>←</span> Back
          </button>
          <h2>{startup?.name || 'Startup Details'}</h2>
          <p className="startup-sector">{startup?.sector || 'Technology'}</p>
        </div>
      </div>

      <div className="startup-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="startup-tab-content">
        <Routes>
          <Route path="info" element={<StartupBasicInfo startup={startup} refreshData={fetchStartupDetails} />} />
          <Route path="awards" element={<StartupAwards startupId={startupId} />} />
          <Route path="funding" element={<StartupFunding startupId={startupId} />} />
          <Route path="team" element={<StartupTeam startupId={startupId} />} />
          <Route path="properties" element={<StartupProperties startupId={startupId} />} />
          <Route path="updates" element={<StartupUpdates startupId={startupId} />} />
          <Route path="fee" element={<StartupFee startupId={startupId} />} />
          <Route path="*" element={<StartupBasicInfo startup={startup} refreshData={fetchStartupDetails} />} />
        </Routes>
      </div>
    </div>
  );
};

export default StartupInfo;
