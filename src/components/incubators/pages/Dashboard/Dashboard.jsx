import React, { Suspense } from 'react';
import { useIncubator } from '../../../../hooks/useIncubator';
import './Dashboard.css';
import { 
  FaUsers, FaBuilding, FaMoneyBillWave, 
  FaBriefcase, FaFileAlt, FaHandshake,
  FaChartLine, FaUniversity
} from 'react-icons/fa';
import { BsLinkedin, BsTwitter, BsInstagram, BsYoutube } from 'react-icons/bs';

// Separate components for better code splitting and error boundaries
const StatsGrid = ({ startupList }) => {
  const stats = [
    {
      icon: <FaBuilding />,
      title: "Number of Startups",
      value: startupList.length || "0",
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
  );
};

const IncubatorInfo = ({ incubatorInfo }) => (
  <div className="info-section">
    <h2>Incubator Information</h2>
    <div className="info-content">
      <div className="info-row">
        <div className="info-field">
          <span className="info-label">Name</span>
          <span className="info-value">{incubatorInfo?.incubator_name || 'Venture Lab'}</span>
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
);

const TeamMembers = ({ teamMembers }) => (
  <div className="info-section">
    <h2>Team Members</h2>
    {teamMembers.length === 0 ? (
      <div className="no-data-message">No team members found</div>
    ) : (
      <div className="team-grid">
        {teamMembers.slice(0, 4).map((member, index) => (
          <div key={index} className="team-member-card">
            <img 
              src={member.profile_picture || member.image || 'https://randomuser.me/api/portraits/women/79.jpg'} 
              alt={`${member.first_name} ${member.last_name}`} 
              className="member-photo"
            />
            <div className="member-info">
              <div className="member-header">
                <span className="member-label">Name:</span>
                <span className="member-name">{member.first_name} {member.last_name || ''}</span>
              </div>
              <div className="member-role">{member.designation || 'Team Member'}</div>
              <div className="member-social">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><BsLinkedin /></a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer"><BsInstagram /></a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer"><BsTwitter /></a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="dashboard-loading">
    <div className="spinner"></div>
    <p>Loading dashboard data...</p>
  </div>
);

const ErrorDisplay = ({ error, refetch }) => (
  <div className="dashboard-error">
    <h2>Error loading dashboard</h2>
    <p>{error?.message || 'Something went wrong'}</p>
    <button onClick={refetch}>
      Try Again
    </button>
  </div>
);

const Dashboard = () => {
  const {
    incubatorInfo,
    incubatorTeam,
    startups,
    isLoading,
    error,
    refetchIncubatorInfo,
    refetchIncubatorTeam,
    refetchStartups
  } = useIncubator();

  // Create safe references to data
  const teamMembers = incubatorTeam || [];
  const startupList = startups || [];

  // Handle loading state
  if (isLoading.incubatorInfo || isLoading.incubatorTeam) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error.incubatorInfo || error.incubatorTeam) {
    return (
      <ErrorDisplay 
        error={error.incubatorInfo || error.incubatorTeam} 
        refetch={() => {
          refetchIncubatorInfo();
          refetchIncubatorTeam();
          refetchStartups();
        }}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <StatsGrid startupList={startupList} />
      </Suspense>

      <div className="info-sections">
        <Suspense fallback={<LoadingSpinner />}>
          <IncubatorInfo incubatorInfo={incubatorInfo} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <TeamMembers teamMembers={teamMembers} />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard; 