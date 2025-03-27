import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';
import './Incubators.css';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

const Incubators = () => {
  const [activeTab, setActiveTab] = useState('my-incubators');
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [expandedPrograms, setExpandedPrograms] = useState({});

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = () => {
    axios
      .get(`${config.api_base_url}/startup/incubators/list`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      })
      .then((response) => {
        setIncubators(response.data);
      })
      .catch((error) => {
        console.error("Error fetching incubators:", error);
      });
  };

  const fetchPrograms = (incubatorId) => {
    axios
      .get(`${config.api_base_url}/startup/incubators/${incubatorId}/programs`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
          }`,
        },
      })
      .then((response) => {
        const updatedIncubator = incubators.find(inc => inc.id === incubatorId);
        if (updatedIncubator) {
          updatedIncubator.programs = response.data;
          setSelectedIncubator(updatedIncubator);
        }
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  };

  const toggleProgram = (programId) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [programId]: !prev[programId]
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

      {activeTab === 'my-incubators' && (
        <div className="incubators-grid">
          {incubators.map((incubator) => (
            <div 
              key={incubator.id} 
              className="incubator-card"
              onClick={() => {
                setSelectedIncubator(incubator);
                fetchPrograms(incubator.id);
              }}
            >
              <div className="incubator-logo">
                <img src={incubator.logo_url || 'default-logo.png'} alt={incubator.name} />
              </div>
              <div className="incubator-info">
                <h3>{incubator.name}</h3>
                <p className="joining-date">Joining Date: {new Date(incubator.joining_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIncubator && (
        <div className="programs-section">
          <h2>{selectedIncubator.name} Programs</h2>
          <div className="programs-list">
            {selectedIncubator.programs?.map((program) => (
              <div key={program.id} className="program-container">
                <div 
                  className="program-header"
                  onClick={() => toggleProgram(program.id)}
                >
                  <div className="program-title">
                    <h3>{program.name}</h3>
                    {expandedPrograms[program.id] ? 
                      <KeyboardArrowUp className="arrow-icon" /> : 
                      <KeyboardArrowDown className="arrow-icon" />
                    }
                  </div>
                  <div className="program-meta">
                    <span className="program-date">Start: {new Date(program.start_date).toLocaleDateString()}</span>
                    <span className="program-date">End: {new Date(program.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {expandedPrograms[program.id] && program.cohorts && (
                  <div className="cohorts-list">
                    {program.cohorts.map((cohort) => (
                      <div key={cohort.id} className="cohort-card">
                        <h4>{cohort.name}</h4>
                        <div className="cohort-details">
                          <p>Start Date: {new Date(cohort.start_date).toLocaleDateString()}</p>
                          <p>End Date: {new Date(cohort.end_date).toLocaleDateString()}</p>
                          <p>Status: <span className={`status-badge ${cohort.status.toLowerCase()}`}>{cohort.status}</span></p>
                        </div>
                        <div className="cohort-actions">
                          <button onClick={() => window.location.href = `/cohort/${cohort.id}`}>View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Incubators; 