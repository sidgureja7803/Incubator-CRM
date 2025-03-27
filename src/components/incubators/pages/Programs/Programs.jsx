import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';
import './Cohorts.css';
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

const Programs = () => {
  const { setIncubatorPeople } = useIncubatorContext();
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
  const [activeCohortTab, setActiveCohortTab] = useState('members');
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
  const [tasks, setTasks] = useState([]);
  const [showAddNewDocModal, setShowAddNewDocModal] = useState(false);
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [showCohortContent, setShowCohortContent] = useState(false);
  const [activeCohort, setActiveCohort] = useState(null);

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
    fetchPrograms();
    fetchPeople();
  }, []);

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
      setIncubatorPeople(response.data); // Set in context
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
        incubatorprogram: selectedProgram
      };

      const response = await axios.post(
        `${config.api_base_url}/incubator/program/${selectedProgram}/cohort/`,  // Updated endpoint
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 201) {
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
      }
    } catch (error) {
      console.error("Error adding cohort:", error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error adding cohort';
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
        fetchPrograms(); // Refresh the programs list
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
      const response = await axios.patch(
        `${config.api_base_url}/incubator/program/cohort/${cohortToUpdate.id}`,
        {
          cohort_name: cohortToUpdate.cohort_name,
          start_date: cohortToUpdate.start_date,
          end_date: cohortToUpdate.end_date,
          status: cohortToUpdate.status
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setShowSuccessPopup(true);
        setSuccessMessage('Cohort updated successfully!');
        setTimeout(() => setShowSuccessPopup(false), 3000);
        setShowUpdateCohortModal(false);
        fetchPrograms();
        setCohortToUpdate(null);
      }
    } catch (error) {
      console.error("Error updating cohort:", error);
      alert(error.response?.data?.message || 'Error updating cohort');
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
        fetchPrograms();
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
        fetchPrograms(); // Refresh the programs list
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
      const response = await axios.post(
        `${config.api_base_url}/incubator/programs/`,
        newProgramData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Program added successfully!');
        setShowAddProgramModal(false);
        fetchPrograms(); // Refresh programs list
        setNewProgramData({
          program_name: '',
          description: '',
          is_active: true
        });
      }
    } catch (error) {
      console.error("Error adding program:", error);
      alert(error.response?.data?.message || 'Error adding program');
    }
  };

  const handleUpdateProgram = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${config.api_base_url}/incubator/programs/${programToUpdate.id}`,
        {
          program_name: programToUpdate.program_name,
          description: programToUpdate.description,
          is_active: programToUpdate.is_active
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Program updated successfully!');
        setShowUpdateProgramModal(false);
        fetchPrograms();
        setProgramToUpdate(null);
      }
    } catch (error) {
      console.error("Error updating program:", error);
      alert(error.response?.data?.message || 'Error updating program');
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

  // Toggle program expansion
  const toggleProgram = (programId) => {
    setExpandedProgram(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  // Handle selecting a cohort for detailed view
  const handleSelectCohort = (cohort) => {
    setActiveCohort(cohort);
    setActiveCohortTab('members');
    setShowCohortContent(true);
    fetchCohortPeople(cohort.id);
    fetchDocuments(cohort.id);
    fetchTasks(cohort.id);
  };

  // New function to fetch tasks
  const fetchTasks = async (cohortId) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/programadmin/tasks/${cohortId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setErrorMessage('Error fetching tasks');
    }
  };

  return (
    <div className="broad-container">
      <div className="header-container">
        <h1 className="page-title">Programs</h1>
        <div className="breadcrumb">
          <span>Programs</span>
        </div>
        <button 
          className="add-program-btn"
          onClick={() => setShowAddProgramModal(true)}
        >
          Add Program
        </button>
      </div>

      {/* Programs list with cohorts */}
      {!showCohortContent && (
        <div className="programs-container">
          {programs.map(program => (
            <div key={program.id} className="program-section">
              <div className="program-header">
                <div className="program-info" onClick={() => toggleProgram(program.id)}>
                  <div className="program-title">
                    {expandedProgram[program.id] ? 
                      <KeyboardArrowUp className="arrow-icon" /> : 
                      <KeyboardArrowDown className="arrow-icon" />
                    }
                    <h3>{program.program_name}</h3>
                    <span className={`status-badge ${program.is_active ? 'active' : 'inactive'}`}>
                      {program.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="program-description">{program.description}</p>
                  {program.admin && (
                    <div className="admin-info">
                      Admin: {program.admin.first_name} {program.admin.last_name}
                    </div>
                  )}
                </div>
                <div className="program-actions">
                  <button 
                    className="edit-program-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProgramToUpdate(program);
                      setShowUpdateProgramModal(true);
                    }}
                  >
                    Edit Program
                  </button>
                  <button 
                    className="add-cohort-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!program.is_active) {
                        setErrorMessage('Cannot add cohort to an inactive program');
                        return;
                      }
                      if (program.id) {
                        setSelectedProgram(program.id);
                        setShowAddCohortModal(true);
                      } else {
                        setErrorMessage('Invalid program selected');
                      }
                    }}
                  >
                    Add Cohort
                  </button>
                  <button 
                    className="assign-admin-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(program.id);
                      setShowAssignAdminModal(true);
                    }}
                  >
                    Assign Admin
                  </button>
                </div>
              </div>

              {expandedProgram[program.id] && (
                <div className="cohorts-container">
                  {program.cohorts?.length > 0 ? (
                    program.cohorts.map(cohort => (
                      <div 
                        key={cohort.id} 
                        className={`cohort-card ${activeCohort?.id === cohort.id ? 'selected' : ''}`}
                        onClick={() => handleSelectCohort(cohort)}
                      >
                        <div className="cohort-info">
                          <h4>{cohort.cohort_name}</h4>
                          <div className="cohort-details">
                            <p><strong>Start Date:</strong> {new Date(cohort.start_date).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(cohort.end_date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className={`status-pill ${cohort.status}`}>{cohort.status}</span></p>
                          </div>
                        </div>
                        <div className="cohort-actions">
                          <div className="button-row">
                            <button 
                              className="edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCohortToUpdate(cohort);
                                setShowUpdateCohortModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCohort(cohort.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="button-row">
                            <button 
                              className="add-people-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCohortId(cohort.id);
                                setShowAddPeopleModal(true);
                                fetchStartups();
                                fetchStartupPeople();
                              }}
                            >
                              Add People
                            </button>
                            <button 
                              className="assign-task-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCohort(cohort);
                                setShowAssignTaskModal(true);
                              }}
                            >
                              Add Cohort
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-cohorts">No cohorts found for this program</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cohort details view with tabs */}
      {showCohortContent && activeCohort && (
        <div className="cohort-detail-view">
          <div className="back-navigation">
            <button 
              className="back-button"
              onClick={() => {
                setShowCohortContent(false);
                setActiveCohort(null);
              }}
            >
              ← Back to Programs
            </button>
          </div>
          
          <div className="cohort-header">
            <h2>{activeCohort.cohort_name}</h2>
            <div className="cohort-meta">
              <span>Start: {new Date(activeCohort.start_date).toLocaleDateString()}</span>
              <span>End: {new Date(activeCohort.end_date).toLocaleDateString()}</span>
              <span className={`status-pill ${activeCohort.status}`}>{activeCohort.status}</span>
            </div>
          </div>

          <div className="cohort-content">
            <div className="cohort-tabs">
              <button 
                className={`cohort-tab ${activeCohortTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveCohortTab('members')}
              >
                Members
              </button>
              <button 
                className={`cohort-tab ${activeCohortTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveCohortTab('documents')}
              >
                Documents
              </button>
              <button 
                className={`cohort-tab ${activeCohortTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveCohortTab('tasks')}
              >
                Tasks
              </button>
            </div>

            {/* Members Tab Content */}
            {activeCohortTab === 'members' && (
              <div className="tab-content">
                <div className="tab-header">
                  <button 
                    className="add-button"
                    onClick={() => {
                      setSelectedCohortId(activeCohort.id);
                      setShowAddPeopleModal(true);
                      fetchStartups();
                      fetchStartupPeople();
                    }}
                  >
                    Add Members
                  </button>
                </div>
                
                <div className="members-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortPeople.length > 0 ? (
                        cohortPeople.map(person => (
                          <tr key={person.id}>
                            <td>{person.first_name} {person.last_name}</td>
                            <td>{person.startup_name}</td>
                            <td>{person.personal_phone}</td>
                            <td>{person.personal_email}</td>
                            <td className="action-buttons">
                              <button className="edit-btn small">Edit</button>
                              <button className="delete-btn small">Delete</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">No members found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="pagination">
                  <div className="rows-per-page">
                    <span>Rows per page:</span>
                    <select className="rows-select">
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div className="pagination-controls">
                    <button className="pagination-btn">‹</button>
                    <button className="pagination-btn">›</button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab Content */}
            {activeCohortTab === 'documents' && (
              <div className="tab-content">
                <div className="tab-header">
                  <button 
                    className="add-button"
                    onClick={() => setShowAddNewDocModal(true)}
                  >
                    Add Documents
                  </button>
                </div>
                
                <div className="documents-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length > 0 ? (
                        documents.map(doc => (
                          <tr key={doc.id}>
                            <td>{doc.name}</td>
                            <td>{doc.description}</td>
                            <td>
                              <a href={doc.document_url} download className="download-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="no-data">No documents found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="pagination">
                  <div className="rows-per-page">
                    <span>Rows per page:</span>
                    <select className="rows-select">
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div className="pagination-controls">
                    <button className="pagination-btn">‹</button>
                    <button className="pagination-btn">›</button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab Content */}
            {activeCohortTab === 'tasks' && (
              <div className="tab-content">
                <div className="tab-header">
                  <button 
                    className="add-button"
                    onClick={() => {
                      setSelectedCohort(activeCohort);
                      setShowAssignTaskModal(true);
                    }}
                  >
                    Add Tasks
                  </button>
                </div>
                
                <div className="tasks-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Responses</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length > 0 ? (
                        tasks.map(task => (
                          <tr key={task.id}>
                            <td>{task.task_name}</td>
                            <td>{new Date(task.due_date).toLocaleDateString()}</td>
                            <td>{task.description}</td>
                            <td>{task.responses || 'No responses'}</td>
                            <td className="action-buttons">
                              <button className="edit-btn small">Edit</button>
                              <button className="delete-btn small">Delete</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">No tasks found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="pagination">
                  <div className="rows-per-page">
                    <span>Rows per page:</span>
                    <select className="rows-select">
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                  </div>
                  <div className="pagination-controls">
                    <button className="pagination-btn">‹</button>
                    <button className="pagination-btn">›</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Program</h2>
            </div>
            <form onSubmit={handleAddProgram}>
              <div className="form-row">
                <label>Program Name</label>
                <input
                  type="text"
                  value={newProgramData.program_name}
                  onChange={(e) => setNewProgramData({
                    ...newProgramData,
                    program_name: e.target.value
                  })}
                  placeholder="Enter program name"
                  required
                />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea
                  value={newProgramData.description}
                  onChange={(e) => setNewProgramData({
                    ...newProgramData,
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
                    checked={newProgramData.is_active}
                    onChange={(e) => setNewProgramData({
                      ...newProgramData,
                      is_active: e.target.checked
                    })}
                  />
                  Active Program
                </label>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddProgramModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">
                  Add Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cohort Modal */}
      {showAddCohortModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Cohort !</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowAddCohortModal(false);
                  setErrorMessage(''); // Clear any error messages
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAddCohort}>
              <div className="form-row">
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
              <div className="form-row">
                <label>Start Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({
                      ...formData,
                      start_date: e.target.value
                    })}
                    placeholder="11-08-2023"
                    required
                  />
                  <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </div>
              </div>
              <div className="form-row">
                <label>Start Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({
                      ...formData,
                      end_date: e.target.value
                    })}
                    placeholder="11-12-2024"
                    required
                  />
                  <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </div>
              </div>
              <div className="form-row">
                <label>Status</label>
                <div className="switch-toggle">
                  <button
                    type="button"
                    className={`switch-option ${formData.status === 'active' ? 'active' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      status: 'active'
                    })}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={`switch-option ${formData.status === 'closed' ? 'active' : ''}`}
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
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
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

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
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
        <h2>Upload Tasks !</h2>
        <button onClick={() => setShowAssignTaskModal(false)}>×</button>
      </div>
      <form onSubmit={handleAssignTask}>
        <div className="form-row">
          <label>Add file</label>
          <div className="file-upload-container">
            <span className="file-placeholder">Upload File here</span>
            <button type="button" className="upload-btn">
              Upload
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            value={taskData.task_name}
            onChange={(e) => setTaskData({ ...taskData, task_name: e.target.value })}
            placeholder="Enter Name of the Task here !"
            required
          />
        </div>
        <div className="form-row">
          <label>Due Date</label>
          <div className="date-input-container">
            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
              placeholder="Choose the due date !"
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="calendar-icon">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </div>
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            placeholder="Enter a short Description of the Document !"
            required
          />
        </div>
        <div className="form-row">
          <label>Select People from Cohort</label>
          <div className="people-select-list">
            {cohortPeople.map(person => (
              <label key={person.id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={person.id}
                  checked={taskData.startup_person_ids.includes(person.id)}
                  onChange={(e) => {
                    const personId = person.id;
                    setTaskData(prev => ({
                      ...prev,
                      startup_person_ids: e.target.checked
                        ? [...prev.startup_person_ids, personId]
                        : prev.startup_person_ids.filter(id => id !== personId)
                    }));
                  }}
                />
                {person.first_name} {person.last_name}
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={taskData.startup_person_ids.length === 0}
          >
            Save
          </button>
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
        <h2>Upload Documents !</h2>
        <button onClick={() => {
          setShowAddNewDocModal(false);
          setIsEditingDoc(false);
          setDocumentData({ name: '', description: '', file: null });
        }}>×</button>
      </div>
      <form onSubmit={isEditingDoc ? handleUpdateDocument : handleAddDocument}>
        <div className="form-row">
          <label>Add Document</label>
          <div className="file-upload-container">
            <span className="file-placeholder">Upload your Document here</span>
            <button type="button" className="upload-btn">
              Upload
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
            </button>
            <input
              type="file"
              onChange={(e) => setDocumentData({ ...documentData, file: e.target.files[0] })}
              required={!isEditingDoc}
              className="hidden-file-input"
            />
          </div>
        </div>
        <div className="form-row">
          <label>Document Name</label>
          <input
            type="text"
            value={documentData.name}
            onChange={(e) => setDocumentData({ ...documentData, name: e.target.value })}
            placeholder="Enter Name of the Document here !"
            required
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={documentData.description}
            onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
            placeholder="Enter a short Description of the Document !"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save
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
              <h2>Add Members !</h2>
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
                <label>Startups</label>
                <div className="select-container">
                  <select
                    value={selectedStartup}
                    onChange={(e) => {
                      setSelectedStartup(e.target.value);
                      setSelectedPeople([]);
                    }}
                    required
                  >
                    <option value="">Enter the startup</option>
                    {startupPeople.map(startup => (
                      <option key={startup.startup_name} value={startup.startup_name}>
                        {startup.startup_name}
                      </option>
                    ))}
                  </select>
                  <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                </div>
              </div>
              
              {selectedStartup && (
                <div className="form-row">
                  <label>Members</label>
                  <div className="select-container">
                    <select
                      multiple
                      value={selectedPeople}
                      onChange={(e) => {
                        const options = e.target.options;
                        const selected = [];
                        for (let i = 0; i < options.length; i++) {
                          if (options[i].selected) {
                            selected.push(options[i].value);
                          }
                        }
                        setSelectedPeople(selected);
                      }}
                      className="members-select"
                    >
                      <option value="">Enter the Members</option>
                      {startupPeople
                        .find(s => s.startup_name === selectedStartup)
                        ?.people.map(person => (
                          <option key={person.person_id} value={person.person_id}>
                            {person.person_name}
                          </option>
                        ))}
                    </select>
                    <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="submit"
                  className="save-btn"
                  disabled={selectedPeople.length === 0}
                >
                  Save
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
