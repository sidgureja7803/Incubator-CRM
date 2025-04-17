import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './Incubated.css';
import ThaparInnovate from './TIETInnovate.png';
import { ArrowForward } from '@mui/icons-material';

const Incubated = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(`${config.api_base_url}/incubator/startupincubator/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStartups(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError('Failed to load startups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartupClick = (startup) => {
    navigate(`/incubator/startups/incubated/${startup.startup_id}/info`);
  };

  if (isLoading) {
    return <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading incubated startups...</p>
    </div>;
  }

  if (error) {
    return <div className="error-container">
      <h3>Error loading incubated startups</h3>
      <p>{error}</p>
      <button onClick={fetchData} className="retry-button">Retry</button>
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
              key={startup.id} 
              className="incubated-card"
              onClick={() => handleStartupClick(startup)}
            >
              <div className="startup-logo-container">
                <img 
                  src={ThaparInnovate} 
                  alt={startup.startup} 
                  className="startup-logo"
                  loading="lazy"
                />
              </div>
              
              <div className="startup-info">
                <div className="startup-name-section">
                  <span className="label">Startup Name:</span>
                  <h3 className="startup-name">{startup.startup}</h3>
                </div>
                
                <div className="founder-section">
                  <span className="label">Founder:</span>
                  <p className="founder-name">Kanishk Dadwal</p>
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