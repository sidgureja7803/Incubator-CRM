import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VLogo from '.../VLogo.png';
import './SideBar.css';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { id: 1, name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { id: 2, name: 'Startup Profile', path: '/startup-profile', icon: '👤' },
    { id: 3, name: 'Incubators', path: '/incubators', icon: '🏢' },
    { id: 4, name: 'Accelerators', path: '/accelerators', icon: '🚀' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={VLogo} alt="Venture Lab" className="logo" />
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="menu-item logout" onClick={handleLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
