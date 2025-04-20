import React, { useState, useEffect, Suspense, useCallback, useMemo, useTransition } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Programs.css';
import { KeyboardArrowUp, KeyboardArrowDown, Add, Edit, AdminPanelSettings, Group, Description } from '@mui/icons-material';
import { useIncubator } from '../../../../hooks/useIncubator';
import { useIncubatorContext } from '../../../../context/IncubatorContext';
import ThaparInnovate from './IncuabtorImage.png';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorBoundary from '../../../common/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';

// Separate components for better code splitting and error boundaries
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading data...</p>
  </div>
);

const ErrorDisplay = ({ error, refetch }) => (
  <div className="error-container">
    <h2>Error</h2>
    <p>{error?.message || 'Something went wrong'}</p>
    <button onClick={refetch}>Try Again</button>
  </div>
);

const ProgramCard = ({ program, onToggle, isExpanded, onEdit, onAddCohort, onAssignAdmin }) => (
  <div className={`program-card ${isExpanded ? 'expanded' : ''}`}>
    <div className="program-header">
      <div className="program-info-wrapper">
        <div className="program-logo">
          <img src={program.image_url || ThaparInnovate} alt={program.program_name} />
        </div>
        <div className="program-title">
          <h2>{program.program_name}</h2>
          <p>{program.description}</p>
        </div>
      </div>
      <div className="program-actions">
        <button 
          className="edit-program-btn"
          onClick={() => onEdit(program)}
        >
          <Edit /> <span>Edit</span>
        </button>
        <button 
          className="expand-btn"
          onClick={() => onToggle(program.id)}
        >
          {isExpanded ? (
            <><KeyboardArrowUp /> <span>Collapse</span></>
          ) : (
            <><KeyboardArrowDown /> <span>Expand</span></>
          )}
        </button>
      </div>
    </div>

    {isExpanded && (
      <div className="program-content">
        <div className="action-buttons">
          <button 
            className="add-cohort-btn"
            onClick={() => onAddCohort(program)}
          >
            <Add /> Add Cohort
          </button>
          <button 
            className="assign-admin-btn"
            onClick={() => onAssignAdmin(program)}
          >
            <AdminPanelSettings /> Assign Admin
          </button>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CohortsList program={program} />
        </Suspense>
      </div>
    )}
  </div>
);

