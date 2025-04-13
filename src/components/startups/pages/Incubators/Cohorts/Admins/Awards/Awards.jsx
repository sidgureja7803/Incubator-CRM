import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './Awards.css';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/awards`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setAwards(response.data);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      setError('Failed to load awards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading awards...</div>;
  if (error) return <div className="error">{error}</div>;

  // Placeholder awards data for display
  const placeholderAwards = [
    {
      id: 1,
      name: 'Bharat Ratna',
      date: '11-10-2023',
      organization: 'TIET',
      category: 'Best Start up Award',
      description: 'Lorem ipsum dolor amet, consectetur adipiscing elit. Fusce ante turpis pharetra amet ridiculus interdum auctor. Nascetur magnis nisl egestos congue senectus lorem; placerat tellus.'
    },
    {
      id: 2,
      name: 'Bharat Ratna',
      date: '11-10-2023',
      organization: 'TIET',
      category: 'Best Start up Award',
      description: 'Lorem ipsum dolor amet, consectetur adipiscing elit. Fusce ante turpis pharetra amet ridiculus interdum auctor. Nascetur magnis nisl egestos congue senectus lorem; placerat tellus.'
    }
  ];

  return (
    <div className="awards-container">
      <div className="awards-header">
        <h1>Awards</h1>
        <button className="add-award-btn" onClick={() => setShowAddModal(true)}>
          Add Awards
        </button>
      </div>

      <div className="awards-grid">
        {(awards.length > 0 ? awards : placeholderAwards).map((award) => (
          <div key={award.id} className="award-card">
            <div className="award-banner">
              <img 
                src="/award-banner.png" 
                alt="Award Banner" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x150/6A3DE8/FFFFFF?text=Award+Banner";
                }}
              />
              <button className="edit-award-btn">Edit</button>
            </div>
            
            <div className="award-details">
              <div className="award-detail-row">
                <div className="detail-label">Name</div>
                <div className="detail-value">{award.name}</div>
              </div>
              
              <div className="award-detail-row">
                <div className="detail-label">Date</div>
                <div className="detail-value">{award.date}</div>
              </div>
              
              <div className="award-detail-row">
                <div className="detail-label">Award Organization</div>
                <div className="detail-value">{award.organization}</div>
              </div>
              
              <div className="award-detail-row">
                <div className="detail-label">Categories</div>
                <div className="detail-value">{award.category}</div>
              </div>
              
              <div className="award-detail-row">
                <div className="detail-label">Description</div>
                <div className="detail-value description">{award.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* We'll implement the Add Award modal later */}
    </div>
  );
};

export default Awards; 