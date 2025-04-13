import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './Mentors.css';

const Mentors = ({ cohortId }) => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchMentors();
  }, [cohortId]);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/mentor/get-mentor-for-fellowpeople`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  return (
    <div className="mentors-grid">
      {mentors.map((mentor) => (
        <div key={mentor.id} className="mentor-card">
          <div className="mentor-profile">
            <img 
              src={mentor.profile_image || 'default-profile.jpg'} 
              alt={mentor.name} 
              className="profile-image" 
            />
            <div className="social-links">
              <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer">
                <img src="/linkedin-icon.png" alt="LinkedIn" />
              </a>
              <a href={mentor.instagram_url} target="_blank" rel="noopener noreferrer">
                <img src="/instagram-icon.png" alt="Instagram" />
              </a>
              <a href={mentor.twitter_url} target="_blank" rel="noopener noreferrer">
                <img src="/twitter-icon.png" alt="Twitter" />
              </a>
            </div>
          </div>
          <div className="mentor-info">
            <div className="info-row">
              <label>Name:</label>
              <span>{mentor.first_name} {mentor.last_name}</span>
            </div>
            <div className="info-row">
              <label>Expertise:</label>
              <span>{mentor.expertise}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{mentor.email}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mentors;
