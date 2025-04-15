import React, { useState } from 'react';
import axios from 'axios';
import config from 'config';
import './Team.css';
import { FaLinkedin, FaInstagram, FaTwitter, FaPlus } from 'react-icons/fa';
import { useIncubator } from '../../../../../hooks/useIncubator';

const Team = () => {
  const { incubatorTeam, refetchIncubatorTeam } = useIncubator();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Form states
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const validateForm = () => {
    if (!first_name || !last_name || !email || !designation) {
      alert("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      editIndex !== null ? handleUpdate() : handleAddPerson();
      resetForm();
    }
  };

  const handleAddPerson = async () => {
    if (!validateForm()) return;
    
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('designation', designation);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${config.api_base_url}/incubator/people/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      // Refetch team members to update the UI
      refetchIncubatorTeam();
      
      resetForm();
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error adding person:", error);
      alert("Failed to add team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    if (incubatorTeam && incubatorTeam[index]) {
      const person = incubatorTeam[index];
      setfirst_name(person.first_name || '');
      setlast_name(person.last_name || '');
      setEmail(person.email || '');
      setDesignation(person.designation || '');
      setEditIndex(index);
      setIsAddPersonOpen(true);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('designation', designation);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      setIsLoading(true);
      if (!incubatorTeam || !incubatorTeam[editIndex]) {
        throw new Error('Team member not found');
      }
      
      await axios.patch(
        `${config.api_base_url}/incubator/people/${incubatorTeam[editIndex].id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      // Refetch team members to update the UI
      refetchIncubatorTeam();
      
      resetForm();
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error updating person:", error);
      alert("Failed to update team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const confirmation = window.confirm(
      "Do you really want to delete this team member?"
    );
    if (confirmation) {
      try {
        setIsLoading(true);
        if (!incubatorTeam || !incubatorTeam[index]) {
          throw new Error('Team member not found');
        }
        
        await axios.delete(
          `${config.api_base_url}/incubator/people/${incubatorTeam[index].id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
            },
          }
        );
        
        // Refetch team members to update the UI
        refetchIncubatorTeam();
      } catch (error) {
        console.error("Error deleting person:", error);
        alert("Failed to delete team member");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setfirst_name("");
    setlast_name("");
    setEmail("");
    setDesignation("");
    setSelectedImage(null);
    setIsAddPersonOpen(false);
    setEditIndex(null);
  };

  if (isLoading) {
    return <div className="loading">Loading team members...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const teamMembers = incubatorTeam || [];

  return (
    <div className="main-container">
      <button 
        className="add-team-button" 
        onClick={() => setIsAddPersonOpen(true)}
      >
        <FaPlus style={{ marginRight: '8px' }} /> Add Team
      </button>
      
      <div className="team-container">
        {teamMembers.length === 0 ? (
          <div className="no-team-members">
            <p>No team members added yet. Click "Add Team" to get started.</p>
          </div>
        ) : (
          teamMembers.map((person, index) => (
            <div key={person.id || index} className="member-card">
              <div className="member-image">
                <img 
                  src={person.image || 'https://via.placeholder.com/96'} 
                  alt={`${person.first_name} ${person.last_name}`} 
                />
              </div>
              <div className="member-info">
                <h3>Name: {person.first_name} {person.last_name}</h3>
                <div className="designation-info">
                  <p>Designation: {person.designation}</p>
                </div>
                <div className="contact-info">
                  <p>Email: {person.email}</p>
                  <p>Phone: {person.phone || 'N/A'}</p>
                </div>
                
                <div className="social-links">
                  {person.linkedin && (
                    <a 
                      href={person.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="linkedin"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {person.instagram && (
                    <a 
                      href={person.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="instagram"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {person.twitter && (
                    <a 
                      href={person.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="twitter"
                    >
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddPersonOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editIndex !== null ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button className="close-button" onClick={resetForm}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setfirst_name(e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setlast_name(e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Enter designation"
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleSubmit}>
                  {editIndex !== null ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="success-popup">
          Team member {editIndex !== null ? 'updated' : 'added'} successfully!
        </div>
      )}
    </div>
  );
};

export default Team;