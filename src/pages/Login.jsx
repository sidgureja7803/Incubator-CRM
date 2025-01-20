import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImg from './Login.png';
import './Login.css';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted:', formData);
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src="/venture-lab-logo.png" alt="Venture Lab" />
      </div>

      <div className="login-container">
        <div className="left-section">
          <img src={LoginImg} alt="Login Illustration" className="login-illustration" />
        </div>

        <div className="right-section">
          <div className="form-container">
            <h1>Log In !!</h1>
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

              <button type="submit" className="login-button">Log In</button>
            </form>

            <p className="signup-link">
              Don't have an Account? <span onClick={() => navigate('/signup')}>Sign Up!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
