import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import VLogo from '../../../../assets/VLogo.png';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
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
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/login');
          }}
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
    </div>
  );
};

export default SideBar;
