import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './DashBoard.css';
import { FaUsers, FaBuilding, FaPeopleCarry } from 'react-icons/fa';
import { BsLinkedin, BsTwitter, BsInstagram } from 'react-icons/bs';

const DashBoard = () => {
  const [stats, setStats] = useState({
    partners: 0,
    startups: 0,
    people: 0
  });
  const [incubatorInfo, setIncubatorInfo] = useState(null);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchIncubatorInfo();
    fetchPeople();
  }, []);

  const fetchStats = async () => {
    try {
      const [partnersResponse, startupsResponse, peopleResponse] = await Promise.all([
        axios.get(`${config.api_base_url}/incubator/partners/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }),
        axios.get(`${config.api_base_url}/incubator/startupincubator/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        }),
        axios.get(`${config.api_base_url}/incubator/people/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          },
        })
      ]);

      setStats({
        partners: partnersResponse.data.length,
        startups: startupsResponse.data.length,
        people: peopleResponse.data.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchIncubatorInfo = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/list/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
        },
      });
      setIncubatorInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching incubator info:", error);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/incubator/people/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
        },
      });
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Number of Partners</h3>
            <p className="stat-number">{stats.partners}</p>
            <p className="stat-label">Total Partners</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBuilding />
          </div>
          <div className="stat-content">
            <h3>Number of Startups</h3>
            <p className="stat-number">{stats.startups}</p>
            <p className="stat-label">Incubated Startups</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaPeopleCarry />
          </div>
          <div className="stat-content">
            <h3>Number of People</h3>
            <p className="stat-number">{stats.people}</p>
            <p className="stat-label">Working at Incubator</p>
          </div>
        </div>
      </div>

      {/* Incubator Information */}
      <div className="info-container">
        <div className="incubator-info">
          <h2>Incubator Information</h2>
          {incubatorInfo && (
            <div className="info-content">
              <div className="info-row">
                <h3>Name</h3>
                <p>{incubatorInfo.name}</p>
              </div>
              <div className="info-row">
                <h3>Website</h3>
                <p>{incubatorInfo.website}</p>
              </div>
              <div className="info-row">
                <h3>Address</h3>
                <p>{incubatorInfo.address}</p>
              </div>
              <div className="social-links">
                <a href={incubatorInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <BsLinkedin />
                </a>
                <a href={incubatorInfo.twitter} target="_blank" rel="noopener noreferrer">
                  <BsTwitter />
                </a>
                <a href={incubatorInfo.instagram} target="_blank" rel="noopener noreferrer">
                  <BsInstagram />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="team-members">
          <h2>Team Members</h2>
          <div className="members-grid">
            {people.map((person) => (
              <div key={person.id} className="member-card">
                <img src={person.image || 'default-avatar.png'} alt={person.name} />
                <h3>{person.name}</h3>
                <p>{person.designation}</p>
                <div className="social-links">
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                    <BsLinkedin />
                  </a>
                  <a href={person.twitter} target="_blank" rel="noopener noreferrer">
                    <BsTwitter />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
