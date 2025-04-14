import React from 'react';
import { useIncubator } from '../../hooks/useIncubator';
import { Link } from 'react-router-dom';
import './IncubatorDashboard.css';

const IncubatorDashboard = () => {
  const {
    // Data
    incubatorInfo,
    incubatorTeam,
    incubatorPrograms,
    startups,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Refetch functions
    refetchIncubatorInfo,
    refetchIncubatorTeam,
    refetchPrograms,
    
    // Mutation functions
    addProgram,
    updateProgram
  } = useIncubator();

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>{error.message}</p>
        <button onClick={() => {
          refetchIncubatorInfo();
          refetchIncubatorTeam();
          refetchPrograms();
        }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="incubator-dashboard">
      <header className="dashboard-header">
        <div className="incubator-info">
          <img 
            src={incubatorInfo?.logo_url || '/placeholder-logo.png'} 
            alt={incubatorInfo?.name} 
            className="incubator-logo"
          />
          <div>
            <h1>{incubatorInfo?.name || 'Incubator Dashboard'}</h1>
            <p>{incubatorInfo?.description || 'Welcome to your incubator dashboard'}</p>
          </div>
        </div>
        <div className="action-buttons">
          <button onClick={() => refetchPrograms()} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card">
            <h3>Programs</h3>
            <p className="stat-value">{incubatorPrograms?.length || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Team Members</h3>
            <p className="stat-value">{incubatorTeam?.length || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Startups</h3>
            <p className="stat-value">{startups?.length || 0}</p>
          </div>
        </section>

        <section className="programs-section">
          <div className="section-header">
            <h2>Active Programs</h2>
            <Link to="/programs" className="view-all">View All Programs</Link>
          </div>
          
          <div className="programs-grid">
            {incubatorPrograms && incubatorPrograms.length > 0 ? (
              incubatorPrograms
                .filter(program => program.is_active)
                .slice(0, 3)
                .map(program => (
                  <div key={program.id} className="program-card">
                    <h3>{program.program_name}</h3>
                    <p>{program.description}</p>
                    <div className="cohort-count">
                      <span>{program.cohorts?.length || 0} Cohorts</span>
                    </div>
                    <Link to={`/programs/${program.id}`} className="view-details">
                      View Details
                    </Link>
                  </div>
                ))
            ) : (
              <p className="no-data">No active programs found</p>
            )}
          </div>
        </section>

        <section className="team-section">
          <div className="section-header">
            <h2>Team Members</h2>
            <Link to="/team" className="view-all">View All Team Members</Link>
          </div>
          
          <div className="team-grid">
            {incubatorTeam && incubatorTeam.length > 0 ? (
              incubatorTeam.slice(0, 4).map(member => (
                <div key={member.id} className="team-card">
                  <img 
                    src={member.avatar_url || '/placeholder-avatar.png'} 
                    alt={`${member.first_name} ${member.last_name}`} 
                    className="member-avatar"
                  />
                  <h3>{member.first_name} {member.last_name}</h3>
                  <p className="member-role">{member.designation}</p>
                </div>
              ))
            ) : (
              <p className="no-data">No team members found</p>
            )}
          </div>
        </section>

        <section className="startups-section">
          <div className="section-header">
            <h2>Recent Startups</h2>
            <Link to="/startups" className="view-all">View All Startups</Link>
          </div>
          
          <div className="startups-list">
            {startups && startups.length > 0 ? (
              startups.slice(0, 5).map(startup => (
                <div key={startup.id} className="startup-card">
                  <img 
                    src={startup.logo_url || '/placeholder-startup-logo.png'} 
                    alt={startup.name} 
                    className="startup-logo"
                  />
                  <div className="startup-info">
                    <h3>{startup.name}</h3>
                    <p>{startup.description}</p>
                  </div>
                  <div className="startup-meta">
                    <span className="industry">{startup.industry}</span>
                    <Link to={`/startups/${startup.id}`} className="view-startup">
                      Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No startups found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default IncubatorDashboard;