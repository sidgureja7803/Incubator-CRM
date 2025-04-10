import React from 'react';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import './IncubatorInfo.css';
import { FaEdit } from 'react-icons/fa';

const IncubatorInfo = () => {
  const { incubatorInfo } = useIncubatorContext();

  return (
    <div className="incubator-info">
      <div className="info-card">
        <div className="info-header">
          <div className="logo-section">
            <img src="/tl-logo.png" alt="Venture Lab" className="incubator-logo" />
            <div className="logo-info">
              <h2>Venture Lab</h2>
              <p>Incubator</p>
            </div>
          </div>
          <button className="edit-button">
            <FaEdit />
          </button>
        </div>

        <div className="info-details">
          <div className="info-field">
            <h3>Address</h3>
            <p>C/O POONAM PASWAN, SHAMAN VIHAAR APARTMENT, DWARKA, SECTOR-23 NA DELHI, South West, Delhi, DL, 110075, IN</p>
          </div>

          <div className="info-field">
            <h3>Website</h3>
            <p>https://www.venturelab.org.in/</p>
          </div>

          <div className="info-field">
            <h3>LinkedIn</h3>
            <p>https://www.venturelab.org.in/</p>
          </div>

          <div className="info-field">
            <h3>Twitter</h3>
            <p>https://www.venturelab.org.in/</p>
          </div>

          <div className="info-field">
            <h3>Instagram</h3>
            <p>https://www.venturelab.org.in/</p>
          </div>

          <div className="info-field">
            <h3>Youtube</h3>
            <p>https://www.venturelab.org.in/</p>
          </div>
        </div>
      </div>

      <div className="info-illustration">
        <img src="/business-illustration.svg" alt="Business Illustration" />
      </div>
    </div>
  );
};

export default IncubatorInfo; 