import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './Incubated.css';
import ThaparInnovate from './TIETInnovate.png';
import { ArrowForward } from '@mui/icons-material';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';

export const Incubated = () => {
  const navigate = useNavigate();
  const { startups, isLoading, error, refetchStartups } = useIncubatorContext();

  const handleStartupClick = (startup) => {
    navigate(`/incubator/startups/incubated/${startup.startup_id}/info`);
  };

  if (isLoading.startups) {
    return <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading incubated startups...</p>
    </div>;
  }

  if (error?.startups) {
    return <div className="error-container">
      <h3>Error loading incubated startups</h3>
      <p>{error.startups.message}</p>
      <button onClick={refetchStartups} className="retry-button">Retry</button>
    </div>;
  }

  return (
    <div className="incubated-container">
      <div className="incubated-list">
        {startups.length === 0 ? (
          <div className="no-startups">
            <h3>No incubated startups found</h3>
            <p>You don't have any startups in your incubator yet.</p>
          </div>
        ) : (
          startups.map((startup) => (
            <div 
              key={startup.startup_id} 
              className="incubated-card"
              onClick={() => handleStartupClick(startup)}
            >
              <div className="startup-logo-container">
                <img 
                  src={startup.details?.image_url || ThaparInnovate} 
                  alt={startup.details?.startup_name} 
                  className="startup-logo"
                  loading="lazy"
                />
              </div>
              
              <div className="startup-info">
                <div className="startup-name-section">
                  <span className="label">Startup Name:</span>
                  <h3 className="startup-name">{startup.details?.startup_name}</h3>
                </div>
                
                <div className="founder-section">
                  <span className="label">Founder:</span>
                  <p className="founder-name">{startup.details?.founder_name || 'Not specified'}</p>
                </div>
              </div>
              
              <button className="view-application-btn">
                <ArrowForward />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Incubated;