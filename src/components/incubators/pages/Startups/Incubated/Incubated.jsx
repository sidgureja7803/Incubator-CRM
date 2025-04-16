import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './Incubated.css';
import ThaparInnovate from './TIETInnovate.png'

const Incubated = () => {
  const navigate = useNavigate();
  const [startups, setLocalStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Get all startups in a single request
      const response = await axios.get(`${config.api_base_url}/incubator/startupincubator/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Process the data to include founder information directly
      const startupData = await Promise.all(
        response.data.map(async (startup) => {
          try {
            const peopleResponse = await axios.get(
              `${config.api_base_url}/startup/list/?startup_id=${startup.startup_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            // Add founder info directly to the startup object
            const people = peopleResponse.data || [];
            const founderName = people.length > 0
              ? `${people[0].first_name} ${people[0].last_name}`
              : 'Not specified';
              
            return {
              ...startup,
              founderName
            };
          } catch (err) {
            console.warn(`Could not fetch people for startup ${startup.startup_id}`, err);
            return {
              ...startup,
              founderName: 'Not specified'
            };
          }
        })
      );
      
      setLocalStartups(startupData);
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
      {startups.length === 0 ? (
        <div className="no-startups">
          <h3>No incubated startups found</h3>
          <p>You don't have any startups in your incubator yet.</p>
        </div>
      ) : (
        <div className="startups-grid">
          {startups.map((startup) => (
            <div 
              key={startup.id || startup.startup_id} 
              className="startup-card"
              onClick={() => handleStartupClick(startup)}
            >
              <div className="startup-content">
                <div className="startup-logo-container">
                  <img 
                    src={startup.logo || ThaparInnovate} 
                    alt={startup.startup_name} 
                    className="startup-logo"
                    loading="lazy"
                  />
                </div>
                <div className="startup-info">
                  <div className="startup-name-container">
                    <span>Startup Name:</span>
                    <div className="startup-name">{startup.startup_name}</div>
                  </div>
                  <div className="founder-container">
                    <span>Founder:</span>
                    <div className="founder-name">{startup.founderName}</div>
                  </div>
                </div>
              </div>
              <div className="startup-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Incubated;