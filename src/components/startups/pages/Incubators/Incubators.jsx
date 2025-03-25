import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../config';
import './Incubators.css';

const Incubators = () => {
  const [activeTab, setActiveTab] = useState('my-incubators');
  const [myIncubators, setMyIncubators] = useState([]);
  const [allIncubators, setAllIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [showPrograms, setShowPrograms] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyIncubators();
    fetchAllIncubators();
  }, []);

  const fetchMyIncubators = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/my-incubators/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyIncubators(response.data);
    } catch (error) {
      console.error('Error fetching my incubators:', error);
    }
  };

  const fetchAllIncubators = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/incubators/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllIncubators(response.data);
    } catch (error) {
      console.error('Error fetching all incubators:', error);
    }
  };

  const handleIncubatorClick = (incubatorId) => {
    navigate(`/incubator-details/${incubatorId}`);
  };

  const togglePrograms = (incubatorId) => {
    setShowPrograms(prev => ({
      ...prev,
      [incubatorId]: !prev[incubatorId]
    }));
  };

  return (
    <div className="incubators-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'my-incubators' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-incubators')}
        >
          My Incubators
        </button>
        <button 
          className={`tab ${activeTab === 'apply' ? 'active' : ''}`}
          onClick={() => setActiveTab('apply')}
        >
          Apply For Incubation
        </button>
      </div>

      {activeTab === 'my-incubators' ? (
        <div className="my-incubators">
          <div className="incubators-grid">
            {myIncubators.map((incubator) => (
              <div 
                key={incubator.id} 
                className="incubator-card"
                onClick={() => handleIncubatorClick(incubator.id)}
              >
                <div className="incubator-logo">
                  <img src={incubator.logo_url || 'default-logo.png'} alt={incubator.incubator_name} />
                </div>
                <div className="incubator-info">
                  <h3>{incubator.incubator_name}</h3>
                  <p className="joining-date">Joining Date: {incubator.joining_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="apply-incubation">
          {allIncubators.map((incubator) => (
            <div key={incubator.id} className="incubator-section">
              <div 
                className="incubator-header" 
                onClick={() => togglePrograms(incubator.id)}
              >
                <div className="incubator-name">{incubator.incubator_name}</div>
                <span className="toggle-icon">
                  {showPrograms[incubator.id] ? '−' : '+'}
                </span>
              </div>
              
              {showPrograms[incubator.id] && incubator.programs && (
                <div className="programs-list">
                  {incubator.programs.map((program) => (
                    <div key={program.id} className="program-row">
                      <div className="program-info">
                        <div className="program-name">{program.program_name}</div>
                        <div className="program-date">Last Date: {program.last_date}</div>
                      </div>
                      <div className="program-actions">
                        <button className="details-btn">Details</button>
                        <button 
                          className={`apply-btn ${program.submitted ? 'submitted' : ''}`}
                          disabled={program.submitted}
                        >
                          {program.submitted ? 'Submitted' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Incubators; 