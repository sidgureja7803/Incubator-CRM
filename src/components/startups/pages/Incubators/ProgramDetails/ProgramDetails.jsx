import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import './ProgramDetails.css';

const ProgramDetails = () => {
  const { incubatorId, programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState(null);
  const [incubator, setIncubator] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [expandedSection, setExpandedSection] = useState('details');

  useEffect(() => {
    fetchProgramDetails();
  }, [incubatorId, programId]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Fetch program details
      const programResponse = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/${programId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setProgram(programResponse.data);
      
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
      
      // Fetch cohorts
      const cohortsResponse = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/${programId}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCohorts(cohortsResponse.data);
    } catch (err) {
      console.error('Error fetching program details:', err);
      setError('Failed to load program details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCohortClick = (cohortId) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}`);
  };

  const goBack = () => {
    navigate('/startup/incubators');
  };

  if (loading) {
    return <div className="loading">Loading program details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!program) {
    return <div className="no-program">Program not found</div>;
  }

  return (
    <div className="program-details-container">
      <div className="program-details-header">
        <button className="back-button" onClick={goBack}>
          &larr; Back to Incubators
        </button>
        <h1 className="program-title">{program.name}</h1>
        {incubator && (
          <div className="incubator-info">
            <span>Incubator: {incubator.incubator_name || incubator.name}</span>
          </div>
        )}
      </div>
      
      <div className="program-content">
        <div className="program-section">
          <div 
            className={`section-header ${expandedSection === 'details' ? 'expanded' : ''}`}
            onClick={() => toggleSection('details')}
          >
            <h2>Program Details</h2>
            {expandedSection === 'details' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </div>
          
          {expandedSection === 'details' && (
            <div className="section-content">
              <div className="program-info-item">
                <div className="info-label">Description:</div>
                <div className="info-value">{program.description || 'No description available'}</div>
              </div>
              
              <div className="program-info-item">
                <div className="info-label">Application Deadline:</div>
                <div className="info-value">{program.last_date || 'Not specified'}</div>
              </div>
              
              <div className="program-info-item">
                <div className="info-label">Status:</div>
                <div className={`info-value status-${program.status?.toLowerCase() || 'unknown'}`}>
                  {program.status || 'Unknown'}
                </div>
              </div>
              
              {program.start_date && (
                <div className="program-info-item">
                  <div className="info-label">Start Date:</div>
                  <div className="info-value">{program.start_date}</div>
                </div>
              )}
              
              {program.end_date && (
                <div className="program-info-item">
                  <div className="info-label">End Date:</div>
                  <div className="info-value">{program.end_date}</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="program-section">
          <div 
            className={`section-header ${expandedSection === 'cohorts' ? 'expanded' : ''}`}
            onClick={() => toggleSection('cohorts')}
          >
            <h2>Cohorts</h2>
            {expandedSection === 'cohorts' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </div>
          
          {expandedSection === 'cohorts' && (
            <div className="section-content">
              {cohorts.length === 0 ? (
                <div className="no-cohorts">No cohorts available for this program</div>
              ) : (
                <div className="cohorts-grid">
                  {cohorts.map(cohort => (
                    <div 
                      key={cohort.id} 
                      className="cohort-card"
                      onClick={() => handleCohortClick(cohort.id)}
                    >
                      <h3 className="cohort-name">{cohort.name}</h3>
                      
                      {(cohort.start_date || cohort.end_date) && (
                        <div className="cohort-dates">
                          <div className="cohort-date-item">
                            <span className="date-label">Start:</span>
                            <span className="date-value">{cohort.start_date || 'Not specified'}</span>
                          </div>
                          <div className="cohort-date-item">
                            <span className="date-label">End:</span>
                            <span className="date-value">{cohort.end_date || 'Not specified'}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="cohort-status">
                        Status: <span className={`status-${cohort.status?.toLowerCase() || 'unknown'}`}>
                          {cohort.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;


