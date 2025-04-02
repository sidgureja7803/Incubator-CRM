import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../config';
import VLogo from '../assets/VLogo.png';
import './StartupLanding.css';

const StartupLanding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [companyDetails, setCompanyDetails] = useState({
    startupName: '',
    industry: '',
    registrationAddress: '',
    businessTransactionType: '',
    startupRegistrationType: ''
  });

  const [brandingInfo, setBrandingInfo] = useState({
    logo: null,
    emailAddress: '',
    phoneNo: ''
  });

  const [registrationInfo, setRegistrationInfo] = useState({
    dpiitNo: '',
    dpiitDate: '',
    cinNo: '',
    cinDate: '',
    tanNo: '',
    panNo: ''
  });

  const [growthStats, setGrowthStats] = useState({
    stage: '',
    productDemoUrl: ''
  });

  const handleCompanyDetailsChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleBrandingInfoChange = (e) => {
    if (e.target.name === 'logo' && e.target.files) {
      setBrandingInfo({
        ...brandingInfo,
        logo: e.target.files[0]
      });
    } else {
      setBrandingInfo({
        ...brandingInfo,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleRegistrationInfoChange = (e) => {
    setRegistrationInfo({
      ...registrationInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleGrowthStatsChange = (e) => {
    setGrowthStats({
      ...growthStats,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Add all form data to FormData
      Object.entries(companyDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      Object.entries(brandingInfo).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          formData.append(key, value);
        } else if (key !== 'logo') {
          formData.append(key, value);
        }
      });
      
      Object.entries(registrationInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      Object.entries(growthStats).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      await axios.post(
        `${config.api_base_url}/startup/info`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // After successfully submitting startup info, navigate to dashboard
      navigate('/dashboard');
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
          {step === 1 && (
            <div className="company-details">
              <h2>Company Details !</h2>
              <p>Step 1/4</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '25%' }}></div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-group">
                  <input
                    type="text"
                    name="startupName"
                    placeholder="Enter the Startup Name"
                    value={companyDetails.startupName}
                    onChange={handleCompanyDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="industry"
                    placeholder="Enter the name of Industry!"
                    value={companyDetails.industry}
                    onChange={handleCompanyDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="registrationAddress"
                    placeholder="Enter Your Address Here!"
                    value={companyDetails.registrationAddress}
                    onChange={handleCompanyDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    name="businessTransactionType"
                    value={companyDetails.businessTransactionType}
                    onChange={handleCompanyDetailsChange}
                    required
                  >
                    <option value="">Select the transaction type!</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="B2B2C">B2B2C</option>
                  </select>
                </div>

                <div className="form-group">
                  <select
                    name="startupRegistrationType"
                    value={companyDetails.startupRegistrationType}
                    onChange={handleCompanyDetailsChange}
                    required
                  >
                    <option value="">Select the Registration type!</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </select>
                </div>

                <button type="submit" className="next-button">Next</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="branding-communication">
              <h2>Branding & Communication !</h2>
              <p>Step 2/4</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '50%' }}></div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-group">
                  <label>Add Start Uplogo</label>
                  <div className="upload-container">
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleBrandingInfoChange}
                      className="file-input"
                    />
                    <div className="upload-label">
                      <span>Upload your Image Here</span>
                      <button type="button" className="upload-button">Upload</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder="Enter the Email here"
                    value={brandingInfo.emailAddress}
                    onChange={handleBrandingInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phoneNo"
                    placeholder="+91 9690XXXXXX"
                    value={brandingInfo.phoneNo}
                    onChange={handleBrandingInfoChange}
                    required
                  />
                </div>

                <div className="button-group">
                  <button type="button" className="back-button" onClick={handlePrevStep}>Back</button>
                  <button type="submit" className="next-button">Next</button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="registration-certifications">
              <h2>Registration & Certifications !</h2>
              <p>Step 3/4</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '75%' }}></div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-group">
                  <input
                    type="text"
                    name="dpiitNo"
                    placeholder="Enter DPIIT!"
                    value={registrationInfo.dpiitNo}
                    onChange={handleRegistrationInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="date"
                    name="dpiitDate"
                    value={registrationInfo.dpiitDate}
                    onChange={handleRegistrationInfoChange}
                    required
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group-half">
                    <input
                      type="text"
                      name="cinNo"
                      placeholder="Enter CIN No."
                      value={registrationInfo.cinNo}
                      onChange={handleRegistrationInfoChange}
                    />
                  </div>

                  <div className="form-group-half">
                    <input
                      type="date"
                      name="cinDate"
                      value={registrationInfo.cinDate}
                      onChange={handleRegistrationInfoChange}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group-half">
                    <input
                      type="text"
                      name="tanNo"
                      placeholder="Enter Tan No.!"
                      value={registrationInfo.tanNo}
                      onChange={handleRegistrationInfoChange}
                    />
                  </div>

                  <div className="form-group-half">
                    <input
                      type="text"
                      name="panNo"
                      placeholder="Enter PAN No.!"
                      value={registrationInfo.panNo}
                      onChange={handleRegistrationInfoChange}
                    />
                  </div>
                </div>

                <div className="button-group">
                  <button type="button" className="back-button" onClick={handlePrevStep}>Back</button>
                  <button type="submit" className="next-button">Next</button>
                </div>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="growth-statistics">
              <h2>Growth Statistics !</h2>
              <p>Step 4/4</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '100%' }}></div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="stage"
                    placeholder="Enter Stage !"
                    value={growthStats.stage}
                    onChange={handleGrowthStatsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="url"
                    name="productDemoUrl"
                    placeholder="Enter The Product Url !"
                    value={growthStats.productDemoUrl}
                    onChange={handleGrowthStatsChange}
                    required
                  />
                </div>

                <div className="button-group">
                  <button type="button" className="back-button" onClick={handlePrevStep}>Back</button>
                  <button type="submit" className="save-button">Save</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupLanding; 