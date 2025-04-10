import React from 'react';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import './Team.css';
import { BsLinkedin, BsTwitter, BsInstagram } from 'react-icons/bs';

const Team = () => {
  const { incubatorTeam } = useIncubatorContext();

  const dummyTeam = [
    {
      id: 1,
      first_name: 'Kanishk',
      last_name: 'Dadwal',
      designation: 'Venture Lab',
      email: 'kanishkdadwal@gmail.com',
      phone: '+91 9690602545',
      profile_picture: 'https://randomuser.me/api/portraits/women/79.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    },
    // Repeat 3 more times for the grid
  ];

  const team = incubatorTeam || Array(4).fill(dummyTeam[0]);

  return (
    <div className="team-container">
      <div className="team-header">
        <button className="add-team-button">Add Team</button>
      </div>

      <div className="team-grid">
        {team.map((member, index) => (
          <div key={index} className="team-card">
            <div className="member-profile">
              <img 
                src={member.profile_picture} 
                alt={`${member.first_name} ${member.last_name}`} 
                className="member-photo"
              />
              <div className="member-social">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><BsLinkedin /></a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer"><BsInstagram /></a>
                <a href={member.twitter} target="_blank" rel="noopener noreferrer"><BsTwitter /></a>
              </div>
            </div>

            <div className="member-details">
              <div className="member-field">
                <span className="field-label">Name:</span>
                <span className="field-value">{member.first_name} {member.last_name}</span>
              </div>

              <div className="member-field">
                <span className="field-label">Designation:</span>
                <span className="field-value">{member.designation}</span>
              </div>

              <div className="member-field">
                <span className="field-label">Email:</span>
                <span className="field-value">{member.email}</span>
              </div>

              <div className="member-field">
                <span className="field-label">Phone No.:</span>
                <span className="field-value">{member.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;