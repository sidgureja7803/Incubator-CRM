import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import Tasks from './Tasks/Tasks';
import Members from './Members/Members';
import Mentors from './Mentors/Mentors';
import Admins from './Admins/Admins';
import Documents from './Documents/Documents';
import './Cohorts.css';

const Cohorts = () => {
  const { incubatorId, programId, cohortId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cohort, setCohort] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchCohortDetails();
  }, [cohortId]);

  const fetchCohortDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCohort(response.data);
    } catch (error) {
      console.error('Error fetching cohort details:', error);
      setError('Failed to fetch cohort details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cohort) {
    return <div className="loading">Loading cohort details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Check which tab is active
  const isTasksActive = location.pathname.includes('/tasks') || location.pathname.endsWith(`/cohorts/${cohortId}`);
  const isMembersActive = location.pathname.includes('/members');
  const isMentorsActive = location.pathname.includes('/mentors');
  const isAdminsActive = location.pathname.includes('/admins');
  const isDocumentsActive = location.pathname.includes('/documents');

  return (
    <div className="cohorts-container">
      <div className="cohort-header">
        <h2 className="cohort-title">{cohort?.name || 'Cohort Details'}</h2>
      </div>
      
      <div className="cohort-tabs">
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/tasks`}
          className={`cohort-tab ${isTasksActive ? 'active' : ''}`}
        >
          Tasks
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/members`}
          className={`cohort-tab ${isMembersActive ? 'active' : ''}`}
        >
          Members
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/mentors`}
          className={`cohort-tab ${isMentorsActive ? 'active' : ''}`}
        >
          Mentors
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/admins`}
          className={`cohort-tab ${isAdminsActive ? 'active' : ''}`}
        >
          Admins
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/documents`}
          className={`cohort-tab ${isDocumentsActive ? 'active' : ''}`}
        >
          Documents
        </NavLink>
      </div>
      
      <div className="cohort-content">
        <Routes>
          <Route index element={<Navigate to={`tasks`} replace />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="members" element={<Members />} />
          <Route path="mentors" element={<Mentors />} />
          <Route path="admins" element={<Admins />} />
          <Route path="documents" element={<Documents />} />
        </Routes>
      </div>
    </div>
  );
};

export default Cohorts;
