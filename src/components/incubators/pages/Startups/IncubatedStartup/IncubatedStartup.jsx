import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

      <div className="startup-tab-content">
        {/* Content will be rendered by the parent route */}
        {children}
      </div>
    </div>
  );
};

export default StartupInfo;
