import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './OtpVerification.css';
import VLogo from '../assets/VLogo.png';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const email = location.state?.email;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.api_base_url}${config.endpoints.verifyOtp}`, {
        email,
        otp
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="otp-page">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>
      
      <div className="otp-container">
        <h1>Verify Your Email</h1>
        <p>We've sent a verification code to {email}</p>
        
        <form onSubmit={handleVerifyOtp}>
          <div className="otp-input">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength="6"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="verify-button">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification; 