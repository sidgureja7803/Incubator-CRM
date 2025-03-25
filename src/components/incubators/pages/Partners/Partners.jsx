import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from 'utils/httpClient';
import config from 'config';
import "./Partners.css";

const IncubatorPartners = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
  });

  const [partnersList, setPartnersList] = useState([
    // Dummy data for testing layout
    {
      id: 1,
      name: "Award Organization",
      type: "Tech Partnerships",
      logo: "aws" // You'll need to add actual logo handling
    },
    // Add more dummy items as needed
  ]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    // Implementation for saving partner
    closeModal();
  };

  return (
    <div className="partners-container">
      <div className="partners-header">
        <div className="tab-navigation">
          <div className="tab active">Incubator Info</div>
          <div className="tab">Team</div>
          <div className="tab">Partners</div>
          <div className="tab">Institute Associated</div>
          <div className="tab">Infrastructure</div>
          <div className="tab">Awards</div>
        </div>
        <button className="add-partners-btn" onClick={openModal}>
          Add Partners
        </button>
      </div>

      <div className="partners-grid">
        {partnersList.map((partner, index) => (
          <div key={index} className="partner-card">
            <div className="partner-logo">
              <img src={`/images/${partner.logo}.png`} alt={partner.name} />
            </div>
            <div className="partner-info">
              <h3>{partner.name}</h3>
              <p>{partner.type}</p>
            </div>
            <button className="expand-btn">
              <span>▼</span>
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="partner-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>Add Partners</h2>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>
        <form className="partner-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name here!"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="">Select the partner type</option>
              <option value="Tech Partnerships">Tech Partnerships</option>
              <option value="Business Partnerships">Business Partnerships</option>
            </select>
          </div>
          {/* Add other form fields */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter the email here"
            />
          </div>
          <div className="form-group">
            <label>Phone No.</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter the phone number here"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter the Address here"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Enter the website"
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="Enter the LinkedIn Link here"
            />
          </div>
          <button type="button" className="save-btn" onClick={handleSave}>
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default IncubatorPartners;
