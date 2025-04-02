import React, { useState, useEffect } from 'react';
import { authAxios } from '../../../../../utils/auth';
import config from '../../../../../config';
import './InstituteAssociated.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

const InstituteAssociated = () => {
  const [institutes, setInstitutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [formData, setFormData] = useState({
    institute_name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
    logo: null
  });

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await authAxios.get(`${config.api_base_url}/incubator/institute/`);
      setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      logo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      if (selectedInstitute) {
        await authAxios.patch(
          `${config.api_base_url}/incubator/institute/${selectedInstitute.id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await authAxios.post(
          `${config.api_base_url}/incubator/institute/`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      setShowModal(false);
      setSelectedInstitute(null);
      setFormData({
        institute_name: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        website: "",
        logo: null
      });
      fetchInstitutes();
    } catch (error) {
      console.error("Error saving institute:", error);
    }
  };

  const handleEdit = (institute) => {
    setSelectedInstitute(institute);
    setFormData({
      institute_name: institute.institute_name,
      address: institute.address,
      country: institute.country,
      state: institute.state,
      city: institute.city,
      pincode: institute.pincode,
      website: institute.website,
      logo: institute.logo
    });
    setShowModal(true);
  };

  const handleDelete = async (instituteId) => {
    if (window.confirm('Are you sure you want to delete this institute?')) {
      try {
        await authAxios.delete(`${config.api_base_url}/incubator/institute/${instituteId}`);
        fetchInstitutes();
      } catch (error) {
        console.error("Error deleting institute:", error);
      }
    }
  };

  return (
    <div className="institute-container">
      <div className="institute-header">
        <h2>Institute Associated</h2>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <IoMdAdd /> Add Institute
        </button>
      </div>

      <div className="institutes-grid">
        {institutes.map((institute) => (
          <div key={institute.id} className="institute-card">
            <div className="institute-logo">
              <img src={institute.logo || '/default-logo.png'} alt={institute.institute_name} />
            </div>
            <div className="institute-info">
              <h3>{institute.institute_name}</h3>
              <p className="address">{institute.address}</p>
              <p className="city">{institute.city}</p>
              <p className="state">{institute.state}</p>
              <p className="country">{institute.country}</p>
              <p className="pincode">{institute.pincode}</p>
              <a href={institute.website} target="_blank" rel="noopener noreferrer" className="website">
                {institute.website}
              </a>
            </div>
            <div className="institute-actions">
              <button onClick={() => handleEdit(institute)} className="edit-button">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(institute.id)} className="delete-button">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedInstitute ? 'Edit Institute Info' : 'Add Institute'}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="logo-upload">
                <label>Add Logo</label>
                <div className="upload-box">
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"
                  />
                  <button type="button" className="upload-button">Upload</button>
                </div>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="institute_name"
                  value={formData.institute_name}
                  onChange={handleInputChange}
                  placeholder="Enter the Institute Name"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter the Address"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter the City"
                />
              </div>
              <div className="form-group">
                <label>State / Pincode</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter the State and Pincode"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter the Country"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter the link for website"
                />
              </div>
              <button type="submit" className="save-button">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteAssociated;
