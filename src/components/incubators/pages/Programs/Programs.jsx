import React, { useState, useEffect, Suspense } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Programs.css';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useIncubator } from '../../../../hooks/useIncubator';
import ThaparInnovate from './IncuabtorImage.png';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import ErrorBoundary from '../../../common/ErrorBoundary';

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
  <div className="program-card">
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
          onClick={() => onEdit(program)}
        >
          Edit Program
        </button>
        <button 
          className="expand-btn"
          onClick={() => onToggle(program.id)}
        >
          {isExpanded ? (
            <span>Collapse <KeyboardArrowUp /></span>
          ) : (
            <span>Expand <KeyboardArrowDown /></span>
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
            Add Cohort
          </button>
          <button 
            className="assign-admin-btn"
            onClick={() => onAssignAdmin(program)}
          >
            Assign Admin
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
      {cohorts.length > 0 ? (
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
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showViewPeopleModal, setShowViewPeopleModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  return (
    <div className="cohort-card">
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
            // Handle edit
          }}
        >
          Edit
        </button>
        <button 
          className="delete-btn"
          onClick={() => {
            // Handle delete
          }}
        >
          Delete
        </button>
      </div>
      
      <div className="action-row">
        <button 
          className="add-people-btn"
          onClick={() => setShowAddPeopleModal(true)}
        >
          Add People
        </button>
        <button 
          className="view-people-btn"
          onClick={() => setShowViewPeopleModal(true)}
        >
          View People
        </button>
      </div>
      
      <div className="action-row">
        <button 
          className="assign-task-btn"
          onClick={() => setShowAssignTaskModal(true)}
        >
          Assign Task
        </button>
        <button 
          className="documents-btn"
          onClick={() => setShowDocumentsModal(true)}
        >
          Documents
        </button>
      </div>
    </div>
  );
};

const VirtualizedProgramList = ({ programs, onToggle, isExpanded, onEdit, onAddCohort, onAssignAdmin }) => {
  const ROW_HEIGHT = 200; // Adjust based on your card height

  const Row = ({ index, style }) => {
    const program = programs[index];
    return (
      <div style={style}>
        <ProgramCard
          program={program}
          onToggle={onToggle}
          isExpanded={isExpanded[program.id]}
          onEdit={onEdit}
          onAddCohort={onAddCohort}
          onAssignAdmin={onAssignAdmin}
        />
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={programs.length}
          itemSize={ROW_HEIGHT}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

const VirtualizedCohortsList = ({ cohorts }) => {
  const ROW_HEIGHT = 150; // Adjust based on your card height

  const Row = ({ index, style }) => {
    const cohort = cohorts[index];
    return (
      <div style={style}>
        <CohortCard cohort={cohort} />
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={Math.min(height, cohorts.length * ROW_HEIGHT)}
          itemCount={cohorts.length}
          itemSize={ROW_HEIGHT}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

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

  const toggleProgram = (programId) => {
    setExpandedProgram(prev => ({
      ...prev,
      [programId]: !prev[programId]
    }));
  };

  const handleAddCohort = (programOrEvent) => {
    if (programOrEvent?.preventDefault) {
      // Form submission handler
      programOrEvent.preventDefault();
      handleAddCohortSubmit();
    } else {
      // Program selection handler
      const program = programOrEvent;
      if (!program.is_active) {
        return;
      }
      setSelectedProgram(program.id);
      setShowAddCohortModal(true);
    }
  };

  const handleAddCohortSubmit = async () => {
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

      await addCohort(payload);
      
      setShowSuccessPopup(true);
      setSuccessMessage('Cohort added successfully!');
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAddCohortModal(false);
      
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

  const handleAssignAdmin = (programOrEvent) => {
    if (programOrEvent?.preventDefault) {
      // Form submission handler
      programOrEvent.preventDefault();
      handleAssignAdminSubmit();
    } else {
      // Program selection handler
      const program = programOrEvent;
      setSelectedProgram(program.id);
      setShowAssignAdminModal(true);
    }
  };

  const handleAssignAdminSubmit = async () => {
    if (!selectedProgram || !selectedAdmin) {
      setErrorMessage('Please select both program and admin');
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
        refetchPrograms();
        setSelectedProgram(null);
        setSelectedAdmin('');
      }
    } catch (error) {
      console.error("Error assigning admin:", error);
      setErrorMessage(error.response?.data?.message || 'Error assigning admin');
    }
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

  const queryClient = useQueryClient();

  const fetchProgramsPage = async (page) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/programs/?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      
      // Ensure we have the expected data structure
      const programs = response.data.results || response.data || [];
      const totalPages = response.data.total_pages || 1;
      
      return {
        programs: programs,
        nextPage: page < totalPages ? page + 1 : undefined,
        hasMore: page < totalPages
      };
    } catch (error) {
      console.error("Error fetching programs page:", error);
      throw error;
    }
  };

  // Update the infinite query implementation
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['programs'],
    queryFn: ({ pageParam = 1 }) => fetchProgramsPage(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Query error:", error);
      setErrorMessage(error.message || 'Error fetching programs');
    },
    // Add suspense option to work with Suspense boundary
    suspense: true,
    // Add error boundary handling
    useErrorBoundary: true
  });

  // Safe data flattening
  const allPrograms = React.useMemo(() => {
    return data?.pages?.flatMap(page => page?.programs || []) || [];
  }, [data]);

  const handleEditProgram = (program) => {
    setProgramToUpdate(program);
    setShowUpdateProgramModal(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <ErrorBoundary fallback={<ErrorDisplay error={error} />}>
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

        <Suspense fallback={<LoadingSpinner />}>
          <VirtualizedProgramList
            programs={allPrograms}
            onToggle={toggleProgram}
            isExpanded={expandedProgram}
            onEdit={handleEditProgram}
            onAddCohort={handleAddCohort}
            onAssignAdmin={handleAssignAdmin}
          />
        </Suspense>

        {hasNextPage && (
          <div className="load-more">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Success/Error Messages */}
        {showSuccessPopup && (
          <div className="success-popup">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {/* Modals */}
        {showAddProgramModal && (
          <div className="modal-overlay">
            <AddProgramModal
              onSubmit={handleAddProgram}
              onClose={() => setShowAddProgramModal(false)}
            />
          </div>
        )}
        {showUpdateProgramModal && programToUpdate && (
          <div className="modal-overlay">
            <UpdateProgramModal
              program={programToUpdate}
              onSubmit={handleUpdateProgram}
              onClose={() => setShowUpdateProgramModal(false)}
            />
          </div>
        )}
        {showAssignAdminModal && (
          <div className="modal-overlay">
            <AssignAdminModal
              onSubmit={handleAssignAdminSubmit}
              onClose={() => setShowAssignAdminModal(false)}
              selectedAdmin={selectedAdmin}
              setSelectedAdmin={setSelectedAdmin}
            />
          </div>
        )}
        {showAddCohortModal && (
          <div className="modal-overlay">
            <AddCohortModal
              onSubmit={handleAddCohort}
              onClose={() => setShowAddCohortModal(false)}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
        {showUpdateCohortModal && cohortToUpdate && (
          <div className="modal-overlay">
            <UpdateCohortModal
              cohort={cohortToUpdate}
              onSubmit={handleUpdateCohort}
              onClose={() => setShowUpdateCohortModal(false)}
            />
          </div>
        )}
        {showAssignTaskModal && (
          <div className="modal-overlay">
            <AssignTaskModal
              onSubmit={handleAssignTask}
              onClose={() => setShowAssignTaskModal(false)}
              taskData={taskData}
              setTaskData={setTaskData}
            />
          </div>
        )}
        {showDocumentsModal && (
          <div className="modal-overlay">
            <DocumentsModal
              documents={documents}
              onClose={() => setShowDocumentsModal(false)}
            />
          </div>
        )}
        {showAddNewDocModal && (
          <div className="modal-overlay">
            <AddNewDocModal
              onSubmit={handleAddDocument}
              onClose={() => setShowAddNewDocModal(false)}
              documentData={documentData}
              setDocumentData={setDocumentData}
            />
          </div>
        )}
        {showAddPeopleModal && (
          <div className="modal-overlay">
            <AddPeopleModal
              onSubmit={handleAddPersonToCohort}
              onClose={() => setShowAddPeopleModal(false)}
              people={people}
              selectedPeople={selectedPeople}
              setSelectedPeople={setSelectedPeople}
            />
          </div>
        )}
        {showViewPeopleModal && (
          
          <div className="modal-overlay">
            <ViewPeopleModal
              onClose={() => setShowViewPeopleModal(false)}
              people={cohortPeople}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Programs;
