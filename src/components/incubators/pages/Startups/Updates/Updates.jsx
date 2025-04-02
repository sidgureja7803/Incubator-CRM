import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from '../../../../../config';
import './Updates.css';

const Updates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    handleRecentUpdates();
  }, []);

  const handleRecentUpdates = async () => {
    try {
      const response = await authAxios.get(`${config.api_base_url}/incubator/view-regular-updates/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      
      // Filter updates from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const updates = response.data
        .filter(update => {
          const updateDate = new Date(update.year, parseInt(update.month) - 1);
          return updateDate >= sixMonthsAgo;
        })
        .map(update => {
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          return {
            ...update,
            monthName: monthNames[parseInt(update.month) - 1]
          };
        });

      setUpdates(updates);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  return (
    <div className="updates-container">
      <div className="navigation-tabs">
        <div className="tab">Startup Info</div>
        <div className="tab">Awards</div>
        <div className="tab">Funding</div>
        <div className="tab">Team</div>
        <div className="tab">Intellectual Properties</div>
        <div className="tab active">Updates</div>
        <div className="tab">Fee</div>
      </div>

      <div className="updates-content">
        <h2>Updates</h2>
        <div className="updates-list">
          {updates.map((update, index) => (
            <div key={index} className="update-card">
              <div className="update-header">
                <h3>{update.monthName} {update.year}</h3>
                <span className="description-label">Description</span>
              </div>
              <p className="update-description">{update.description}</p>
            </div>
          ))}
          {updates.length === 0 && (
            <div className="no-updates">
              No updates available for the last 6 months
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Updates;
