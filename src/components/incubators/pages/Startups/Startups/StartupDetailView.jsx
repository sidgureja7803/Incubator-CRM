import React, { Suspense } from 'react';
import { useParams, NavLink, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useIncubatorContext } from '../../../../../context/IncubatorContext';
import { useAuth } from '../../../../../hooks/useAuth';
import Breadcrumbs from '../../../../common/Breadcrumbs/Breadcrumbs';
import './StartupDetailView.css';
import ThaparInnovate from '../Incubated/TIETInnovate.png';

// Lazy load tab components
const StartupBasicInfo = React.lazy(() => import('./Info/Info'));
const StartupAwards = React.lazy(() => import('./Awards/StartupAwards'));
const StartupFunding = React.lazy(() => import('./Funding/Funding'));
const StartupTeam = React.lazy(() => import('./Team/StartupTeam'));
const StartupProperties = React.lazy(() => import('./IP/IntellectualProperties'));
const StartupUpdates = React.lazy(() => import('./Updates/Updates'));
const StartupFees = React.lazy(() => import('./Fees/Fees'));

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
  const startup = startups.find(s => s.startup_id === parseInt(startupId) || s.startup_id === startupId)?.details;

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

  const getStartupName = () => startup.startup_name;

  return (
    <div className="startup-detail-container">
      <Breadcrumbs getStartupName={getStartupName} />
      
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
          to={`info`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Overview
        </NavLink>
        <NavLink 
          to={`awards`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Awards
        </NavLink>
        <NavLink 
          to={`funding`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Funding
        </NavLink>
        <NavLink 
          to={`team`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Team
        </NavLink>
        <NavLink 
          to={`properties`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Intellectual Properties
        </NavLink>
        <NavLink 
          to={`updates`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Updates
        </NavLink>
        <NavLink 
          to={`fee`}
          className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
          end
        >
          Fee
        </NavLink>
      </div>

      <div className="startup-tab-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<StartupBasicInfo startup={startup} />} />
            <Route path="awards" element={<StartupAwards startup={startup} />} />
            <Route path="funding" element={<StartupFunding startup={startup} />} />
            <Route path="team" element={<StartupTeam startup={startup} />} />
            <Route path="properties" element={<StartupProperties startup={startup} />} />
            <Route path="updates" element={<StartupUpdates startup={startup} />} />
            <Route path="fee" element={<StartupFees startup={startup} />} />
            <Route path="*" element={<Navigate to="info" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default StartupDetailView; 