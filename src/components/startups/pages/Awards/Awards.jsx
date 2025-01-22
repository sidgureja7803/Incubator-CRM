import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Awards.css';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    award_organization: '',
    award_date: '',
    categories: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get('http://139.59.46.75/api/startup/awards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAwards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching awards:', error);
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
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      if (selectedAward) {
        // Update existing award
        await axios.patch(
          `http://139.59.46.75/api/startup/awards/${selectedAward.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new award
        await axios.post(
          'http://139.59.46.75/api/startup/awards',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      fetchAwards();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving award:', error);
    }
  };

  const handleEdit = (award) => {
    setSelectedAward(award);
    setFormData({
      name: award.name,
      award_organization: award.award_organization,
      award_date: award.award_date.split('T')[0],
      categories: award.categories,
      description: award.description,
      image: null // Keep existing image if no new one is uploaded
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAward(null);
    setFormData({
      name: '',
      award_organization: '',
      award_date: '',
      categories: '',
      description: '',
      image: null
    });
  };

  return (
    <div className="awards-container">
      <div className="awards-header">
        <button className="add-award-button" onClick={() => setIsModalOpen(true)}>
          Add Awards
        </button>
      </div>

      <div className="awards-grid">
        {awards.map((award) => (
          <div key={award.id} className="award-card">
            <div className="award-header">
              <button className="edit-button" onClick={() => handleEdit(award)}>
                Edit
              </button>
            </div>
            <img src={award.image_url} alt={award.name} className="award-image" />
            <div className="award-details">
              <div className="award-info">
                <h3>Name</h3>
                <p>{award.name}</p>
              </div>
              <div className="award-info">
                <h3>Date</h3>
                <p>{new Date(award.award_date).toLocaleDateString()}</p>
              </div>
              <div className="award-info">
                <h3>Award Organization</h3>
                <p>{award.award_organization}</p>
              </div>
              <div className="award-info">
                <h3>Categories</h3>
                <p>{award.categories}</p>
              </div>
              <div className="award-info">
                <h3>Description</h3>
                <p>{award.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedAward ? 'Edit Award' : 'Enter You\'re Award Information !!'}</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="award-form">
              <div className="form-group">
                <label>Add Award Photos</label>
                <div className="upload-container">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="file-input"
                  />
                  <button type="button" className="upload-button">Upload</button>
                </div>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name here!"
                />
              </div>

              <div className="form-group">
                <label>Award Organization</label>
                <input
                  type="text"
                  name="award_organization"
                  value={formData.award_organization}
                  onChange={handleInputChange}
                  placeholder="Enter here the Award Organization!"
                />
              </div>

              <div className="form-group">
                <label>Award Date</label>
                <input
                  type="date"
                  name="award_date"
                  value={formData.award_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Categories</label>
                <input
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  placeholder="Enter the Categories"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter the Description of the award!"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Awards;
