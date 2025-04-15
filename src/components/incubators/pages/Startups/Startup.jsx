import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Incubated from './Incubated/Incubated';
import Applications from './Applications/Applications';
import './Startup.css';

const Startup = () => {
  const location = useLocation();
  
  return (
    <div className="startups-container">
      <h1 className="page-title">Startups</h1>
      
      <div className="breadcrumb">
        <span>Startups</span>
        {location.pathname.includes('incubated') && <span> / Incubated</span>}
        {location.pathname.includes('applications') && <span> / Applications</span>}
        {/* Add more breadcrumb items for sub-routes */}
        {location.pathname.includes('/info') && <span> / Startup Info</span>}
      </div>

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
