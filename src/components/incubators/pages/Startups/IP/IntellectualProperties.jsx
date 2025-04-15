import React from 'react';
import { useParams } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import './IntellectualProperties.css';

const IntellectualProperties = () => {
  const { startupId } = useParams();
  const { startups, isLoading } = useIncubatorContext();
  
  // Find the current startup from the context
  const startup = startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId);
  
  // Get IP data from the startup
  const intellectualProperties = startup?.intellectual_properties || [];

  // Mocked IP data for display purposes
  const mockProperties = [
    {
      id: 1,
      type: 'Patent',
      number: '123465',
      description: 'Design Patent',
      status: 'Applied',
      date: '1-10-2020'
    },
    {
      id: 2,
      type: 'Patent',
      number: '234563',
      description: 'Design Patent',
      status: 'Applied',
      date: '1-10-2020'
    },
    {
      id: 3,
      type: 'Patent',
      number: '202301',
      description: 'Design Patent',
      status: 'Approved',
      date: '1-10-2020'
    },
    {
      id: 4,
      type: 'Patent',
      number: '301028',
      description: 'Design Patent',
      status: 'Approved',
      date: '1-10-2020'
    }
  ];

  const displayProperties = intellectualProperties.length > 0 ? intellectualProperties : mockProperties;

  if (isLoading.startups) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading intellectual property information...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Startup Not Found</h3>
        <p>The requested startup information could not be found.</p>
      </div>
    );
  }

  return (
    <div className="ip-container">
      <div className="ip-table">
        <table>
          <thead>
            <tr>
              <th>IP Type</th>
              <th>IP Number</th>
              <th>Description</th>
              <th>IP Status</th>
              <th>IP Status Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayProperties.map((property) => (
              <tr key={property.id}>
                <td>{property.type}</td>
                <td>{property.number}</td>
                <td>{property.description}</td>
                <td>{property.status}</td>
                <td>{property.date}</td>
                <td>
                  <div className="ip-actions">
                    <button className="edit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                    <button className="delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <div className="pagination-info">
            <span>1 - 10 of 460</span>
          </div>
          <div className="rows-per-page">
            <span>Rows per page:</span>
            <select>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button className="prev-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="next-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntellectualProperties; 