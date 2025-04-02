import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import './IntelluctualProperties.css';

const IntellectualProperties = () => {
  const [ipList, setIpList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIp, setSelectedIp] = useState(null);
  const [formData, setFormData] = useState({
    ip_type: '',
    ip_number: '',
    description: '',
    ip_status: '',
    ip_status_date: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchIpList();
  }, []);

  const fetchIpList = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/intellectualproperties/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIpList(response.data);
    } catch (error) {
      console.error('Error fetching IP list:', error);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ip_type) newErrors.ip_type = 'IP Type is required';
    if (!formData.ip_number) newErrors.ip_number = 'IP Number is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.ip_status) newErrors.ip_status = 'IP Status is required';
    if (!formData.ip_status_date) newErrors.ip_status_date = 'Status Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (selectedIp) {
        await axios.patch(
          `${config.api_base_url}/startup/intellectualproperties/${selectedIp.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          `${config.api_base_url}/startup/intellectualproperties/`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      fetchIpList();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving IP:', error);
    }
  };

  const handleEdit = (ip) => {
    setSelectedIp(ip);
    setFormData({
      ip_type: ip.ip_type,
      ip_number: ip.ip_number,
      description: ip.description,
      ip_status: ip.ip_status,
      ip_status_date: ip.ip_status_date
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.delete(
        `${config.api_base_url}/startup/intellectualproperties/${selectedIp.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchIpList();
      setShowDeleteModal(false);
      setSelectedIp(null);
    } catch (error) {
      console.error('Error deleting IP:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIp(null);
    setFormData({
      ip_type: '',
      ip_number: '',
      description: '',
      ip_status: '',
      ip_status_date: ''
    });
    setErrors({});
  };

  return (
    <div className="ip-container">
      <div className="ip-header">
        <button className="add-ip-button" onClick={() => setShowModal(true)}>
          Add IP's
        </button>
      </div>

      <div className="ip-table">
        <table>
          <thead>
            <tr>
              <th>IP Type</th>
              <th>IP Number</th>
              <th>Description</th>
              <th>IP Status</th>
              <th>IP Status Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ipList.map((ip) => (
              <tr key={ip.id}>
                <td>{ip.ip_type}</td>
                <td>{ip.ip_number}</td>
                <td>{ip.description}</td>
                <td>{ip.ip_status}</td>
                <td>{new Date(ip.ip_status_date).toLocaleDateString()}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(ip)}>✏️</button>
                  <button onClick={() => {
                    setSelectedIp(ip);
                    setShowDeleteModal(true);
                  }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Intellectual Properties!</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="ip-form">
              <div className="form-group">
                <label>IP Type</label>
                <input
                  type="text"
                  name="ip_type"
                  value={formData.ip_type}
                  onChange={handleInputChange}
                  placeholder="Enter the IP Type"
                />
                {errors.ip_type && <span className="error">{errors.ip_type}</span>}
              </div>

              <div className="form-group">
                <label>IP Number</label>
                <input
                  type="text"
                  name="ip_number"
                  value={formData.ip_number}
                  onChange={handleInputChange}
                  placeholder="Enter IP Number eg : 23876"
                />
                {errors.ip_number && <span className="error">{errors.ip_number}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter the Description for IP !!"
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label>IP Status</label>
                <input
                  type="text"
                  name="ip_status"
                  value={formData.ip_status}
                  onChange={handleInputChange}
                  placeholder="Enter the IP Status"
                />
                {errors.ip_status && <span className="error">{errors.ip_status}</span>}
              </div>

              <div className="form-group">
                <label>IP Status Date</label>
                <input
                  type="date"
                  name="ip_status_date"
                  value={formData.ip_status_date}
                  onChange={handleInputChange}
                />
                {errors.ip_status_date && <span className="error">{errors.ip_status_date}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  {selectedIp ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this IP record?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntellectualProperties;
