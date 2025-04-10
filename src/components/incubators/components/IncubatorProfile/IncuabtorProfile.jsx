import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './IncubatorProfile.css';

const IncubatorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'info', label: 'Incubator Info', path: '/incubator/profile/info' },
    { id: 'team', label: 'Team', path: '/incubator/profile/team' },
    { id: 'partners', label: 'Partners', path: '/incubator/profile/partners' },
    { id: 'institute', label: 'Institute Associated', path: '/incubator/profile/institute' },
    { id: 'infrastructure', label: 'Infrastructure', path: '/incubator/profile/infrastructure' },
    { id: 'awards', label: 'Awards', path: '/incubator/profile/awards' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getCurrentTab = () => {
    const currentPath = location.pathname.split('/').pop();
    const currentTab = tabs.find(tab => tab.id === currentPath);
    return currentTab ? currentTab.label : '';
  };

  return (
    <div className="incubator-profile">
      <div className="profile-header">
        <div className="breadcrumb">
          <span>Incubator Profile</span>
          {getCurrentTab() && <span> / {getCurrentTab()}</span>}
        </div>
      </div>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${isActive(tab.path) ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
};

export default IncubatorProfile; 