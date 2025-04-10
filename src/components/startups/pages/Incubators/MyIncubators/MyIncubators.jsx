import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from "config";
import './MyIncubators.css';
import IncubatorLogo from '../../../pages/Dashboard/IncuabtorImage.png';

const MyIncubators = () => {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/startupincubator/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setIncubators(response.data);
    } catch (error) {
      console.error('Error fetching incubators:', error);
    }
  };

  const fetchPrograms = async (incubatorId) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleIncubatorClick = async (incubator) => {
    setSelectedIncubator(incubator);
    await fetchPrograms(incubator.id);
  };

  const handleProgramClick = (program) => {
    navigate(`/incubators/programs/${program.id}`);
  };

  return (
    <div className="my-incubators-container">
      <div className="incubators-list">
        {incubators.map((incubator) => (
          <div
            key={incubator.id}
            className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
            onClick={() => handleIncubatorClick(incubator)}
          >
            <img src={incubator.logo_url || IncubatorLogo} alt={incubator.incubator_name} className="incubator-logo" />
            <h3>{incubator.incubator_name}</h3>
            <p>{incubator.description}</p>
          </div>
        ))}
      </div>

      {selectedIncubator && (
        <div className="programs-section">
          <h2>Programs under {selectedIncubator.incubator_name}</h2>
          <div className="programs-grid">
            {programs.map((program) => (
              <div
                key={program.id}
                className="program-card"
                onClick={() => handleProgramClick(program)}
              >
                <h3>{program.name}</h3>
                <p>{program.description}</p>
                <div className="program-meta">
                  <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                  <span>End: {new Date(program.end_date).toLocaleDateString()}</span>
                </div>
                <div className={`status-badge ${program.status.toLowerCase()}`}>
                  {program.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIncubators; 