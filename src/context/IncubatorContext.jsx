import React, { createContext, useContext } from 'react';
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

const fetchStartupData = async () => {
  try {
    const response = await axios.get(`${config.api_base_url}/incubator/startupincubator/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
      }
    });
    setLocalStartups(response.data);
    setContextStartups(response.data);
    
    // Fetch people for each startup
    const peopleData = {};
    await Promise.all(response.data.map(async (startup) => {
      const peopleResponse = await axios.get(
        `${config.api_base_url}/startup/list/?startup_id=${startup.startup_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      peopleData[startup.startup_id] = peopleResponse.data;
    }));
    setStartupPeople(peopleData);
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setError(error);
    setIsLoading(false);
  }
};

// API Functions
const fetchIncubatorInfo = async () => {
  try {
    const response = await axios.get(
      `${config.api_base_url}/incubator/list/`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
        }
      }
    );
    // Return the first incubator in the list
    return response.data && response.data.length > 0 ? response.data[0] : {};
  } catch (error) {
    console.error("Error fetching incubator info:", error);
    return {}; // Return empty object instead of null
  }
};

const fetchIncubatorTeam = async () => {
  try {
    const response = await axios.get(
      `${config.api_base_url}/incubator/people/`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching incubator team:", error);
    return []; // Return empty array instead of null
  }
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
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return []; // Return empty array instead of null
  }
};

const fetchProgramsWithCohorts = async () => {
  try {
    const response = await axios.get(
      `${config.api_base_url}/incubator/programs/`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
        }
      }
    );
    
    // Fetch cohorts for each program
    const programsWithCohorts = await Promise.all(
      response.data.map(async (program) => {
        try {
          const cohortsResponse = await axios.get(
            `${config.api_base_url}/incubator/program/${program.id}/cohort/`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
              }
            }
          );
          return {
            ...program,
            cohorts: cohortsResponse.data
          };
        } catch (error) {
          console.error(`Error fetching cohorts for program ${program.id}:`, error);
          return {
            ...program,
            cohorts: [] // Empty array if cohorts can't be fetched
          };
        }
      })
    );
    
    return programsWithCohorts;
  } catch (error) {
    console.error("Error fetching programs with cohorts:", error);
    return []; // Return empty array instead of null
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
    return response.data;
  } catch (error) {
    console.error("Error fetching startups:", error);
    return []; // Return empty array instead of null
  }
};

export const IncubatorProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Queries
  const incubatorInfoQuery = useQuery({
    queryKey: ['incubatorInfo'],
    queryFn: fetchIncubatorInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });

  const incubatorTeamQuery = useQuery({
    queryKey: ['incubatorTeam'],
    queryFn: fetchIncubatorTeam,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: fetchProgramsWithCohorts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const startupsQuery = useQuery({
    queryKey: ['startups'],
    queryFn: fetchStartups,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Mutations
  const addProgramMutation = useMutation({
    mutationFn: async (programData) => {
      const response = await axios.post(
        `${config.api_base_url}/incubator/programs/`,
        programData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async (programData) => {
      const response = await axios.patch(
        `${config.api_base_url}/incubator/programs/${programData.id}`,
        {
          program_name: programData.program_name,
          description: programData.description,
          is_active: programData.is_active
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  const addCohortMutation = useMutation({
    mutationFn: async (cohortData) => {
      const response = await axios.post(
        `${config.api_base_url}/incubator/program/${cohortData.program_id}/cohort/`,
        {
          cohort_name: cohortData.cohort_name,
          start_date: cohortData.start_date,
          end_date: cohortData.end_date,
          status: cohortData.status,
          incubatorprogram: cohortData.program_id
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  const updateCohortMutation = useMutation({
    mutationFn: async (cohortData) => {
      const response = await axios.patch(
        `${config.api_base_url}/incubator/program/cohort/${cohortData.id}`,
        {
          cohort_name: cohortData.cohort_name,
          start_date: cohortData.start_date,
          end_date: cohortData.end_date,
          status: cohortData.status
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  const value = {
    // Data and loading states
    incubatorInfo: incubatorInfoQuery.data || {},
    incubatorTeam: incubatorTeamQuery.data || [],
    incubatorPrograms: programsQuery.data || [],
    startups: startupsQuery.data || [],
    
    // Loading states
    isLoading: {
      incubatorInfo: incubatorInfoQuery.isLoading,
      incubatorTeam: incubatorTeamQuery.isLoading,
      programs: programsQuery.isLoading,
      startups: startupsQuery.isLoading,
      addProgram: addProgramMutation.isPending,
      updateProgram: updateProgramMutation.isPending,
      addCohort: addCohortMutation.isPending,
      updateCohort: updateCohortMutation.isPending
    },
    
    // Error states
    error: {
      incubatorInfo: incubatorInfoQuery.error,
      incubatorTeam: incubatorTeamQuery.error,
      programs: programsQuery.error,
      startups: startupsQuery.error,
      addProgram: addProgramMutation.error,
      updateProgram: updateProgramMutation.error,
      addCohort: addCohortMutation.error,
      updateCohort: updateCohortMutation.error
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
    updateCohort: updateCohortMutation.mutate
  };

  return (
    <IncubatorContext.Provider value={value}>
      {children}
    </IncubatorContext.Provider>
  );
}; 