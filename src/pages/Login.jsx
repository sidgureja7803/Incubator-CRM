import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import LoginImg from './Login.png';
import VLogo from './VLogo.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${config.api_base_url}${config.endpoints.login}`,
        formData
      );

      if (response.status === 200) {
        const { role, access_token, refresh_token, startup_id } = response.data;
        
        if (rememberMe) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('startup_id', startup_id);
        } else {
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);     
          sessionStorage.setItem('startup_id', startup_id);
        }

        // Navigate based on role
        if (role === 'startup') {
          navigate('/startup-landing');
        } else {
          navigate('/incubator-landing');
        }
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>

      <div className="login-container">
        <div className="left-section">
          <img src={LoginImg} alt="Login Illustration" className="login-illustration" />
        </div>

        <div className="right-section">
          <div className="form-container">
            <h1>Log In !!</h1>
            <p>Get Started with the Wonderful Journey !!</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}

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
