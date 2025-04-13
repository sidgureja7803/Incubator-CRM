import React from 'react';
import { NavLink, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './Incubators.css';

const Incubators = () => {
  const location = useLocation();
  const isMyIncubatorsActive = location.pathname.includes('/my-incubators') || location.pathname === '/startup/incubators';
  const isApplyActive = location.pathname.includes('/apply');

  return (
    <div className="incubators-container">
      <h2 className="page-title">Incubators</h2>
      
      <div className="tab-navigation">
        <NavLink 
          to="/startup/incubators/my-incubators"
          className={`tab-button ${isMyIncubatorsActive ? 'active' : ''}`}
        >
          My Incubators
        </NavLink>
        <NavLink 
          to="/startup/incubators/apply"
          className={`tab-button ${isApplyActive ? 'active' : ''}`}
        >
          Apply For Incubation
        </NavLink>
      </div>

      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Incubators;