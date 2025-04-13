import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'utils/httpClient';
import config from "config";
import './IncubatorApplicationModal.css';

// Set the app element for accessibility reasons
Modal.setAppElement('#root');

const IncubatorApplicationModal = ({ 
  isOpen, 
  onClose, 
  program,
  onSubmitSuccess 
}) => {
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([
    { id: 'question1', question_name: 'What is the funding of your startup !' },
    { id: 'question2', question_name: 'What is the Product of your Startup !' },
    { id: 'question3', question_name: 'What Impact your startup have in upcoming years !' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    if (program?.id) {
      // In a real application, you would fetch questions from the API
      // fetchQuestionsAndAnswers(program.id);
      console.log("Program selected:", program);
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

      // Simulate API call for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitting answers:', transformedPayload);

      /*
      // Uncomment to use the actual API
      await axios.post(
        `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
        transformedPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      */

      if (action === 'submit') {
        onSubmitSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting application. Please try again.');
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
          <h2>MIETY</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="modal-form">
          {questions.map(question => (
            <div key={question.id} className="form-group">
              <label>{question.question_name}</label>
              <textarea
                name={question.id.toString()}
                value={formData[question.id] || ''}
                onChange={handleInputChange}
                disabled={!isEditMode || isLoading}
                placeholder={`Enter the ${question.question_name.toLowerCase().replace(/!$/, '')}`}
                rows={4}
              />
            </div>
          ))}

          <div className="form-actions">
            {isEditMode && (
              <button
                type="button"
                className="submit-button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Apply'}
              </button>
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