import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import config from '../../../../config';

const IncubatorApplicationModal = ({ 
  isOpen, 
  onClose, 
  program,
  onSubmitSuccess 
}) => {
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    if (program?.id) {
      fetchQuestionsAndAnswers(program.id);
    }
  }, [program]);

  const fetchQuestionsAndAnswers = async (programId) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/program/${programId}/questions-answers/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.length > 0) {
        const answersData = {};
        const questionsData = response.data.map(item => {
          answersData[item.question_id] = item.answer;
          return {
            id: item.question_id,
            question_name: item.question
          };
        });
        setFormData(answersData);
        setQuestions(questionsData);
        setIsEditMode(!program.submitted);
      } else {
        fetchQuestions(programId);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const fetchQuestions = async (programId) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/program/${programId}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` }
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await submitAnswers('save');
  };

  const handleSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const submitAnswers = async (action) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const transformedPayload = {
        action,
        answers: Object.entries(formData)
          .filter(([_, answer]) => answer !== '')
          .map(([questionId, answer]) => ({
            program_question_id: parseInt(questionId, 10),
            answer
          }))
      };

      await axios.post(
        `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
        transformedPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (action === 'submit') {
        onSubmitSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsLoading(false);
      setShowConfirmSubmit(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="application-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{program?.program_name}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form className="application-form">
          {questions.map(question => (
            <div key={question.id} className="form-group">
              <label>{question.question_name}</label>
              <input
                type="text"
                name={question.id.toString()}
                value={formData[question.id] || ''}
                onChange={handleInputChange}
                disabled={!isEditMode}
                placeholder="Type your answer here"
              />
            </div>
          ))}

          <div className="form-actions">
            {isEditMode && (
              <>
                <button
                  type="button"
                  className="save-button"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {showConfirmSubmit && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit? You won't be able to edit after submission.</p>
            <div className="confirm-actions">
              <button onClick={() => submitAnswers('submit')}>Yes, Submit</button>
              <button onClick={() => setShowConfirmSubmit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default IncubatorApplicationModal; 