import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './ApplyIncubation.css';
import IncubatorLogo from '../../Dashboard/IncuabtorImage.png';
const ApplyIncubation = () => {
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [formData, setFormData] = useState({
    funding: '',
    product: '',
    impact: ''
  });

  useEffect(() => {
    fetchAvailableIncubators();
  }, []);

  const fetchAvailableIncubators = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/list/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      setIncubators(response.data);
    } catch (error) {
      console.error('Error fetching available incubators:', error);
    }
  };

  const handleIncubatorSelect = async (incubator) => {
    setSelectedIncubator(incubator);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubator.id}/programs/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      setSelectedIncubator({
        ...incubator,
        programs: response.data
      });
    } catch (error) {
      console.error('Error fetching incubator programs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.post(
        `${config.api_base_url}/startup/incubators/${selectedIncubator.id}/apply/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      alert('Application submitted successfully!');
      setSelectedIncubator(null);
      setFormData({
        funding: '',
        product: '',
        impact: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="apply-incubation-container">
      <div className="available-incubators">
        {incubators.map((incubator) => (
          <div
            key={incubator.id}
            className={`incubator-card ${selectedIncubator?.id === incubator.id ? 'active' : ''}`}
            onClick={() => handleIncubatorSelect(incubator)}
          >
            <img src={incubator.logo_url || IncubatorLogo} alt={incubator.name} className="incubator-logo" />
            <h3>{incubator.name}</h3>
            <p>{incubator.description}</p>
          </div>
        ))}
      </div>

      {selectedIncubator && (
        <div className="application-section">
          <div className="programs-list">
            <h3>Available Programs</h3>
            {selectedIncubator.programs?.map((program) => (
              <div key={program.id} className="program-card">
                <h4>{program.name}</h4>
                <p>{program.description}</p>
                <div className="program-meta">
                  <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                  <span>End: {new Date(program.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="application-form">
            <h2>Apply to {selectedIncubator.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>What is the funding of your startup!</label>
                <input
                  type="text"
                  name="funding"
                  value={formData.funding}
                  onChange={handleInputChange}
                  placeholder="Enter the Fundings"
                  required
                />
              </div>

              <div className="form-group">
                <label>What is the Product of your Startup!</label>
                <textarea
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  placeholder="Enter the product"
                  required
                />
              </div>

              <div className="form-group">
                <label>What Impact your startup have in upcoming years!</label>
                <textarea
                  name="impact"
                  value={formData.impact}
                  onChange={handleInputChange}
                  placeholder="Enter your Update here !!"
                  required
                />
              </div>

              <button type="submit" className="apply-button">Apply</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyIncubation; 