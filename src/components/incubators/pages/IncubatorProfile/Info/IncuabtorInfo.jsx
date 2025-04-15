import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from '../../../../../config';
import './IncubatorInfo.css';
import image from './image.png';
import { useIncubator } from '../../../../../hooks/useIncubator';

const IncubatorInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { incubatorInfo, refetchIncubatorInfo } = useIncubator();
  const [formData, setFormData] = useState({
    incubator_name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  // Update the form data when incubatorInfo changes
  useEffect(() => {
    if (incubatorInfo) {
      setFormData({
        incubator_name: incubatorInfo.incubator_name || "",
        address: incubatorInfo.address || "",
        country: incubatorInfo.country || "",
        state: incubatorInfo.state || "",
        city: incubatorInfo.city || "",
        pincode: incubatorInfo.pincode || "",
        website: incubatorInfo.website || "",
        linkedin: incubatorInfo.linkedin || "",
        twitter: incubatorInfo.twitter || "",
        instagram: incubatorInfo.instagram || "",
        youtube: incubatorInfo.youtube || "",
      });
    }
  }, [incubatorInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${config.api_base_url}/incubator/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token")
            }`,
          },
        }
      );
      // Refetch the incubator info to update the UI
      refetchIncubatorInfo();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="incubator-info-container">
      <div className="incubator-info-content">
        <div className="incubator-details">
          <h2>Incubator Information</h2>
          {!isEditing ? (
            <div className="info-display">
              <div className="info-item">
                <label>Address</label>
                <p>{incubatorInfo?.address || formData.address}</p>
              </div>
              <div className="info-item">
                <label>Website</label>
                <p>{incubatorInfo?.website || formData.website}</p>
              </div>
              <div className="info-item">
                <label>LinkedIn</label>
                <p>{incubatorInfo?.linkedin || formData.linkedin}</p>
              </div>
              <div className="info-item">
                <label>Twitter</label>
                <p>{incubatorInfo?.twitter || formData.twitter}</p>
              </div>
              <div className="info-item">
                <label>Instagram</label>
                <p>{incubatorInfo?.instagram || formData.instagram}</p>
              </div>
              <div className="info-item">
                <label>YouTube</label>
                <p>{incubatorInfo?.youtube || formData.youtube}</p>
              </div>
              <button 
                className="edit-button"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Incubator Name</label>
                <input
                  type="text"
                  name="incubator_name"
                  value={formData.incubator_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>YouTube</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="image-container">
          <img src={image} alt="Incubator illustration" />
        </div>
      </div>
    </div>
  );
};

export default IncubatorInfo;
