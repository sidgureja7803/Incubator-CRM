import React, { useEffect } from 'react';
import { useIncubatorContext } from '../../../../context/IncubatorContext';
import axios from 'axios';
import config from '../../../../config';
import './Dashboard.css';
import { 
  FaUsers, FaBuilding, FaMoneyBillWave, 
  FaBriefcase, FaFileAlt, FaHandshake,
  FaChartLine, FaUniversity
} from 'react-icons/fa';
import { BsLinkedin, BsTwitter, BsInstagram, BsYoutube } from 'react-icons/bs';

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

  const stats = [
    {
      icon: <FaBuilding />,
      title: "Number of Startups",
      value: startups?.length || "100000",
      subtitle: "Total Partners"
    },
    {
      icon: <FaUsers />,
      title: "Employment Generated",
      value: "20000",
      subtitle: "By all the startups"
    },
    {
      icon: <FaFileAlt />,
      title: "Number of Patents",
      value: "3",
      subtitle: "By all the startups"
    },
    {
      icon: <FaHandshake />,
      title: "Number of Partners",
      value: "10,00,000",
      subtitle: "People"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Fund Distributed",
      value: "₹100000",
      subtitle: "By the Incubator"
    },
    {
      icon: <FaBriefcase />,
      title: "External Funds",
      value: "₹20000",
      subtitle: "Raised by Startups"
    },
    {
      icon: <FaChartLine />,
      title: "Valuation of Startups",
      value: "3",
      subtitle: "Total for all the Startups"
    },
    {
      icon: <FaUniversity />,
      title: "Revenue Generated",
      value: "₹10,00,000",
      subtitle: "By all the startups"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="info-sections">
        <div className="info-section">
          <h2>Incubator Information</h2>
          <div className="info-content">
            <div className="info-row">
              <div className="info-field">
                <span className="info-label">Name</span>
                <span className="info-value">Venture Lab</span>
              </div>
              <div className="info-field">
                <span className="info-label">LinkedIn</span>
                <span className="info-value">{incubatorInfo?.linkedin || 'https://www.venturelab.org.in/'}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-field">
                <span className="info-label">Website</span>
                <span className="info-value">{incubatorInfo?.website || 'https://www.venturelab.org.in/'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">Twitter</span>
                <span className="info-value">{incubatorInfo?.twitter || 'https://www.venturelab.org.in/'}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-field">
                <span className="info-label">Address</span>
                <span className="info-value">
                  {incubatorInfo?.address || 'C/O POONAM PASWAN, SHAMAN VIHAAR APARTMENT, DWARKA, SECTOR-23 NA DELHI, South West, Delhi, DL, 110075, IN'}
                </span>
              </div>
              <div className="info-field">
                <span className="info-label">Instagram</span>
                <span className="info-value">{incubatorInfo?.instagram || 'https://www.venturelab.org.in/'}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-field">
                <span className="info-label">Youtube</span>
                <span className="info-value">{incubatorInfo?.youtube || 'https://www.venturelab.org.in/'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Team Members</h2>
          <div className="team-grid">
            {incubatorTeam?.slice(0, 4).map((member, index) => (
              <div key={index} className="team-member-card">
                <img 
                  src={member.profile_picture || 'https://randomuser.me/api/portraits/women/79.jpg'} 
                  alt={member.name} 
                  className="member-photo"
                />
                <div className="member-info">
                  <div className="member-header">
                    <span className="member-label">Name:</span>
                    <span className="member-name">{member.first_name} {member.last_name || 'Kanishk Dadwal'}</span>
                  </div>
                  <div className="member-role">{member.designation || 'CEO/Founder'}</div>
                  <div className="member-social">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><BsLinkedin /></a>
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer"><BsInstagram /></a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"><BsTwitter /></a>
                  </div>
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