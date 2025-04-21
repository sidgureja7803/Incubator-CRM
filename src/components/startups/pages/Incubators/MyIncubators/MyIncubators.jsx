import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import './MyIncubators.css';
import ThaparInnovate from './Incubator.png';

const MyIncubators = () => {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/startupincubator/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (Array.isArray(response.data)) {
        setIncubators(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching incubators:', error);
      setError('Failed to load incubators. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleIncubatorClick = (incubatorId) => {
    // Navigate to ProgramDetails page with the first program of this incubator
    navigate(`/startup/incubators/${incubatorId}/programs`);
  };

  if (loading) {
    return <div className="loading">Loading incubators...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-incubators-container">
      <h1 className="page-title">My Incubators</h1>
      
      {incubators.length === 0 ? (
        <div className="no-incubators">You are not part of any incubators yet.</div>
      ) : (
        <div className="incubators-grid">
          {incubators.map(incubator => (
            <div 
              key={incubator.id} 
              className="incubator-card"
              onClick={() => handleIncubatorClick(incubator.id)}
            >
              <div className="incubator-logo">
                <img 
                  src={incubator.logo || ThaparInnovate} 
                  alt={incubator.name || incubator.incubator_name} 
                />
              </div>
              <div className="incubator-info">
                <h3 className="incubator-name">{incubator.name || incubator.incubator_name}</h3>
                <div className="joining-date">
                  <p>Joining Date:</p>
                  <p>{incubator.joining_date || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIncubators;
