import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './Accelerators.css';

const Accelerators = () => {
  const [accelerators, setAccelerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Placeholder for API call - in a real app, this would fetch accelerators
    setLoading(true);
    setTimeout(() => {
      // Sample data
      const sampleAccelerators = [
        {
          id: 1,
          name: "Y Combinator",
          logo_url: "https://thaparinnovate.org/images/ThaparInnovate-logo.png",
          location: "Silicon Valley, USA",
          description: "Y Combinator is a startup accelerator that invests in a wide range of startups.",
          application_deadline: "2023-12-31"
        },
        {
          id: 2,
          name: "500 Startups",
          logo_url: "https://thaparinnovate.org/images/ThaparInnovate-logo.png",
          location: "San Francisco, USA",
          description: "500 Startups is a global venture capital firm with a network of startup programs.",
          application_deadline: "2023-11-15"
        },
        {
          id: 3,
          name: "Techstars",
          logo_url: "https://thaparinnovate.org/images/ThaparInnovate-logo.png",
          location: "Various Locations",
          description: "Techstars is a worldwide network that helps entrepreneurs succeed.",
          application_deadline: "2023-10-30"
        },
        {
          id: 4,
          name: "Startup India",
          logo_url: "https://thaparinnovate.org/images/ThaparInnovate-logo.png",
          location: "India",
          description: "Startup India is an initiative by the Government of India to promote startups.",
          application_deadline: "2023-12-15"
        }
      ];
      
      setAccelerators(sampleAccelerators);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading accelerators...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="accelerators-container">
      <h1>Accelerators</h1>
      <p className="subtitle">Explore and apply to accelerator programs to grow your startup</p>
      
      <div className="filter-section">
        <input type="text" placeholder="Search accelerators..." className="search-input" />
        <select className="filter-dropdown">
          <option value="">All Locations</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="Europe">Europe</option>
        </select>
        <button className="filter-button">Filter</button>
      </div>
      
      <div className="accelerators-grid">
        {accelerators.map(accelerator => (
          <div key={accelerator.id} className="accelerator-card">
            <div className="accelerator-logo">
              <img src={accelerator.logo_url} alt={accelerator.name} />
            </div>
            <div className="accelerator-info">
              <h3>{accelerator.name}</h3>
              <p className="location">{accelerator.location}</p>
              <p className="description">{accelerator.description}</p>
              <p className="deadline">Application Deadline: {new Date(accelerator.application_deadline).toLocaleDateString()}</p>
              <button className="apply-button">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accelerators; 