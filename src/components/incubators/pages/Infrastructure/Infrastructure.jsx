import React, { useState } from "react";
import Modal from "react-modal";
import "./Infrastructure.css";

const Infrastructure = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    type: "",
    capacity: "",
    description: "",
  });
  const [infrastructureList, setInfrastructureList] = useState([
    // Dummy data for testing layout
    {
      id: 1,
      photo: "/images/lab.jpg",
      name: "Development Lab",
      type: "Lab",
      capacity: "100 People",
      description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Fusce ante turpis pharetra amet ridiculus interdum auctor. Nascetur magnis nisl egestas congue senectus lorem; placerat tellus."
    },
    // Add more items as needed
  ]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      photo: null,
      name: "",
      type: "",
      capacity: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoUpload = (e) => {
    // Handle photo upload logic here
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleSave = () => {
    // Add the new infrastructure to the list
    const newInfrastructure = {
      id: infrastructureList.length + 1,
      ...formData,
    };
    setInfrastructureList([...infrastructureList, newInfrastructure]);
    closeModal();
  };

  return (
    <div className="infrastructure-container">
      <div className="infrastructure-header">
        <div className="tab-navigation">
          <div className="tab">Incubator Info</div>
          <div className="tab">Team</div>
          <div className="tab">Partners</div>
          <div className="tab">Institute Associated</div>
          <div className="tab active">Infrastructure</div>
          <div className="tab">Awards</div>
        </div>
        <button className="add-infrastructure-btn" onClick={openModal}>
          Add Infrastructure
        </button>
      </div>

      <div className="infrastructure-grid">
        {infrastructureList.map((infra) => (
          <div key={infra.id} className="infrastructure-card">
            <div className="infrastructure-image">
              <img src={infra.photo} alt={infra.name} />
              <button className="edit-btn">Edit</button>
            </div>
            <div className="infrastructure-info">
              <div className="info-row">
                <label>Name</label>
                <span>{infra.name}</span>
              </div>
              <div className="info-row">
                <label>Type</label>
                <span>{infra.type}</span>
              </div>
              <div className="info-row">
                <label>Capacity</label>
                <span>{infra.capacity}</span>
              </div>
              <div className="info-row">
                <label>Description</label>
                <p>{infra.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="infrastructure-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>Add Infrastructure</h2>
          <button className="close-btn" onClick={closeModal}>×</button>
        </div>
        <form className="infrastructure-form">
          <div className="form-group">
            <label>Add Photo</label>
            <div className="upload-container">
              <input
                type="text"
                placeholder="Upload Photo here"
                readOnly
                value={formData.photo ? formData.photo.name : ""}
              />
              <label className="upload-btn">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter the Infrastructure Name"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Enter the type of Infrastructure!"
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Enter the Capacity!"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter the Description about the infrastructure!"
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

export default Infrastructure;
