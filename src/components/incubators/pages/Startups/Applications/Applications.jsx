import React, { useState, useEffect, useCallback, useTransition } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Applications.css';
import Modal from 'react-modal';
import ThaparInnovate from './IncuabtorImage.png';
import { KeyboardArrowDown, KeyboardArrowUp, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../../../../../hooks/useAuth';

// Set the app element for the modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const Applications = () => {
  const { isAuthenticated } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [programs, setPrograms] = useState([]);
  const [expandedPrograms, setExpandedPrograms] = useState({});
  const [programApplications, setProgramApplications] = useState({});
  const [applicationModalIsOpen, setApplicationModalIsOpen] = useState(false);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const fetchPrograms = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingPrograms(true);
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/programs/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedPrograms = response.data || [];
      setPrograms(fetchedPrograms);
      
      const initialExpandedState = {};
      fetchedPrograms.forEach(program => {
        initialExpandedState[program.id] = false;
      });
      setExpandedPrograms(initialExpandedState);
      setError(null);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError("Failed to fetch programs.");
    } finally {
      setIsLoadingPrograms(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const toggleProgram = (programId) => {
    startTransition(() => {
      setExpandedPrograms(prev => ({
        ...prev,
        [programId]: !prev[programId]
      }));
      if (!expandedPrograms[programId] && !programApplications[programId] && !isLoadingApplications[programId]) {
        fetchApplications(programId);
      }
    });
  };

  const fetchApplications = useCallback(async (programId) => {
    if (!isAuthenticated) return;
    
    setIsLoadingApplications(prev => ({ ...prev, [programId]: true }));
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/applications/${programId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProgramApplications(prev => ({
        ...prev,
        [programId]: response.data || []
      }));
      setError(null);
    } catch (error) {
      console.error(`Error fetching applications for program ${programId}:`, error);
      setError(`Failed to fetch applications for program ${programId}.`);
      setProgramApplications(prev => ({
        ...prev,
        [programId]: []
      }));
    } finally {
      setIsLoadingApplications(prev => ({ ...prev, [programId]: false }));
    }
  }, [isAuthenticated]);

  const fetchQuestionsAndAnswers = useCallback(async (programId, startupId) => {
    if (!isAuthenticated) return;
    
    setIsLoadingQuestions(true);
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/program/${programId}/questions/?startup_id=${startupId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setQuestionsAndAnswers(response.data || []);
    } catch (error) {
      console.error('Error fetching questions and answers:', error);
      setQuestionsAndAnswers([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [isAuthenticated]);

  const handleViewApplicationClick = (application) => {
    startTransition(() => {
      setSelectedApplication(application);
      setNewStatus(application.status || '');
      setRemarks(application.remarks || '');
      fetchQuestionsAndAnswers(application.program_id, application.startup_id);
      setApplicationModalIsOpen(true);
    });
  };

  const handleModalClose = () => {
    setApplicationModalIsOpen(false);
    setSelectedApplication(null);
    setQuestionsAndAnswers([]);
    setNewStatus('');
    setRemarks('');
  };

  const handleSaveStatus = async () => {
    if (!selectedApplication) return;
    setIsSubmittingStatus(true);
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      await axios.patch(`${config.api_base_url}/incubator/editapplicationstatus/${selectedApplication.id}/`, {
        status: newStatus,
        remarks: remarks
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const programId = selectedApplication.program_id;
      setProgramApplications(prev => ({
        ...prev,
        [programId]: (prev[programId] || []).map(app =>
          app.id === selectedApplication.id ? { ...app, status: newStatus, remarks: remarks } : app
        )
      }));

      handleModalClose();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  if (isLoadingPrograms) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading programs...</p>
      </div>
    );
  }

  return (
    <div className="applications-container">
      {error && <div className="error-message"><p>{error}</p></div>}

      {programs.length === 0 && !isLoadingPrograms ? (
        <div className="no-applications">
          <p>No programs found.</p>
        </div>
      ) : (
        <div className="applications-content">
          {programs.map(program => (
            <div key={program.id} className="program-card">
              <div 
                className="program-header" 
                onClick={() => toggleProgram(program.id)}
              >
                <div className="program-header-left">
                  <img src={ThaparInnovate} alt="Program Logo" className="program-logo" />
                  <h3 className="program-name">{program.program_name}</h3>
                </div>
                
                <button className="expand-button">
                  {expandedPrograms[program.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </button>
              </div>

              {expandedPrograms[program.id] && (
                <div className="applications-list-container">
                  {isLoadingApplications[program.id] ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <p>Loading applications...</p>
                    </div>
                  ) : (programApplications[program.id] || []).length === 0 ? (
                    <div className="no-applications-message">
                      <p>No applications for this program.</p>
                    </div>
                  ) : (
                    <div className="applications-list">
                      {(programApplications[program.id] || []).map(application => (
                        <div key={application.id} className="application-card">
                          <div className="application-header">
                            <div className="application-logo">
                              <img src={ThaparInnovate} alt="Startup Logo" /> 
                            </div>
                            <div className="application-title">
                              <h3>{application.startup_name}</h3>
                              <p>{application.founder_name || 'Founder'}</p>
                            </div>
                          </div>
                          
                          <div className="application-details">
                            <div className="detail-row">
                              <span className="detail-label">Status:</span>
                              <span className={`status-badge ${application.status?.toLowerCase()}`}>
                                {application.status || 'Applied'}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Applied On:</span>
                              <span className="detail-value">
                                {new Date(application.created_at).toLocaleDateString() || 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="application-actions">
                            <button 
                              className="view-button"
                              onClick={() => handleViewApplicationClick(application)}
                            >
                              View Application
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={applicationModalIsOpen}
        onRequestClose={handleModalClose}
        className="application-modal"
        overlayClassName="modal-overlay"
        contentLabel="Application Details"
      >
        {selectedApplication && (
          <div className="modal-content">
            <div className="modal-header">
              <h2>View Application: {selectedApplication.startup_name}</h2>
              <button className="close-button" onClick={handleModalClose} disabled={isSubmittingStatus}>×</button>
            </div>

            <div className="modal-body">
              <div className="questions-section">
                <h3>Application Questions</h3>
                {isLoadingQuestions ? (
                   <div className="loading-container small-spinner">
                    <div className="spinner"></div>
                   </div>
                ) : questionsAndAnswers.length > 0 ? (
                  questionsAndAnswers.map((qa, index) => (
                    <div key={index} className="question-answer">
                      <h4>{qa.question}</h4>
                      <div className="answer">
                        <p>Answer:</p>
                        <p>{qa.answer || 'No answer provided.'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No questions found for this application.</p>
                )}
              </div>

              <div className="status-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  {['Applied', 'In Progress', 'Accepted', 'Rejected'].map(status => (
                    <button
                      key={status}
                      className={`status-btn ${newStatus === status ? 'active' : ''}`}
                      onClick={() => setNewStatus(status)}
                      disabled={isSubmittingStatus}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="remarks-section">
                  <label htmlFor="remarks">Remarks (Optional)</label>
                  <textarea 
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks here..."
                    rows={3}
                    disabled={isSubmittingStatus}
                  />
                </div>
              </div>

              <div className="action-buttons">
                 <button 
                    className="cancel-button" 
                    onClick={handleModalClose} 
                    disabled={isSubmittingStatus}
                >
                    Cancel
                </button>
                <button 
                    className="save-button" 
                    onClick={handleSaveStatus} 
                    disabled={!newStatus || isSubmittingStatus}
                >
                  {isSubmittingStatus ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applications;