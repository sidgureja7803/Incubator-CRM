import React, { useState, useEffect } from 'react';
import axios from "utils/httpClient";
import config from "config";
import './Members.css';

const Members = ({ cohortId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, [cohortId]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/cohort/members/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  return (
    <div className="members-grid">
      {members.map((member) => (
        <div key={member.id} className="member-card">
          <div className="member-profile">
            <img 
              src={member.profile_image || 'default-profile.jpg'} 
              alt={member.name} 
              className="profile-image" 
            />
            <div className="social-links">
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                <img src="/linkedin-icon.png" alt="LinkedIn" />
              </a>
              <a href={member.instagram_url} target="_blank" rel="noopener noreferrer">
                <img src="/instagram-icon.png" alt="Instagram" />
              </a>
              <a href={member.twitter_url} target="_blank" rel="noopener noreferrer">
                <img src="/twitter-icon.png" alt="Twitter" />
              </a>
            </div>
          </div>
          <div className="member-info">
            <div className="info-row">
              <label>Name:</label>
              <span>{member.firstname} {member.lastname}</span>
            </div>
            <div className="info-row">
              <label>Company Name:</label>
              <span>{member.startupname}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{member.email}</span>
            </div>
            <div className="info-row">
              <label>Phone No.:</label>
              <span>{member.phone}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
