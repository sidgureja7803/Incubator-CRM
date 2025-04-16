import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Funding.css';

const Funding = () => {
  const { startup } = useOutletContext();
  const [activeTab, setActiveTab] = useState('incubator');
  
  const incubatorFunding = startup?.Startup_IncubatorFunding || [];
  const externalFunding = startup?.Startup_ExternalFunding || [];

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="funding-container">
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'incubator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('incubator')}
        >
          Incubator Funding
        </button>
        <button 
          className={`tab-button ${activeTab === 'external' ? 'active' : ''}`} 
          onClick={() => setActiveTab('external')}
        >
          External Funding
        </button>
      </div>

      {activeTab === 'incubator' && (
        <>
          <h2 className="funding-section-title">Incubator Funding</h2>
          {incubatorFunding.length === 0 ? (
            <div className="no-funding">
              <p>No incubator funding records found.</p>
            </div>
          ) : (
            <div className="funding-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Funding Program</th>
                    <th>Funding Agency</th>
                  </tr>
                </thead>
                <tbody>
                  {incubatorFunding.map((funding) => (
                    <tr key={funding.id}>
                      <td>{new Date(funding.created_datetime).toLocaleDateString()}</td>
                      <td>₹{funding.amount.toLocaleString()}</td>
                      <td>{funding.funding_program}</td>
                      <td>{funding.funding_agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'external' && (
        <>
          <h2 className="funding-section-title">External Funding</h2>
          {externalFunding.length === 0 ? (
            <div className="no-funding">
              <p>No external funding records found.</p>
            </div>
          ) : (
            <div className="funding-table">
              <table>
                <thead>
                  <tr>
                    <th>Investor Name</th>
                    <th>Amount</th>
                    <th>Funding Program</th>
                  </tr>
                </thead>
                <tbody>
                  {externalFunding.map((funding) => (
                    <tr key={funding.id}>
                      <td>{funding.investor_name}</td>
                      <td>₹{funding.amount.toLocaleString()}</td>
                      <td>{funding.funding_program}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Funding;
