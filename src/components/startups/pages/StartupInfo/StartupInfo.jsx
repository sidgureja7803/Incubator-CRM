import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './StartupInfo.css';

const StartupInfo = () => {
  const [startupData, setStartupData] = useState({
    name: "ThinkWaveeee",
    logo: "https://via.placeholder.com/150",
    companyDetails: {
      sector: "Professional Service",
      industry: "Goods and Services",
      registrationAddress: "C/O POONAM PASWAN, SHAMAN VIHAAR APARTMENT, DWARKA, SECTOR-23 NA DELHI, South West, Delhi, DL, 110075, IN",
      businessTransactionType: "B2B2C",
      startupRegistrationType: "Sole Proprietorship"
    },
    registration: {
      cinNo: "12344453221",
      cinDate: "11-11-2023",
      dpiitNo: "12435678431",
      dpiitDate: "11-11-2023",
      tanNo: "12435678431",
      panNo: "12435678431"
    },
    growth: {
      stage: "sfsfstdgdfgfh",
      productDemoUrl: "sfsfstdgdfgfh",
      currentAnnualRevenue: "10,000",
      currentValuation: "12,000 Rs",
      numberOfEmployees: "4",
      numberOfCustomers: "100"
    },
    communication: {
      email: "kanishkdadwal@gmail.com",
      phone: "+91 9690602545"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add API call to save data
  };

  return (
    <div className="startup-info-container">
      <div className="startup-info-header">
        <div className="tabs">
          <NavLink to="/startup/profile/startup-info" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Startup Info
          </NavLink>
          <NavLink to="/startup/profile/awards" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Awards
          </NavLink>
          <NavLink to="/startup/profile/funding" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Funding
          </NavLink>
          <NavLink to="/startup/profile/team" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Team
          </NavLink>
          <NavLink to="/startup/profile/intellectual-properties" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Intellectual Properties
          </NavLink>
          <NavLink to="/startup/profile/updates" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Updates
          </NavLink>
        </div>
        <button className="edit-btn" onClick={handleEdit}>Edit Info</button>
      </div>

      <div className="startup-info-content">
        <div className="startup-header">
          <div className="startup-logo">
            <img src={startupData.logo} alt={startupData.name} />
          </div>
          <h2>{startupData.name}</h2>
        </div>

        <div className="startup-details">
          <div className="details-section">
            <h3>Company Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Sector:</p>
                <p className="value">{startupData.companyDetails.sector}</p>
              </div>
              <div className="detail-item">
                <p className="label">Industry:</p>
                <p className="value">{startupData.companyDetails.industry}</p>
              </div>
              <div className="detail-item full-width">
                <p className="label">Registration Address:</p>
                <p className="value">{startupData.companyDetails.registrationAddress}</p>
              </div>
              <div className="detail-item">
                <p className="label">Business Transaction Type:</p>
                <p className="value">{startupData.companyDetails.businessTransactionType}</p>
              </div>
              <div className="detail-item">
                <p className="label">Startup Registration Type:</p>
                <p className="value">{startupData.companyDetails.startupRegistrationType}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Registration & Certifications</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">CIN No.</p>
                <p className="value">{startupData.registration.cinNo}</p>
              </div>
              <div className="detail-item">
                <p className="label">CIN Date</p>
                <p className="value">{startupData.registration.cinDate}</p>
              </div>
              <div className="detail-item">
                <p className="label">DPIIT No.</p>
                <p className="value">{startupData.registration.dpiitNo}</p>
              </div>
              <div className="detail-item">
                <p className="label">DPIIT Date</p>
                <p className="value">{startupData.registration.dpiitDate}</p>
              </div>
              <div className="detail-item">
                <p className="label">TAN No.</p>
                <p className="value">{startupData.registration.tanNo}</p>
              </div>
              <div className="detail-item">
                <p className="label">PAN No.</p>
                <p className="value">{startupData.registration.panNo}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Growth Statistics</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Stage</p>
                <p className="value">{startupData.growth.stage}</p>
              </div>
              <div className="detail-item">
                <p className="label">Product Demo Url</p>
                <p className="value">{startupData.growth.productDemoUrl}</p>
              </div>
              <div className="detail-item">
                <p className="label">Current Annual Revenue</p>
                <p className="value">{startupData.growth.currentAnnualRevenue}</p>
              </div>
              <div className="detail-item">
                <p className="label">Current Valuation</p>
                <p className="value">{startupData.growth.currentValuation}</p>
              </div>
              <div className="detail-item">
                <p className="label">Number of Employees</p>
                <p className="value">{startupData.growth.numberOfEmployees}</p>
              </div>
              <div className="detail-item">
                <p className="label">Number of Customers</p>
                <p className="value">{startupData.growth.numberOfCustomers}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Communication</h3>
            <div className="details-grid">
              <div className="detail-item">
                <p className="label">Email Address:</p>
                <p className="value">{startupData.communication.email}</p>
              </div>
              <div className="detail-item">
                <p className="label">Phone Number:</p>
                <p className="value">{startupData.communication.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupInfo; 