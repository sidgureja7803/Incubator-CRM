import { useContext } from 'react';
import { IncubatorContext } from '../context/IncubatorContext';

/**
 * Custom hook for accessing and using incubator data
 * @returns {Object} The incubator context with data, loading states, error states and methods
 */
export function useIncubator() {
  const context = useContext(IncubatorContext);
  
  if (context === undefined) {
    throw new Error('useIncubator must be used within an IncubatorProvider');
  }
  
  // Provide safe default values to prevent undefined errors
  return {
    // Data
    incubatorInfo: context.incubatorInfo || {},
    incubatorTeam: context.incubatorTeam || [],
    incubatorPrograms: context.incubatorPrograms || [],
    startups: context.startups || [],
    
    // Loading states
    isLoading: context.isLoading || false,
    
    // Error states
    error: context.error || null,
    
    // Refetch functions
    refetchIncubatorInfo: context.refetchIncubatorInfo || (() => Promise.resolve()),
    refetchIncubatorTeam: context.refetchIncubatorTeam || (() => Promise.resolve()),
    refetchPrograms: context.refetchPrograms || (() => Promise.resolve()),
    refetchStartups: context.refetchStartups || (() => Promise.resolve()),
    
    // Mutation functions
    addProgram: context.addProgram || (() => Promise.reject(new Error('Not initialized'))),
    updateProgram: context.updateProgram || (() => Promise.reject(new Error('Not initialized'))),
    addCohort: context.addCohort || (() => Promise.reject(new Error('Not initialized'))),
    updateCohort: context.updateCohort || (() => Promise.reject(new Error('Not initialized')))
  };
}

export default useIncubator; 