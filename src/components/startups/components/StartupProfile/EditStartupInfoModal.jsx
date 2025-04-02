import React, { useState } from 'react';
import axios from 'utils/httpClient';
import './EditStartupInfoModal.css';

const EditStartupInfoModal = ({ startupData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    startup_name: startupData.startup_name,
    industry: startupData.industry,
    sector: startupData.sector,
    address: startupData.address,
    phone: startupData.phone,
    email: startupData.email,
    website: startupData.website,
    startup_business_transaction: startupData.startup_business_transaction,
    cin_no: startupData.cin_no,
    cin_date: startupData.cin_date?.split('T')[0],
    dpiit_no: startupData.dpiit_no,
    dpiit_date: startupData.dpiit_date?.split('T')[0],
    PAN_no: startupData.PAN_no,
    TAN_no: startupData.TAN_no,
    stage: startupData.stage,
    product_demo_url: startupData.product_demo_url
  });

  const handleInputChange = (e) => {
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
      await axios.put(
        `http://139.59.46.75/api/startup/update/${startupData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating startup info:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Startup Information</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Company Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Startup Name</label>
                <input
                  type="text"
                  name="startup_name"
                  value={formData.startup_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Sector</label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Registration Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Registration & Certifications</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>CIN Number</label>
                <input
                  type="text"
                  name="cin_no"
                  value={formData.cin_no}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>CIN Date</label>
                <input
                  type="date"
                  name="cin_date"
                  value={formData.cin_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>DPIIT Number</label>
                <input
                  type="text"
                  name="dpiit_no"
                  value={formData.dpiit_no}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>DPIIT Date</label>
                <input
                  type="date"
                  name="dpiit_date"
                  value={formData.dpiit_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStartupInfoModal; 