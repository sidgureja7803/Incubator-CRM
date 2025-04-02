import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from '../../../../../config';
import './StartupInfo.css';

const StartupInfo = () => {
  const [startupDetails, setStartupDetails] = useState({
    company_details: {
      sector: '',
      industry: '',
      registration_address: '',
      business_type: '',
      registration_type: ''
    },
    registration_certifications: {
      cin_no: '',
      cin_date: '',
      dpiit_no: '',
      dpiit_date: '',
      tan_no: '',
      pan_no: ''
    },
    growth_statistics: {
      stage: '',
      product_demo_url: '',
      current_revenue: '',
      current_valuation: '',
      employee_count: '',
      customer_count: ''
    },
    communication: {
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchStartupDetails();
  }, []);

  const fetchStartupDetails = async () => {
    try {
      const response = await authAxios.get(
        `${config.api_base_url}/incubator/startupincubator/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setStartupDetails(response.data);
    } catch (error) {
      console.error('Error fetching startup details:', error);
    }
  };

  return (
    <div className="startup-info-container">
      <div className="navigation-tabs">
        <div className="tab active">Startup Info</div>
        <div className="tab">Awards</div>
        <div className="tab">Funding</div>
        <div className="tab">Team</div>
        <div className="tab">Intellectual Properties</div>
        <div className="tab">Updates</div>
        <div className="tab">Fee</div>
      </div>

      <div className="startup-details-card">
        <div className="startup-header">
          <div className="startup-logo">
            <img src="/path/to/logo" alt="ThinkWaveee" />
          </div>
          <h2>ThinkWaveee</h2>
        </div>

        <div className="details-section">
          <div className="section-left">
            <h3>Company Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Sector:</label>
                <span>{startupDetails.company_details.sector}</span>
              </div>
              <div className="info-item">
                <label>Industry:</label>
                <span>{startupDetails.company_details.industry}</span>
              </div>
              <div className="info-item full-width">
                <label>Registration Address:</label>
                <span>{startupDetails.company_details.registration_address}</span>
              </div>
              <div className="info-item">
                <label>Business Transaction Type:</label>
                <span>{startupDetails.company_details.business_type}</span>
              </div>
              <div className="info-item">
                <label>Startup Registration Type:</label>
                <span>{startupDetails.company_details.registration_type}</span>
              </div>
            </div>

            <h3>Communication</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email Address:</label>
                <span>{startupDetails.communication.email}</span>
              </div>
              <div className="info-item">
                <label>Phone Number:</label>
                <span>{startupDetails.communication.phone}</span>
              </div>
            </div>
          </div>

          <div className="section-right">
            <h3>Registration & Certifications</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>CIN No.</label>
                <span>{startupDetails.registration_certifications.cin_no}</span>
              </div>
              <div className="info-item">
                <label>CIN Date</label>
                <span>{startupDetails.registration_certifications.cin_date}</span>
              </div>
              <div className="info-item">
                <label>DPIIT No.</label>
                <span>{startupDetails.registration_certifications.dpiit_no}</span>
              </div>
              <div className="info-item">
                <label>DPIIT Date</label>
                <span>{startupDetails.registration_certifications.dpiit_date}</span>
              </div>
              <div className="info-item">
                <label>TAN No.</label>
                <span>{startupDetails.registration_certifications.tan_no}</span>
              </div>
              <div className="info-item">
                <label>PAN No.</label>
                <span>{startupDetails.registration_certifications.pan_no}</span>
              </div>
            </div>

            <h3>Growth Statistics</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Stage</label>
                <span>{startupDetails.growth_statistics.stage}</span>
              </div>
              <div className="info-item">
                <label>Product Demo Url</label>
                <span>{startupDetails.growth_statistics.product_demo_url}</span>
              </div>
              <div className="info-item">
                <label>Current Annual Revenue</label>
                <span>{startupDetails.growth_statistics.current_revenue}</span>
              </div>
              <div className="info-item">
                <label>Current Valuation</label>
                <span>{startupDetails.growth_statistics.current_valuation}</span>
              </div>
              <div className="info-item">
                <label>Number of Employees</label>
                <span>{startupDetails.growth_statistics.employee_count}</span>
              </div>
              <div className="info-item">
                <label>Number of Customers</label>
                <span>{startupDetails.growth_statistics.customer_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupInfo;
