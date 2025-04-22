import React, { Suspense } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useIncubatorContext } from '../../../../context/IncubatorContext';
import Breadcrumbs from '../../../common/Breadcrumbs/Breadcrumbs';
import './Startup.css';

// Lazy load components for better performance
const Incubated = React.lazy(() => import('./Incubated/Incubated'));
const Applications = React.lazy(() => import('./Applications/Applications'));
const StartupDetailView = React.lazy(() => import('./Startups/StartupDetailView'));

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
  const { startups } = useIncubatorContext();
  
  // Define main tabs array
  const mainTabs = [
    { id: 'incubated', label: 'Incubated', path: 'incubated' },
    { id: 'applications', label: 'Applications', path: 'applications' },
  ];

  // Get current path for breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isStartupView = pathSegments.includes('incubated') && startupId;
  
  // Function to get startup name from context
  const getStartupName = () => {
    if (!startupId) return '';
    const startup = startups?.find(s => s.startup_id === startupId);
    return startup?.details?.startup_name || 'Startup';
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

      {/* Breadcrumbs */}
      <Breadcrumbs getStartupName={getStartupName} />

      {/* Tabs */}
      {!isStartupView && (
        <div className="tabs-container">
          <div className="main-tabs">
            {mainTabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="content-container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main routes */}
            <Route index element={<Navigate to="incubated" replace />} />
            <Route path="incubated" element={<Incubated />} />
            <Route path="applications" element={<Applications />} />
            
            {/* Startup detail route */}
            <Route path="incubated/:startupId/*" element={<StartupDetailView />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="incubated" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Startup;
