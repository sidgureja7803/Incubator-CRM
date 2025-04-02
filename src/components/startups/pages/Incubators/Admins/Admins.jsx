import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './Admins.css';

const Admins = ({ cohortId }) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, [cohortId]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/cohort/admins/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  return (
    <div className="admins-grid">
      {admins.map((admin) => (
        <div key={admin.id} className="admin-card">
          <div className="admin-profile">
            <img 
              src={admin.profile_image || 'default-profile.jpg'} 
              alt={admin.name} 
              className="profile-image" 
            />
            <div className="social-links">
              <a href={admin.linkedin_url} target="_blank" rel="noopener noreferrer">
                <img src="/linkedin-icon.png" alt="LinkedIn" />
              </a>
              <a href={admin.instagram_url} target="_blank" rel="noopener noreferrer">
                <img src="/instagram-icon.png" alt="Instagram" />
              </a>
              <a href={admin.twitter_url} target="_blank" rel="noopener noreferrer">
                <img src="/twitter-icon.png" alt="Twitter" />
              </a>
            </div>
          </div>
          <div className="admin-info">
            <div className="info-row">
              <label>Name:</label>
              <span>{admin.name}</span>
            </div>
            <div className="info-row">
              <label>Phone No.:</label>
              <span>{admin.phone}</span>
            </div>
            <div className="info-row">
              <label>Company Email:</label>
              <span>{admin.email}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admins;
