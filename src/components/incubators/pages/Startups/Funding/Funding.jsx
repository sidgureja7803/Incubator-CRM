import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import './Funding.css';

const Funding = () => {
  const { startupId } = useParams();
  const { startups, isLoading } = useIncubatorContext();
  const [activeTab, setActiveTab] = useState('incubator'); // 'incubator' or 'external'
  
  // Find the current startup from the context
  const startup = startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId);
  
  // Get funding data from the startup
  const incubatorFunding = startup?.incubator_funding || [];
  const externalFunding = startup?.external_funding || [];

  // Mocked funding data for display purposes
  const mockIncubatorFunding = [
    {
      id: 1,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    },
    {
      id: 2,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    },
    {
      id: 3,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    },
    {
      id: 4,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    }
  ];
  
  const mockExternalFunding = [
    {
      id: 1,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    },
    {
      id: 2,
      date: '11 Jan 2024',
      amount: 'TIET',
      funding_program: 'Student Growth Plan',
      funding_agency: 'Venture Lab'
    }
  ];

  const displayIncubatorFunding = incubatorFunding.length > 0 ? incubatorFunding : mockIncubatorFunding;
  const displayExternalFunding = externalFunding.length > 0 ? externalFunding : mockExternalFunding;

  if (isLoading.startups) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading funding information...</p>
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
    <div className="funding-container">
      {activeTab === 'incubator' && (
        <>
          <h2 className="funding-section-title">Incubator Funding</h2>
          <div className="funding-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Funding Program</th>
                  <th>Funding Agency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayIncubatorFunding.map((funding) => (
                  <tr key={funding.id}>
                    <td>{funding.date}</td>
                    <td>{funding.amount}</td>
                    <td>{funding.funding_program}</td>
                    <td>{funding.funding_agency}</td>
                    <td>
                      <div className="funding-actions">
                        <button className="edit-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button className="delete-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <div className="pagination-info">
                <span>1 - 10 of 460</span>
              </div>
              <div className="rows-per-page">
                <span>Rows per page:</span>
                <select>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="pagination-controls">
                <button className="prev-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="next-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'external' && (
        <>
          <h2 className="funding-section-title">External Funding</h2>
          <div className="funding-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Funding Program</th>
                  <th>Funding Agency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayExternalFunding.map((funding) => (
                  <tr key={funding.id}>
                    <td>{funding.date}</td>
                    <td>{funding.amount}</td>
                    <td>{funding.funding_program}</td>
                    <td>{funding.funding_agency}</td>
                    <td>
                      <div className="funding-actions">
                        <button className="edit-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button className="delete-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <div className="pagination-info">
                <span>1 - 10 of 460</span>
              </div>
              <div className="rows-per-page">
                <span>Rows per page:</span>
                <select>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="pagination-controls">
                <button className="prev-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="next-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'incubator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('incubator')}
        >
          Incubator Funding
        </button>
        <button 
          className={`tab-button ${activeTab === 'external' ? 'active' : ''}`} 
          onClick={() => setActiveTab('external')}
        >
          External Funding
        </button>
      </div>
    </div>
  );
};

export default Funding;
