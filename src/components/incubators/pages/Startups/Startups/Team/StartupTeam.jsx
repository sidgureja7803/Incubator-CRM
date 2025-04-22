import React from 'react';
import './StartupTeam.css';
import defaultAvatar from './image.png';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const StartupTeam = ({ startup }) => {
  if (!startup || !startup.Startup_People) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Team information not found</p>
      </div>
    );
  }

  return (
    <div className="team-container">
      <div className="team-header">
        <h2>Team Members</h2>
      </div>
      <div className="team-cards-grid">
        {startup.Startup_People.map((member) => (
          <div key={member.id} className="team-card">
            <div className="card-left">
              <div className="member-avatar">
                <img 
                  src={member.image_url || defaultAvatar} 
                  alt={`${member.first_name} ${member.last_name}`} 
                />
              </div>
              <div className="social-links">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <FaLinkedin />
                </a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <FaInstagram />
                </a>
                <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <FaTwitter />
                </a>
              </div>
              <div className="action-buttons">
                <button className="action-btn edit">Edit Info</button>
                <button className="action-btn invite">Invite</button>
              </div>
            </div>
            <div className="card-right">
              <div className="member-info">
                <h3 className="member-name">{member.first_name} {member.last_name}</h3>
                <div className="member-roles">
                  <div className="role-item">
                    <span className="role-label">Primary Roll:</span>
                    <span className="role-value">{member.primary_role || 'CFO'}</span>
                  </div>
                  <div className="role-item">
                    <span className="role-label">Secondary Roll:</span>
                    <span className="role-value">{member.secondary_role || 'Founder'}</span>
                  </div>
                </div>
                <div className="contact-details">
                  <div className="contact-row">
                    <div className="contact-item">
                      <span className="contact-label">Personal Phone No.:</span>
                      <span className="contact-value">{member.personal_phone || '+91 9690602545'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Company Phone No.:</span>
                      <span className="contact-value">{member.company_phone || '+91 9690602545'}</span>
                    </div>
                  </div>
                  <div className="contact-row">
                    <div className="contact-item">
                      <span className="contact-label">Personal Email:</span>
                      <span className="contact-value">{member.personal_email || 'kanishkdadwal@gmail.com'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Company Email:</span>
                      <span className="contact-value">{member.company_email || 'kanishkdadwal@gmail.com'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartupTeam;