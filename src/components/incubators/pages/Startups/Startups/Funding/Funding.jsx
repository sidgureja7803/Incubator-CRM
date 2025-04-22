import React from 'react';
import './Funding.css';

const Funding = ({ startup }) => {
  if (!startup || (!startup.Startup_ExternalFunding && !startup.Startup_IncubatorFunding)) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Funding information not found</p>
      </div>
    );
  }

  const renderFundingTable = (fundingData, title) => (
    <div className="funding-section">
      <h3>
        {title}
        <button className="add-funding-button">
          Add Fundings
        </button>
      </h3>
      {fundingData.length === 0 ? (
        <div className="no-funding">
          <p>No {title.toLowerCase()} records found.</p>
        </div>
      ) : (
        <table className="funding-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Funding Program</th>
              <th>Funding Agency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fundingData.map((funding) => (
              <tr key={funding.id}>
                <td>{funding.created_datetime ? new Date(funding.created_datetime).toLocaleDateString() : 'Invalid Date'}</td>
                <td>₹{funding.amount?.toLocaleString() || '0'}</td>
                <td>{funding.funding_program || 'NN'}</td>
                <td>{funding.funding_agency || funding.investor_name || 'NN'}</td>
                <td className="actions-cell">
                  <button className="action-button edit-button" title="Edit">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button className="action-button delete-button" title="Delete">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="funding-container">
      {renderFundingTable(startup.Startup_IncubatorFunding || [], 'Incubator Funding')}
      {renderFundingTable(startup.Startup_ExternalFunding || [], 'External Funding')}
    </div>
  );
};

export default Funding;