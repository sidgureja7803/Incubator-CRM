import React, { createContext, useContext, useState } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import { 
  useQuery, 
  useMutation, 
  useQueryClient
} from '@tanstack/react-query';

export const IncubatorContext = createContext();

export const useIncubatorContext = () => {
  const context = useContext(IncubatorContext);
  if (!context) {
    throw new Error('useIncubatorContext must be used within an IncubatorProvider');
  }
  return context;
};

// API Functions - Define all API functions here
const fetchProgramCohorts = async (programId) => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return [];
    }
    
    const response = await axios.get(
      `${config.api_base_url}/incubator/program/${programId}/cohort/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching cohorts for program ${programId}:`, error);
    return [];
  }
};

const fetchIncubatorInfo = async () => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return {};
    }
    
    const response = await axios.get(
      `${config.api_base_url}/incubator/list/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data?.[0] || {};
  } catch (error) {
    console.error("Error fetching incubator info:", error);
    return {};
  }
};

const fetchIncubatorTeam = async () => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return [];
    }
    
    const response = await axios.get(
      `${config.api_base_url}/incubator/people/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching incubator team:", error);
    return [];
  }
};

const fetchProgramsWithCohorts = async () => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return [];
    }
    
    const response = await axios.get(
      `${config.api_base_url}/incubator/programs/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const programsWithCohorts = await Promise.all(
      response.data.map(async (program) => {
        try {
          const cohorts = await fetchProgramCohorts(program.id);
          return {
            ...program,
            cohorts
          };
        } catch (error) {
          console.error(`Error fetching cohorts for program ${program.id}:`, error);
          return {
            ...program,
            cohorts: []
          };
        }
      })
    );
    
    return programsWithCohorts;
  } catch (error) {
    console.error("Error fetching programs with cohorts:", error);
    return [];
  }
};

const fetchStartups = async () => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return [];
    }
    
    const response = await axios.get(
      `${config.api_base_url}/incubator/startupincubator/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const startupsWithDetails = await Promise.all(
      response.data.map(async (startup) => {
        try {
          const detailsResponse = await axios.get(
            `${config.api_base_url}/startup/list/?startup_id=${startup.startup_id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          return {
            ...startup,
            details: detailsResponse.data[0]
          };
        } catch (error) {
          console.error(`Error fetching details for startup ${startup.startup_id}:`, error);
          return {
            ...startup,
            details: null
          };
        }
      })
    );
    
    return startupsWithDetails;
  } catch (error) {
    console.error("Error fetching startups:", error);
    return [];
  }
};

const fetchStartupDetails = async (startupId) => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return null;
    }
    
    const response = await axios.get(
      `${config.api_base_url}/startup/list/?startup_id=${startupId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching startup details:", error);
    return null;
  }
};

export const IncubatorProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [documentData, setDocumentData] = useState({ name: '', description: '', file: null });
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Queries
  const incubatorInfoQuery = useQuery({
    queryKey: ['incubatorInfo'],
    queryFn: fetchIncubatorInfo,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const incubatorTeamQuery = useQuery({
    queryKey: ['incubatorTeam'],
    queryFn: fetchIncubatorTeam,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: fetchProgramsWithCohorts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const startupsQuery = useQuery({
    queryKey: ['startups'],
    queryFn: fetchStartups,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Mutations
  const addProgramMutation = useMutation({
    mutationFn: async (programData) => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${config.api_base_url}/incubator/programs/`,
        programData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setSuccessMessage('Program added successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async (programData) => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.patch(
        `${config.api_base_url}/incubator/programs/${programData.id}`,
        programData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setSuccessMessage('Program updated successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  });

  const addCohortMutation = useMutation({
    mutationFn: async (cohortData) => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${config.api_base_url}/incubator/program/${cohortData.program_id}/cohort/`,
        cohortData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.program_id] });
      setSuccessMessage('Cohort added successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  });

  const updateCohortMutation = useMutation({
    mutationFn: async (cohortData) => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.patch(
        `${config.api_base_url}/incubator/program/cohort/${cohortData.id}`,
        cohortData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      setSuccessMessage('Cohort updated successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  });

  // Document handling functions
  const handleAddDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', documentData.name);
    formData.append('description', documentData.description);
    formData.append('file', documentData.file);

    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      await axios.post(
        `${config.api_base_url}/programadmin/docs/${selectedCohort.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setSuccessMessage('Document added successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setShowAddDocumentModal(false);
      queryClient.invalidateQueries({ queryKey: ['cohortDocuments', selectedCohort.id] });
    } catch (error) {
      console.error("Error adding document:", error);
      setErrorMessage(error.response?.data?.message || 'Error adding document');
    }
  };

  const handleUpdateDocument = async (documentId, updatedData) => {
    const formData = new FormData();
    formData.append('name', updatedData.name);
    formData.append('description', updatedData.description);
    if (updatedData.file) {
      formData.append('file', updatedData.file);
    }

    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      await axios.patch(
        `${config.api_base_url}/programadmin/docs/${documentId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSuccessMessage('Document updated successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['cohortDocuments', selectedCohort.id] });
      setIsEditingDoc(false);
    } catch (error) {
      console.error("Error updating document:", error);
      setErrorMessage(error.response?.data?.message || 'Error updating document');
    }
  };

  const value = {
    // Data
    incubatorInfo: incubatorInfoQuery.data || {},
    incubatorTeam: incubatorTeamQuery.data || [],
    incubatorPrograms: programsQuery.data || [],
    startups: startupsQuery.data || [],
    
    // Loading states
    isLoading: {
      incubatorInfo: incubatorInfoQuery.isLoading,
      incubatorTeam: incubatorTeamQuery.isLoading,
      programs: programsQuery.isLoading,
      startups: startupsQuery.isLoading
    },
    
    // Error states
    error: {
      incubatorInfo: incubatorInfoQuery.error,
      incubatorTeam: incubatorTeamQuery.error,
      programs: programsQuery.error,
      startups: startupsQuery.error
    },
    
    // Refetch functions
    refetchIncubatorInfo: incubatorInfoQuery.refetch,
    refetchIncubatorTeam: incubatorTeamQuery.refetch,
    refetchPrograms: programsQuery.refetch,
    refetchStartups: startupsQuery.refetch,
    
    // Mutation functions
    addProgram: addProgramMutation.mutate,
    updateProgram: updateProgramMutation.mutate,
    addCohort: addCohortMutation.mutate,
    updateCohort: updateCohortMutation.mutate,
    
    // Document handling
    handleAddDocument,
    handleUpdateDocument,
    
    // State management
    selectedCohort,
    setSelectedCohort,
    showAssignTaskModal,
    setShowAssignTaskModal,
    showAddDocumentModal,
    setShowAddDocumentModal,
    documentData,
    setDocumentData,
    isEditingDoc,
    setIsEditingDoc,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    showSuccessPopup,
    setShowSuccessPopup,
    
    // Helper functions
    fetchProgramCohorts,
    fetchStartupDetails
  };

  return (
    <IncubatorContext.Provider value={value}>
      {children}
    </IncubatorContext.Provider>
  );
}; 