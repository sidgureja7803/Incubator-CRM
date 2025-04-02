import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from '../../../../../config';
import Modal from 'react-modal';
import './Partners.css';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    partnership_type: '',
    logo: null
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await authAxios.get(`${config.api_base_url}/incubator/partners/`);
      setPartners(response.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'logo' && files[0]) {
      setFormData({
        ...formData,
        logo: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    
    try {
      await authAxios.post(`${config.api_base_url}/incubator/partners/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchPartners();
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        website: '',
        description: '',
        partnership_type: '',
        logo: null
      });
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const handleEdit = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      name: partner.name,
      website: partner.website || '',
      description: partner.description || '',
      partnership_type: partner.partnership_type || '',
      logo: null
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    
    try {
      await authAxios.patch(`${config.api_base_url}/incubator/partners/${currentPartner.id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchPartners();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await authAxios.delete(`${config.api_base_url}/incubator/partners/${id}/`);
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  return (
    <div className="partners-container">
      <div className="partners-header">
        <h2>Partners</h2>
        <button onClick={() => setIsAddModalOpen(true)}>Add Partner</button>
      </div>

      <div className="partners-grid">
        {partners.length === 0 ? (
          <p>No partners available</p>
        ) : (
          partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <div className="partner-logo">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} />
                ) : (
                  <div className="no-logo">No Logo</div>
                )}
              </div>
              <div className="partner-info">
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <div className="partner-details">
                  <span><strong>Type:</strong> {partner.partnership_type}</span>
                  {partner.website && (
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  )}
                </div>
                <div className="partner-actions">
                  <button onClick={() => handleEdit(partner)}>Edit</button>
                  <button onClick={() => handleDelete(partner.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add Partner</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Partnership Type:</label>
            <select
              name="partnership_type"
              value={formData.partnership_type}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              <option value="Technology">Technology</option>
              <option value="Financial">Financial</option>
              <option value="Marketing">Marketing</option>
              <option value="Research">Research</option>
              <option value="Educational">Educational</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Logo:</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Partner</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Partnership Type:</label>
            <select
              name="partnership_type"
              value={formData.partnership_type}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              <option value="Technology">Technology</option>
              <option value="Financial">Financial</option>
              <option value="Marketing">Marketing</option>
              <option value="Research">Research</option>
              <option value="Educational">Educational</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Logo (Leave empty to keep current):</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <div className="form-actions">
            <button type="submit">Update</button>
            <button type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Partners;
