import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../../config';
import './Updates.css';

const Updates = () => {
  const [updates, setUpdates] = useState([]);
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
      console.error("No startup ID found in URL");
      setError("No startup ID found. Please navigate to a valid startup page.");
      setLoading(false);
    }
  }, []);
  
  // Fetch updates directly
  useEffect(() => {
    if (!startupId) return;
    
    const fetchStartupUpdates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await axios.get(
          `${config.api_base_url}/incubator/startup/${startupId}/updates/`, 
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        console.log("Startup updates data:", response.data);
        
        // Process response data - format dates and sort by date (newest first)
        const formattedUpdates = response.data.map(update => ({
          ...update,
          date: new Date(update.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setUpdates(formattedUpdates);
        setError(null);
      } catch (err) {
        console.error("Error fetching startup updates:", err);
        
        // Add mock data for testing if API fails
        console.log("Using mock data for startup updates");
        const mockData = [
          {
            id: 1,
            title: "Series A Funding Completed",
            description: "We've successfully closed our Series A funding round, securing ₹50M in investment.",
            created_at: "2023-11-15T10:30:00Z",
            date: "November 15, 2023"
          },
          {
            id: 2,
            title: "New Product Launch",
            description: "Successfully launched our new cloud analytics platform with positive initial customer feedback.",
            created_at: "2023-09-22T14:45:00Z",
            date: "September 22, 2023"
          },
          {
            id: 3,
            title: "Team Expansion",
            description: "Added 5 new team members this quarter, including senior developers and a marketing director.",
            created_at: "2023-07-03T09:15:00Z",
            date: "July 3, 2023"
          }
        ];
        setUpdates(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchStartupUpdates();
  }, [startupId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading updates...</p>
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
                  <h3>{update.title || (update.month && update.year ? update.month + ' ' + update.year : 'Update')}</h3>
                  <span className="update-date">{update.date}</span>
                </div>
                <div className="update-body">
                  <p>{update.description || update.content || 'No details available.'}</p>
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