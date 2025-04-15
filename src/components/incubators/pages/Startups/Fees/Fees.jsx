import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import './Fees.css';

const Fees = ({ startupId }) => {
  const [charges, setCharges] = useState([]);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [editCharge, setEditCharge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'monthly',
    dueDate: '',
    feeType: '',
    status: ''
  });

  useEffect(() => {
    if (startupId) {
      fetchSchedule();
    }
  }, [startupId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/charges/${startupId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      setCharges(response.data);
      setLoading(false);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error fetching charges:", error.response ? error.response.data : error.message);
      setLoading(false);
      return false;
    }
  };

  const handleCreateSchedule = async (totalAmount, frequency) => {
    const payload = {
      startup: startupId,
      amount: totalAmount,
      frequency: frequency
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.api_base_url}/incubator/create-charges/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setShowSchedulePopup(false);
      await fetchSchedule();
      setLoading(false);
    } catch (error) {
      console.error("Error creating schedule:", error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const handleEditCharge = async (updatedCharge) => {
    try {
      setLoading(true);
      await axios.patch(
        `${config.api_base_url}/incubator/updatecharge/${updatedCharge.id}/`,
        updatedCharge,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setEditCharge(null);
      setCharges((prevCharges) => prevCharges.map((charge) => (charge.id === updatedCharge.id ? updatedCharge : charge)));
      setLoading(false);
    } catch (error) {
      console.error("Error updating charge:", error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const handleDeleteCharge = async (chargeId) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        setLoading(true);
        await axios.delete(
          `${config.api_base_url}/incubator/deletecharge/${chargeId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
            }
          }
        );
        setCharges(charges.filter(charge => charge.id !== chargeId));
        setLoading(false);
      } catch (error) {
        console.error("Error deleting charge:", error.response ? error.response.data : error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="fees-container">
      <div className="fees-content">
        <div className="fees-header">
          <button className="add-fee-btn" onClick={() => setShowSchedulePopup(true)} disabled={loading}>
            {loading ? 'Loading...' : 'Add Fee'}
          </button>
        </div>

        {loading && charges.length === 0 && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading fees...</p>
          </div>
        )}

        {!loading && charges.length === 0 ? (
          <div className="no-fees">
            <p>No fees have been set up for this startup.</p>
            <p>Click the "Add Fee" button to create a fee schedule.</p>
          </div>
        ) : (
          <div className="fees-table">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Frequency</th>
                  <th>Fee Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((charge) => (
                  <tr key={charge.id}>
                    <td>{charge.amount} Rs</td>
                    <td>{charge.due_date}</td>
                    <td>{charge.frequency}</td>
                    <td>{charge.fee_type}</td>
                    <td>
                      <span className={`status-badge ${charge.status.toLowerCase()}`}>
                        {charge.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => setEditCharge(charge)} disabled={loading}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteCharge(charge.id)} disabled={loading}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Fee Modal */}
        {showSchedulePopup && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Fee</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateSchedule(formData.amount, formData.frequency);
              }}>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowSchedulePopup(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Fee Modal */}
        {editCharge && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Fee</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditCharge({
                  ...editCharge,
                  amount: formData.amount || editCharge.amount,
                  frequency: formData.frequency || editCharge.frequency
                });
              }}>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    defaultValue={editCharge.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    defaultValue={editCharge.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditCharge(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fees;
