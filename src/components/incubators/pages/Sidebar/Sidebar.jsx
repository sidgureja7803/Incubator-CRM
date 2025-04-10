import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import VLogo from '../../../../assets/VLogo.png';

const Sidebar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <img src={VLogo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-links">
          <NavLink 
            to="/incubator/dashboard" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/incubator/profile" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </NavLink>
          <NavLink 
            to="/incubator/programs" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="fas fa-project-diagram"></i>
            <span>Programs</span>
          </NavLink>
          <NavLink 
            to="/incubator/startups" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <i className="fas fa-rocket"></i>
            <span>Startups</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-link logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="logout-popup-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-popup-actions">
              <button onClick={() => setShowLogoutPopup(false)}>Cancel</button>
              <button onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
