import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import { useOutletContext } from 'react-router-dom';
import './Fees.css';

const Fees = () => {
  const { startup } = useOutletContext();
  const fees = startup?.fees || [];
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

  const handleCreateSchedule = async (totalAmount, frequency) => {
    const payload = {
      startup: startup.id,
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
      await fetchSchedule();
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
        await fetchSchedule();
        setLoading(false);
      } catch (error) {
        console.error("Error deleting charge:", error.response ? error.response.data : error.message);
        setLoading(false);
      }
    }
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api_base_url}/incubator/charges/${startup.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      setLoading(false);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error fetching charges:", error.response ? error.response.data : error.message);
      setLoading(false);
      return false;
    }
  };

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>Startup information not found</p>
      </div>
    );
  }

  return (
    <div className="fees-container">
      <h2>Fee Records</h2>
      
      {fees.length === 0 ? (
        <div className="no-fees">
          <p>No fee records have been added yet.</p>
        </div>
      ) : (
        <div className="fees-table-container">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Fee Type</th>
                <th>Payment Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, index) => (
                <tr key={fee.id || index} className={fee.status === 'Paid' ? 'paid' : 'unpaid'}>
                  <td>{fee.payment_date || 'N/A'}</td>
                  <td className="amount">₹{fee.amount?.toLocaleString() || 'N/A'}</td>
                  <td>{fee.type || 'Regular Fee'}</td>
                  <td>
                    <span className={`status-badge ${fee.status?.toLowerCase() || 'pending'}`}>
                      {fee.status || 'Pending'}
                    </span>
                  </td>
                  <td>{fee.due_date || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="fees-content">
        <div className="fees-header">
          <button className="add-fee-btn" onClick={() => setShowSchedulePopup(true)} disabled={loading}>
            {loading ? 'Loading...' : 'Add Fee'}
          </button>
        </div>

        {loading && fees.length === 0 && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading fees...</p>
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
