import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './StartupProfile.css';

const StartupProfile = () => {
  return (
    <div className="startup-profile-container">
      <h1 className="profile-title">Startup Profile</h1>
      
      <div className="profile-content">
        <div className="profile-tabs">
          <NavLink to="/startup/profile/startup-info" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Startup Info
          </NavLink>
          <NavLink to="/startup/profile/awards" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Awards
          </NavLink>
          <NavLink to="/startup/profile/funding" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Funding
          </NavLink>
          <NavLink to="/startup/profile/team" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Team
          </NavLink>
          <NavLink to="/startup/profile/intellectual-properties" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Intellectual Properties
          </NavLink>
          <NavLink to="/startup/profile/updates" className={({ isActive }) => isActive ? "profile-tab active" : "profile-tab"}>
            Updates
          </NavLink>
        </div>
        
        <div className="profile-tab-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StartupProfile; 