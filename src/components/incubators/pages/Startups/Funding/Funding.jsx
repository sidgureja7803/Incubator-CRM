import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Funding.css';

const Funding = () => {
  const { startup } = useOutletContext();
  const fundingRounds = startup?.funding_rounds || [];

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
      <h2>Funding History</h2>
      
      {fundingRounds.length === 0 ? (
        <div className="no-funding">
          <p>No funding rounds have been added yet.</p>
        </div>
      ) : (
        <div className="funding-timeline">
          {fundingRounds.map((round, index) => (
            <div key={round.id || index} className="funding-round">
              <div className="round-marker">
                <div className="round-dot"></div>
                <div className="round-line"></div>
              </div>
              <div className="round-content">
                <div className="round-header">
                  <h3>{round.round_type || 'Funding Round'}</h3>
                  <span className="round-date">{round.date || 'Unknown date'}</span>
                </div>
                <div className="round-details">
                  <div className="round-amount">
                    <span className="label">Amount Raised:</span>
                    <span className="value">{round.amount ? `$${round.amount.toLocaleString()}` : 'Undisclosed'}</span>
                  </div>
                  {round.lead_investor && (
                    <div className="round-investor">
                      <span className="label">Lead Investor:</span>
                      <span className="value">{round.lead_investor}</span>
                    </div>
                  )}
                  {round.description && (
                    <p className="round-description">{round.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Funding;
