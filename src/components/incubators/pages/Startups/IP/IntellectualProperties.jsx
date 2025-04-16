import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './IntellectualProperties.css';

const IntellectualProperties = () => {
  const { startup } = useOutletContext();
  const intellectualProperties = startup?.Startup_IntellectualProperties || [];

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="ip-container">
      <h2>Intellectual Properties</h2>

      {intellectualProperties.length === 0 ? (
        <div className="no-ip">
          <p>No intellectual properties have been added yet.</p>
        </div>
      ) : (
        <div className="ip-table">
          <table>
            <thead>
              <tr>
                <th>IP Type</th>
                <th>IP Number</th>
                <th>Description</th>
                <th>Status</th>
                <th>Status Date</th>
              </tr>
            </thead>
            <tbody>
              {intellectualProperties.map((ip) => (
                <tr key={ip.id}>
                  <td>{ip.IP_type}</td>
                  <td>{ip.IP_no}</td>
                  <td>{ip.description}</td>
                  <td>
                    <span className={`status-badge ${ip.IP_status.toLowerCase()}`}>
                      {ip.IP_status}
                    </span>
                  </td>
                  <td>{new Date(ip.IP_statusdate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IntellectualProperties; 