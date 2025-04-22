import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../../../../../../config';
import './Fees.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';

const Fees = () => {
  const { startupId } = useParams();
  const [fees, setFees] = useState([]);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'Monthly',
    dueDate: '',
    feeType: '',
    status: 'Pending'
  });

  // Load real data from API
  useEffect(() => {
    if (!startupId) return;
    fetchFees();
  }, [startupId]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.get(
        `${config.api_base_url}/incubator/startup/${startupId}/fees/`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setFees(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching fees:", err);
      setError("Failed to load fee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const payload = {
        startup: startupId,
        amount: formData.amount,
        frequency: formData.frequency,
        due_date: formData.dueDate,
        type: formData.feeType,
        status: formData.status
      };
      
      await axios.post(
        `${config.api_base_url}/incubator/create-charges/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setShowAddFeeModal(false);
      await fetchFees();
      
      // Reset form
      setFormData({
        amount: '',
        frequency: 'Monthly',
        dueDate: '',
        feeType: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error("Error creating fee:", error.response ? error.response.data : error.message);
      setError("Failed to create fee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCharge = async (feeId) => {
    try {
      // Logic to get the current fee data and open edit modal
      const feeToEdit = fees.find(fee => fee.id === feeId);
      if (feeToEdit) {
        setFormData({
          amount: feeToEdit.amount,
          frequency: feeToEdit.frequency,
          dueDate: feeToEdit.due_date,
          feeType: feeToEdit.type,
          status: feeToEdit.status
        });
        setShowAddFeeModal(true);
      }
    } catch (error) {
      console.error("Error preparing edit:", error);
    }
  };

  const handleDeleteCharge = async (feeId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      
      await axios.delete(
        `${config.api_base_url}/incubator/deletecharge/${feeId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh fees after deletion
      await fetchFees();
    } catch (error) {
      console.error("Error deleting charge:", error.response ? error.response.data : error.message);
      setError("Failed to delete fee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(fees.length / rowsPerPage);
  const currentFees = fees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="fee-container">
      <div className="fee-header">
        <button className="add-fee-button" onClick={() => setShowAddFeeModal(true)}>
          Add Fee
        </button>
      </div>

      {loading && (
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
        <>
          {fees.length === 0 ? (
            <div className="no-fees">
              <p>No fee records have been added yet.</p>
            </div>
          ) : (
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
                  {currentFees.map((fee) => (
                    <tr key={fee.id}>
                      <td>{fee.amount} Rs</td>
                      <td>{fee.due_date}</td>
                      <td>{fee.frequency}</td>
                      <td>{fee.type}</td>
                      <td>
                        <span className={`status-badge ${fee.status.toLowerCase()}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="action-button edit"
                          onClick={() => handleEditCharge(fee.id)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDeleteCharge(fee.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination">
            <div className="page-info">
              {fees.length > 0 ? `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, fees.length)} of ${fees.length}` : '0 - 0 of 0'}
            </div>
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
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
        </>
      )}

      {/* Add Fee Modal */}
      {showAddFeeModal && (
        <div className="fee-modal-overlay">
          <div className="fee-modal">
            <div className="fee-modal-header">
              <h2>Add Fee</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddFeeModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSchedule}>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="text"
                  id="amount"
                  placeholder="Enter amount here"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    id="dueDate"
                    placeholder="Select the Due date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                  <span className="date-icon">
                    <IoCalendarOutline />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="frequency">Frequency</label>
                <div className="select-container">
                  <select
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="feeType">Fee Type</label>
                <input
                  type="text"
                  id="feeType"
                  placeholder="Enter fee type"
                  value={formData.feeType}
                  onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <div className="select-container">
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
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