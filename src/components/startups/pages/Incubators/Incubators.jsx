import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import { useNavigate } from 'react-router-dom';
import './Incubators.css';
import IncubatorLogo from '../../pages/Dashboard/IncuabtorImage.png';

const Incubators = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-incubators');
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [cohortTab, setCohortTab] = useState('documents');
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [isSubmitPopupVisible, setIsSubmitPopupVisible] = useState(false);

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

  const handleIncubatorClick = async (incubator) => {
    if (activeTab === 'my-incubators') {
      try {
        const response = await axios.get(
          `${config.api_base_url}/startup/incubators/${incubator.id}/programs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
            },
          }
        );
        setSelectedIncubator({
          ...incubator,
          programs: response.data
        });
        setSelectedProgram(null);
        setSelectedCohort(null);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    } else {
      try {
        const response = await axios.get(
          `${config.api_base_url}/startup/incubators/program-questions/${incubator.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
            },
          }
        );
        setQuestions(response.data);
        const initialFormData = {};
        response.data.forEach((question) => {
          initialFormData[question.id] = '';
        });
        setFormData(initialFormData);
        setSelectedIncubator(incubator);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  };

  const handleProgramClick = async (program) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${program.id}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setSelectedProgram({
        ...program,
        cohorts: response.data
      });
      setSelectedCohort(null);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const handleCohortClick = (cohort) => {
    setSelectedCohort(cohort);
    setCohortTab('documents');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    submitAnswers('save').finally(() => {
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    setIsSubmitPopupVisible(true);
  };

  const confirmSubmit = () => {
    submitAnswers('submit');
    setIsSubmitPopupVisible(false);
  };

  const submitAnswers = (action) => {
    const transformedPayload = {
      action: action,
      answers: Object.entries(formData)
        .filter(([questionId, answer]) => questionId && answer !== '')
        .map(([questionId, answer]) => ({
          program_question_id: parseInt(questionId, 10),
          answer: answer || '',
        })),
    };

    return axios.post(
      `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
      transformedPayload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
        },
      }
    )
    .then((response) => {
      if (action === 'save') {
        setIsSuccessPopupVisible(true);
        setTimeout(() => setIsSuccessPopupVisible(false), 3000);
      }
      setSelectedIncubator(null);
      setFormData({});
      setQuestions([]);
    })
    .catch((error) => {
      console.error('Error saving form:', error.response?.data || error);
      alert(`Error: ${error.response?.data?.error || 'An error occurred'}`);
    });
  };

  return (
    <div className="incubators-page">
      <div className="breadcrumb">
        <span>Incubators</span>
        {activeTab === 'my-incubators' && <span>/ My Incubators</span>}
        {activeTab === 'apply' && <span>/ Apply For Incubation</span>}
      </div>

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
        <div className="my-incubators-content">
          <div className="incubators-grid">
            {incubators.map((incubator) => (
              <div
                key={incubator.id}
                className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
                onClick={() => handleIncubatorClick(incubator)}
              >
                <div className="incubator-logo">
                  <img src={IncubatorLogo} alt={incubator.incubator_name} />
                </div>
                <div className="incubator-info">
                  <h3>{incubator.incubator_name}</h3>
                </div>
              </div>
            ))}
          </div>

          {selectedIncubator && (
            <div className="programs-section">
              <h2>{selectedIncubator.incubator_name} Programs</h2>
              <div className="programs-list">
                {selectedIncubator.programs?.map((program) => (
                  <div
                    key={program.id}
                    className={`program-card ${selectedProgram?.id === program.id ? 'active' : ''}`}
                    onClick={() => handleProgramClick(program)}
                  >
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                    <div className="program-meta">
                      <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                      <span>End: {new Date(program.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProgram && (
            <div className="cohorts-section">
              <h2>Cohorts under {selectedProgram.name}</h2>
              <div className="cohorts-grid">
                {selectedProgram.cohorts?.map((cohort) => (
                  <div
                    key={cohort.id}
                    className={`cohort-card ${selectedCohort?.id === cohort.id ? 'active' : ''}`}
                    onClick={() => handleCohortClick(cohort)}
                  >
                    <h4>COHORT {cohort.name}</h4>
                    <div className="cohort-details">
                      <p>Start Date: {new Date(cohort.start_date).toLocaleDateString()}</p>
                      <p>End Date: {new Date(cohort.end_date).toLocaleDateString()}</p>
                      <p>Status: <span className={`status-badge ${cohort.status?.toLowerCase()}`}>{cohort.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCohort && (
            <div className="cohort-details-section">
              <div className="cohort-tabs">
                <button
                  className={`tab ${cohortTab === 'documents' ? 'active' : ''}`}
                  onClick={() => setCohortTab('documents')}
                >
                  Documents
                </button>
                <button
                  className={`tab ${cohortTab === 'members' ? 'active' : ''}`}
                  onClick={() => setCohortTab('members')}
                >
                  Members
                </button>
                <button
                  className={`tab ${cohortTab === 'mentors' ? 'active' : ''}`}
                  onClick={() => setCohortTab('mentors')}
                >
                  Mentors
                </button>
                <button
                  className={`tab ${cohortTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setCohortTab('admins')}
                >
                  Admins
                </button>
                <button
                  className={`tab ${cohortTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setCohortTab('tasks')}
                >
                  Tasks
                </button>
              </div>
              <div className="cohort-tab-content">
                {/* Content for each tab will be rendered here */}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'apply' && (
        <div className="apply-incubation-content">
          <div className="available-incubators">
            {incubators.map((incubator) => (
              <div
                key={incubator.id}
                className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
                onClick={() => handleIncubatorClick(incubator)}
              >
                <div className="incubator-logo">
                  <img src={IncubatorLogo} alt={incubator.name} />
                </div>
                <h3>{incubator.name}</h3>
                <div className="expand-icon">+</div>
              </div>
            ))}
          </div>

          {selectedIncubator && questions.length > 0 && (
            <div className="application-form">
              <h2>Apply to {selectedIncubator.name}</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                {questions.map((question) => (
                  <div key={question.id} className="form-group">
                    <label>{question.question}</label>
                    <textarea
                      name={question.id}
                      value={formData[question.id] || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your answer"
                      required
                    />
                  </div>
                ))}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </button>
                  <button 
                    type="button" 
                    className="submit-button" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {isSuccessPopupVisible && (
        <div className="success-popup">
          Application saved successfully!
        </div>
      )}

      {isSubmitPopupVisible && (
        <div className="submit-popup">
          <h3>Confirm Submission</h3>
          <p>Are you sure you want to submit your application? This action cannot be undone.</p>
          <div className="popup-actions">
            <button onClick={() => setIsSubmitPopupVisible(false)}>Cancel</button>
            <button onClick={confirmSubmit}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incubators; 