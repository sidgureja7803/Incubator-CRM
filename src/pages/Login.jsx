import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../config';
import LoginImg from './Login.png';
import VLogo from '../assets/VLogo.png';
import './Login.css';

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState('email@example.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoPopupMessage, setInfoPopupMessage] = useState('');
  const [infoFilled, setInfoFilled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: '' });
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
        const { role, access_token, refresh_token, startup_id } = response.data;
        
        // Store tokens based on remember me
        if (rememberMe) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('startup_id', startup_id);
          localStorage.setItem('remembered_email', email);
          localStorage.setItem('user_role', role);
        } else {
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);     
          sessionStorage.setItem('startup_id', startup_id);
          sessionStorage.setItem('user_role', role);
          localStorage.removeItem('remembered_email');
        }

        // Set user role in parent component
        setUserRole(role);
        
        // Show success message
        setShowSuccessPopup(true);

        // Navigate based on role
        if (role === 'startup') {
          console.log('Navigating to startup dashboard...');
          // Force a small delay to ensure tokens are set
          setTimeout(() => {
            navigate('/startup/dashboard', { replace: true });
          }, 100);
        } else if (role === 'incubator') {
          navigate('/incubator/dashboard', { replace: true });
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

  const showToastMessage = (message, type) => {
    setToastMessage({ text: message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleForgotPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setShowErrorPopup(true);
      return;
    }
    try {
      const response = await axios.post(
        `${config.api_base_url}/v1/auth/reset-password/`,
        { email, newPassword }
      );
      if (response.status === 200) {
        setShowForgotPasswordPopup(false);
        setShowSuccessPopup(true);
        setErrorMessage('Password reset successfully!');
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setShowErrorPopup(true);
      setErrorMessage('Password reset failed. Please try again later.');
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

            <div className="forgot-password">
              <span onClick={handleForgotPassword}>Forgot Password?</span>
            </div>

            <p className="signup-link">
              Don't have an Account? <span onClick={() => navigate('/signup')}>Sign Up!</span>
            </p>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={`toast ${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

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

      {showForgotPasswordPopup && (
        <div className="popup forgot-password-popup">
          <div className="popup-content">
            <h3>Reset Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleForgotPasswordSubmit}>Reset</button>
              <button onClick={() => setShowForgotPasswordPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
