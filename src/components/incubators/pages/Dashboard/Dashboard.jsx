import React, { useEffect } from 'react';
import { useIncubatorContext } from '../../../../context/IncubatorContext';
import axios from 'utils/httpClient';
import config from '../../../../config';
import './Dashboard.css';
import { FaUsers, FaBuilding, FaPeopleCarry } from 'react-icons/fa';
import { BsLinkedin, BsTwitter, BsInstagram } from 'react-icons/bs';

const Dashboard = () => {
  const { 
    incubatorInfo, 
    setIncubatorInfo,
    incubatorTeam,
    setIncubatorTeam,
    startups,
    setStartups
  } = useIncubatorContext();

  useEffect(() => {
    fetchIncubatorInfo();
    fetchIncubatorTeam();
    fetchStartups();
  }, []);

  const fetchIncubatorInfo = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/list/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      if (response.data && response.data[0]) {
        setIncubatorInfo(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching incubator info:", error);
    }
  };

  const fetchIncubatorTeam = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/people/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setIncubatorTeam(response.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const fetchStartups = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/incubator/startupincubator/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`
          }
        }
      );
      setStartups(response.data);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="breadcrumb">
          <span>Dashboard</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Team Members</h3>
          <p>{incubatorTeam?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Startups</h3>
          <p>{startups?.length || 0}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Recent Team Members</h2>
          <div className="team-list">
            {incubatorTeam?.slice(0, 5).map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-info">
                  <h4>{member.first_name} {member.last_name}</h4>
                  <p>{member.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Recent Startups</h2>
          <div className="startup-list">
            {startups?.slice(0, 5).map((startup) => (
              <div key={startup.id} className="startup-card">
                <div className="startup-info">
                  <h4>{startup.startup_name}</h4>
                  <p>{startup.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
