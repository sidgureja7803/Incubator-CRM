import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import './ProgramDetails.css';

const ProgramDetails = () => {
  const { incubatorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incubator, setIncubator] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchIncubatorAndPrograms();
  }, [incubatorId]);

  const fetchIncubatorAndPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Fetch incubator details
      const incubatorResponse = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setIncubator(incubatorResponse.data);
      
      // Fetch programs for this incubator
      const programsResponse = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setPrograms(programsResponse.data);
    } catch (err) {
      console.error('Error fetching incubator details:', err);
      setError('Failed to load incubator details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgramClick = (programId) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}`);
  };

  const navigateToCohort = (programId, cohortId) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}`);
  };

  const goBack = () => {
    navigate('/startup/incubators/my-incubators');
  };

  if (loading) {
    return <div className="loading">Loading incubator details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="program-details-container">
      <div className="program-details-header">
        <button className="back-button" onClick={goBack}>
          &larr; Back to My Incubators
        </button>
        
        <h1 className="incubator-title">
          {incubator?.incubator_name || incubator?.name || 'Incubator Programs'}
        </h1>
      </div>
      
      {programs.length === 0 ? (
        <div className="no-programs">No programs available for this incubator</div>
      ) : (
        <div className="programs-grid">
          {programs.map(program => (
            <div 
              key={program.id} 
              className="program-card"
              onClick={() => handleProgramClick(program.id)}
            >
              <h3 className="program-name">{program.name}</h3>
              
              <div className="program-details">
                {program.description && (
                  <p className="program-description">
                    {program.description.length > 150 
                      ? program.description.substring(0, 150) + '...' 
                      : program.description}
                  </p>
                )}
                
                <div className="program-meta">
                  <div className="program-status">
                    Status: <span className={`status-${program.status?.toLowerCase() || 'unknown'}`}>
                      {program.status || 'Unknown'}
                    </span>
                  </div>
                  
                  {program.last_date && (
                    <div className="program-deadline">
                      Application Deadline: {program.last_date}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="program-actions">
                <button className="details-btn">View Details</button>
                <button 
                  className="apply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle apply action
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramDetails;


