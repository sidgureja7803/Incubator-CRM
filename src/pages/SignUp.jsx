import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VLogo from './VLogo.png';
import StartupIcon from './Startup.png';
import IncubatorIcon from './Incubator.png';
import './SignUp.css';
import axios from 'axios';
import config from '../config';

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError('Please select whether you are a Startup or Incubator');
      return;
    }

    try {
      const response = await axios.post(`${config.api_base_url}${config.endpoints.signup}`, {
        ...formData,
        role: userType
      });

      if (response.status === 200) {
        navigate('/verify-otp', { state: { email: formData.email } });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>

      <div className="signup-container">
        <div className="left-section">
          <div className="left-content">
            <h1>Lets Get,you started !</h1>
            <h2>Are you a Startup or Incubator!!!</h2>

            <div className="user-type-options">
              <button 
                className={`type-option ${userType === 'startup' ? 'selected' : ''}`}
                onClick={() => setUserType('startup')}
              >
                <div className="option-content">
                  <img src={StartupIcon} alt="Startup" />
                  <span>We're a Startup !!</span>
                </div>
              </button>

              <button 
                className={`type-option ${userType === 'incubator' ? 'selected' : ''}`}
                onClick={() => setUserType('incubator')}
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
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter the First Name !"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter the Last Name !"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="xyz@mail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter the Password !"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password !"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="signup-button">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;