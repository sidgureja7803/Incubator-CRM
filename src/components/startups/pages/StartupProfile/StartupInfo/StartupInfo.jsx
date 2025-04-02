import React, { useState } from 'react';
import { useStartupContext } from '../../../../../context/StartupContext';
import './StartupInfo.css';

const StartupInfo = () => {
  const { startupData, loading, error } = useStartupContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add API call to save data
  };

  if (loading) {
    return <div className="startup-info-container">Loading...</div>;
  }

  if (error) {
    return <div className="startup-info-container">Error: {error}</div>;
  }

  if (!startupData) {
    return <div className="startup-info-container">No startup data available</div>;
  }

  return (
    <div className="startup-info-container">
      <div className="edit-button-container">
        <button className="edit-btn" onClick={handleEdit}>Edit Info</button>
      </div>

      <div className="startup-info-content">
        <div className="startup-header">
          <div className="startup-logo">
            <img src={startupData.logo || "https://via.placeholder.com/150"} alt={startupData.name} />
          </div>
          <h2>{startupData.name}</h2>
        </div>

        <div className="startup-details">
          <div className="details-section">
            <h3>Company Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Sector:</p>
                <p className="value">{startupData.companyDetails?.sector || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Industry:</p>
                <p className="value">{startupData.companyDetails?.industry || 'N/A'}</p>
              </div>
              <div className="detail-item full-width">
                <p className="label">Registration Address:</p>
                <p className="value">{startupData.companyDetails?.registrationAddress || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Business Transaction Type</p>
                <p className="value">{startupData.companyDetails?.businessTransactionType || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Startup Registration Type</p>
                <p className="value">{startupData.companyDetails?.startupRegistrationType || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Registration & Certifications</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">CIN No.</p>
                <p className="value">{startupData.registration?.cinNo || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">CIN Date</p>
                <p className="value">{startupData.registration?.cinDate || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">DPIIT No.</p>
                <p className="value">{startupData.registration?.dpiitNo || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">DPIIT Date</p>
                <p className="value">{startupData.registration?.dpiitDate || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">TAN No.</p>
                <p className="value">{startupData.registration?.tanNo || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">PAN No.</p>
                <p className="value">{startupData.registration?.panNo || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Growth Statistics</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Stage</p>
                <p className="value">{startupData.growth?.stage || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Product Demo Url</p>
                <p className="value">{startupData.growth?.productDemoUrl || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Current Annual Revenue</p>
                <p className="value">{startupData.growth?.currentAnnualRevenue || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Current Valuation</p>
                <p className="value">{startupData.growth?.currentValuation || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Number of Employees</p>
                <p className="value">{startupData.growth?.numberOfEmployees || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Number of Customers</p>
                <p className="value">{startupData.growth?.numberOfCustomers || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Communication</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Email Address:</p>
                <p className="value">{startupData.communication?.email || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <p className="label">Phone Number:</p>
                <p className="value">{startupData.communication?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupInfo; 