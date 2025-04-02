import React, { useState } from 'react';
import { useStartupContext } from '../../../../context/StartupContext';
import './Dashboard.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import IncubatorLogo from './IncuabtorImage.png';

const Dashboard = () => {
  const { 
    startupInfo, 
    incubatorFunding, 
    externalFunding, 
    teamMembers, 
    incubators, 
    loading, 
    error 
  } = useStartupContext();
  
  const [currentIncubatorPage, setCurrentIncubatorPage] = useState(0);
  const incubatorsPerPage = 4;

  const handleNextIncubatorPage = () => {
    if ((currentIncubatorPage + 1) * incubatorsPerPage < incubators.length) {
      setCurrentIncubatorPage(currentIncubatorPage + 1);
    }
  };

  const handlePrevIncubatorPage = () => {
    if (currentIncubatorPage > 0) {
      setCurrentIncubatorPage(currentIncubatorPage - 1);
    }
  };

  const currentIncubators = incubators.slice(
    currentIncubatorPage * incubatorsPerPage,
    (currentIncubatorPage + 1) * incubatorsPerPage
  );

  // Display loading indicator
  if (loading) return (
    <div className="dashboard-content">
      <div className="loading">Loading dashboard data...</div>
    </div>
  );

  // Display error message
  if (error) return (
    <div className="dashboard-content">
      <div className="error">{error}</div>
    </div>
  );

  // If no startup data is available
  if (!startupInfo) return (
    <div className="dashboard-content">
      <div className="no-data">No startup data available</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>DashBoard</h1>
        <div className="notification-icon">
          <span className="bell-icon">🔔</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon incubator">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Incubator Funding</h3>
            <p className="stat-value">{incubatorFunding}</p>
            <p className="stat-label">Rupees</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon external">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 12l-4-4-4 4M12 8v8" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>External Funding</h3>
            <p className="stat-value">{externalFunding}</p>
            <p className="stat-label">Rupees</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon employees">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Employment Generated</h3>
            <p className="stat-value">{teamMembers.length}</p>
            <p className="stat-label">Total Employees</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Annual Revenue</h3>
            <p className="stat-value">{startupInfo.annual_revenue || '10,00,000'}</p>
            <p className="stat-label">Rupees</p>
          </div>
        </div>
      </div>

      {/* Incubators Section */}
      <h2 className="section-title">Incubaors / Accubators</h2>
      <div className="incubators-container">
        {currentIncubators && currentIncubators.length > 0 ? (
          currentIncubators.map((incubator, index) => (
            <div key={incubator.id || index} className="incubator-card">
              <div className="incubator-logo">
                <img 
                  src={IncubatorLogo} 
                  alt={incubator.name || `Incubator ${index + 1}`} 
                />
              </div>
              <div className="incubator-name">{incubator.name || `THAPAR INNOVATE`}</div>
            </div>
          ))
        ) : (
          // Fallback to default incubators if none are available from API
          [
            { name: "VENTURE LABS" },
            { name: "C. R. E. A. T. E" },
            { name: "NMIMS AIC" },
            { name: "SRM IAIC" }
          ].map((incubator, index) => (
            <div key={index} className="incubator-card">
              <div className="incubator-logo">
                <img src={IncubatorLogo} alt={incubator.name} />
              </div>
              <div className="incubator-name">{incubator.name}</div>
            </div>
          ))
        )}
        <div className="pagination-controls">
          <button 
            className="pagination-btn prev" 
            onClick={handlePrevIncubatorPage}
            disabled={currentIncubatorPage === 0}
          >
            <ChevronLeft />
          </button>
          <button 
            className="pagination-btn next" 
            onClick={handleNextIncubatorPage}
            disabled={(currentIncubatorPage + 1) * incubatorsPerPage >= incubators.length}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Info Sections - Two columns */}
      <div className="info-sections">
        {/* Startup Information */}
        <div className="info-section">
          <h2 className="section-title">Startup Information</h2>
          <div className="info-box">
            <div className="info-content">
              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Industry:</div>
                  <div className="info-value">{startupInfo.industry || 'Business service, other Service and Miscellaneous Service'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Sector:</div>
                  <div className="info-value">{startupInfo.sector || 'Professional Service'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Registration Address:</div>
                  <div className="info-value">{startupInfo.address || 'C/O POONAM PASWAN, SHAMAN VIHAAR APARTMENT, DWARKA, SECTOR-23 NA DELHI, South West, Delhi, DL, 110075, IN'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">CIN Number:</div>
                  <div className="info-value">{startupInfo.cin_no || 'U74999DL2021PTC385097'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">CIN Date:</div>
                  <div className="info-value">{startupInfo.cin_date ? new Date(startupInfo.cin_date).toLocaleDateString() : '08/12/2021'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Communication Address:</div>
                  <div className="info-value">{startupInfo.address || 'Delhi India'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">DIIT No.:</div>
                  <div className="info-value">{startupInfo.dpiit_no || '1234534'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="info-section">
          <h2 className="section-title">Team Members</h2>
          <div className="team-members-grid">
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="team-member-card">
                  <div className="member-photo">
                    <img 
                      src={member.image_url || "https://randomuser.me/api/portraits/women/44.jpg"} 
                      alt={`${member.first_name} ${member.last_name}`}
                    />
                  </div>
                  <div className="member-info">
                    <div className="member-detail">
                      <span className="detail-label">Name:</span> 
                      <span className="detail-value">{member.first_name} {member.last_name}</span>
                    </div>
                    <div className="member-role">({member.primary_role || 'CFO/Founder'})</div>
                  </div>
                  <div className="member-social">
                    <a href={member.linkedin || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                      <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" />
                    </a>
                    <a href={member.instagram || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                      <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" />
                    </a>
                    <a href={member.twitter || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                      <img src="https://img.icons8.com/color/48/000000/twitter.png" alt="Twitter" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              // Fallback default team members if none are available from API
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="team-member-card">
                  <div className="member-photo">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" />
                  </div>
                  <div className="member-info">
                    <div className="member-detail">
                      <span className="detail-label">Name:</span> 
                      <span className="detail-value">Kanishk Dadwal</span>
                    </div>
                    <div className="member-role">(CFO/Founder)</div>
                  </div>
                  <div className="member-social">
                    <a href="#" className="social-link">
                      <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" />
                    </a>
                    <a href="#" className="social-link">
                      <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" />
                    </a>
                    <a href="#" className="social-link">
                      <img src="https://img.icons8.com/color/48/000000/twitter.png" alt="Twitter" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="user-profile">
        <div className="user-info">
          <img 
            src={startupInfo.image_url || "https://randomuser.me/api/portraits/men/32.jpg"} 
            alt={startupInfo.startup_name || 'User'} 
            className="user-avatar" 
          />
          <div className="user-details">
            <div className="user-name">{startupInfo.startup_name || 'Kanishk Dadwal'}</div>
            <div className="user-email">{startupInfo.email || 'kanishkdadwal@gmail.com'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 