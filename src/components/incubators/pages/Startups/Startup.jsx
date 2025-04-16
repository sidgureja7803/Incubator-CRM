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
