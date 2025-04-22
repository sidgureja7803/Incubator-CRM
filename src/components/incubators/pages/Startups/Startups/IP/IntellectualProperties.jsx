import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../../../../../../config';
import './IntellectualProperties.css';

const IntellectualProperties = () => {
  const [intellectualProperties, setIntellectualProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { startupId } = useParams();

  // Fetch IP data directly
  useEffect(() => {
    if (!startupId) return;
    
    const fetchIP = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await axios.get(
          `${config.api_base_url}/incubator/startup/${startupId}/intellectual-properties/`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        console.log("Intellectual Properties data:", response.data);
        setIntellectualProperties(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching intellectual properties:", error);
        
        // Add mock data for testing if API fails
        console.log("Using mock data for intellectual properties");
        
      } finally {
        setLoading(false);
      }
    };

    fetchIP();
  }, [startupId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading intellectual properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

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
                  <span className="value">
                    {property.filing_date ? new Date(property.filing_date).toLocaleDateString() : 'N/A'}
                  </span>
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
                    <span className="value">
                      {new Date(property.grant_date).toLocaleDateString()}
                    </span>
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