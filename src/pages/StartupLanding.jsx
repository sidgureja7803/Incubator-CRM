import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VLogo from '../assets/VLogo.png';
import './StartupLanding.css';

const StartupLanding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    phoneNumber: '',
    linkedinProfile: '',
    currentRole: ''
  });
  const [companyInfo, setCompanyInfo] = useState({
    industry: '',
    registrationAddress: '',
    sector: '',
    cinNo: '',
    cinDate: '',
    diitNo: ''
  });

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCompanyInfoChange = (e) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.post(
        `${config.api_base_url}/startup/info`,
        {
          ...personalInfo,
          ...companyInfo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Navigate to dashboard or show success message
    } catch (error) {
      console.error('Error submitting startup info:', error);
    }
  };

  return (
    <div className="startup-landing">
      <div className="logo">
        <img src={VLogo} alt="Venture Lab" />
      </div>

      <div className="landing-content">
        <div className="text-section">
          <h1>Managing Startups</h1>
          <h2>Made Easy</h2>
          <p>We're really excited to know you more !!!</p>
        </div>

        <div className="form-section">
          {step === 1 ? (
            <div className="personal-info">
              <h2>Your Personal Information!</h2>
              <p>Step 1/2</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '50%' }}></div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 9990500XXX"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="url"
                    name="linkedinProfile"
                    placeholder="www.linkedin.com/in/kash/stateofai"
                    value={personalInfo.linkedinProfile}
                    onChange={handlePersonalInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="currentRole"
                    placeholder="Enter your Current role in the start up!"
                    value={personalInfo.currentRole}
                    onChange={handlePersonalInfoChange}
                  />
                </div>

                <button type="submit" className="next-button">Next</button>
              </form>
            </div>
          ) : (
            <div className="company-info">
              <h2>Your Company Information!</h2>
              <p>Step 2/2</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '100%' }}></div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="industry"
                    placeholder="Industry"
                    value={companyInfo.industry}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="registrationAddress"
                    placeholder="Enter your address here !"
                    value={companyInfo.registrationAddress}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="sector"
                    placeholder="Enter the Sector here !!"
                    value={companyInfo.sector}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="cinNo"
                    placeholder="1242333456"
                    value={companyInfo.cinNo}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="date"
                    name="cinDate"
                    value={companyInfo.cinDate}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="diitNo"
                    placeholder="124233"
                    value={companyInfo.diitNo}
                    onChange={handleCompanyInfoChange}
                  />
                </div>

                <button type="submit" className="continue-button">Continue</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupLanding; 