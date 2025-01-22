import React, { useState } from 'react';
import StartupInfo from './StartupInfo';
import './StartupProfile.css';
import Awards from '../../pages/Awards/Awards';

const StartupProfile = () => {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Startup Info' },
    { id: 'awards', label: 'Awards' },
    { id: 'funding', label: 'Funding' },
    { id: 'team', label: 'Team' },
    { id: 'intellectual', label: 'Intellectual Properties' },
    { id: 'updates', label: 'Updates' }
  ];

  return (
    <div className="startup-profile">
      <div className="profile-header">
        <div className="header-title">
          <h1>Startup Profile</h1>
          <p className="breadcrumb">Startup Profile / {activeTab === 'info' ? 'Startup Info' : ''}</p>
        </div>
      </div>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'info' && <StartupInfo />}
        {activeTab === 'awards' && <Awards />}
        {/* Other tabs will be implemented later */}
      </div>
    </div>
  );
};

export default StartupProfile; 