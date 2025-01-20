import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpImg from './SignUp.jpg';

import './SignUp.css';

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log('Form submitted:', { userType, ...formData });
  };

  return (
    <div className="signup-page">
      <div className="logo">
        <img src="/venture-lab-logo.png" alt="Venture Lab" />
      </div>

      <div className="signup-container">
        <div className="left-section">
          <h1>Lets Get,you started !</h1>
          <h2>Are you a Startup or Incubator!!!</h2>

          <div className="user-type-options">
            <div 
              className={`type-card ${userType === 'startup' ? 'selected' : ''}`}
              onClick={() => setUserType('startup')}
            >
              <div className="icon-wrapper">
                <img src="/startup-icon.png" alt="Startup" />
              </div>
              <span>We're a Startup !!</span>
            </div>

            <div 
              className={`type-card ${userType === 'incubator' ? 'selected' : ''}`}
              onClick={() => setUserType('incubator')}
            >
              <div className="icon-wrapper">
                <img src="/incubator-icon.png" alt="Incubator" />
              </div>
              <span>We Are an Incubator !</span>
            </div>
          </div>

          <p className="login-link">
            Already Have an Account? <span onClick={() => navigate('/login')}>Log In !</span>
          </p>
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
