import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../../config';
import './Updates.css';

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/add-regular-update/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
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

  const handleMonthSelect = (month) => {
    setFormData(prev => ({ ...prev, month: month.value }));
    setIsDropdownOpen(false);
    if (errors.month) {
      setErrors(prev => ({ ...prev, month: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.post(
        `${config.api_base_url}/startup/add-regular-update/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUpdates();
      setShowModal(false);
      setFormData({
        month: '',
        year: new Date().getFullYear(),
        description: ''
      });
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const getMonthLabel = (value) => {
    const month = months.find(m => m.value === value);
    return month ? month.label : '';
  };

  return (
    <div className="updates-container">
      <div className="updates-header">
        <button className="add-update-button" onClick={() => setShowModal(true)}>
          Add Updates
        </button>
      </div>

      <div className="updates-list">
        {updates.map((update, index) => (
          <div key={index} className="update-card">
            <div className="update-header">
              <h3>{getMonthLabel(update.month)} {update.year}</h3>
            </div>
            <div className="update-description">
              <p>{update.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Updates !</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="update-form">
              <div className="form-group">
                <label>Month</label>
                <div className="custom-select">
                  <div 
                    className="select-header" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {formData.month ? getMonthLabel(formData.month) : 'Enter the Months'}
                  </div>
                  {isDropdownOpen && (
                    <div className="select-options">
                      {months.map((month) => (
                        <div
                          key={month.value}
                          className="select-option"
                          onClick={() => handleMonthSelect(month)}
                        >
                          {month.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.month && <span className="error">{errors.month}</span>}
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Enter the Years"
                />
                {errors.year && <span className="error">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter your Update here !!"
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;
