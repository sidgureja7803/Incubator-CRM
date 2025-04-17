import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../config';
import './LandingPage.css';
import VLogo from './VentureLab.png';

const IncubatorLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incubatorName: '',
    registrationAddress: '',
    websiteLink: '',
    linkedIn: ''
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
    
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.post(
        `${config.api_base_url}/incubator/info`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Set info filled flag
        localStorage.setItem('incubator_info_filled', 'true');
        // Navigate to dashboard
        navigate('/incubator/dashboard');
      }
    } catch (error) {
      setError('Failed to submit incubator information. Please try again.');
      console.error('Error submitting incubator info:', error);
    }
  };

  return (
    <div className="landing-page">
      {/* <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div> */}
      
      <div className="landing-content">
        <div className="left-content">
          <h1>Managing Startups</h1>
          <h2>Made Easy</h2>
          <p>We're really excited to know you more !!!</p>
        </div>
        
        <div className="right-content">
          <div className="form-container">
            <h2>Your Incubator Information!</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Incubator Name</label>
                <input
                  type="text"
                  name="incubatorName"
                  placeholder="Enter the Incubator name !"
                  value={formData.incubatorName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Registration address</label>
                <textarea
                  name="registrationAddress"
                  placeholder="Enter your address here !"
                  value={formData.registrationAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Website Link</label>
                <input
                  type="url"
                  name="websiteLink"
                  placeholder="Enter the Website link here !!"
                  value={formData.websiteLink}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Linked In</label>
                <input
                  type="url"
                  name="linkedIn"
                  placeholder="Enter your linkedin Profile"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="continue-button">Continue</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncubatorLanding; 