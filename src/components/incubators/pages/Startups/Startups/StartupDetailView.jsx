import React, { Suspense } from 'react';
import { useParams, NavLink, Outlet, useNavigate, Navigate, useLocation, Routes, Route } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import { useAuth } from '../../../../../hooks/useAuth';
import './StartupDetailView.css';
import ThaparInnovate from '../Incubated/TIETInnovate.png';

// Lazy load tab components
const StartupBasicInfo = React.lazy(() => import('../Info/Info'));
const StartupAwards = React.lazy(() => import('../Awards/Awards'));
const StartupFunding = React.lazy(() => import('../Funding/Funding'));
const StartupTeam = React.lazy(() => import('../Team/Team'));
const StartupProperties = React.lazy(() => import('../IP/IntellectualProperties'));
const StartupUpdates = React.lazy(() => import('../Updates/Updates'));
const StartupFees = React.lazy(() => import('../Fees/Fees'));

// Loading component
const LoadingFallback = () => (
  <div className="startup-detail-loading">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const StartupDetailView = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { startups, isLoading } = useIncubatorContext();
  
  // Handle authentication
  if (authLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Find the startup from context
  const startupWithDetails = startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId);
  const startup = startupWithDetails?.details;

  const goBack = () => {
    navigate('/incubator/startups/incubated');
  };

  if (isLoading.startups) {
    return <LoadingFallback />;
  }

  if (!startup) {
    return (
      <div className="startup-detail-container">
        <div className="startup-detail-error">
          <h3>Error</h3>
          <p>Startup not found</p>
          <button className="back-button" onClick={goBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="startup-detail-container">
      <div className="startup-header">
        <button className="back-button" onClick={goBack}>← Back</button>
        <img 
          src={startup.image_url || ThaparInnovate} 
          alt={startup.startup_name} 
          className="startup-logo"
        />
        <h2>{startup.startup_name}</h2>
      </div>

      <div className="startup-tabs">
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/info`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Startup Info
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/awards`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Awards
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/funding`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Funding
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/team`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Team
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/properties`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Intellectual Properties
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/updates`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Updates
        </NavLink>
        <NavLink 
          to={`/incubator/startups/incubated/${startupId}/fee`} 
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
        >
          Fee
        </NavLink>
      </div>

      <div className="startup-tab-content">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet context={{ startup }} />
        </Suspense>
      </div>
    </div>
  );
};

export default StartupDetailView; 