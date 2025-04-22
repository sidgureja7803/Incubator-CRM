import React from 'react';
import './Info.css';

const Info = ({ startup }) => {
  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="startup-info-container">
      <div className="startup-header">
        <img 
          src={startup.image_url} 
          alt={startup.startup_name} 
          className="startup-logo" 
        />
        <h2 className="startup-name">{startup.startup_name}</h2>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Company Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Sector:</span>
            <span className="info-value">{startup.sector}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Industry:</span>
            <span className="info-value">{startup.industry}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Stage:</span>
            <span className="info-value">{startup.stage}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Business Type:</span>
            <span className="info-value">{startup.startup_business_transaction}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Address:</span>
            <span className="info-value">{startup.address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">City:</span>
            <span className="info-value">{startup.city}</span>
          </div>
          <div className="info-item">
            <span className="info-label">State:</span>
            <span className="info-value">{startup.state}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Country:</span>
            <span className="info-value">{startup.country}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Pincode:</span>
            <span className="info-value">{startup.pincode}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Registration Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">CIN Number:</span>
            <span className="info-value">{startup.cin_no}</span>
          </div>
          <div className="info-item">
            <span className="info-label">CIN Date:</span>
            <span className="info-value">{startup.cin_date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DPIIT Number:</span>
            <span className="info-value">{startup.dpiit_no}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DPIIT Date:</span>
            <span className="info-value">{startup.dpiit_date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">PAN Number:</span>
            <span className="info-value">{startup.PAN_no}</span>
          </div>
          <div className="info-item">
            <span className="info-label">TAN Number:</span>
            <span className="info-value">{startup.TAN_no}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Contact Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{startup.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{startup.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Website:</span>
            <span className="info-value">
              {startup.website ? (
                <a href={startup.website} target="_blank" rel="noopener noreferrer">
                  {startup.website}
                </a>
              ) : 'Not provided'}
            </span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Social Media</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">LinkedIn:</span>
            <span className="info-value">
              {startup.linkedin ? (
                <a href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                  {startup.linkedin}
                </a>
              ) : 'Not provided'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Twitter:</span>
            <span className="info-value">
              {startup.twitter ? (
                <a href={startup.twitter} target="_blank" rel="noopener noreferrer">
                  {startup.twitter}
                </a>
              ) : 'Not provided'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Instagram:</span>
            <span className="info-value">
              {startup.instagram ? (
                <a href={startup.instagram} target="_blank" rel="noopener noreferrer">
                  {startup.instagram}
                </a>
              ) : 'Not provided'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">YouTube:</span>
            <span className="info-value">
              {startup.youtube ? (
                <a href={startup.youtube} target="_blank" rel="noopener noreferrer">
                  {startup.youtube}
                </a>
              ) : 'Not provided'}
            </span>
          </div>
        </div>
      </div>

      {startup.product_demo_url && (
        <div className="info-section">
          <h3 className="info-section-title">Product Demo</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Demo URL:</span>
              <span className="info-value">
                <a href={startup.product_demo_url} target="_blank" rel="noopener noreferrer">
                  {startup.product_demo_url}
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;

