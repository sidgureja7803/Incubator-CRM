import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import './IntellectualProperties.css';

const IntellectualProperties = () => {
  const [intellectualProperties, setIntellectualProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startupId, setStartupId] = useState(null);

  // Get startup ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/startups\/(\d+)/);
    if (matches && matches[1]) {
      setStartupId(matches[1]);
    } else {
      // If no ID is found in the URL, you might want to use a default or show an error
      console.error("No startup ID found in URL");
      setError("No startup ID found. Please navigate to a valid startup page.");
      setLoading(false);
    }
  }, []);

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
      } catch (err) {
        console.error("Error fetching intellectual properties:", err);
        
        // Add mock data for testing if API fails
        console.log("Using mock data for intellectual properties");
        const mockData = [
          {
            id: 1,
            title: "Smart Energy Distribution System",
            type: "Patent",
            application_number: "US2023/12345",
            filing_date: "2023-05-15",
            status: "Pending",
            description: "A novel system for optimizing energy distribution in smart grids using machine learning algorithms."
          },
          {
            id: 2,
            title: "ThinkWave Analytics Platform",
            type: "Trademark",
            application_number: "TM2023/78901",
            filing_date: "2023-03-10",
            status: "Granted",
            grant_date: "2023-09-22",
            description: "Trademark for our analytics software platform that processes and visualizes IoT data."
          }
        ];
        setIntellectualProperties(mockData);
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