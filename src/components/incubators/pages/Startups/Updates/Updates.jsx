import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from 'config';
import './Updates.css';

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [visibleUpdates, setVisibleUpdates] = useState({}); // for particular startup
  const [startupUpdates, setStartupUpdates] = useState({});
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [updatesModalIsOpen, setUpdatesModalIsOpen] = useState(false);

  useEffect(() => {
    handleRecentUpdates();
  }, []);

  

  const handleStartupUpdates = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/view-regular-updates/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      
      // Log the response for debugging
      console.log("Recent updates response:", response.data);
      
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
  
      console.log("Filtered updates:", updates);
  
      if (updates.length > 0) {
        setRecentUpdates(updates);
        setUpdateMessage('');
      } else {
        setUpdateMessage('No updates from any startup in the last 6 months.');
      }
    } catch (error) {
      console.error("Error fetching recent updates:", error);
      setUpdateMessage('Error fetching recent updates.');
    }
  };

  const toggleUpdateVisibility = (startupId) => {
    setVisibleUpdates(prev => ({
      ...prev,
      [startupId]: !prev[startupId]
    }));
  };

  return (
    <table className="updates-table">
      <thead>
        <tr>
          <th>Startup</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {updates.map((startup) => (
          <React.Fragment key={startup.startup_id}>
            <tr>
              <td>{startup.name}</td>
              <td>
                <button onClick={() => handleStartupUpdates(startup)}>View Details</button>
                <button onClick={() => toggleUpdateVisibility(startup.startup_id)}>
                  {visibleUpdates[startup.startup_id] ? 'Hide Updates' : 'Show Updates'}
                </button>
              </td>
            </tr>
            {visibleUpdates[startup.startup_id] && (
              <tr>
                <td colSpan="2">
                  <div className="update-container">
                    {startupUpdates[startup.startup_id]?.length > 0 ? (
                      startupUpdates[startup.startup_id].map((update, index) => {
                        // Convert month number to month name
                        const monthNames = [
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ];
                        const monthName = monthNames[parseInt(update.month) - 1];
                        
                        return (
                          <div key={index} className="update-card">
                            <div className="update-header">
                              <h4>{monthName} {update.year}</h4>
                            </div>
                            <div className="update-body">
                              <p>{update.description}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-updates">No updates available</div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Updates;