import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from 'config';
import { KeyboardArrowDown, KeyboardArrowUp, Close } from '@mui/icons-material';
import ThaparInnovate from './Incubator.png';
import './ApplyIncubation.css';

const ApplyIncubation = () => {
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrograms, setShowPrograms] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitPopupVisible, setIsSubmitPopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/list`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setIncubators(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching incubators:', err);
      setError('Failed to load incubators. Please try again later.');
      setLoading(false);
    }
  };

  const fetchPrograms = (incubatorId) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    axios
      .get(`${config.api_base_url}/startup/incubators/${incubatorId}/programs`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response) => {
        const updatedIncubators = [...incubators];
        const incubatorIndex = updatedIncubators.findIndex(inc => inc.id === incubatorId);
        if (incubatorIndex !== -1) {
          updatedIncubators[incubatorIndex] = {
            ...updatedIncubators[incubatorIndex],
            programs: response.data
          };
          setIncubators(updatedIncubators);
          setSelectedIncubator(updatedIncubators[incubatorIndex]);
        }
      })
      .catch((err) => {
        console.error("Error fetching programs:", err);
      });
  };

  const togglePrograms = (incubatorId) => {
    setShowPrograms((prev) => ({
      ...prev,
      [incubatorId]: !prev[incubatorId],
    }));
    
    // Fetch programs if they haven't been loaded yet
    const incubator = incubators.find(inc => inc.id === incubatorId);
    if (incubator && !incubator.programs) {
      fetchPrograms(incubatorId);
    }
  };

  const openModal = (program) => {
    setCurrentProgram(program);
    setModalIsOpen(true);
    setIsEditMode(!program.submitted);
    fetchQuestionsAndAnswers(program.id);
  };

  const fetchQuestionsAndAnswers = (programId) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    axios
      .get(
        `${config.api_base_url}/startup/incubators/program/${programId}/questions-answers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      )
      .then((response) => {
        if (response.data.length > 0) {
          const answersData = {};
          const questionsData = response.data.map((item) => {
            answersData[item.question_id] = item.answer;
            return {
              id: item.question_id,
              question_name: item.question,
            };
          });
          setFormData(answersData);
          setQuestions(questionsData);
        } else {
          fetchQuestions(programId);
        }
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  };

  const fetchQuestions = (programId) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    axios
      .get(
        `${config.api_base_url}/startup/incubators/program/${programId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      )
      .then((response) => {
        setQuestions(response.data);
        const initialFormData = {};
        response.data.forEach((question) => {
          initialFormData[question.id] = "";
        });
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({});
    setQuestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitPopupVisible(true);
  };

  const confirmSubmit = () => {
    submitAnswers("submit");
    setIsSubmitPopupVisible(false);
  };

  const handleSave = () => {
    setIsLoading(true);
    submitAnswers("save").finally(() => {
      setIsLoading(false);
    });
  };

  const submitAnswers = (action) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const transformedPayload = {
      action: action,
      answers: Object.entries(formData)
        .filter(([questionId, answer]) => questionId && answer !== "")
        .map(([questionId, answer]) => ({
          program_question_id: parseInt(questionId, 10),
          answer: answer || "",
        })),
    };

    return axios.post(
      `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
      transformedPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    )
    .then((response) => {
      if (action === "save") {
        setIsSuccessPopupVisible(true);
        setTimeout(() => setIsSuccessPopupVisible(false), 3000);
        if (selectedIncubator && currentProgram) {
          const updatedPrograms = selectedIncubator.programs.map((program) =>
            program.id === currentProgram.id
              ? { ...program, submitted: false }
              : program
          );
          setSelectedIncubator({
            ...selectedIncubator,
            programs: updatedPrograms,
          });
        }
      } else {
        if (selectedIncubator && currentProgram) {
          const updatedPrograms = selectedIncubator.programs.map((program) =>
            program.id === currentProgram.id
              ? { ...program, submitted: true }
              : program
          );
          setSelectedIncubator({
            ...selectedIncubator,
            programs: updatedPrograms,
          });
        }
      }
      closeModal();
    })
    .catch((error) => {
      console.error("Error saving form:", error.response?.data || error);
      alert(`Error: ${error.response?.data?.error || "An error occurred"}`);
    });
  };

  return (
    <div className="apply-incubation-content">
      {loading ? (
        <div className="loading">Loading incubators...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : incubators.length === 0 ? (
        <div className="no-incubators">
          <p>No incubators available for application.</p>
        </div>
      ) : (
        <div className="incubators-list">
          {incubators.map((incubator) => (
            <div key={incubator.id} className="incubator-container">
              <div 
                className="incubator-header"
                onClick={() => togglePrograms(incubator.id)}
              >
                <div className="incubator-info">
                  <div className="incubator-logo">
                    <img src={incubator.logo || ThaparInnovate} alt={incubator.incubator_name} />
                  </div>
                  <h3>{incubator.incubator_name}</h3>
                </div>
                <div className="expand-icon">
                  {showPrograms[incubator.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </div>
              </div>
              
              {showPrograms[incubator.id] && incubator.programs && (
                <div className="programs-section">
                  {incubator.programs.map((program) => (
                    <div key={program.id} className="program-item">
                      <div className="program-info">
                        <h4>{program.name}</h4>
                        <p className="last-date">Last Date: {program.last_date}</p>
                      </div>
                      <div className="program-actions">
                        <button 
                          className="details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle details view
                          }}
                        >
                          Details
                        </button>
                        <button 
                          className="apply-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(program);
                          }}
                          disabled={program.submitted}
                        >
                          {program.submitted ? 'Applied' : 'Apply'}
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

      {modalIsOpen && (
        <div className="modal-overlay">
          <div className="application-modal">
            <div className="modal-header">
              <h2>{currentProgram?.name || 'Application Questions'}</h2>
              <button className="close-button" onClick={closeModal}>
                <Close />
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                  <div key={question.id} className="form-group">
                    <label className="question-label">{question.question_name}</label>
                    <textarea
                      name={question.id}
                      value={formData[question.id] || ''}
                      onChange={handleInputChange}
                      className="question-textarea"
                      placeholder={
                        question.question_name.toLowerCase().includes('funding') ? 'Enter the Fundings' :
                        question.question_name.toLowerCase().includes('product') ? 'Enter the product' :
                        'Enter your Update here !!'
                      }
                      disabled={!isEditMode || isLoading}
                      required
                    />
                  </div>
                ))}
                <div className="form-actions">
                  {isEditMode && (
                    <>
                      <button
                        type="button" 
                        className="save-btn"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Draft'}
                      </button>
                      <button
                        type="submit"
                        className="apply-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Submitting...' : 'Apply'}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isSubmitPopupVisible && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit? You won't be able to edit after submission.</p>
            <div className="confirm-actions">
              <button onClick={confirmSubmit}>Yes, Submit</button>
              <button onClick={() => setIsSubmitPopupVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isSuccessPopupVisible && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <h3>Saved Successfully</h3>
            <p>Your answers have been saved as a draft.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyIncubation;
