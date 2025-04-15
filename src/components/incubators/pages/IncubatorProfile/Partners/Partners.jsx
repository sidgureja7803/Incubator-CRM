import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../../config';
import Modal from 'react-modal';
import './Partners.css';

Modal.setAppElement('#root');

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    partnership_type: "",
    logo: null
  });
  const [errors, setErrors] = useState({});
  const [currentPartnerId, setCurrentPartnerId] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/partners/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
        },
      });
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      // Set mock data for development purposes
      setPartners([
        {
          id: 1,
          name: "Google for Startups",
          description: "Google for Startups helps startups build something better.",
          partnership_type: "Technology",
          website: "https://startup.google.com",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
        },
        {
          id: 2,
          name: "Microsoft Ventures",
          description: "Microsoft Ventures provides technology and investment to innovative startups.",
          partnership_type: "Financial",
          website: "https://www.microsoft.com/ventures",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.partnership_type) {
      newErrors.partnership_type = "Partnership type is required";
    }
    
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    if (name === 'logo' && files && files[0]) {
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
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${config.api_base_url}/incubator/partners/`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      setPartners([...partners, response.data]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating partner:", error);
      alert("Failed to add partner. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        // Only append if value exists and for logo, only if it's a file
        if (formData[key] !== null && !(key === 'logo' && typeof formData[key] === 'string')) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.patch(`${config.api_base_url}/incubator/partners/${currentPartnerId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      setIsEditModalOpen(false);
      fetchPartners(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating partner:", error);
      alert("Failed to update partner. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (partner) => {
    setFormData({
      name: partner.name,
      website: partner.website || "",
      description: partner.description,
      partnership_type: partner.partnership_type,
      logo: partner.logo
    });
    setErrors({});
    setCurrentPartnerId(partner.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (partnerId) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setLoading(true);
      try {
        await axios.delete(`${config.api_base_url}/incubator/partners/${partnerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        });
        setPartners(partners.filter(partner => partner.id !== partnerId));
      } catch (error) {
        console.error("Error deleting partner:", error);
        alert("Failed to delete partner. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      description: "",
      partnership_type: "",
      logo: null
    });
    setErrors({});
  };

  return (
    <div className="partners-container">
      <div className="partners-header">
        <h2>Partners</h2>
        <button 
          className="add-btn" 
          onClick={() => setIsAddModalOpen(true)}
          disabled={loading}
        >
          {loading && <span className="button-loader"></span>}
          Add Partner
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading partners...</p>
        </div>
      )}

      <div className="partners-grid">
        {!loading && partners.length === 0 && (
          <div className="no-partners">
            <p>No partners found</p>
            <p>Click the button above to add your first partner</p>
          </div>
        )}
        {partners.length > 0 && (
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
                  <button onClick={() => handleEdit(partner)} disabled={loading}>Edit</button>
                  <button onClick={() => handleDelete(partner.id)} disabled={loading}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => !submitting && setIsAddModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add Partner</h2>
        {submitting && <div className="modal-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Saving partner...</p>
        </div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "invalid" : ""}
              required
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={errors.website ? "invalid" : ""}
            />
            {errors.website && <div className="error-message">{errors.website}</div>}
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "invalid" : ""}
              required
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label>Partnership Type:</label>
            <select
              name="partnership_type"
              value={formData.partnership_type}
              onChange={handleChange}
              className={errors.partnership_type ? "invalid" : ""}
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
            {errors.partnership_type && <div className="error-message">{errors.partnership_type}</div>}
          </div>
          <div className="form-group">
            <label>Logo:</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/*"
            />
            {formData.logo && typeof formData.logo === 'object' && (
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.logo)} alt="Preview" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => setIsAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting && <span className="button-loader"></span>}
              Save Partner
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => !submitting && setIsEditModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Partner</h2>
        {submitting && <div className="modal-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Updating partner...</p>
        </div>}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "invalid" : ""}
              required
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={errors.website ? "invalid" : ""}
            />
            {errors.website && <div className="error-message">{errors.website}</div>}
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "invalid" : ""}
              required
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label>Partnership Type:</label>
            <select
              name="partnership_type"
              value={formData.partnership_type}
              onChange={handleChange}
              className={errors.partnership_type ? "invalid" : ""}
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
            {errors.partnership_type && <div className="error-message">{errors.partnership_type}</div>}
          </div>
          <div className="form-group">
            <label>Logo (Leave empty to keep current):</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/*"
            />
            {formData.logo && typeof formData.logo === 'object' && (
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.logo)} alt="Preview" />
              </div>
            )}
            {formData.logo && typeof formData.logo === 'string' && (
              <div className="image-preview">
                <img src={formData.logo} alt="Current logo" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting && <span className="button-loader"></span>}
              Update Partner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Partners;
