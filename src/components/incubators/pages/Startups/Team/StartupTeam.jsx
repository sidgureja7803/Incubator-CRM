import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './StartupTeam.css';

const StartupTeam = () => {
  const { startup } = useOutletContext();
  const teamMembers = startup?.Startup_People || [];

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="team-container">
      <h2>Team Members</h2>
      
      {teamMembers.length === 0 ? (
        <div className="no-team-members">
          <p>No team members have been added yet.</p>
        </div>
      ) : (
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member-card">
              <div className="member-image">
                <img 
                  src={member.image_url} 
                  alt={`${member.first_name} ${member.last_name}`} 
                  loading="lazy"
                />
              </div>
              <div className="member-info">
                <h3>{member.first_name} {member.last_name}</h3>
                <div className="member-roles">
                  <p className="primary-role">{member.primary_role}</p>
                  {member.secondary_role && member.secondary_role !== member.primary_role && (
                    <p className="secondary-role">{member.secondary_role}</p>
                  )}
                </div>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="label">Company Email:</span>
                    <span className="value">{member.company_email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="label">Company Phone:</span>
                    <span className="value">{member.company_phone}</span>
                  </div>
                </div>

                {(member.linkedin || member.twitter || member.instagram) && (
                  <div className="social-links">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                        LinkedIn
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                        Twitter
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                        Instagram
                      </a>
                    )}
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

export default StartupTeam;