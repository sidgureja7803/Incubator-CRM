import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import VLogo from '../../../../assets/VLogo.png';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>

      <div className="nav-links">
        <button 
          className={`nav-item ${isActive('/incubator/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/incubator/dashboard')}
        >
          <span className="icon">🏠</span>
          Dashboard
        </button>

        <button 
          className={`nav-item ${isActive('/incubator/profile') ? 'active' : ''}`}
          onClick={() => navigate('/incubator/profile')}
        >
          <span className="icon">👤</span>
          Incubator Profile
        </button>

        <button 
          className={`nav-item ${isActive('/incubator/programs') ? 'active' : ''}`}
          onClick={() => navigate('/incubator/programs')}
        >
          <span className="icon">📚</span>
          Programs
        </button>

        <button 
          className={`nav-item ${isActive('/incubator/startups') ? 'active' : ''}`}
          onClick={() => navigate('/incubator/startups')}
        >
          <span className="icon">🚀</span>
          Startups
        </button>

        <button 
          className="nav-item"
          onClick={handleLogout}
        >
          <span className="icon">↪️</span>
          Log Out
        </button>
      </div>

      <div className="user-profile">
        <div className="profile-info">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
          <div className="user-details">
            <span className="name">Admin</span>
            <span className="email">admin@venturelabs.com</span>
          </div>
        </div>
      </div>

      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="logout-popup-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-popup-actions">
              <button onClick={() => setShowLogoutPopup(false)}>No</button>
              <button onClick={confirmLogout}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
