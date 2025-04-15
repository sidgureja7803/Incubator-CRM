import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Awards.css';

const Awards = () => {
  const { startupId } = useParams();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        // Get token from storage
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        // Fetch awards data from the API
        const response = await axios.get('http://139.59.46.75/api/startup/awards/', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            startup_id: startupId
          }
        });
        
        setAwards(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching startup awards:', err);
        setError('Failed to load awards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (startupId) {
      fetchAwards();
    }
  }, [startupId]);

  if (loading) {
    return (
      <div className="awards-loading">
        <div className="spinner"></div>
        <p>Loading awards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="awards-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="awards-container">
      <div className="awards-header">
        <h2>Startup Awards</h2>
        <button className="add-award-btn">+ Add Award</button>
      </div>

      {awards.length === 0 ? (
        <div className="no-awards">
          <p>No awards found for this startup.</p>
          <p>Awards will appear here once they're added.</p>
        </div>
      ) : (
        <div className="awards-table">
          <table>
            <thead>
              <tr>
                <th>Award Name</th>
                <th>Organization</th>
                <th>Year</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <tr key={award.id}>
                  <td>{award.award_name}</td>
                  <td>{award.organization}</td>
                  <td>{award.year}</td>
                  <td>{award.description}</td>
                  <td>
                    <div className="award-actions">
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
              <span>1 - {awards.length} of {awards.length}</span>
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
              <button className="prev-btn" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="next-btn" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Awards;
