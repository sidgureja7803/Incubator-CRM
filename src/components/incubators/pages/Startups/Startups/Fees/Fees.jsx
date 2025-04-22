import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from 'config';
import './Fees.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';

const Fees = () => {
  const { startupId } = useParams();
  const [charges, setCharges] = useState([]);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editCharge, setEditCharge] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    due_date: '',
    frequency: 'Monthly',
    fee_type: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (!startupId) return;
    fetchSchedule();
  }, [startupId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.api_base_url}/incubator/charges/${startupId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      // Ensure each charge has a status field
      const processedCharges = response.data.map(charge => ({
        ...charge,
        status: charge.status || 'Pending' // Default to 'Pending' if status is missing
      }));
      setCharges(processedCharges);
      setError(null);
    } catch (error) {
      console.error("Error fetching charges:", error);
      setError("Failed to load fee schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${config.api_base_url}/incubator/create-charges/`,
        {
          startup: startupId,
          amount: formData.amount,
          due_date: formData.due_date,
          frequency: formData.frequency,
          fee_type: formData.fee_type,
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setShowAddFeeModal(false);
      fetchSchedule();
      setFormData({
        amount: '',
        due_date: '',
        frequency: 'Monthly',
        fee_type: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      setError("Failed to create fee schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCharge = async (chargeId) => {
    const charge = charges.find(c => c.id === chargeId);
    if (charge) {
      setEditCharge(charge);
      setFormData({
        amount: charge.amount || '',
        due_date: charge.due_date || '',
        frequency: charge.frequency || 'Monthly',
        fee_type: charge.fee_type || '',
        status: charge.status || 'Pending'
      });
      setShowAddFeeModal(true);
    }
  };

  const handleUpdateCharge = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch(
        `${config.api_base_url}/incubator/updatecharge/${editCharge.id}/`,
        {
          amount: formData.amount,
          due_date: formData.due_date,
          frequency: formData.frequency,
          fee_type: formData.fee_type,
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
          }
        }
      );
      setShowAddFeeModal(false);
      setEditCharge(null);
      fetchSchedule();
    } catch (error) {
      console.error("Error updating charge:", error);
      setError("Failed to update fee schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharge = async (chargeId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        await axios.delete(
          `${config.api_base_url}/incubator/updatecharge/${chargeId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`
            }
          }
        );
        fetchSchedule();
      } catch (error) {
        console.error("Error deleting charge:", error);
        setError("Failed to delete fee. Please try again.");
      }
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(charges.length / rowsPerPage);
  const currentCharges = charges.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const statusLower = status.toLowerCase();
    return ['paid', 'pending', 'unpaid'].includes(statusLower) ? statusLower : 'pending';
  };

  return (
    <div className="fee-container">
      <div className="fee-header">
        <button className="add-fee-button" onClick={() => {
          setEditCharge(null);
          setFormData({
            amount: '',
            due_date: '',
            frequency: 'Monthly',
            fee_type: '',
            status: 'Pending'
          });
          setShowAddFeeModal(true);
        }}>
          Add Fee
        </button>
      </div>

      {loading && !showAddFeeModal && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading fees...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="fee-table-container">
          <table className="fee-table">
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
              {currentCharges.map((charge) => (
                <tr key={charge.id}>
                  <td>{charge.amount} Rs</td>
                  <td>{charge.due_date ? new Date(charge.due_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{charge.frequency || 'N/A'}</td>
                  <td>{charge.fee_type || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(charge.status)}`}>
                      {charge.status || 'Pending'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEditCharge(charge.id)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteCharge(charge.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <div className="page-info">
              {charges.length > 0 ? 
                `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, charges.length)} of ${charges.length}` 
                : '0 - 0 of 0'}
            </div>
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="page-controls">
              <button 
                className="page-button prev" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &lt;
              </button>
              <button 
                className="page-button next" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editCharge ? 'Edit Fee' : 'Add Fee'}</h2>
              <button 
                className="close-button" 
                onClick={() => {
                  setShowAddFeeModal(false);
                  setEditCharge(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={editCharge ? handleUpdateCharge : handleCreateSchedule}>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter Name here!!"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    placeholder="Select the Due date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    required
                  />
                  <IoCalendarOutline className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  required
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fee Type</label>
                <input
                  type="text"
                  placeholder="Enter the fee type here"
                  value={formData.fee_type}
                  onChange={(e) => setFormData({...formData, fee_type: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div className="modal-actions">
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

export default Fees;