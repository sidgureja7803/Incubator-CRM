import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';
import './Team.css';

const Team = () => {
  const [people, setPeople] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    primary_role: '',
    secondary_role: '',
    personal_phone: '',
    company_phone: '',
    personal_email: '',
    company_email: '',
    profile_image: null
  });

  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/people/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPeople(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      profile_image: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.primary_role) newErrors.primary_role = 'Primary role is required';
    if (!formData.personal_phone) newErrors.personal_phone = 'Personal phone is required';
    if (!formData.personal_email) newErrors.personal_email = 'Personal email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editIndex !== null) {
        await axios.patch(
          `${config.api_base_url}/startup/people/${people[editIndex].id}`,
          formDataToSend,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
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
      }
      
      fetchTeamMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (index) => {
    const person = people[index];
    setFormData({
      name: person.name,
      primary_role: person.primary_role,
      secondary_role: person.secondary_role || '',
      personal_phone: person.personal_phone,
      company_phone: person.company_phone || '',
      personal_email: person.personal_email,
      company_email: person.company_email || '',
      profile_image: null
    });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.delete(
        `${config.api_base_url}/startup/people/${people[index].id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditIndex(null);
    setFormData({
      name: '',
      primary_role: '',
      secondary_role: '',
      personal_phone: '',
      company_phone: '',
      personal_email: '',
      company_email: '',
      profile_image: null
    });
    setErrors({});
  };

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
              <img src={person.profile_image || 'default-avatar.png'} alt={person.name} />
            </div>
            <div className="member-info">
              <h3>Name: {person.name}</h3>
              <div className="role-info">
                <p>Primary Role: {person.primary_role}</p>
                <p>Secondary Role: {person.secondary_role}</p>
              </div>
              <div className="contact-info">
                <p>Personal Phone: {person.personal_phone}</p>
                <p>Company Phone: {person.company_phone}</p>
                <p>Personal Email: {person.personal_email}</p>
                <p>Company Email: {person.company_email}</p>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
              <div className="card-actions">
                <button className="edit-button" onClick={() => handleEdit(index)}>
                  Edit Info
                </button>
                <button className="invite-button">
                  Invite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editIndex !== null ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="member-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Primary Role</label>
                <input
                  type="text"
                  name="primary_role"
                  value={formData.primary_role}
                  onChange={handleInputChange}
                  placeholder="Enter Primary Role"
                />
                {errors.primary_role && <span className="error">{errors.primary_role}</span>}
              </div>

              <div className="form-group">
                <label>Secondary Role</label>
                <input
                  type="text"
                  name="secondary_role"
                  value={formData.secondary_role}
                  onChange={handleInputChange}
                  placeholder="Enter Secondary Role"
                />
              </div>

              <div className="form-group">
                <label>Personal Phone</label>
                <input
                  type="text"
                  name="personal_phone"
                  value={formData.personal_phone}
                  onChange={handleInputChange}
                  placeholder="Enter Personal Phone"
                />
                {errors.personal_phone && <span className="error">{errors.personal_phone}</span>}
              </div>

              <div className="form-group">
                <label>Company Phone</label>
                <input
                  type="text"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleInputChange}
                  placeholder="Enter Company Phone"
                />
              </div>

              <div className="form-group">
                <label>Personal Email</label>
                <input
                  type="email"
                  name="personal_email"
                  value={formData.personal_email}
                  onChange={handleInputChange}
                  placeholder="Enter Personal Email"
                />
                {errors.personal_email && <span className="error">{errors.personal_email}</span>}
              </div>

              <div className="form-group">
                <label>Company Email</label>
                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                  placeholder="Enter Company Email"
                />
              </div>

              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editIndex !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
