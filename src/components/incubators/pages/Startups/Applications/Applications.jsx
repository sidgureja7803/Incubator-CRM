import React, { useState, useEffect, useCallback } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Applications.css';
import Modal from 'react-modal';

// Set the app element for the modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const Applications = () => {
  const [programs, setPrograms] = useState([]);
  const [programApplications, setProgramApplications] = useState({});
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  // Memoize the fetchPrograms function to prevent unnecessary re-renders
  const fetchPrograms = useCallback(async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/programs/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setPrograms(response.data);
      setError(null);

      // If there are programs, fetch applications for the first one
      if (response.data.length > 0) {
        const firstProgramId = response.data[0].id;
        setSelectedProgramId(firstProgramId);
        fetchApplications(firstProgramId);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError('Failed to load programs. Please try again.');
      setIsLoading(false);
    }
  }, []);

  // Memoize the fetchApplications function
  const fetchApplications = useCallback(async (programId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    // If we already have this program's applications cached, use them
    if (programApplications[programId]) {
      setApplications(programApplications[programId]);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/applications/${programId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Cache the applications for this program
      const appData = response.data || [];
      setProgramApplications(prev => ({
        ...prev,
        [programId]: appData
      }));
      
      setApplications(appData);
      setError(null);
    } catch (err) {
      console.error(`Error fetching applications for program ${programId}:`, err);
      setError(`Failed to load applications for program ${programId}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [programApplications]);

  // Fetch Q&A separately with its own loading state
  const fetchQuestionsAndAnswers = async (programId, startupId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    try {
      setIsQuestionsLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/program/${programId}/questions/?startup_id=${startupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setQuestionsAndAnswers(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions and answers:', err);
      setQuestionsAndAnswers([]);
      // Don't set global error, just handle locally
      console.warn('Could not load Q&A. Modal will show empty Q&A section.');
    } finally {
      setIsQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);
    fetchApplications(programId);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status || '');
    setRemarks(application.remarks || '');
    setModalIsOpen(true);
    
    // Fetch Q&A only after opening modal
    fetchQuestionsAndAnswers(selectedProgramId, application.startup_id);
  };

  const handleSaveStatus = async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    try {
      setIsSubmitting(true);
      await axios.patch(`${config.api_base_url}/incubator/editapplicationstatus/${selectedApplication.id}/`, {
        status: newStatus,
        remarks: remarks
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update the application in our state
      const updatedApplications = applications.map(app =>
        app.id === selectedApplication.id ? { ...app, status: newStatus, remarks: remarks } : app
      );
      
      // Update both states
      setApplications(updatedApplications);
      setProgramApplications(prev => ({
        ...prev,
        [selectedProgramId]: updatedApplications
      }));
      
      // Clear the form
      setNewStatus('');
      setRemarks('');
      setModalIsOpen(false);
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="applications-container">
      <div className="program-selector">
        <span>Select Program:</span>
        <select 
          value={selectedProgramId || ''}
          onChange={handleProgramChange}
          disabled={isLoading || programs.length === 0}
          className="program-dropdown"
        >
          {programs.length === 0 && <option value="">No programs available</option>}
          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.program_name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading applications...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => selectedProgramId && fetchApplications(selectedProgramId)}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>There are no startups that have applied to this program yet.</p>
        </div>
      ) : (
        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Startup Name</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id}>
                  <td>{application.startup_name}</td>
                  <td>{application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Invalid Date'}</td>
                  <td>
                    <span className={`status-badge ${application.status?.toLowerCase() || 'applied'}`}>
                      {application.status || 'Applied'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-application-btn"
                      onClick={() => handleViewApplication(application)}
                    >
                      View Application
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => !isSubmitting && setModalIsOpen(false)}
        className="application-modal"
        overlayClassName="application-modal-overlay"
      >
        <div className="modal-header">
          <h2>View Application</h2>
          <button 
            className="close-btn" 
            onClick={() => setModalIsOpen(false)}
            disabled={isSubmitting}
          >×</button>
        </div>
        
        <div className="modal-content">
          {isQuestionsLoading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading application details...</p>
            </div>
          ) : questionsAndAnswers.length > 0 ? (
            <div className="qa-container">
              {questionsAndAnswers.map(qa => (
                <div key={qa.id} className="qa-item">
                  <h3 className="question">{qa.question}</h3>
                  <div className="answer">
                    <p>Answer:</p>
                    <p>{qa.answer || 'No answer provided.'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-questions">No questions or answers found for this application.</p>
          )}

          <div className="status-container">
            <h3>Status</h3>
            <div className="status-options">
              <button 
                className={`status-btn ${newStatus === 'Applied' ? 'active' : ''}`}
                onClick={() => setNewStatus('Applied')}
                disabled={isSubmitting}
              >
                Applied
              </button>
              <button 
                className={`status-btn ${newStatus === 'In Progress' ? 'active' : ''}`}
                onClick={() => setNewStatus('In Progress')}
                disabled={isSubmitting}
              >
                In Progress
              </button>
              <button 
                className={`status-btn ${newStatus === 'Accepted' ? 'active' : ''}`}
                onClick={() => setNewStatus('Accepted')}
                disabled={isSubmitting}
              >
                Accepted
              </button>
              <button 
                className={`status-btn ${newStatus === 'Rejected' ? 'active' : ''}`}
                onClick={() => setNewStatus('Rejected')}
                disabled={isSubmitting}
              >
                Rejected
              </button>
            </div>
            
            <div className="remarks-container">
              <label htmlFor="remarks">Remarks</label>
              <textarea 
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks about this application..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="cancel-btn"
              onClick={() => setModalIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              className="save-btn"
              onClick={handleSaveStatus}
              disabled={!newStatus || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;