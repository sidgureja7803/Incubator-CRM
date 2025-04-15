import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Incubated from './Incubated/Incubated';
import Applications from './Applications/Applications';
import './Startup.css';

const Startup = () => {
  const location = useLocation();
  
  // Determine if we're on a detailed path
  const isDetailView = location.pathname.includes('/incubated/') && location.pathname.split('/').length > 4;
  
  // Get the startup name from the path if available
  const startupName = isDetailView ? location.pathname.split('/')[4] : '';

  return (
    <div className="startups-container">
      <h1 className="page-title">Startups</h1>
      
      <div className="breadcrumb">
        <span className="breadcrumb-item">Startups</span>
        {location.pathname.includes('incubated') && (
          <span className="breadcrumb-item">/ Incubated</span>
        )}
        {location.pathname.includes('applications') && (
          <span className="breadcrumb-item">/ Applications</span>
        )}
        {isDetailView && location.pathname.includes('/info') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Startup Info</span>
        )}
        {isDetailView && location.pathname.includes('/awards') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Awards</span>
        )}
        {isDetailView && location.pathname.includes('/funding') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Funding</span>
        )}
        {isDetailView && location.pathname.includes('/team') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Team</span>
        )}
        {isDetailView && location.pathname.includes('/properties') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Intellectual Properties</span>
        )}
        {isDetailView && location.pathname.includes('/updates') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Updates</span>
        )}
        {isDetailView && location.pathname.includes('/fee') && (
          <span className="breadcrumb-item">/ {startupName || 'Startup'} / Fee</span>
        )}
      </div>

      {!isDetailView && (
        <div className="tabs-container">
          <NavLink 
            to="incubated"
            className={({ isActive }) => 
              isActive ? "tab-item active" : "tab-item"
            }
          >
            Incubated
          </NavLink>
          <NavLink 
            to="applications"
            className={({ isActive }) => 
              isActive ? "tab-item active" : "tab-item"
            }
          >
            Applications
          </NavLink>
        </div>
      )}

      <div className="content-container">
        <Routes>
          <Route path="incubated/*" element={<Incubated />} />
          <Route path="applications/*" element={<Applications />} />
        </Routes>
      </div>
    </div>
  );
};

export default Startup;