const CohortsList = ({ program }) => {
  const [isPending, startTransition] = useTransition();
  const { data: cohorts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['cohorts', program.id],
    queryFn: () => fetchProgramCohorts(program.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} refetch={refetch} />;

  return (
    <div className="cohorts-grid">
      {isPending ? (
        <LoadingSpinner />
      ) : cohorts.length > 0 ? (
        cohorts.map(cohort => (
          <CohortCard key={cohort.id} cohort={cohort} />
        ))
      ) : (
        <div className="no-cohorts">
          <p>No cohorts found for this program</p>
        </div>
      )}
    </div>
  );
};

const CohortCard = ({ cohort }) => {
  const [isPending, startTransition] = useTransition();
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showViewPeopleModal, setShowViewPeopleModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    startTransition(() => {
      switch(action) {
        case 'addPeople':
          setShowAddPeopleModal(true);
          break;
        case 'viewPeople':
          setShowViewPeopleModal(true);
          break;
        case 'documents':
          setShowDocumentsModal(true);
          break;
        case 'edit':
          // Handle edit cohort
          handleEditCohort(cohort);
          break;
        default:
          break;
      }
    });
  };

  const handleEditCohort = (cohort) => {
    // Set the cohort to update and show the edit modal
    setCohortToUpdate({ ...cohort });
    setShowUpdateCohortModal(true);
  };

  // Format date strings
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="cohort-card">
      <div className="cohort-header">
        <h3>{cohort.cohort_name}</h3>
        <span className={`status-badge ${cohort.status?.toLowerCase()}`}>{cohort.status}</span>
      </div>
      
      <div className="cohort-details">
        <div className="detail-row">
          <span className="detail-label">Start Date:</span>
          <span className="detail-value">{formatDate(cohort.start_date)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">End Date:</span>
          <span className="detail-value">{formatDate(cohort.end_date)}</span>
        </div>
      </div>
      
      <div className="action-buttons-grid">
        <div className="action-buttons-row">
          <button className="action-btn edit-btn" onClick={() => handleActionClick('edit')}>
            <Edit fontSize="small" />
            <span>Edit</span>
          </button>
          
          <button 
            className="action-btn people-btn"
            onClick={() => handleActionClick('addPeople')}
          >
            <Group fontSize="small" />
            <span>Add People</span>
          </button>
        </div>
        
        <div className="action-buttons-row">
          <button 
            className="action-btn view-btn"
            onClick={() => handleActionClick('viewPeople')}
          >
            <Group fontSize="small" />
            <span>View People</span>
          </button>
          
          <button 
            className="action-btn doc-btn"
            onClick={() => handleActionClick('documents')}
          >
            <Description fontSize="small" />
            <span>Documents</span>
          </button>
        </div>
      </div>

      {/* Add People Modal */}
      {showAddPeopleModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add People to {cohort.cohort_name}</h2>
              <button className="close-btn" onClick={() => setShowAddPeopleModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <AddPeopleForm cohortId={cohort.id} onClose={() => setShowAddPeopleModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* View People Modal */}
      {showViewPeopleModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>People in {cohort.cohort_name}</h2>
              <button className="close-btn" onClick={() => setShowViewPeopleModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <ViewPeopleList cohortId={cohort.id} onClose={() => setShowViewPeopleModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Documents for {cohort.cohort_name}</h2>
              <button className="close-btn" onClick={() => setShowDocumentsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <DocumentsList cohortId={cohort.id} onClose={() => setShowDocumentsModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder components for modals - Add these after the CohortCard component
const AddPeopleForm = ({ cohortId, onClose }) => {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [availablePeople, setAvailablePeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailablePeople = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${config.api_base_url}/incubator/people/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAvailablePeople(response.data || []);
      } catch (error) {
        console.error("Error fetching people:", error);
        setError("Failed to load people. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePeople();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPeople.length === 0) {
      setError("Please select at least one person");
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      await axios.post(
        `${config.api_base_url}/incubator/cohort/${cohortId}/people/`,
        { people_ids: selectedPeople },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onClose();
    } catch (error) {
      console.error("Error adding people to cohort:", error);
      setError("Failed to add people to cohort. Please try again.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading people...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Select People</label>
        <div className="people-list">
          {availablePeople.length > 0 ? (
            availablePeople.map(person => (
              <div key={person.id} className="person-item">
                <input
                  type="checkbox"
                  id={`person-${person.id}`}
                  value={person.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPeople([...selectedPeople, person.id]);
                    } else {
                      setSelectedPeople(selectedPeople.filter(id => id !== person.id));
                    }
                  }}
                />
                <label htmlFor={`person-${person.id}`}>
                  {person.first_name} {person.last_name}
                </label>
              </div>
            ))
          ) : (
            <p>No people available to add</p>
          )}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">Add Selected People</button>
      </div>
    </form>
  );
};

const ViewPeopleList = ({ cohortId, onClose }) => {
  const [cohortPeople, setCohortPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCohortPeople = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${config.api_base_url}/incubator/cohort/${cohortId}/people/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCohortPeople(response.data || []);
      } catch (error) {
        console.error("Error fetching cohort people:", error);
        setError("Failed to load people in this cohort. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCohortPeople();
  }, [cohortId]);

  if (loading) return <div className="loading-spinner">Loading cohort members...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="cohort-people-list">
      {cohortPeople.length > 0 ? (
        <div className="people-grid">
          {cohortPeople.map(person => (
            <div key={person.id} className="person-card">
              <div className="person-avatar">
                {person.first_name?.charAt(0) || ''}
                {person.last_name?.charAt(0) || ''}
              </div>
              <div className="person-info">
                <h4>{person.first_name} {person.last_name}</h4>
                <p>{person.email}</p>
                <p>{person.role || 'No role specified'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No people added to this cohort yet.</p>
      )}
    </div>
  );
};

const DocumentsList = ({ cohortId, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${config.api_base_url}/incubator/cohort/${cohortId}/documents/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to load documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [cohortId]);

  if (loading) return <div className="loading-spinner">Loading documents...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="documents-list">
      {documents.length > 0 ? (
        <div className="documents-grid">
          {documents.map(doc => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">
                <Description />
              </div>
              <div className="document-info">
                <h4>{doc.title || 'Untitled Document'}</h4>
                <p>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="download-link">
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No documents added to this cohort yet.</p>
      )}
    </div>
  );
};

// Fetch program cohorts using API from the context
const fetchProgramCohorts = async (programId) => {
  console.log(`Fetching cohorts for program ID: ${programId}`);
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  if (!programId) {
    console.error("fetchProgramCohorts called with invalid programId");
    return []; // Return empty array if programId is invalid
  }
  try {
    const response = await axios.get(
      `${config.api_base_url}/incubator/program/${programId}/cohort/`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    console.log(`Cohorts for program ${programId}:`, response.data);
    return response.data || []; // Ensure returning an array
  } catch (error) {
    console.error(`Error fetching cohorts for program ${programId}:`, error);
    return []; // Return empty array on error for graceful handling in CohortsList
  }
};

const Programs = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  
  // Access the context to use the pre-fetched data
  const { 
    incubatorPrograms, 
    isLoading: { programs: programsLoading },
    error: { programs: programsError },
    refetchPrograms,
    addProgram,
    updateProgram,
    addCohort,
    updateCohort 
  } = useIncubatorContext();

  const queryClient = useQueryClient();
  
  const [people, setPeople] = useState([]);
  const [expandedPrograms, setExpandedPrograms] = useState(new Set());
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
    cohort_name: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const [showUpdateProgramModal, setShowUpdateProgramModal] = useState(false);
  const [programToUpdate, setProgramToUpdate] = useState(null);
  const [showUpdateCohortModal, setShowUpdateCohortModal] = useState(false);
  const [cohortToUpdate, setCohortToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Pre-fetch and cache people data
  const fetchPeople = useCallback(async () => {
    console.log("Fetching people...");
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    if (!token) {
      console.error("No token available");
      return;
    }
    
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/people/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const peopleData = (response.data || []).map(person => ({
        id: person.id,
        name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
      }));
      setPeople(peopleData);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }, []);

  useEffect(() => {
    // Only fetch people when authenticated and component mounts
    if (isAuthenticated && !authLoading) {
      fetchPeople();
    }
  }, [isAuthenticated, authLoading, fetchPeople]);

  // Toggle program expansion
  const toggleProgram = useCallback((programId) => {
    startTransition(() => {
      setExpandedPrograms(prev => {
        const newSet = new Set(prev);
        if (newSet.has(programId)) {
          newSet.delete(programId);
        } else {
          newSet.add(programId);
          // Pre-fetch cohorts data for this program
          queryClient.prefetchQuery({
            queryKey: ['cohorts', programId],
            queryFn: () => fetchProgramCohorts(programId),
            staleTime: 5 * 60 * 1000 // 5 minutes
          });
        }
        return newSet;
      });
    });
  }, [queryClient]);

  // Handle add cohort click
  const handleAddCohortClick = useCallback((program) => {
    if (!program || !program.id) {
      console.error("Invalid program selected for adding cohort");
      setErrorMessage("Cannot add cohort: Invalid program data.");
      return;
    }
    
    if (!program.is_active) {
      setErrorMessage("Cannot add cohort to an inactive program.");
      return;
    }
    
    startTransition(() => {
      setSelectedProgram(program);
      setFormData({
        cohort_name: '',
        start_date: '',
        end_date: '',
        status: 'active' 
      });
      setErrorMessage('');
      setShowAddCohortModal(true);
    });
  }, []);

  // Handle add cohort submission
  const handleAddCohortSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedProgram.id) {
      setErrorMessage("No program selected or invalid program ID.");
      return;
    }

    if (!formData.cohort_name || !formData.start_date || !formData.end_date || !formData.status) {
      setErrorMessage("Please fill in all required cohort fields.");
      return;
    }

    try {
      await addCohort({ 
        program_id: selectedProgram.id, 
        cohort_name: formData.cohort_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status
      });
      
      setSuccessMessage('Cohort added successfully!');
      setShowAddCohortModal(false);
      
      // Invalidate and refetch programs and cohorts data
      queryClient.invalidateQueries(['cohorts', selectedProgram.id]);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error adding cohort:", error);
      const apiErrorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to add cohort. Please try again.';
      if (apiErrorMessage.includes("cohort with this cohort name already exists")) {
        setErrorMessage('A cohort with this name already exists in this program.');
      } else {
        setErrorMessage(apiErrorMessage);
      }
    }
  }, [selectedProgram, formData, addCohort, queryClient]);

  // Handle assign admin click
  const handleAssignAdminClick = useCallback((program) => {
    if (!program || !program.id) {
      console.error("Invalid program selected for assigning admin");
      setErrorMessage("Cannot assign admin: Invalid program data.");
      return;
    }
    
    startTransition(() => {
      setSelectedProgram(program);
      setSelectedAdmin('');
      setErrorMessage('');
      setShowAssignAdminModal(true);
    });
  }, []);

  // Handle assign admin submission
  const handleAssignAdminSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedProgram.id || !selectedAdmin) {
      setErrorMessage("Please select a program and an admin.");
      return;
    }

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    try {
      await axios.post(
        `${config.api_base_url}/programadmin/${selectedProgram.id}`,
        { admin_id: selectedAdmin },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccessMessage('Admin assigned successfully!');
      setShowAssignAdminModal(false);
      setSelectedAdmin('');
      refetchPrograms(); // Refresh programs data
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error assigning admin:", error);
      const apiErrorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to assign admin. Please try again.';
      setErrorMessage(apiErrorMessage);
    }
  }, [selectedProgram, selectedAdmin, refetchPrograms]);

  // Handle edit program
  const handleEditProgram = useCallback((program) => {
    startTransition(() => {
      setProgramToUpdate({ ...program });
      setShowUpdateProgramModal(true);
    });
  }, []);

  // Handle update program submission
  const handleUpdateProgramSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!programToUpdate || !programToUpdate.id) return;

    try {
      await updateProgram({
        id: programToUpdate.id,
        program_name: programToUpdate.program_name,
        description: programToUpdate.description,
        is_active: programToUpdate.is_active
      });

      setSuccessMessage('Program updated successfully!');
      setShowUpdateProgramModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating program:", error);
      const apiErrorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to update program.';
      setErrorMessage(apiErrorMessage);
    }
  }, [programToUpdate, updateProgram]);

  // Handle add program
  const handleAddProgram = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newProgramData.program_name || !newProgramData.description) {
      setErrorMessage("Please fill in all required program fields.");
      return;
    }
    
    try {
      await addProgram(newProgramData);
      setSuccessMessage('Program added successfully!');
      setShowAddProgramModal(false);
      setNewProgramData({
        program_name: '',
        description: '',
        is_active: true
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error adding program:", error);
      const apiErrorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to add program.';
      setErrorMessage(apiErrorMessage);
    }
  }, [newProgramData, addProgram]);

  // Loading, error and data access logic
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect due to useEffect
  }

  if (programsLoading && !incubatorPrograms) {
    return <LoadingSpinner />;
  }

  if (programsError && !incubatorPrograms) {
    return <ErrorDisplay error={programsError} refetch={refetchPrograms} />;
  }

  return (
    <ErrorBoundary>
      <div className="programs-container">
        <div className="programs-header">
          <h1>Programs</h1>
          <button 
            className="add-program-btn"
            onClick={() => setShowAddProgramModal(true)}
          >
            <Add /> Add Program
          </button>
        </div>

        {successMessage && (
          <div className="success-popup">
            {successMessage}
          </div>
        )}
        
        {errorMessage && !showAddCohortModal && !showAssignAdminModal && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="programs-list-container">
          {isPending ? (
            <LoadingSpinner />
          ) : incubatorPrograms?.length > 0 ? (
            incubatorPrograms.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                onToggle={toggleProgram}
                isExpanded={expandedPrograms.has(program.id)}
                onEdit={handleEditProgram}
                onAddCohort={handleAddCohortClick}
                onAssignAdmin={handleAssignAdminClick}
              />
            ))
          ) : (
            <div className="no-programs-message">
              <p>No programs available.</p>
            </div>
          )}
        </div>

        {showAddProgramModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Add New Program</h2>
                <button className="close-btn" onClick={() => setShowAddProgramModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddProgram}>
                  <div className="form-group">
                    <label htmlFor="program_name">Program Name</label>
                    <input
                      id="program_name"
                      type="text"
                      value={newProgramData.program_name}
                      onChange={(e) => setNewProgramData({ ...newProgramData, program_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={newProgramData.description}
                      onChange={(e) => setNewProgramData({ ...newProgramData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Program</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showAddCohortModal && selectedProgram && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Add Cohort to {selectedProgram.program_name}</h2>
                <button className="close-btn" onClick={() => { setShowAddCohortModal(false); setErrorMessage(''); }}>×</button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="error-message modal-error">{errorMessage}</div>
                )}
                <form onSubmit={handleAddCohortSubmit}>
                  <div className="form-group">
                    <label htmlFor="cohort_name">Cohort Name</label>
                    <input
                      id="cohort_name"
                      type="text"
                      value={formData.cohort_name}
                      onChange={(e) => setFormData({ ...formData, cohort_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="status-toggle">
                      <button
                        type="button"
                        className={`status-btn ${formData.status === 'active' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, status: 'active' })}
                      >Active</button>
                      <button
                        type="button"
                        className={`status-btn ${formData.status === 'closed' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, status: 'closed' })}
                      >Closed</button>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Save Cohort</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showAssignAdminModal && selectedProgram && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Assign Admin to {selectedProgram.program_name}</h2>
                <button className="close-btn" onClick={() => { setShowAssignAdminModal(false); setErrorMessage(''); }}>×</button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="error-message modal-error">{errorMessage}</div>
                )}
                <form onSubmit={handleAssignAdminSubmit}>
                  <div className="form-group">
                    <label htmlFor="admin-select">Select Admin</label>
                    <select
                      id="admin-select"
                      value={selectedAdmin}
                      onChange={(e) => setSelectedAdmin(e.target.value)}
                      required
                    >
                      <option value="" disabled>-- Select an Admin --</option>
                      {people.length > 0 ? (
                        people.map(person => (
                          <option key={person.id} value={person.id}>
                            {person.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Loading admins...</option>
                      )}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={!selectedAdmin}>Assign Admin</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showUpdateProgramModal && programToUpdate && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Update Program</h2>
                <button className="close-btn" onClick={() => setShowUpdateProgramModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateProgramSubmit}>
                  <div className="form-group">
                    <label htmlFor="update_program_name">Program Name</label>
                    <input
                      id="update_program_name"
                      type="text"
                      value={programToUpdate.program_name}
                      onChange={(e) => setProgramToUpdate({ ...programToUpdate, program_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="update_description">Description</label>
                    <textarea
                      id="update_description"
                      value={programToUpdate.description}
                      onChange={(e) => setProgramToUpdate({ ...programToUpdate, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <input
                      id="update_is_active"
                      type="checkbox"
                      checked={programToUpdate.is_active}
                      onChange={(e) => setProgramToUpdate({ ...programToUpdate, is_active: e.target.checked })}
                    />
                    <label htmlFor="update_is_active">Active Program</label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Update Program</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Update Cohort Modal */}
        {showUpdateCohortModal && cohortToUpdate && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Update Cohort</h2>
                <button className="close-btn" onClick={() => setShowUpdateCohortModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Logic to update cohort
                  updateCohort(cohortToUpdate)
                    .then(() => {
                      setSuccessMessage('Cohort updated successfully!');
                      setShowUpdateCohortModal(false);
                      // Invalidate and refetch cohorts data
                      queryClient.invalidateQueries(['cohorts', selectedProgram?.id]);
                      setTimeout(() => setSuccessMessage(''), 3000);
                    })
                    .catch(error => {
                      console.error("Error updating cohort:", error);
                      const apiErrorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to update cohort.';
                      setErrorMessage(apiErrorMessage);
                    });
                }}>
                  <div className="form-group">
                    <label htmlFor="update_cohort_name">Cohort Name</label>
                    <input
                      id="update_cohort_name"
                      type="text"
                      value={cohortToUpdate.cohort_name}
                      onChange={(e) => setCohortToUpdate({ ...cohortToUpdate, cohort_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="update_start_date">Start Date</label>
                    <input
                      id="update_start_date"
                      type="date"
                      value={cohortToUpdate.start_date}
                      onChange={(e) => setCohortToUpdate({ ...cohortToUpdate, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="update_end_date">End Date</label>
                    <input
                      id="update_end_date"
                      type="date"
                      value={cohortToUpdate.end_date}
                      onChange={(e) => setCohortToUpdate({ ...cohortToUpdate, end_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="status-toggle">
                      <button
                        type="button"
                        className={`status-btn ${cohortToUpdate.status === 'active' ? 'active' : ''}`}
                        onClick={() => setCohortToUpdate({ ...cohortToUpdate, status: 'active' })}
                      >Active</button>
                      <button
                        type="button"
                        className={`status-btn ${cohortToUpdate.status === 'closed' ? 'active' : ''}`}
                        onClick={() => setCohortToUpdate({ ...cohortToUpdate, status: 'closed' })}
                      >Closed</button>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Update Cohort</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Programs;
