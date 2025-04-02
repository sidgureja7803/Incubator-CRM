import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../config';

// Create the context
const StartupContext = createContext();

// Create a hook to use the context
export const useStartupContext = () => useContext(StartupContext);

// Create the provider component
export const StartupProvider = ({ children }) => {
  const [startupInfo, setStartupInfo] = useState(null);
  const [incubatorFunding, setIncubatorFunding] = useState(0);
  const [externalFunding, setExternalFunding] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch all data when the component mounts
  useEffect(() => {
    if (!dataFetched) {
      fetchAllData();
    }
  }, [dataFetched]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      console.log('Using token:', token);
      
      // Fetch startup info which includes all nested data
      const startupResponse = await axios.get(`${config.api_base_url}/startup/list/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Startup list response:', startupResponse.data);
      
      if (startupResponse.data && startupResponse.data.length > 0) {
        const startupData = startupResponse.data[0];
        setStartupInfo(startupData);
        
        // Set team members
        if (startupData.Startup_People && startupData.Startup_People.length > 0) {
          setTeamMembers(startupData.Startup_People);
        }
        
        // Calculate total incubator funding
        if (startupData.Startup_IncubatorFunding && startupData.Startup_IncubatorFunding.length > 0) {
          const totalIncubatorFunding = startupData.Startup_IncubatorFunding.reduce(
            (sum, item) => sum + (parseInt(item.amount) || 0), 0
          );
          setIncubatorFunding(totalIncubatorFunding);
        }
        
        // Calculate total external funding
        if (startupData.Startup_ExternalFunding && startupData.Startup_ExternalFunding.length > 0) {
          const totalExternalFunding = startupData.Startup_ExternalFunding.reduce(
            (sum, item) => sum + (parseInt(item.amount) || 0), 0
          );
          setExternalFunding(totalExternalFunding);
        }
      } else {
        console.warn('No startup data received');
      }
      
      // Fetch incubators
      const incubatorsResponse = await axios.get(`${config.api_base_url}/startup/startupincubator/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Incubators response:', incubatorsResponse.data);
      
      if (incubatorsResponse.data) {
        setIncubators(incubatorsResponse.data);
      }

      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error.response || error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Provide a way to refresh the data if needed
  const refreshData = () => {
    setDataFetched(false);
  };

  // The value that will be provided to consumers of this context
  const contextValue = {
    startupInfo,
    incubatorFunding,
    externalFunding,
    teamMembers,
    incubators,
    loading,
    error,
    refreshData
  };

  return (
    <StartupContext.Provider value={contextValue}>
      {children}
    </StartupContext.Provider>
  );
};

export default StartupContext; 