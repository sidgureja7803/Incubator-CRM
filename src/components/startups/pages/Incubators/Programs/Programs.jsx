import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from "../../../../../config";
import './Programs.css';
import IncubatorLogo from '../../Dashboard/IncuabtorImage.png';

const Programs = () => {
  const { incubatorId, programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const cohortsPerPage = 4;

  useEffect(() => {
    if (incubatorId && programId) {
      fetchProgramDetails();
      fetchCohorts();
    }
  }, [incubatorId, programId]);

  const fetchProgramDetails = async () => {
    try {
      // Mocked program details for demonstration
      setProgram({
        id: programId,
        name: "ACCELERATE",
        description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        start_date: "2023-02-11",
        end_date: "2023-04-05",
        website: "https://venturelab.org.in/ignite-launch-accelerate"
      });
      
      /*
      // Uncomment to use the actual API
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${programId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setProgram(response.data);
      */
    } catch (error) {
      console.error('Error fetching program details:', error);
    }
  };

  const fetchCohorts = async () => {
    try {
      // Mocked cohort data for demonstration
      const mockedCohorts = Array(8).fill().map((_, index) => ({
        id: index + 1,
        name: `04`,
        start_date: "2021-12-08",
        end_date: "2022-04-08",
        status: "Active"
      }));
      
      setCohorts(mockedCohorts);
      
      /*
      // Uncomment to use the actual API
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${programId}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setCohorts(response.data);
      */
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const handleCohortSelect = (cohort) => {
    setSelectedCohort(cohort);
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohort.id}/tasks`);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * cohortsPerPage < cohorts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayedCohorts = cohorts.slice(
    currentPage * cohortsPerPage,
    (currentPage + 1) * cohortsPerPage
  );

  if (!program) {
    return <div className="programs-loading">Loading program details...</div>;
  }

  return (
    <div className="program-container">
      <div className="program-info">
        <div className="program-header">
          <div className="program-logo">
            <img src={IncubatorLogo} alt="Program Logo" />
          </div>
          <div className="program-title">
            <h2>{program.name}</h2>
            <p className="program-description">{program.description}</p>
          </div>
        </div>
        
        <div className="program-meta">
          <div className="meta-item">
            <h4>Start Date</h4>
            <p>{new Date(program.start_date).toLocaleDateString()}</p>
          </div>
          <div className="meta-item">
            <h4>End Date</h4>
            <p>{new Date(program.end_date).toLocaleDateString()}</p>
          </div>
          <div className="meta-item website">
            <h4>Website Link</h4>
            <a href={program.website} target="_blank" rel="noopener noreferrer">
              {program.website}
            </a>
          </div>
        </div>
      </div>

      <div className="cohorts-section">
        <div className="cohorts-grid">
          {displayedCohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="cohort-card"
              onClick={() => handleCohortSelect(cohort)}
            >
              <h3>COHORT {cohort.name}</h3>
              <div className="cohort-details">
                <div className="date-group">
                  <span className="label">Start Date :</span>
                  <span className="value">{new Date(cohort.start_date).toLocaleDateString()}</span>
                </div>
                <div className="date-group">
                  <span className="label">End Date :</span>
                  <span className="value">{new Date(cohort.end_date).toLocaleDateString()}</span>
                </div>
                <div className="status-group">
                  <span className="label">Status :</span>
                  <span className="value">{cohort.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cohorts.length > cohortsPerPage && (
          <div className="pagination-controls">
            <button 
              className="pagination-btn prev" 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
            <button 
              className="pagination-btn next" 
              onClick={handleNextPage}
              disabled={(currentPage + 1) * cohortsPerPage >= cohorts.length}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
