import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './IntellectualProperties.css';

const IntellectualProperties = () => {
  const { startup } = useOutletContext();

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  const intellectualProperties = startup.intellectual_properties || [];

  return (
    <div className="ip-container">
      <h2>Intellectual Properties</h2>
      
      {intellectualProperties.length === 0 ? (
        <div className="no-ip-items">
          <p>No intellectual properties have been added yet.</p>
        </div>
      ) : (
        <div className="ip-grid">
          {intellectualProperties.map((property, index) => (
            <div key={property.id || index} className="ip-card">
              <div className="ip-header">
                <h3>{property.title || 'Untitled Property'}</h3>
                <span className={`ip-type ${property.type?.toLowerCase() || 'other'}`}>
                  {property.type || 'Other'}
                </span>
              </div>

              <div className="ip-details">
                <div className="ip-info-row">
                  <span className="label">Application Number:</span>
                  <span className="value">{property.application_number || 'N/A'}</span>
                </div>

                <div className="ip-info-row">
                  <span className="label">Filing Date:</span>
                  <span className="value">{property.filing_date || 'N/A'}</span>
                </div>

                <div className="ip-info-row">
                  <span className="label">Status:</span>
                  <span className={`ip-status ${property.status?.toLowerCase() || 'pending'}`}>
                    {property.status || 'Pending'}
                  </span>
                </div>

                {property.grant_date && (
                  <div className="ip-info-row">
                    <span className="label">Grant Date:</span>
                    <span className="value">{property.grant_date}</span>
                  </div>
                )}
              </div>
              
              {property.description && (
                <div className="ip-description">
                  <h4>Description</h4>
                  <p>{property.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntellectualProperties; 