import React, { createContext, useContext, useState } from 'react';

export const IncubatorContext = createContext();

export const useIncubatorContext = () => {
  const context = useContext(IncubatorContext);
  if (!context) {
    throw new Error('useIncubatorContext must be used within an IncubatorProvider');
  }
  return context;
};

export const IncubatorProvider = ({ children }) => {
  const [incubatorInfo, setIncubatorInfo] = useState(null);
  const [incubatorTeam, setIncubatorTeam] = useState([]);
  const [incubatorPrograms, setIncubatorPrograms] = useState([]);
  const [startups, setStartups] = useState([]);

  const value = {
    incubatorInfo,
    setIncubatorInfo,
    incubatorTeam,
    setIncubatorTeam,
    incubatorPrograms,
    setIncubatorPrograms,
    startups,
    setStartups
  };

  return (
    <IncubatorContext.Provider value={value}>
      {children}
    </IncubatorContext.Provider>
  );
}; 