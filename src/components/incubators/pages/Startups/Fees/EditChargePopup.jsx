

import React, { useState } from "react";
import "./EditChargePopup.css";

const EditChargePopup = ({ charge, onUpdateCharge, onClose }) => {
  const [updatedCharge, setUpdatedCharge] = useState(charge);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCharge({
      ...updatedCharge,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateCharge(updatedCharge);
    onClose();
  };

  return (
    <div className="edit-charge-popup">
      <h3>Edit Charge</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={updatedCharge.amount}
            onChange={handleChange}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="duedate"
            value={updatedCharge.duedate}
            onChange={handleChange}
          />
        </label>
        <label>
          Status:
          <input
            type="text"
            name="paymentstatus"
            value={updatedCharge.paymentstatus || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Frequency:
          <input
            type="text"
            name="frequency"
            value={updatedCharge.frequency}
            onChange={handleChange}
          />
        </label>
        <label>
          Fee Type:
          <input
            type="text"
            name="feetype"
            value={updatedCharge.feetype || ''}
            onChange={handleChange}
          />
        </label>
        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditChargePopup;
