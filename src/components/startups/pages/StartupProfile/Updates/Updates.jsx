import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
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
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(`${config.api_base_url}/startup/regular-update/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setMessage('No updates added or found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const updateData = {
        month: selectedMonth || month,
        year,
        description
      };

      if (editingUpdate) {
        // Update existing update
        await axios.patch(
          `${config.api_base_url}/startup/regular-update/${editingUpdate.id}/`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessage('Update successfully edited!');
      } else {
        // Add new update
        await axios.post(
          `${config.api_base_url}/startup/regular-update/`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessage('Update successfully added!');
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setMessage('');
      }, 3000);

      // Reset form
      setMonth('');
      setYear(new Date().getFullYear().toString());
      setDescription('');
      setSelectedMonth('');
      setEditingUpdate(null);
      setShowModal(false);

      // Refresh updates list
      fetchUpdates();
    } catch (error) {
      console.error('Error saving update:', error);
      setMessage('Failed to save update');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setMonth(update.month);
    setYear(update.year);
    setDescription(update.description);
    setSelectedMonth(update.month);
    setShowModal(true);
  };

  const handleMonthSelect = (selectedMonth) => {
    setMonth(selectedMonth.value);
    setSelectedMonth(selectedMonth.value);
  };

  return (
    <div className="updates-container">
      <div className="updates-header">
        <h2>Updates</h2>
        <button className="add-update-button" onClick={() => setShowModal(true)}>
          Add Update
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {message && (
        <div className={`message ${showSuccessPopup ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="updates-list">
        {updates.map((update) => (
          <div key={update.id} className="update-card">
            <div className="update-header">
              <h3>{months.find(m => m.value === update.month)?.label} {update.year}</h3>
              <button className="edit-button" onClick={() => handleEdit(update)}>
                Edit
              </button>
            </div>
            <div className="update-content">
              <p>{update.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUpdate ? 'Edit Update' : 'Add New Update'}</h3>
              <button className="close-button" onClick={() => {
                setShowModal(false);
                setEditingUpdate(null);
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Month</label>
                <select
                  value={selectedMonth || month}
                  onChange={(e) => handleMonthSelect({ value: e.target.value })}
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max="2100"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Saving...' : editingUpdate ? 'Save Changes' : 'Add Update'}
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
