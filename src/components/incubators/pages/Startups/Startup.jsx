import React, { Suspense } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import './Startup.css';

// Lazy load components for better performance
const Incubated = React.lazy(() => import('./Incubated/Incubated'));
const Applications = React.lazy(() => import('./Applications/Applications'));
const StartupDetailView = React.lazy(() => import('./Startups/StartupDetailView'));
const StartupBasicInfo = React.lazy(() => import('./Info/Info'));
const StartupAwards = React.lazy(() => import('./Awards/Awards'));
const StartupFunding = React.lazy(() => import('./Funding/Funding'));
const StartupTeam = React.lazy(() => import('./Team/StartupTeam'));
const StartupProperties = React.lazy(() => import('./IP/IntellectualProperties'));
const StartupUpdates = React.lazy(() => import('./Updates/Updates'));
const StartupFees = React.lazy(() => import('./Fees/Fees'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const Startup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startupId } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Define main tabs array
  const mainTabs = [
    { id: 'incubated', label: 'Incubated', path: '/startups/incubated' },
    { id: 'applications', label: 'Applications', path: '/startups/applications' },
  ];

  // Define startup detail tabs array
  const startupTabs = [
    { id: 'info', label: 'Basic Info', path: 'info' },
    { id: 'awards', label: 'Awards', path: 'awards' },
    { id: 'funding', label: 'Funding', path: 'funding' },
    { id: 'team', label: 'Team', path: 'team' },
    { id: 'properties', label: 'Intellectual Properties', path: 'properties' },
    { id: 'updates', label: 'Updates', path: 'updates' },
    { id: 'fee', label: 'Fee', path: 'fee' },
  ];
  
  // Get current path for breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isStartupView = pathSegments.includes('incubated') && startupId;
  
  // Function to get startup name - in a real app, this would come from your data
  const getStartupName = () => {
    // This should be replaced with actual startup data
    return "Thinkwave";
  };

  // Function to get current tab label
  const getCurrentTabLabel = () => {
    const currentPath = pathSegments[pathSegments.length - 1];
    const tab = startupTabs.find(t => t.path === currentPath);
    return tab ? tab.label : 'Startup Info';
  };
  
  // Handle authentication
  if (authLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="startups-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Startups</h1>
      </div>

      {/* Breadcrumb - Only show when viewing a specific startup */}
      {isStartupView && (
        <div className="breadcrumb-nav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Startups</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Incubated</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">{getStartupName()}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">{getCurrentTabLabel()}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        {!isStartupView ? (
          // Main tabs (Incubated/Applications)
          mainTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id}
              className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))
        ) : (
          // Startup detail tabs
          startupTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/startups/incubated/${startupId}/${tab.path}`}
              className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))
        )}
      </div>

      {/* Content */}
      <div className="content-container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="incubated" replace />} />
            <Route path="incubated" element={<Incubated />} />
            <Route path="applications" element={<Applications />} />
            
            {/* Detailed startup view with nested routes */}
            <Route path="incubated/:startupId/*" element={
              <Routes>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<StartupBasicInfo />} />
                <Route path="awards" element={<StartupAwards />} />
                <Route path="funding" element={<StartupFunding />} />
                <Route path="team" element={<StartupTeam />} />
                <Route path="properties" element={<StartupProperties />} />
                <Route path="updates" element={<StartupUpdates />} />
                <Route path="fee" element={<StartupFees />} />
              </Routes>
            } />
            
            <Route path="*" element={<Navigate to="incubated" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Startup;
