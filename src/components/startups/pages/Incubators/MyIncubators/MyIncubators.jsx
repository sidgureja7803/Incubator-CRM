import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import './MyIncubators.css';

const MyIncubators = () => {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [loading, setLoading] = useState(false);
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
        setIncubators([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching incubators:', error);
      setError('Failed to fetch incubators. Please try again later.');
      setIncubators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIncubatorClick = async (incubator) => {
    if (selectedIncubator?.id === incubator.id) {
      setSelectedIncubator(null);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubator.id}/programs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedIncubator({
        ...incubator,
        programs: Array.isArray(response.data) ? response.data : []
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgramClick = async (program) => {
    if (!selectedIncubator) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${selectedIncubator.id}/programs/${program.id}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // If there's only one cohort, navigate directly to it
      if (response.data.length === 1) {
        navigate(`/startup/incubators/${selectedIncubator.id}/programs/${program.id}/cohorts/${response.data[0].id}`);
      } else if (response.data.length > 1) {
        // Store cohorts in program and show cohorts list
        const updatedProgram = {
          ...program,
          cohorts: response.data
        };
        
        // Update the selectedIncubator programs array to include cohorts for this program
        const updatedPrograms = selectedIncubator.programs.map(p => 
          p.id === program.id ? updatedProgram : p
        );
        
        setSelectedIncubator({
          ...selectedIncubator,
          programs: updatedPrograms
        });
      } else {
        alert('No cohorts found for this program.');
      }
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      setError('Failed to fetch cohorts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCohortClick = (program, cohort) => {
    navigate(`/startup/incubators/${selectedIncubator.id}/programs/${program.id}/cohorts/${cohort.id}`);
  };

  if (loading && !incubators.length) {
    return <div className="loading">Loading incubators...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-incubators-container">
      {incubators.length === 0 ? (
        <div className="no-incubators">
          <p>No incubators found. Please check back later.</p>
        </div>
      ) : (
        <>
          <div className="my-incubators-grid">
            {incubators.map((incubator) => (
              <div
                key={incubator.id}
                className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
                onClick={() => handleIncubatorClick(incubator)}
              >
                <div className="incubator-logo">
                  <img src={incubator.logo} alt={incubator.name} />
                </div>
                <div className="incubator-info">
                  <h3 className="incubator-name">{incubator.name}</h3>

                </div>
              </div>
            ))}
          </div>

          {selectedIncubator && selectedIncubator.programs && selectedIncubator.programs.length > 0 && (
            <div className="programs-container">
              <h2>Programs under {selectedIncubator.name}</h2>
              <div className="programs-list">
                {selectedIncubator.programs.map((program) => (
                  <div key={program.id} className="program-item">
                    <div className="program-header" onClick={() => handleProgramClick(program)}>
                      <div className="program-logo">
                        <img src={program.logo} alt={program.name} />
                      </div>
                      <div className="program-info">
                        <h3>{program.name}</h3>
                        <p className="program-description">{program.description}</p>
                      </div>
                    </div>
                    <div className="program-meta">
                      <div className="program-dates">
                        <div className="date-item">
                          <span className="date-label">Start Date</span>
                          <span className="date-value">
                            {new Date(program.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">End Date</span>
                          <span className="date-value">
                            {new Date(program.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="program-website">
                        <span className="website-label">Website Link</span>
                        <a 
                          href={program.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="website-url"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {program.website}
                        </a>
                      </div>
                    </div>
                    
                    {program.cohorts && program.cohorts.length > 0 && (
                      <div className="cohorts-list">
                        <h4>Cohorts</h4>
                        {program.cohorts.map(cohort => (
                          <div 
                            key={cohort.id} 
                            className="cohort-item"
                            onClick={() => handleCohortClick(program, cohort)}
                          >
                            <h5>{cohort.name}</h5>
                            <p>{cohort.description}</p>
                            <div className="cohort-dates">
                              <span>Duration: {new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}</span>
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
        </>
      )}
    </div>
  );
};

export default MyIncubators;
