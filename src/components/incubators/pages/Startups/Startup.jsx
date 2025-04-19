import React, { Suspense } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
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
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Determine if we're on a detailed path
  const isDetailView = location.pathname.includes('/incubated/') && location.pathname.split('/').length > 4;
  
  // Handle authentication
  if (authLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="startups-container">
      {!isDetailView && (
        <div className="tabs-container">
          <NavLink 
            to="incubated"
            className={({ isActive }) => 
              isActive ? "tab-item active" : "tab-item"
            }
          >
            Incubated
          </NavLink>
          <NavLink 
            to="applications"
            className={({ isActive }) => 
              isActive ? "tab-item active" : "tab-item"
            }
          >
            Applications
          </NavLink>
        </div>
      )}

      <div className="content-container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="incubated" replace />} />
            <Route path="incubated" element={<Incubated />} />
            <Route path="applications" element={<Applications />} />
            
            {/* Detailed startup view with nested routes */}
            <Route path="incubated/:startupId" element={<StartupDetailView />}>
              <Route index element={<Navigate to="info" replace />} />
              <Route path="info" element={<StartupBasicInfo />} />
              <Route path="awards" element={<StartupAwards />} />
              <Route path="funding" element={<StartupFunding />} />
              <Route path="team" element={<StartupTeam />} />
              <Route path="properties" element={<StartupProperties />} />
              <Route path="updates" element={<StartupUpdates />} />
              <Route path="fee" element={<StartupFees />} />
            </Route>
            
            <Route path="*" element={<Navigate to="incubated" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Startup;
