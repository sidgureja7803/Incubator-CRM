import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from '../../../../../../config';
import './Funding.css';

const Funding = () => {
  const [fundingRounds, setFundingRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { startupId } = useParams();

  // Fetch funding data directly
  useEffect(() => {
    if (!startupId) return;

    const fetchFunding = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await axios.get(
          `${config.api_base_url}/incubator/startup/${startupId}/funding/`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        console.log("Funding data:", response.data);
        
        // Process and sort funding rounds by date
        const sortedFunding = response.data
          .map(round => ({
            ...round,
            date: new Date(round.date),
            formatted_date: new Date(round.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }))
          .sort((a, b) => b.date - a.date);

        setFundingRounds(sortedFunding);
        setError(null);
      } catch (error) {
        console.error("Error fetching funding rounds:", error);
        
        // Add mock data for testing if API fails
        console.log("Using mock data for funding rounds");
        const mockData = [
          {
            id: 1,
            round_type: "Seed",
            amount: 10000000,
            date: new Date("2022-06-15"),
            formatted_date: "June 15, 2022",
            lead_investor: "Angel Investors Group",
            valuation: 50000000,
            investors: ["TechStars", "Startup Capital", "Individual Angel"],
            notes: "Initial funding to develop MVP and establish market presence."
          },
          {
            id: 2,
            round_type: "Series A",
            amount: 50000000,
            date: new Date("2023-04-22"),
            formatted_date: "April 22, 2023",
            lead_investor: "Venture Partners LLC",
            valuation: 200000000,
            investors: ["Global Ventures", "Tech Growth Fund", "Innovation Capital"],
            notes: "Funding for scaling operations and expanding product offering."
          }
        ];
        setFundingRounds(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, [startupId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading funding information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Calculate total funding
  const totalFunding = fundingRounds.reduce((sum, round) => sum + (round.amount || 0), 0);

  return (
    <div className="funding-container">
      {renderTable(incubatorData, "Incubator Funding")}
      {renderTable(externalData, "External Funding")}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Fundings!</h2>
              <button className="close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="funding-type-selector">
                <label>
                  <input
                    type="radio"
                    checked={editingTable === "Incubator Funding"}
                    onChange={() => setEditingTable("Incubator Funding")}
                  />
                  Incubator Funding
                </label>
                <label>
                  <input
                    type="radio"
                    checked={editingTable === "External Funding"}
                    onChange={() => setEditingTable("External Funding")}
                  />
                  External Funding
                </label>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editedRow.date}
                  onChange={handleInputChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editedRow.amount}
                  onChange={handleInputChange}
                  placeholder="10000"
                />
                {errors.amount && <span className="error">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label>Funding Program</label>
                <input
                  type="text"
                  name="funding_program"
                  value={editedRow.funding_program}
                  onChange={handleInputChange}
                  placeholder="Enter th Program here !!"
                />
                {errors.funding_program && <span className="error">{errors.funding_program}</span>}
              </div>

              <div className="form-group">
                <label>Funding Agency</label>
                <input
                  type="text"
                  name="funding_agency"
                  value={editedRow.funding_agency}
                  onChange={handleInputChange}
                  placeholder="Enter Funding Agency name here !!"
                />
                {errors.funding_agency && <span className="error">{errors.funding_agency}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this funding record?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
              <button className="delete-button" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;