import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../../../config';
import LoginImg from './Login.png';
import VLogo from '../../../assets/VLogo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('remembered_email');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowErrorPopup(false);
    setShowSuccessPopup(false);
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password');
      setShowErrorPopup(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.api_base_url}/v1/auth/login/`,
        { email, password }
      );

      if (response.data) {
        const { role, access_token, refresh_token } = response.data;
        
        // Store tokens based on remember me
        if (rememberMe) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('remembered_email', email);
          localStorage.setItem('user_type', role);
        } else {
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);     
          sessionStorage.setItem('user_type', role);
          localStorage.removeItem('remembered_email');
        }
        
        // Show success message
        setShowSuccessPopup(true);

        // Navigate based on role
        if (role === 'startup') {
          setTimeout(() => {
            navigate('/startup/dashboard');
          }, 1000);
        } else if (role === 'incubator') {
          setTimeout(() => {
            navigate('/incubator/dashboard');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Invalid credentials. Please try again.'
      );
      setShowErrorPopup(true);
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="signup-link">
              Don't have an Account? <span onClick={() => navigate('/signup')}>Sign Up!</span>
            </p>
          </div>
        </div>
      </div>

      {showErrorPopup && (
        <div className="popup error-popup">
          <div className="popup-content">
            <h3>Error</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup success-popup">
          <div className="popup-content">
            <h3>Success</h3>
            <p>Login successful! Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 

