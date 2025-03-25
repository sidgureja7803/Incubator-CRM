import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaBuilding, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="Venture Lab" />
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/dashboard" className="nav-link">
          <MdDashboard />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/incubator-profile" className="nav-link">
          <FaBuilding />
          <span>Incubator Profile</span>
        </NavLink>
        
        <NavLink to="/programs" className="nav-link">
          <FaHome />
          <span>Programs</span>
        </NavLink>
        
        <NavLink to="/startups" className="nav-link">
          <FaUsers />
          <span>Startups</span>
        </NavLink>
      </nav>
      
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
