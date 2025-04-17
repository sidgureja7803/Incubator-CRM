import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Updates.css';

const Updates = () => {
  const { startup } = useOutletContext();
  const updates = startup?.updates || [];

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="updates-container">
      <h2>Startup Updates</h2>
      
      {updates.length === 0 ? (
        <div className="no-updates">
          <p>No updates have been added yet.</p>
        </div>
      ) : (
        <div className="updates-timeline">
          {updates.map((update, index) => (
            <div key={update.id || index} className="update-item">
              <div className="update-marker">
                <div className="update-dot"></div>
                <div className="update-line"></div>
              </div>
              <div className="update-content">
                <div className="update-header">
                  <h3>{update.title || 'Update'}</h3>
                  <span className="update-date">{update.date || 'Unknown date'}</span>
                </div>
                <div className="update-body">
                  <p>{update.content || 'No details available.'}</p>
                </div>
                {update.attachment_url && (
                  <div className="update-attachment">
                    <a href={update.attachment_url} target="_blank" rel="noopener noreferrer">
                      View Attachment
                    </a>
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

export default Updates;