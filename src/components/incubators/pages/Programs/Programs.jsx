import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Programs.css';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useIncubator } from '../../../../hooks/useIncubator';
import ThaparInnovate from './IncuabtorImage.png';
const Programs = () => {
  const { incubatorPrograms, addProgram, updateProgram, addCohort, updateCohort, refetchPrograms } = useIncubator();
  const [programs, setPrograms] = useState([]);
  const [people, setPeople] = useState([]);
  const [expandedProgram, setExpandedProgram] = useState({});
  const [showAddCohortModal, setShowAddCohortModal] = useState(false);
  const [showAssignAdminModal, setShowAssignAdminModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [newProgramData, setNewProgramData] = useState({
    program_name: '',
    description: '',
    is_active: true
  });

  const [formData, setFormData] = useState({
    incubatorprogram: '',
    cohort_name: '',
    start_date: '',
    end_date: '',
    status: ''
  });

  const [showUpdateProgramModal, setShowUpdateProgramModal] = useState(false);
  const [programToUpdate, setProgramToUpdate] = useState(null);
  const [showUpdateCohortModal, setShowUpdateCohortModal] = useState(false);
  const [cohortToUpdate, setCohortToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showViewPeopleModal, setShowViewPeopleModal] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState(null);
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState('');
  const [startupPeople, setStartupPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [cohortPeople, setCohortPeople] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [taskData, setTaskData] = useState({
  task_name: '',
  description: '',
  due_date: '',
  startup_person_ids: []
    });

    const [documentData, setDocumentData] = useState({
        name: '',
        description: '',
        file: null
          });

  const [documents, setDocuments] = useState([]);

  const [showAddNewDocModal, setShowAddNewDocModal] = useState(false);
  const [isEditingDoc, setIsEditingDoc] = useState(false);

  const resetForm = () => {
    setFormData({
      incubatorprogram: '',
      cohort_name: '',
      start_date: '',
      end_date: '',
      status: ''
    });
  };

  useEffect(() => {
    if (incubatorPrograms) {
      setPrograms(incubatorPrograms);
    } else {
      fetchPrograms();
    }
    fetchPeople();
  }, [incubatorPrograms]);

  const fetchProgramCohorts = async (programId) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/program/${programId}/cohort/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching cohorts for program ${programId}:`, error);
      return [];
    }
  };

  const openAssignTaskModal = (cohort) => {
    setSelectedCohort(cohort);
    fetchCohortPeople(cohort.id); // Fetch cohort people when opening the modal
    setShowAssignTaskModal(true);
  };


  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/programs/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      
      // For each program, fetch its cohorts
      const programsWithCohorts = await Promise.all(
        response.data.map(async (program) => {
          const cohorts = await fetchProgramCohorts(program.id);
          return {
            ...program,
            cohorts: cohorts
          };
        })
      );
      
      setPrograms(programsWithCohorts);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setErrorMessage('Error fetching programs');
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/people/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
        }
      });
      const peopleData = response.data.map(person => ({
        id: person.id,
        name: person.first_name + " " + person.last_name,
        first_name: person.first_name,
        last_name: person.last_name,
        designation: person.designation
      }));
      setPeople(peopleData);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const checkCohortNameExists = (programId, cohortName) => {
    const program = programs.find(p => p.id === programId);
    return program?.cohorts?.some(
      cohort => cohort.cohort_name.toLowerCase() === cohortName.toLowerCase()
    );
  };

  const handleAddCohort = async (e) => {
    e.preventDefault();
    
    // Check if program exists and is active
    const program = programs.find(p => p.id === selectedProgram);
    if (!program) {
      setErrorMessage('Please select a valid program');
      return;
    }

    if (!program.is_active) {
      setErrorMessage('Cannot add cohort to an inactive program');
      return;
    }

    // Check if cohort name already exists in the program
    if (checkCohortNameExists(selectedProgram, formData.cohort_name)) {
      setErrorMessage('incubator program cohort with this cohort name already exists');
      return;
    }

    try {
      const payload = {
        cohort_name: formData.cohort_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        program_id: selectedProgram
      };

      // Use the mutation from context instead of direct axios call
      await addCohort(payload);
      
      setShowSuccessPopup(true);
      setSuccessMessage('Cohort added successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAddCohortModal(false);
      
      // Instead of fetching all programs, just fetch cohorts for the updated program
      const updatedCohorts = await fetchProgramCohorts(selectedProgram);
      setPrograms(prevPrograms => prevPrograms.map(program => 
        program.id === selectedProgram 
          ? { ...program, cohorts: updatedCohorts }
          : program
      ));
      
      resetForm();
    } catch (error) {
      console.error("Error adding cohort:", error);
      const errorMessage = error.message || 'Error adding cohort';
      setErrorMessage(errorMessage);
    }
  };

  const handleAssignAdmin = async () => {
    if (!selectedProgram || !selectedAdmin) {
      alert('Please select both program and admin');
      return;
    }

    try {
      const response = await axios.post(
        `${config.api_base_url}/programadmin/${selectedProgram}`,
        { admin_id: selectedAdmin },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Admin assigned successfully!');
        setShowAssignAdminModal(false);
        refetchPrograms(); // Refresh the programs list
        setSelectedProgram(null);
        setSelectedAdmin('');
      }
    } catch (error) {
      console.error("Error assigning admin:", error);
      alert(error.response?.data?.message || 'Error assigning admin');
    }
  };

  const toggleProgram = (programId) => {
    setExpandedProgram(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  const handleEditCohort = (cohort) => {
    setSelectedCohort(cohort);
    setFormData({
      incubatorprogram: cohort.incubatorprogram,
      cohort_name: cohort.cohort_name,
      start_date: cohort.start_date,
      end_date: cohort.end_date,
      status: cohort.status
    });
    setShowEditModal(true);
  }

  const handleUpdateCohort = async (e) => {
    e.preventDefault();
    try {
      // Use the mutation from context instead of direct axios call
      await updateCohort({
        id: cohortToUpdate.id,
        cohort_name: cohortToUpdate.cohort_name,
        start_date: cohortToUpdate.start_date,
        end_date: cohortToUpdate.end_date,
        status: cohortToUpdate.status
      });

      setShowSuccessPopup(true);
      setSuccessMessage('Cohort updated successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowUpdateCohortModal(false);
      refetchPrograms();
      setCohortToUpdate(null);
    } catch (error) {
      console.error("Error updating cohort:", error);
      alert(error.message || 'Error updating cohort');
    }
  };

  const handleDeleteCohort = async (cohortId) => {
    if (window.confirm('Are you sure you want to delete this cohort?')) {
      try {
        await axios.delete(
          `${config.api_base_url}/incubator/program/cohort/${cohortId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
            }
          }
        );

        setShowSuccessPopup(true);
        setSuccessMessage('Cohort deleted successfully!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
        refetchPrograms();
      } catch (error) {
        console.error("Error deleting cohort:", error);
        alert(error.response?.data?.message || 'Error deleting cohort');
      }
    }
  };

  const handleRemoveAdmin = async (programId) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      try {
        await axios.delete(
          `${config.api_base_url}/programadmin/${programId}/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
            }
          }
        );
        
        setSuccessMessage('Admin removed successfully!');
        refetchPrograms(); // Refresh the programs list
      } catch (error) {
        console.error("Error removing admin:", error);
        alert(error.response?.data?.message || 'Error removing admin');
      }
    }
  };

  const handleRemoveAdminClick = () => {
    setShowRemoveAdminModal(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.api_base_url}/programadmin/assignTask/`,
        taskData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowSuccessPopup(true);
      setSuccessMessage('Task assigned successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAssignTaskModal(false);
    } catch (error) {
      console.error("Error assigning task:", error);
      setErrorMessage(error.response?.data?.message || 'Error assigning task');
    }
  };
  
  const handleAddDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', documentData.name);
    formData.append('description', documentData.description);
    formData.append('file', documentData.file);
    

    
    try {
      const response = await axios.post(
        `${config.api_base_url}/programadmin/docs/${selectedCohort.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setShowSuccessPopup(true);
      setSuccessMessage('Document added successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAddDocumentModal(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setErrorMessage(error.response?.data?.message || 'Error adding document');
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      // Use the mutation from context instead of direct axios call
      await addProgram(newProgramData);
      
      setSuccessMessage('Program added successfully!');
      setShowAddProgramModal(false);
      refetchPrograms(); // Use refetchPrograms instead
      setNewProgramData({
        program_name: '',
        description: '',
        is_active: true
      });
    } catch (error) {
      console.error("Error adding program:", error);
      alert(error.message || 'Error adding program');
    }
  };

  const handleUpdateProgram = async (e) => {
    e.preventDefault();
    try {
      // Use the mutation from context instead of direct axios call
      await updateProgram({
        id: programToUpdate.id,
        program_name: programToUpdate.program_name,
        description: programToUpdate.description,
        is_active: programToUpdate.is_active
      });

      setSuccessMessage('Program updated successfully!');
      setShowUpdateProgramModal(false);
      refetchPrograms(); // Use refetchPrograms instead
      setProgramToUpdate(null);
    } catch (error) {
      console.error("Error updating program:", error);
      alert(error.message || 'Error updating program');
    }
  };

  const fetchStartups = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/startupincubator/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setStartups(response.data);
    } catch (error) {
      console.error("Error fetching startups:", error);
      setErrorMessage('Error fetching startups');
    }
  };

  const fetchStartupPeople = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/cohort/getparticipant/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setStartupPeople(response.data);
    } catch (error) {
      console.error("Error fetching startup people:", error);
      setErrorMessage('Error fetching startup people');
    }
  };

  const fetchCohortPeople = async (cohortId) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/cohort/${cohortId}/startuppeople/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setCohortPeople(response.data);
    } catch (error) {
      console.error("Error fetching cohort people:", error);
      setErrorMessage('Error fetching cohort people');
    }
  };

  const handleAddPersonToCohort = async (e) => {
    e.preventDefault();
    try {
      // Log selected people for debugging
      console.log("Selected People:", selectedPeople);
  
      // Create the payload with only selected people
      const payload = selectedPeople.map(personId => ({ startupperson: personId }));

      console.log("Payload:", payload);
  
      const response = await axios.post(
        `${config.api_base_url}/cohort/${selectedCohortId}/startuppeople/`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setShowSuccessPopup(true);
      setSuccessMessage('People added to cohort successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAddPeopleModal(false);
      fetchCohortPeople(selectedCohortId);
    } catch (error) {
      console.error("Error adding people to cohort:", error);
      setErrorMessage(error.response?.data?.message || 'Error adding people to cohort');
    }
  };
  

  const fetchDocuments = async (cohortId) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/programadmin/docs/${cohortId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setErrorMessage('Error fetching documents');
    }
  };

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', documentData.name);
    formData.append('description', documentData.description);
    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    try {
      await axios.patch(
        `${config.api_base_url}/programadmin/docs/${documentData.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setShowSuccessPopup(true);
      setSuccessMessage('Document updated successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      fetchDocuments(selectedCohort.id);
      setIsEditingDoc(false);
      setDocumentData({ name: '', description: '', file: null });
    } catch (error) {
      console.error("Error updating document:", error);
      setErrorMessage(error.response?.data?.message || 'Error updating document');
    }
  };

  return (
    <div className="programs-container">
      <div className="programs-header">
        <h1>Programs</h1>
        <button 
          className="add-program-btn"
          onClick={() => setShowAddProgramModal(true)}
        >
          Add Program
        </button>
      </div>

      {programs.map(program => (
        <div key={program.id} className="program-card">
          <div className="program-header">
            <div className="program-info-wrapper">
              <div className="program-logo">
                <img src={ThaparInnovate} alt={program.program_name} />
              </div>
              <div className="program-title">
                <h2>{program.program_name}</h2>
                <p>{program.description}</p>
              </div>
            </div>
            <div className="program-actions">
              <button 
                className="edit-program-btn"
                onClick={() => {
                  setProgramToUpdate(program);
                  setShowUpdateProgramModal(true);
                }}
              >
                Edit Program
              </button>
              <button 
                className="expand-btn"
                onClick={() => toggleProgram(program.id)}
              >
                {expandedProgram[program.id] ? (
                  <span>Collapse <KeyboardArrowUp /></span>
                ) : (
                  <span>Expand <KeyboardArrowDown /></span>
                )}
              </button>
            </div>
          </div>

          {expandedProgram[program.id] && (
            <div className="program-content">
              <div className="action-buttons">
                <button 
                  className="add-cohort-btn"
                  onClick={() => {
                    if (!program.is_active) {
                      setErrorMessage('Cannot add cohort to an inactive program');
                      return;
                    }
                    setSelectedProgram(program.id);
                    setShowAddCohortModal(true);
                  }}
                >
                  Add Cohort
                </button>
                <button 
                  className="assign-admin-btn"
                  onClick={() => {
                    setSelectedProgram(program.id);
                    setShowAssignAdminModal(true);
                  }}
                >
                  Assign Admin
                </button>
              </div>

              <div className="cohorts-grid">
                {program.cohorts && program.cohorts.length > 0 ? (
                  program.cohorts.map(cohort => (
                    <div key={cohort.id} className="cohort-card">
                      <h3>{cohort.cohort_name}</h3>
                      
                      <div className="cohort-details">
                        <div className="detail-row">
                          <span className="detail-label">Start Date:</span>
                          <span className="detail-value">{new Date(cohort.start_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">End Date:</span>
                          <span className="detail-value">{new Date(cohort.end_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge ${cohort.status}`}>{cohort.status}</span>
                        </div>
                      </div>
                      
                      <div className="action-row">
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setCohortToUpdate(cohort);
                            setShowUpdateCohortModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteCohort(cohort.id)}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="action-row">
                        <button 
                          className="add-people-btn"
                          onClick={() => {
                            setSelectedCohortId(cohort.id);
                            setShowAddPeopleModal(true);
                            fetchStartups();
                            fetchStartupPeople();
                          }}
                        >
                          Add People
                        </button>
                        <button 
                          className="view-people-btn"
                          onClick={() => {
                            setSelectedCohortId(cohort.id);
                            setShowViewPeopleModal(true);
                            fetchCohortPeople(cohort.id);
                          }}
                        >
                          View People
                        </button>
                      </div>
                      
                      <div className="action-row">
                        <button 
                          className="assign-task-btn"
                          onClick={() => {
                            setSelectedCohort(cohort);
                            setShowAssignTaskModal(true);
                          }}
                        >
                          Assign Task
                        </button>
                        <button 
                          className="documents-btn"
                          onClick={() => {
                            setSelectedCohort(cohort);
                            fetchDocuments(cohort.id);
                            setShowDocumentsModal(true);
                          }}
                        >
                          Documents
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-cohorts">
                    <p>No cohorts found for this program</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add Program details !</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddProgramModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddProgram}>
                <div className="form-group">
                  <label>Program Name</label>
                  <input
                    type="text"
                    value={newProgramData.program_name}
                    onChange={(e) => setNewProgramData({
                      ...newProgramData,
                      program_name: e.target.value
                    })}
                    placeholder="Enter the IP Type"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProgramData.description}
                    onChange={(e) => setNewProgramData({
                      ...newProgramData,
                      description: e.target.value
                    })}
                    placeholder="Enter the Description for Program Here !!"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Cohort Modal */}
      {showAddCohortModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add Cohort !</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddCohortModal(false);
                  setErrorMessage('');
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleAddCohort}>
                <div className="form-group">
                  <label>Cohorts</label>
                  <input
                    type="text"
                    value={formData.cohort_name}
                    onChange={(e) => setFormData({
                      ...formData,
                      cohort_name: e.target.value
                    })}
                    placeholder="Enter the IP Type"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({
                      ...formData,
                      start_date: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({
                      ...formData,
                      end_date: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <div className="status-toggle">
                    <button
                      type="button"
                      className={`status-btn ${formData.status === 'active' ? 'active' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        status: 'active'
                      })}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className={`status-btn ${formData.status === 'closed' ? 'active' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        status: 'closed'
                      })}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Admin Modal */}
      {showAssignAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Assign Program Admin</h2>
            </div>
            <div className="form-row">
              <label>Select Admin</label>
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                required
              >
                <option value="">Select an admin</option>
                {people.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  setShowAssignAdminModal(false);
                  setSelectedAdmin('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignAdmin}
                disabled={!selectedAdmin}
              >
                Assign Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Program Modal */}
      {showUpdateProgramModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update Program</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowUpdateProgramModal(false);
                  setProgramToUpdate(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProgram}>
              <div className="form-row">
                <label>Program Name</label>
                <input
                  type="text"
                  value={programToUpdate.program_name}
                  onChange={(e) => setProgramToUpdate({
                    ...programToUpdate,
                    program_name: e.target.value
                  })}
                  placeholder="Enter program name"
                  required
                />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea
                  value={programToUpdate.description}
                  onChange={(e) => setProgramToUpdate({
                    ...programToUpdate,
                    description: e.target.value
                  })}
                  placeholder="Enter program description"
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={programToUpdate.is_active}
                    onChange={(e) => setProgramToUpdate({
                      ...programToUpdate,
                      is_active: e.target.checked
                    })}
                  />
                  Active Program
                </label>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateProgramModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">
                  Update Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Cohort Modal */}
      {showUpdateCohortModal && cohortToUpdate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update Cohort</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowUpdateCohortModal(false);
                  setCohortToUpdate(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateCohort}>
              <div className="form-row">
                <label>Cohort Name</label>
                <input
                  type="text"
                  value={cohortToUpdate.cohort_name}
                  onChange={(e) => setCohortToUpdate({
                    ...cohortToUpdate,
                    cohort_name: e.target.value
                  })}
                  placeholder="Enter cohort name"
                  required
                />
              </div>
              <div className="form-row">
                <label>Start Date</label>
                <input
                  type="date"
                  value={cohortToUpdate.start_date}
                  onChange={(e) => setCohortToUpdate({
                    ...cohortToUpdate,
                    start_date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-row">
                <label>End Date</label>
                <input
                  type="date"
                  value={cohortToUpdate.end_date}
                  onChange={(e) => setCohortToUpdate({
                    ...cohortToUpdate,
                    end_date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Status</label>
                <select
                  value={cohortToUpdate.status}
                  onChange={(e) => setCohortToUpdate({
                    ...cohortToUpdate,
                    status: e.target.value
                  })}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateCohortModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">
                  Update Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
     
{showAssignTaskModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Assign Task</h2>
        <button onClick={() => setShowAssignTaskModal(false)}>×</button>
      </div>
      <form onSubmit={handleAssignTask}>
        <div className="form-row">
          <label>Task Name</label>
          <input
            type="text"
            value={taskData.task_name}
            onChange={(e) => setTaskData({ ...taskData, task_name: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label>Due Date</label>
          <input
            type="date"
            value={taskData.due_date}
            onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label>Select People from Cohort</label>
          <select
            multiple
            value={taskData.startup_person_ids}
            onChange={(e) => {
              const options = e.target.options;
              const selectedIds = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selectedIds.push(options[i].value);
                }
              }
              setTaskData({ ...taskData, startup_person_ids: selectedIds });
            }}
          >
            {cohortPeople.map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => setShowAssignTaskModal(false)}>Cancel</button>
          <button type="submit">Assign Task</button>
        </div>
      </form>
    </div>
  </div>
)}

{showDocumentsModal && (
  <div className="modal-overlay">
    <div className="modal-content documents-modal">
      <div className="modal-header">
        <h2>Documents Management</h2>
        <button onClick={() => setShowDocumentsModal(false)}>×</button>
      </div>

      {/* Documents List */}
      <div className="documents-list">
        <div className="documents-header">
          <h3>Existing Documents</h3>
          <button 
            className="add-new-doc-btn"
            onClick={() => setShowAddNewDocModal(true)}
          >
            Add New Document
          </button>
        </div>
        {documents.length > 0 ? (
          <table className="documents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.description}</td>
                  <td>
                    <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="edit-btn small"
                      onClick={() => {
                        setDocumentData({
                          id: doc.id,
                          name: doc.name,
                          description: doc.description,
                          file: null
                        });
                        setIsEditingDoc(true);
                        setShowAddNewDocModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn small"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this document?')) {
                          try {
                            await axios.delete(
                              `${config.api_base_url}/programadmin/docs/${doc.id}`,
                              {
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
                                }
                              }
                            );
                            fetchDocuments(selectedCohort.id);
                            setShowSuccessPopup(true);
                            setSuccessMessage('Document deleted successfully!');
                            setTimeout(() => setShowSuccessPopup(false), 3000);
                          } catch (error) {
                            console.error('Error deleting document:', error);
                            setErrorMessage('Error deleting document');
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents found</p>
        )}
      </div>
    </div>
  </div>
)}

{/* Add/Edit Document Modal */}
{showAddNewDocModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{isEditingDoc ? 'Edit Document' : 'Add New Document'}</h2>
        <button onClick={() => {
          setShowAddNewDocModal(false);
          setIsEditingDoc(false);
          setDocumentData({ name: '', description: '', file: null });
        }}>×</button>
      </div>
      <form onSubmit={isEditingDoc ? handleUpdateDocument : handleAddDocument}>
        <div className="form-row">
          <label>Document Name</label>
          <input
            type="text"
            value={documentData.name}
            onChange={(e) => setDocumentData({ ...documentData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={documentData.description}
            onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label>{isEditingDoc ? 'Update Document (optional)' : 'Document File'}</label>
          <input
            type="file"
            onChange={(e) => setDocumentData({ ...documentData, file: e.target.files[0] })}
            required={!isEditingDoc}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => {
            setShowAddNewDocModal(false);
            setIsEditingDoc(false);
            setDocumentData({ name: '', description: '', file: null });
          }}>Cancel</button>
          <button type="submit">
            {isEditingDoc ? 'Update Document' : 'Add Document'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Add People Modal */}
      {showAddPeopleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add People to Cohort</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowAddPeopleModal(false);
                  setSelectedPeople([]);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddPersonToCohort}>
              <div className="form-row">
                <label>Select Startup</label>
                <select
                  value={selectedStartup}
                  onChange={(e) => {
                    setSelectedStartup(e.target.value);
                    setSelectedPeople([]);
                  }}
                  required
                >
                  <option value="">Choose a startup</option>
                  {startupPeople.map(startup => (
                    <option key={startup.startup_name} value={startup.startup_name}>
                      {startup.startup_name}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedStartup && (
      <div className="form-row">
    <label>Select People</label>
    <div className="people-select-list">
      {startupPeople
        .find(s => s.startup_name === selectedStartup)
        ?.people.map(person => (
          <label key={person.person_id} className="checkbox-label">
            <input
              type="checkbox"
              value={person.person_id}
              checked={selectedPeople.includes(person.person_id)}
              onChange={(e) => {
                const personId = person.person_id;
                setSelectedPeople(prev =>
                  e.target.checked
                    ? [...prev, personId] // Add person if checked
                    : prev.filter(id => id !== personId) // Remove person if unchecked
                );
              }}
            />
            {person.person_name}
          </label>
        ))}
    </div>
  </div>
)}


              
              <div className="form-actions">
                <button 
                  type="submit"
                  disabled={selectedPeople.length === 0}
                >
                  Add Selected People
                </button>
                <button type="button" onClick={() => setShowAddPeopleModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
              )}

      {/* View People Modal */}
      {showViewPeopleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cohort People</h2>
              <button 
                className="close-button"
                onClick={() => setShowViewPeopleModal(false)}
              >
                ×
              </button>
            </div>
            <div className="cohort-people-list">
              {cohortPeople.length > 0 ? (
                cohortPeople.map(person => (
                  <div key={person.id} className="person-card">
                    <h4>{person.first_name} {person.last_name}</h4>
                    <p>{person.startup_name}</p>
                  </div>
                ))
              ) : (
                <p className="no-people">No people found in this cohort</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Programs;
