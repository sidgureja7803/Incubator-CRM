import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from 'config';
import './Fees.css';

const Fees = () => {
  const [charges, setCharges] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [editCharge, setEditCharge] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'monthly',
    dueDate: '',
    feeType: '',
    status: ''
  });

  useEffect(() => {
    if (selectedStartup) {
      fetchSchedule(selectedStartup);
    }
  }, [selectedStartup]);

  const fetchSchedule = async (startup) => {
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/charges/${startup.startup_id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
        }
      });
      setCharges(response.data);
      return response.data.length > 0;
    } catch (error) {
      console.error("Error fetching charges:", error.response ? error.response.data : error.message);
      return false;
    }
  };

  const handleCreateSchedule = async (startupId, totalAmount, frequency) => {
    const payload = {
      startup: startupId,
      amount: totalAmount,
      frequency: frequency
    };

    try {
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
      await fetchSchedule(selectedStartup);
    } catch (error) {
      console.error("Error creating schedule:", error.response ? error.response.data : error.message);
    }
  };

  const handleEditCharge = async (updatedCharge) => {
    try {
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
    } catch (error) {
      console.error("Error updating charge:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="fees-container">
      <div className="navigation-tabs">
        <div className="tab">Startup Info</div>
        <div className="tab">Awards</div>
        <div className="tab">Funding</div>
        <div className="tab">Team</div>
        <div className="tab">Intellectual Properties</div>
        <div className="tab">Updates</div>
        <div className="tab active">Fee</div>
      </div>

      <div className="fees-content">
        <div className="fees-header">
          <button className="add-fee-btn" onClick={() => setShowSchedulePopup(true)}>
            Add Fee
          </button>
        </div>

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
                      <button className="edit-btn" onClick={() => setEditCharge(charge)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-btn">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Fee Modal */}
        {showSchedulePopup && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Fee</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateSchedule(selectedStartup.startup_id, formData.amount, formData.frequency);
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
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setShowSchedulePopup(false)}>Cancel</button>
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
