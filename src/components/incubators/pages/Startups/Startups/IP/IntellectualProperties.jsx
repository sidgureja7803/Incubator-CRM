import React from 'react';
import './IntellectualProperties.css';

const IntellectualProperties = ({ startup }) => {
  if (!startup || !startup.Startup_IntellectualProperties) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Intellectual property information not found</p>
      </div>
    );
  }

  return (
    <div className="ip-container">
      <h2>Intellectual Properties</h2>
      
      {startup.Startup_IntellectualProperties.length === 0 ? (
        <div className="no-ip-items">
          <p>No intellectual properties have been added yet.</p>
        </div>
      ) : (
        <div className="ip-grid">
          {startup.Startup_IntellectualProperties.map((property) => (
            <div key={property.id} className="ip-card">
              <div className="ip-header">
                <h3>{property.IP_type || 'Untitled Property'}</h3>
                <span className={`ip-type ${property.IP_type?.toLowerCase() || 'other'}`}>
                  {property.IP_type || 'Other'}
                </span>
              </div>

              <div className="ip-details">
                <div className="ip-info-row">
                  <span className="label">IP Number:</span>
                  <span className="value">{property.IP_no || 'N/A'}</span>
                </div>

                <div className="ip-info-row">
                  <span className="label">Status Date:</span>
                  <span className="value">
                    {property.IP_statusdate ? new Date(property.IP_statusdate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="ip-info-row">
                  <span className="label">Status:</span>
                  <span className={`ip-status ${property.IP_status?.toLowerCase() || 'pending'}`}>
                    {property.IP_status || 'Pending'}
                  </span>
                </div>

                {property.description && (
                  <div className="ip-description">
                    <h4>Description</h4>
                    <p>{property.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntellectualProperties;