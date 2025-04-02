import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../config';
import './OtpVerification.css';
import VLogo from '../assets/VLogo.png';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const email = location.state?.email || 'your email';
  const userType = location.state?.userType || localStorage.getItem('userType');

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.api_base_url}/auth/verify-otp`, {
        email,
        otp
      });

      if (response.status === 200) {
        // After successful OTP verification, decide which page to navigate to
        if (userType === 'startup') {
          navigate('/startup-landing');
        } else if (userType === 'incubator') {
          navigate('/incubator-landing');
        } else {
          // If can't determine user type, go to login
          navigate('/login');
        }
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${config.api_base_url}/auth/resend-otp`, {
        email
      });
      
      if (response.status === 200) {
        alert('OTP has been resent to your email');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-card">
        <div className="otp-verification-header">
          <img src={VLogo} alt="Venture Lab" className="otp-verification-logo" />
          <h1 className="otp-verification-title">Verify Your Email</h1>
          <p className="otp-verification-subtitle">We've sent a verification code to {email}</p>
        </div>
        
        <form onSubmit={handleVerifyOtp}>
          <div className="otp-input-container">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength="6"
              className="otp-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="verify-button">
            Verify OTP
          </button>
          
          <div className="resend-link">
            Didn't receive the code? <span onClick={handleResendOtp} style={{cursor: 'pointer', color: '#1e3a8a'}}>Resend OTP</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification; 