import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from '../../../../../config';
import './Funding.css';

const Funding = () => {
  const [incubatorData, setIncubatorData] = useState([]);
  const [externalData, setExternalData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingTable, setEditingTable] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [editedRow, setEditedRow] = useState({
    date: '',
    amount: '',
    funding_program: '',
    funding_agency: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incubatorResponse, externalResponse] = await Promise.all([
        authAxios.get(`${config.api_base_url}/startup/incubatorfunding/`),
        authAxios.get(`${config.api_base_url}/startup/externalfunding/`)
      ]);

      setIncubatorData(incubatorResponse.data);
      setExternalData(externalResponse.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleEdit = (row, type) => {
    setEditingTable(type);
    setEditedRow(row);
    setShowEditModal(true);
  };

  const handleDelete = (id, type) => {
    setDeleteId(id);
    setEditingTable(type);
    setShowDeleteConfirmation(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRow(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editedRow.date) newErrors.date = 'Date is required';
    if (!editedRow.amount) newErrors.amount = 'Amount is required';
    if (!editedRow.funding_program) newErrors.funding_program = 'Funding Program is required';
    if (!editedRow.funding_agency) newErrors.funding_agency = 'Funding Agency is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const url = editingTable === "Incubator Funding"
        ? `${config.api_base_url}/startup/incubatorfunding/${editedRow.id || ""}`
        : `${config.api_base_url}/startup/externalfunding/${editedRow.id || ""}`;

      await authAxios({
        url,
        method: editedRow.id ? "PATCH" : "POST",
        data: editedRow
      });
      
      fetchData();
      setShowEditModal(false);
      setErrors({});
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const url = editingTable === "Incubator Funding"
        ? `${config.api_base_url}/startup/incubatorfunding/${deleteId}`
        : `${config.api_base_url}/startup/externalfunding/${deleteId}`;

      await authAxios.delete(url);

      if (editingTable === "Incubator Funding") {
        setIncubatorData(incubatorData.filter((item) => item.id !== deleteId));
      } else {
        setExternalData(externalData.filter((item) => item.id !== deleteId));
      }

      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const renderTable = (data, type) => (
    <div className="funding-section">
      <div className="section-header">
        <h2>{type}</h2>
        <button 
          className="add-funding-button"
          onClick={() => {
            setEditingTable(type);
            setEditedRow({
              date: '',
              amount: '',
              funding_program: '',
              funding_agency: ''
            });
            setShowEditModal(true);
          }}
        >
          Add Fundings
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Funding Program</th>
              <th>Funding Agency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{row.amount}</td>
                <td>{row.funding_program}</td>
                <td>{row.funding_agency}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(row, type)}>✏️</button>
                  <button onClick={() => handleDelete(row.id, type)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="funding-container">
      {renderTable(incubatorData, "Incubator Funding")}
      {renderTable(externalData, "External Funding")}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Fundings!</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="funding-type-selector">
                <label>
                  <input
                    type="radio"
                    checked={editingTable === "Incubator Funding"}
                    onChange={() => setEditingTable("Incubator Funding")}
                  />
                  Incubator Funding
                </label>
                <label>
                  <input
                    type="radio"
                    checked={editingTable === "External Funding"}
                    onChange={() => setEditingTable("External Funding")}
                  />
                  External Funding
                </label>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editedRow.date}
                  onChange={handleInputChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editedRow.amount}
                  onChange={handleInputChange}
                  placeholder="10000"
                />
                {errors.amount && <span className="error">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label>Funding Program</label>
                <input
                  type="text"
                  name="funding_program"
                  value={editedRow.funding_program}
                  onChange={handleInputChange}
                  placeholder="Enter th Program here !!"
                />
                {errors.funding_program && <span className="error">{errors.funding_program}</span>}
              </div>

              <div className="form-group">
                <label>Funding Agency</label>
                <input
                  type="text"
                  name="funding_agency"
                  value={editedRow.funding_agency}
                  onChange={handleInputChange}
                  placeholder="Enter Funding Agency name here !!"
                />
                {errors.funding_agency && <span className="error">{errors.funding_agency}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this funding record?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
              <button className="delete-button" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
