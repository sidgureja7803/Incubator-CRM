import React from 'react';
import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom';
import MyIncubators from './MyIncubators/MyIncubators';
import ApplyIncubation from './ApplyIncubation/ApplyIncubation';
import ProgramDetails from './ProgramDetails/ProgramDetails';
import Cohorts from './Cohorts/Cohorts';
import './Incubators.css';

const Incubators = () => {
  return (
    <div className="incubators-container">
      <div className="incubators-header">
        <h1>Incubators</h1>
        <div className="breadcrumb">
          <span>Incubators</span>
        </div>
      </div>
      
      <div className="incubators-content-wrapper">
        <div className="tab-navigation">
          <NavLink 
            to="my-incubators" 
            className={({ isActive }) => isActive ? "tab-button active" : "tab-button"}
          >
            My Incubators
          </NavLink>
          <NavLink 
            to="apply-incubation" 
            className={({ isActive }) => isActive ? "tab-button active" : "tab-button"}
          >
            Apply For Incubation
          </NavLink>
        </div>
        
        <div className="tab-content">
          <Routes>
            <Route index element={<Navigate to="my-incubators" replace />} />
            <Route path="my-incubators" element={<MyIncubators />} />
            <Route path="apply-incubation" element={<ApplyIncubation />} />
            <Route path=":incubatorId/programs" element={<ProgramDetails />} />
            <Route path=":incubatorId/programs/:programId/cohorts/:cohortId/*" element={<Cohorts />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Incubators;