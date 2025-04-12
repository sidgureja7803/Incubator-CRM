import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from "../../../../../config";
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
      // In a real-world scenario, we'd fetch this data from the API
      // But for now, we'll use mock data to match the screenshots
      const mockIncubators = [
        {
          id: 1,
          incubator_name: "SRM IAIC",
          logo: IncubatorLogo,
          joining_date: "2021-12-08",
          description: "SRM Institute for Advanced Innovation and Collaboration"
        },
        {
          id: 2,
          incubator_name: "Venture Lab",
          logo: IncubatorLogo,
          joining_date: "2021-12-08",
          description: "Thapar Institute's incubation center"
        },
        {
          id: 3,
          incubator_name: "Venture Lab",
          logo: IncubatorLogo,
          joining_date: "2021-12-08",
          description: "Thapar Institute's incubation center"
        },
        {
          id: 4,
          incubator_name: "Venture Lab",
          logo: IncubatorLogo,
          joining_date: "2021-12-08",
          description: "Thapar Institute's incubation center"
        }
      ];
      
      setIncubators(mockIncubators);

      /*
      // Uncomment this to use actual API
      const response = await axios.get(
        `${config.api_base_url}/startup/startupincubator/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setIncubators(response.data);
      */
    } catch (error) {
      console.error('Error fetching incubators:', error);
    }
  };

  const fetchPrograms = async (incubatorId) => {
    try {
      // Mock data for programs
      const mockPrograms = [
        {
          id: 1,
          name: "ACCELERATE",
          description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
          start_date: "2023-02-11",
          end_date: "2023-04-05",
          status: "Active"
        }
      ];
      
      setPrograms(mockPrograms);
      
      /*
      // Uncomment this to use actual API
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setPrograms(response.data);
      */
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleIncubatorClick = async (incubator) => {
    setSelectedIncubator(incubator);
    await fetchPrograms(incubator.id);
  };

  const handleProgramClick = (program) => {
    navigate(`/startup/incubators/${selectedIncubator.id}/programs/${program.id}`);
  };

  return (
    <div className="my-incubators-container">
      <h2>My Incubators</h2>
      
      <div className="incubators-grid">
        {incubators.map((incubator) => (
          <div
            key={incubator.id}
            className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
            onClick={() => handleIncubatorClick(incubator)}
          >
            <img src={incubator.logo} alt={incubator.incubator_name} className="incubator-logo" />
            <div className="card-content">
              <h3>{incubator.incubator_name}</h3>
              <div className="joining-date">
                <span>Joining Date:</span>
                <span>{new Date(incubator.joining_date).toLocaleDateString()}</span>
              </div>
            </div>
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
                <div className="program-header">
                  <div className="program-logo">
                    <img src={IncubatorLogo} alt="Program Logo" />
                  </div>
                  <h3>{program.name}</h3>
                </div>
                <p className="program-description">{program.description}</p>
                <div className="program-footer">
                  <div className="program-dates">
                    <div className="date-group">
                      <span className="date-label">Start Date</span>
                      <span className="date-value">{new Date(program.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="date-group">
                      <span className="date-label">End Date</span>
                      <span className="date-value">{new Date(program.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="program-link">
                    <span className="website-label">Website Link</span>
                    <a href="https://venturelab.org.in/ignite-launch-accelerate" target="_blank" rel="noopener noreferrer" className="website-url">
                      https://venturelab.org.in/ignite-launch-accelerate
                    </a>
                  </div>
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