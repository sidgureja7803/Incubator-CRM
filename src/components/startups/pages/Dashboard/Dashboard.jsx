import React, { useState } from 'react';
import { useStartupContext } from '../../../../context/StartupContext';
import './Dashboard.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import IncubatorLogo from './IncuabtorImage.png';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
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

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('user_role');
    navigate('/login');
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  if (loading) return (
    <div className="dashboard-content">
      <div className="loading">Loading dashboard data...</div>
    </div>
  );

  if (error) return (
    <div className="dashboard-content">
      <div className="error">{error}</div>
    </div>
  );

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
            <p className="stat-value">₹{incubatorFunding.toLocaleString()}</p>
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
            <p className="stat-value">₹{externalFunding.toLocaleString()}</p>
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
            <p className="stat-value">{startupInfo.employment_generated || teamMembers.length}</p>
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
            <p className="stat-value">₹{startupInfo.annual_revenue || '10,00,000'}</p>
            <p className="stat-label">Rupees</p>
          </div>
        </div>
      </div>

      {/* Incubators Section */}
      <h2 className="section-title">Incubators / Accelerators</h2>
      <div className="incubators-container">
        {incubators && incubators.length > 0 ? (
          currentIncubators.map((incubator, idx) => (
            <div key={incubator.id || `incubator-${idx}`} className="incubator-card">
              <div className="incubator-logo">
                <img 
                  src={incubator.logo || IncubatorLogo} 
                  alt={incubator.incubator_name || `Incubator ${idx + 1}`} 
                />
              </div>
              <div className="incubator-name">{incubator.incubator_name || `Incubator ${idx + 1}`}</div>
            </div>
          ))
        ) : (
          <div className="no-incubators">No incubators associated with this startup.</div>
        )}
        {incubators.length > incubatorsPerPage && (
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
        )}
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
                  <div className="info-value">{startupInfo?.industry || 'Not specified'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Sector:</div>
                  <div className="info-value">{startupInfo?.sector || 'Not specified'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Registration Address:</div>
                  <div className="info-value">{startupInfo?.registration_address || startupInfo?.address || 'Not specified'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">CIN Number:</div>
                  <div className="info-value">{startupInfo?.cin_number || startupInfo?.cin_no || 'Not specified'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">CIN Date:</div>
                  <div className="info-value">
                    {startupInfo?.cin_date ? new Date(startupInfo.cin_date).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">Communication Address:</div>
                  <div className="info-value">{startupInfo?.communication_address || startupInfo?.address || 'Not specified'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">DPIIT No.:</div>
                  <div className="info-value">{startupInfo?.dpiit_number || startupInfo?.dpiit_no || 'Not specified'}</div>
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
              teamMembers.map((member, index) => (
                <div key={member.id || `member-${index}`} className="team-member-card">
                  <div className="member-photo">
                    <img 
                      src={member.profile_image || member.image_url || "https://randomuser.me/api/portraits/women/44.jpg"} 
                      alt={member.name || `${member.first_name || ''} ${member.last_name || ''}`}
                    />
                  </div>
                  <div className="member-info">
                    <div className="member-detail">
                      <span className="detail-label">Name:</span> 
                      <span className="detail-value">{member.name || `${member.first_name || ''} ${member.last_name || ''}`}</span>
                    </div>
                    <div className="member-role">({member.primary_role || 'Team Member'})</div>
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
              <div>No team members found</div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="user-profile">
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">{startupInfo.startup_name || 'Startup Name'}</div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button onClick={handleConfirmLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard; 