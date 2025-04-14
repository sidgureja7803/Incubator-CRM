import React, { useState } from "react";
import { FiEdit2 } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import ReactDOM from 'react-dom';
import "./Infrastructure.css";

const Button = ({ onClick, children, className, variant }) => {
  const baseClass = variant === 'contained' ? 'button-contained' : 'button-outlined';
  return (
    <button 
      onClick={onClick} 
      className={`custom-button ${baseClass} ${className || ''}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('root')
  );
};

const Infrastructure = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    incubatorName: "",
    infraId: "",
    infraType: "",
    infraCapacity: "",
    incubatorId: ""
  });
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [selectedInfraId, setSelectedInfraId] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
    setFormData({
      incubatorName: "",
      infraId: "",
      infraType: "",
      infraCapacity: "",
      incubatorId: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedData = data.map((item, index) =>
        index === editIndex ? formData : item
      );
      setData(updatedData);
    } else {
      setData([...data, formData]);
    }
    handleClose();
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditIndex(index);
    handleOpen();
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Do you really want to delete that entry?");
    if (confirmDelete) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const handleEditInfoOpen = () => {
    setEditInfoOpen(!editInfoOpen);
  };

  const handleEditInfoChange = (e) => {
    const infraId = e.target.value;
    setSelectedInfraId(infraId);
    const index = data.findIndex(item => item.infraId === infraId);
    if (index !== -1) {
      handleEdit(index);
    }
    setEditInfoOpen(false);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="title-container">
          <h2>Infrastructure Management</h2>
          <button 
            className="add-info-button"
            onClick={handleOpen}
          >
            + Add Infrastructure
          </button>
        </div>

        <div className="table-container">
          {data.length === 0 ? (
            <div className="empty-state">
              <p>No infrastructure data available. Click "Add Infrastructure" to get started.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Incubator Name</th>
                  <th>Infrastructure ID</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.incubatorName}</td>
                    <td>{row.infraId}</td>
                    <td>{row.infraType}</td>
                    <td>{row.infraCapacity}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="icon-button edit"
                          onClick={() => handleEdit(index)}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDelete(index)}
                          title="Delete"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal 
        open={open} 
        onClose={handleClose}
      >
        <div className="modalContainer">
          <div className="modalContent">
            <h3>{editIndex !== null ? 'Edit Infrastructure' : 'Add New Infrastructure'}</h3>
            
            <div className="form-group">
              <input
                type="text"
                name="incubatorName"
                value={formData.incubatorName}
                onChange={handleChange}
                placeholder="Incubator Name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="infraId"
                value={formData.infraId}
                onChange={handleChange}
                placeholder="Infrastructure ID"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="infraType"
                value={formData.infraType}
                onChange={handleChange}
                placeholder="Infrastructure Type"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="infraCapacity"
                value={formData.infraCapacity}
                onChange={handleChange}
                placeholder="Infrastructure Capacity"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="incubatorId"
                value={formData.incubatorId}
                onChange={handleChange}
                placeholder="Incubator ID"
                className="form-input"
              />
            </div>

            <div className="modalButtons">
              <Button 
                onClick={handleSave} 
                className="saveButton"
                variant="contained"
              >
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
              <Button 
                onClick={handleClose} 
                className="cancelButton"
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Infrastructure;
