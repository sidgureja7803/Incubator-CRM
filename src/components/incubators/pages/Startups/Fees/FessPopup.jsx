


import React, { useState } from "react";
import "./FeesPopup.css";

const FeesPopup = ({ startup, onCreateSchedule, onClose }) => {
  const [totalAmount, setTotalAmount] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleCreateSchedule = async () => {
    if (!totalAmount || !frequency) {
      alert("Please enter total amount and select frequency.");
      return;
    }
    await onCreateSchedule(startup.startup_id, totalAmount, frequency);
  };

  return (
    <div className="fees-popup">
      <h3>Create Schedule</h3>
      <div>
        <label>Total Amount to be paid by startup:</label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        <label>Frequency:</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="">Select Frequency</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half yearly">Half Yearly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button onClick={handleCreateSchedule}>Create Schedule</button>
      </div>
      <div className="buttons">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FeesPopup;
