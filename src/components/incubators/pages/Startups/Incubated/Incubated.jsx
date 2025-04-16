import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './Incubated.css';
import ThaparInnovate from './TIETInnovate.png'

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

  const handleViewDetailsClick = (e, startup) => {
      e.stopPropagation(); // Prevent card click handler
      navigate(`/incubator/startups/incubated/${startup.startup}/info`);
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
      {/* Add Header like in Applications.jsx if needed */} 
      {/* <div className="incubated-header">
        <h1>Incubated Startups</h1>
      </div> */} 

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
              <div className="incubated-card-info">
                <div className="incubated-logo">
                  <img 
                    src={ThaparInnovate} 
                    alt={startup.startup} 
                    loading="lazy"
                  />
                </div>
                <div className="incubated-details">
                  <div className="incubated-startup-name">
                    <span>Startup Name:</span>
                    <h3>{startup.startup}</h3>
                  </div>
                </div>
              </div>
              <div className="arrow-icon">→</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Incubated;