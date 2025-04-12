import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "../../../../../config";
import './ApplyIncubation.css';
import IncubatorLogo from '../../Dashboard/IncuabtorImage.png';

const ApplyIncubation = () => {
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [questions, setQuestions] = useState([
    { id: 'question1', question: 'What problem is your startup trying to solve?' },
    { id: 'question2', question: 'How does your solution address this problem?' },
    { id: 'question3', question: 'What makes your startup unique?' }
  ]);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const handleIncubatorSelect = (incubator) => {
    setSelectedIncubator(incubator);
    setSelectedProgram(null);
    // Fetch programs for this incubator (mock data for now)
    incubator.programs = [
      { 
        id: 1, 
        name: 'ACCELERATE', 
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        start_date: '2023-02-11',
        end_date: '2023-04-05'
      },
      { 
        id: 2, 
        name: 'IGNITE', 
        description: 'A program designed to kickstart early-stage startups with mentorship and funding.',
        start_date: '2023-01-15',
        end_date: '2023-06-30'
      }
    ];
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncubator || !selectedProgram) return;

    setIsSubmitting(true);
    
    // Mock submission - replace with actual API call in production
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitting application:', {
        incubator: selectedIncubator.incubator_name,
        program: selectedProgram.name,
        answers: formData
      });
      
      setShowSuccessMessage(true);
      setFormData({});
      setSelectedProgram(null);
      setSelectedIncubator(null);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="apply-incubation-container">
      <h2>Apply For Incubation</h2>
      
      {showSuccessMessage ? (
        <div className="success-message">
          <div className="success-content">
            <h3>Application Submitted Successfully!</h3>
            <p>Your application has been received. We'll review it and get back to you soon.</p>
            <button onClick={() => setShowSuccessMessage(false)}>Close</button>
          </div>
        </div>
      ) : (
        <>
          <div className="incubators-programs-container">
            <div className="incubators-container">
              <h3>Select an Incubator</h3>
              <div className="incubators-grid">
                {incubators.map((incubator) => (
                  <div
                    key={incubator.id}
                    className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
                    onClick={() => handleIncubatorSelect(incubator)}
                  >
                    <div className="incubator-logo">
                      <img src={incubator.logo || IncubatorLogo} alt={incubator.incubator_name} />
                    </div>
                    <h4>{incubator.incubator_name}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedIncubator && selectedIncubator.programs && (
              <div className="programs-container">
                <h3>Select a Program</h3>
                <div className="programs-grid">
                  {selectedIncubator.programs.map((program) => (
                    <div
                      key={program.id}
                      className={`program-card ${selectedProgram?.id === program.id ? 'active' : ''}`}
                      onClick={() => handleProgramSelect(program)}
                    >
                      <h4>{program.name}</h4>
                      <p>{program.description}</p>
                      <div className="program-dates">
                        <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                        <span>End: {new Date(program.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {selectedProgram && (
            <div className="application-form">
              <h3>Application for {selectedProgram.name}</h3>
              <form onSubmit={handleSubmit}>
                {questions.map((q) => (
                  <div key={q.id} className="form-group">
                    <label>{q.question}</label>
                    <textarea
                      name={q.id}
                      value={formData[q.id] || ''}
                      onChange={handleInputChange}
                      placeholder="Type your answer here..."
                      required
                    ></textarea>
                  </div>
                ))}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="save-draft-btn"
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplyIncubation; 