import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import './MyIncubators.css';
import ThaparInnovate from './Incubator.png';

const MyIncubators = () => {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIncubators, setExpandedIncubators] = useState({});
  const [expandedPrograms, setExpandedPrograms] = useState({});

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

  const fetchPrograms = async (incubatorId) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedIncubators = [...incubators];
      const index = updatedIncubators.findIndex(inc => inc.id === incubatorId);
      
      if (index !== -1) {
        updatedIncubators[index] = {
          ...updatedIncubators[index],
          programs: response.data
        };
        setIncubators(updatedIncubators);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchCohorts = async (incubatorId, programId) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/${programId}/cohorts/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedIncubators = [...incubators];
      const incubatorIndex = updatedIncubators.findIndex(inc => inc.id === incubatorId);
      
      if (incubatorIndex !== -1) {
        const programIndex = updatedIncubators[incubatorIndex].programs.findIndex(
          prog => prog.id === programId
        );
        
        if (programIndex !== -1) {
          updatedIncubators[incubatorIndex].programs[programIndex] = {
            ...updatedIncubators[incubatorIndex].programs[programIndex],
            cohorts: response.data
          };
          setIncubators(updatedIncubators);
        }
      }
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const toggleIncubator = (incubatorId) => {
    setExpandedIncubators(prev => {
      const isExpanded = !prev[incubatorId];
      return { ...prev, [incubatorId]: isExpanded };
    });
    
    // Fetch programs if they haven't been loaded yet
    const incubator = incubators.find(inc => inc.id === incubatorId);
    if (incubator && !incubator.programs && expandedIncubators[incubatorId]) {
      fetchPrograms(incubatorId);
    }
  };

  const toggleProgram = (incubatorId, programId) => {
    const key = `${incubatorId}-${programId}`;
    setExpandedPrograms(prev => {
      const isExpanded = !prev[key];
      return { ...prev, [key]: isExpanded };
    });
    
    // Fetch cohorts if they haven't been loaded yet
    const incubator = incubators.find(inc => inc.id === incubatorId);
    if (incubator && incubator.programs) {
      const program = incubator.programs.find(prog => prog.id === programId);
      if (program && !program.cohorts && expandedPrograms[key]) {
        fetchCohorts(incubatorId, programId);
      }
    }
  };

  const navigateToProgramDetails = (incubatorId, programId) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}`);
  };

  const navigateToCohort = (incubatorId, programId, cohortId) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}`);
  };

  if (loading) {
    return <div className="loading">Loading incubators...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-incubators-content">
      <h2 className="page-title">My Incubators</h2>
      
      {incubators.length === 0 ? (
        <div className="no-incubators">You are not part of any incubators yet.</div>
      ) : (
        <div className="incubators-list">
          {incubators.map(incubator => (
            <div key={incubator.id} className="incubator-item">
              <div 
                className="incubator-header" 
                onClick={() => toggleIncubator(incubator.id)}
              >
                <div className="incubator-info">
                  <div className="incubator-logo">
                    <img 
                      src={incubator.logo || ThaparInnovate} 
                      alt={incubator.name || incubator.incubator_name} 
                    />
                  </div>
                  <h3>{incubator.name || incubator.incubator_name}</h3>
                </div>
                <div className="joining-info">
                  <span>Joined: {incubator.joining_date || "N/A"}</span>
                  {expandedIncubators[incubator.id] ? 
                    <KeyboardArrowUp className="expand-icon" /> : 
                    <KeyboardArrowDown className="expand-icon" />
                  }
                </div>
              </div>
              
              {expandedIncubators[incubator.id] && (
                <div className="programs-container">
                  {!incubator.programs ? (
                    <div className="loading-programs">Loading programs...</div>
                  ) : incubator.programs.length === 0 ? (
                    <div className="no-programs">No programs available for this incubator</div>
                  ) : (
                    incubator.programs.map(program => (
                      <div key={program.id} className="program-item">
                        <div 
                          className="program-header"
                          onClick={() => toggleProgram(incubator.id, program.id)}
                        >
                          <div className="program-name">
                            <h4>{program.name}</h4>
                          </div>
                          <div className="program-actions">
                            <button 
                              className="details-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToProgramDetails(incubator.id, program.id);
                              }}
                            >
                              View Details
                            </button>
                            {expandedPrograms[`${incubator.id}-${program.id}`] ? 
                              <KeyboardArrowUp className="expand-icon" /> : 
                              <KeyboardArrowDown className="expand-icon" />
                            }
                          </div>
                        </div>
                        
                        {expandedPrograms[`${incubator.id}-${program.id}`] && (
                          <div className="cohorts-container">
                            {!program.cohorts ? (
                              <div className="loading-cohorts">Loading cohorts...</div>
                            ) : program.cohorts.length === 0 ? (
                              <div className="no-cohorts">No cohorts available for this program</div>
                            ) : (
                              <div className="cohorts-list">
                                {program.cohorts.map(cohort => (
                                  <div 
                                    key={cohort.id} 
                                    className="cohort-item"
                                    onClick={() => navigateToCohort(incubator.id, program.id, cohort.id)}
                                  >
                                    <div className="cohort-name">{cohort.name}</div>
                                    <div className="cohort-date">
                                      {cohort.start_date && cohort.end_date ? 
                                        `${cohort.start_date} - ${cohort.end_date}` : 
                                        "Dates not specified"
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIncubators;
