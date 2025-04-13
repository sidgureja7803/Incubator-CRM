import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import config from 'config';
import './ApplyIncubation.css';

Modal.setAppElement('#root');

const ApplyIncubation = () => {
  const [incubators, setIncubators] = useState([]);
  const [expandedIncubator, setExpandedIncubator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});

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
      setError('Failed to fetch available incubators');
    } finally {
      setLoading(false);
    }
  };

  const toggleIncubator = async (incubatorId) => {
    if (expandedIncubator === incubatorId) {
      setExpandedIncubator(null);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedIncubator = incubators.find(inc => inc.id === incubatorId);
      if (updatedIncubator) {
        updatedIncubator.programs = Array.isArray(response.data) ? response.data : [];
        setExpandedIncubator(incubatorId);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (program) => {
    setSelectedProgram(program);
    setShowModal(true);
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/program/${program.id}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuestions(response.data);
      const initialFormData = {};
      response.data.forEach(question => {
        initialFormData[question.id] = '';
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch application questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
    setFormData({});
    setQuestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedProgram) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const transformedAnswers = Object.entries(formData).map(([questionId, answer]) => ({
        program_question_id: parseInt(questionId, 10),
        answer
      }));

      await axios.post(
        `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
        {
          action: 'submit',
          answers: transformedAnswers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      handleCloseModal();
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !incubators.length) {
    return <div className="loading">Loading incubators...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="apply-incubation-container">
      <div className="apply-incubation-header">
        <div className="tab-container">
          <button className="tab">My Incubators</button>
          <button className="tab active">Apply For Incubation</button>
        </div>
      </div>

      <div className="apply-incubation-content">
        {incubators.length === 0 ? (
          <div className="no-incubators">
            <p>No available incubators found. Please check back later.</p>
          </div>
        ) : (
          incubators.map((incubator) => (
            <div key={incubator.id} className="incubator-card">
              <div className="incubator-header" onClick={() => toggleIncubator(incubator.id)}>
                <div className="incubator-logo">
                  <img src={incubator.logo} alt={incubator.name} />
                </div>
                <h3>{incubator.name}</h3>
                <div className="expand-icon">
                  {expandedIncubator === incubator.id ? '−' : '+'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>{selectedProgram?.name}</h2>
            <button className="close-button" onClick={handleCloseModal}>×</button>
          </div>

          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            {questions.map(question => (
              <div key={question.id} className="form-group">
                <label>{question.question_name}</label>
                <textarea
                  name={question.id}
                  value={formData[question.id] || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your answer here !!"
                  disabled={loading}
                />
              </div>
            ))}

            <div className="form-actions">
              <button 
                type="button" 
                className="apply-button" 
                onClick={handleSubmit}
                disabled={loading}
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ApplyIncubation;
