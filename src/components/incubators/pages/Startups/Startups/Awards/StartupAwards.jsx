import React from 'react';
import './StartupAwards.css';

const StartupAwards = ({ startup }) => {
  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  const awards = startup.awards || [];

  return (
    <div className="awards-container">
      <h2>Awards & Recognition</h2>
      
      {awards.length === 0 ? (
        <div className="no-awards">
          <p>No awards or recognitions have been added yet.</p>
        </div>
      ) : (
        <div className="awards-grid">
          {awards.map((award, index) => (
            <div key={award.id || index} className="award-card">
              <div className="award-header">
                <h3>{award.title || 'Untitled Award'}</h3>
                <span className="award-date">{award.date || 'Unknown date'}</span>
              </div>
              
              <div className="award-details">
                <p className="award-issuer">{award.issuer || 'Unknown issuer'}</p>
                {award.description && (
                  <p className="award-description">{award.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartupAwards;
