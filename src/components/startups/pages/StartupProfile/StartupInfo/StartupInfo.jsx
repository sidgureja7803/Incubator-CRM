import React, { useState } from 'react';
import axios from 'utils/httpClient';
import './StartupInfo.css';
import IncubatorImage from '../../Dashboard/IncuabtorImage.png';
import config from '../../../../../config';
import { useStartupContext } from '../../../../../context/StartupContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const EditStartupInfoModal = ({ startupData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    startup_name: startupData.startup_name || '',
    sector: startupData.sector || '',
    industry: startupData.industry || '',
    address: startupData.address || '',
    startup_business_transaction: startupData.startup_business_transaction || '',
    startup_registration_type: startupData.startup_registration_type || '',
    email: startupData.email || '',
    phone: startupData.phone || '',
    website: startupData.website || '',
    cin_no: startupData.cin_no || '',
    dpiit_no: startupData.dpiit_no || '',
    TAN_no: startupData.TAN_no || '',
    PAN_no: startupData.PAN_no || '',
    stage: startupData.stage || '',
    product_demo_url: startupData.product_demo_url || '',
    annual_revenue: startupData.annual_revenue || '',
    employment_generated: startupData.employment_generated || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.patch(`${config.api_base_url}/startup/update/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating startup info:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Startup Information</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Startup Name</label>
              <input
                type="text"
                name="startup_name"
                value={formData.startup_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Sector</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Business Transaction Type</label>
              <input
                type="text"
                name="startup_business_transaction"
                value={formData.startup_business_transaction}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Registration Type</label>
              <input
                type="text"
                name="startup_registration_type"
                value={formData.startup_registration_type}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {/* Add more form fields for other startup information */}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose} className="cancel-button">Cancel</button>
        <button onClick={handleSubmit} className="save-button">Save Changes</button>
      </DialogActions>
    </Dialog>
  );
};

const StartupInfo = () => {
  const { startupInfo, loading, error, refreshData } = useStartupContext();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!startupInfo) return <div className="no-data">No startup data available</div>;

  return (
    <div className="startup-info-container">
      <div className="info-header">
        <div className="startup-identity">
          <img src={IncubatorImage} alt={startupInfo.startup_name} className="startup-logo" />
          <h2>{startupInfo.startup_name}</h2>
        </div>
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit Info
        </button>
      </div>

      <div className="info-sections">
        <div className="info-section">
          <h3>Company Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Sector:</label>
              <span>{startupInfo.sector}</span>
            </div>
            <div className="info-item">
              <label>Industry:</label>
              <span>{startupInfo.industry}</span>
            </div>
            <div className="info-item">
              <label>Registration Address:</label>
              <span>{startupInfo.address}</span>
            </div>
            <div className="info-item">
              <label>Business Transaction Type:</label>
              <span>{startupInfo.startup_business_transaction}</span>
            </div>
            <div className="info-item">
              <label>Startup Registration Type:</label>
              <span>{startupInfo.startup_registration_type || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Communication</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email Address:</label>
              <span>{startupInfo.email}</span>
            </div>
            <div className="info-item">
              <label>Phone Number:</label>
              <span>{startupInfo.phone}</span>
            </div>
            <div className="info-item">
              <label>Website:</label>
              <a href={startupInfo.website} target="_blank" rel="noopener noreferrer">
                {startupInfo.website}
              </a>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Registration & Certifications</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>CIN No:</label>
              <span>{startupInfo.cin_no}</span>
            </div>
            <div className="info-item">
              <label>CIN Date:</label>
              <span>{new Date(startupInfo.cin_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>DPIIT No:</label>
              <span>{startupInfo.dpiit_no}</span>
            </div>
            <div className="info-item">
              <label>DPIIT Date:</label>
              <span>{new Date(startupInfo.dpiit_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>TAN No:</label>
              <span>{startupInfo.TAN_no}</span>
            </div>
            <div className="info-item">
              <label>PAN No:</label>
              <span>{startupInfo.PAN_no}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Growth Statistics</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Stage:</label>
              <span>{startupInfo.stage}</span>
            </div>
            <div className="info-item">
              <label>Product Demo URL:</label>
              <a href={startupInfo.product_demo_url} target="_blank" rel="noopener noreferrer">
                {startupInfo.product_demo_url}
              </a>
            </div>
            <div className="info-item">
              <label>Annual Revenue:</label>
              <span>{startupInfo.annual_revenue || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Employment Generated:</label>
              <span>{startupInfo.employment_generated || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditStartupInfoModal
          startupData={startupInfo}
          onClose={() => setIsEditing(false)}
          onUpdate={() => {
            refreshData();
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default StartupInfo; 