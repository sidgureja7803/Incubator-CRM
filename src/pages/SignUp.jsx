import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VLogo from '../assets/VLogo.png';
import StartupIcon from './Startup.png';
import IncubatorIcon from './Incubator.png';
import './SignUp.css';
import axios from 'utils/httpClient';
import config from '../config';

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(300);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      role: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError('Please select whether you are a Startup or Incubator');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.api_base_url}/v1/auth/register/`, formData);
      setLoading(false);
      
      if (response.status === 201) {
        setIsOtpSent(true);
        setTimer(300); // Reset timer to 5 minutes
        // Store user type for later use
        localStorage.setItem('userType', userType);
        localStorage.setItem('tempEmail', formData.email);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setLoading(false);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.api_base_url}/v1/auth/verify-email/`, {
        email: formData.email,
        otp_code: otpCode
      });
      
      if (response.status === 200) {
        // After OTP verification, redirect based on user type
        const userType = localStorage.getItem('userType');
        if (userType === 'startup') {
          navigate('/startup/startup-info');
        } else if (userType === 'incubator') {
          navigate('/incubator/incubator-info');
        }
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError(error.response?.data?.message || 'OTP verification failed');
    }
  };

  // Timer effect for OTP
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  if (isOtpSent) {
    return (
      <div className="signup-page">
        <div className="logo">
          <img src={VLogo} alt="Venture Lab" />
        </div>
        <div className="otp-container">
          <h2>Enter OTP</h2>
          <p>Please enter the OTP sent to your email</p>
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="timer">Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</div>
            <button type="submit" className="verify-button">Verify OTP</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>

      <div className="signup-container">
        <div className="left-section">
          <div className="left-content">
            <h1>Lets get,you started !</h1>
            <h2>Are you a Startup or Incubator!!!</h2>

            <div className="user-type-options">
              <button 
                className={`type-option ${userType === 'startup' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('startup')}
              >
                <div className="option-content">
                  <img src={StartupIcon} alt="Startup" />
                  <span>We're a Startup !!</span>
                </div>
              </button>

              <button 
                className={`type-option ${userType === 'incubator' ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect('incubator')}
              >
                <div className="option-content">
                  <img src={IncubatorIcon} alt="Incubator" />
                  <span>We Are an Incubator !</span>
                </div>
              </button>
            </div>

            <p className="login-link">
              Already Have an Account? <span onClick={() => navigate('/login')}>Log In !</span>
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="form-container">
            <h2>Sign Up !!</h2>
            <p>Get Started with the Wonderful Journey !!</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter the First Name !"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter the Last Name !"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="xyz@mail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter the Password !"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password !"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="signup-button">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;