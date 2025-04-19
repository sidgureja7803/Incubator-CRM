import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import './Team.css';
import defaultAvatar from './dummyImage.png';
const Team = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    primary_role: '',
    secondary_role: '',
    personal_phone: '',
    company_phone: '',
    personal_email: '',
    company_email: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    profile_image: null
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.get(
        `${config.api_base_url}/startup/people/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPeople(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profile_image: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post(
        `${config.api_base_url}/startup/people/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      await fetchTeamMembers();
      setShowModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        primary_role: '',
        secondary_role: '',
        personal_phone: '',
        company_phone: '',
        personal_email: '',
        company_email: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        profile_image: null
      });
    } catch (err) {
      console.error("Error adding team member:", err);
      setError("Failed to add team member. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading team members...</p>
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
    <div className="team-container">
      <div className="team-header">
        <button className="add-member-button" onClick={() => setShowModal(true)}>
          Add Team Member
        </button>
      </div>

      <div className="team-grid">
        {people.map((person, index) => (
          <div key={index} className="member-card">
            <div className="member-image">
              <img src={person.profile_image || defaultAvatar} alt={`${person.first_name} ${person.last_name}`} />
            </div>
            <div className="member-info">
              <h3>Name: {person.first_name} {person.last_name}</h3>
              <div className="role-info">
                <p>Primary Role: {person.primary_role}</p>
                <p>Secondary Role: {person.secondary_role}</p>
              </div>
              <div className="contact-info">
                <p>Personal Phone No.: {person.personal_phone}</p>
                <p>Company Phone No.: {person.company_phone}</p>
                <p>Personal Email: {person.personal_email}</p>
                <p>Company Email: {person.company_email}</p>
              </div>
              <div className="social-links">
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {person.instagram && (
                  <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {person.twitter && (
                  <a href={person.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
              </div>
              <div className="card-actions">
                <button className="edit-button">Edit Info</button>
                <button className="invite-button">Invite</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Team Member</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="member-form">
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Primary Role</label>
                <input
                  type="text"
                  name="primary_role"
                  value={formData.primary_role}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Secondary Role</label>
                <input
                  type="text"
                  name="secondary_role"
                  value={formData.secondary_role}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Personal Phone</label>
                <input
                  type="text"
                  name="personal_phone"
                  value={formData.personal_phone}
                  onChange={handleInputChange}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Company Phone</label>
                <input
                  type="text"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleInputChange}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Personal Email</label>
                <input
                  type="email"
                  name="personal_email"
                  value={formData.personal_email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company Email</label>
                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;