import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import VLogo from '../../../../assets/VLogo.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="mainContainer">
      <div className="sidebar">
        <div className="sidebar-top">
          <img className="sidebar-logo" src={VLogo} alt="Venture Lab" />
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
            to="/incubator/profile/info" 
            className={({ isActive }) => 
              isActive || location.pathname.startsWith('/incubator/profile') 
                ? "sidebar-link active" 
                : "sidebar-link"
            }
          >
            <i className="fas fa-user"></i>
            <span>Incubator Profile</span>
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
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
      <div className="content-container">
        <Outlet />
      </div>

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
    </div>
  );
}


