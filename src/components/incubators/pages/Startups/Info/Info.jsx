import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import ThaparInnovate from '../Incubated/TIETInnovate.png';
import './Info.css';

const Info = () => {
  const { startupId } = useParams();
  const { startup: contextStartup } = useOutletContext() || {};
  const { startups, isLoading } = useIncubatorContext();
  
  // Use the startup from outlet context or find it in the context
  const startup = contextStartup || startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId);

  if (isLoading?.startups && !contextStartup) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading startup information...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="error-container">
        <h3>Startup Not Found</h3>
        <p>The requested startup information could not be found.</p>
      </div>
    );
  }

  return (
    <div className="startup-info-container">
      <div className="startup-header">
        <img 
          src={startup.logo || ThaparInnovate} 
          alt={startup.startup_name || "ThinkWaveeee"} 
          className="startup-logo" 
        />
        <h2 className="startup-name">{startup.startup_name || "ThinkWaveeee"}</h2>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Company Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Sector:</span>
            <span className="info-value">{startup.sector || 'Professional Service'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Industry:</span>
            <span className="info-value">{startup.industry || 'Goods and Services'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Registration Address:</span>
            <span className="info-value">{startup.address || 'C/O POONAM PASWAN, SHAMAN VIHAAR APARTMENT, DWARKA, SECTOR-23 NA DELHI, South West, Delhi, DL, 110075, IN'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Business Transaction Type:</span>
            <span className="info-value">{startup.business_type || 'B2B2C'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Startup Registration Type:</span>
            <span className="info-value">{startup.registration_type || 'Sole Proprietorship'}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Registration & Certifications</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">CIN No.</span>
            <span className="info-value">{startup.cin_no || '12344453221'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">CIN Date</span>
            <span className="info-value">{startup.cin_date || '11-11-2023'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DPIIT No.</span>
            <span className="info-value">{startup.dpiit_no || '12435678431'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DPIIT Date</span>
            <span className="info-value">{startup.dpiit_date || '11-11-2023'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">TAN No.</span>
            <span className="info-value">{startup.tan_no || '12435678431'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">PAN No.</span>
            <span className="info-value">{startup.pan_no || '12435678431'}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Growth Statistics</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Stage</span>
            <span className="info-value">{startup.stage || 'sfsfdsfdgdfgfh'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Product Demo Url</span>
            <span className="info-value">
              {startup.demo_url || 'sfsfdsfdgdfgfh'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Current Annual Revenue</span>
            <span className="info-value">{startup.annual_revenue || '10,000'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Current Valuation</span>
            <span className="info-value">{startup.valuation || '12,000 Rs'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Number of Employees</span>
            <span className="info-value">{startup.employee_count || '4'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Number of Customers</span>
            <span className="info-value">{startup.customer_count || '100'}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="info-section-title">Communication</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email Address:</span>
            <span className="info-value">{startup.email || 'kanishkdadwal@gmail.com'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone Number:</span>
            <span className="info-value">{startup.phone || '+91 9690602545'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
