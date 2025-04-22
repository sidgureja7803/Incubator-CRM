import React, { useEffect } from 'react';
import './SuccessMessage.css';

const SuccessMessage = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="success-message">
      <div className="success-content">
        <span className="success-icon">✓</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage; 