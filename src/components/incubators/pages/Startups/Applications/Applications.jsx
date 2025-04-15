import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${config.api_base_url}/incubator/programs/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        });
        setPrograms(response.data);

        // If there are programs, fetch applications for the first one
        if (response.data.length > 0) {
          const firstProgramId = response.data[0].id;
          setSelectedProgramId(firstProgramId);
          fetchApplications(firstProgramId);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        setError('Error fetching programs');
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const fetchApplications = async (programId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/applications/${programId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProgramApplications(prev => ({
        ...prev,
        [programId]: response.data
      }));
      setApplications(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching applications for program ${programId}:`, error);
      setError(`Error fetching applications for program ${programId}`);
      setIsLoading(false);
    }
  };

  const fetchQuestionsAndAnswers = async (programId, startupId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/program/${programId}/questions/?startup_id=${startupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestionsAndAnswers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions and answers:', error);
      setError('Error fetching questions and answers');
      setIsLoading(false);
    }
  };

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);
    fetchApplications(programId);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    fetchQuestionsAndAnswers(selectedProgramId, application.startup_id);
    setModalIsOpen(true);
  };

  const handleSaveStatus = async () => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      await axios.patch(`${config.api_base_url}/incubator/editapplicationstatus/${selectedApplication.id}/`, {
        status: newStatus,
        remarks: remarks
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Update the applications list with the new status and remarks
      setApplications(applications.map(app =>
        app.id === selectedApplication.id ? { ...app, status: newStatus, remarks: remarks } : app
      ));
      // Clear the new status and remarks after saving
      setNewStatus('');
      setRemarks('');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Error updating application status');
    }
  };

  if (isLoading && (!programs.length || !applications.length)) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="applications-container">
      <div className="program-selector">
        <label htmlFor="program-select">Select Program:</label>
        <select 
          id="program-select" 
          value={selectedProgramId || ''}
          onChange={handleProgramChange}
        >
          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.program_name}
            </option>
          ))}
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>There are no startups that have applied to this program yet.</p>
        </div>
      ) : (
        <div className="applications-table">
          <table>
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
                  <td>{new Date(application.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
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
        onRequestClose={() => setModalIsOpen(false)}
        className="application-modal"
        overlayClassName="application-modal-overlay"
      >
        <div className="modal-header">
          <h2>View Application</h2>
          <button className="close-btn" onClick={() => setModalIsOpen(false)}>×</button>
        </div>
        
        <div className="modal-content">
          {questionsAndAnswers.length > 0 ? (
            <div className="qa-container">
              {questionsAndAnswers.map(qa => (
                <div key={qa.id} className="qa-item">
                  <h3 className="question">{qa.question}</h3>
                  <div className="answer">
                    <p>Answer.</p>
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
              >
                Applied
              </button>
              <button 
                className={`status-btn ${newStatus === 'In Progress' ? 'active' : ''}`}
                onClick={() => setNewStatus('In Progress')}
              >
                In Progress
              </button>
              <button 
                className={`status-btn ${newStatus === 'Accepted' ? 'active' : ''}`}
                onClick={() => setNewStatus('Accepted')}
              >
                Accepted
              </button>
              <button 
                className={`status-btn ${newStatus === 'Rejected' ? 'active' : ''}`}
                onClick={() => setNewStatus('Rejected')}
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
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="save-btn"
              onClick={handleSaveStatus}
              disabled={!newStatus}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;