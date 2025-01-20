import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPageImg from './LandingPage.jpg';
import './LandingPage.css';
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="logo">
        <img src="/venture-lab-logo.png" alt="Venture Lab" />
      </div>
      
      <div className="landing-content">
        <div className="text-content">
          <h1>Managing Startups</h1>
          <h2>Made Easy</h2>
          <p>We're really excited to know you more !!!</p>
          <button 
            className="next-button"
            onClick={() => navigate('/signup')}
          >
            Next →
          </button>
        </div>
        <div className="image-content">
          <img src={LandingPageImg} alt="Landing Page Illustration" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
