import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';

// Startup Components
import SideBar from './components/startups/components/SideBar/SideBar'; 
import Dashboard from './components/startups/pages/Dashboard/Dashboard';
import StartupProfile from './components/startups/pages/StartupProfile/StartupProfile';
import StartupInfo from './components/startups/pages/StartupProfile/StartupInfo/StartupInfo';
import Awards from './components/startups/pages/StartupProfile/Awards/Awards';
import Funding from './components/startups/pages/StartupProfile/Funding/Funding';
import Team from './components/startups/pages/StartupProfile/Team/Team';
import IntellectualProperties from './components/startups/pages/StartupProfile/IntelluctualProperties/IntelluctualProperties'
import Updates from './components/startups/pages/StartupProfile/Updates/Updates';

// Incubator Related Components
import Incubators from './components/startups/pages/Incubators/Incubators';
import Accelerators from './components/startups/pages/Accelerators/Accelerators';
// import MyIncubators from './components/startups/pages/Incubators/Incubators';
// import ApplyIncubator from './components/startups/pages/Incubators/ApplyIncubator';

// Cohort Components
import Tasks from './components/startups/pages/Incubators/Tasks/Tasks';
import Members from './components/startups/pages/Incubators/Members/Members';
import Mentors from './components/startups/pages/Incubators/Mentors/Mentors';
import Admins from './components/startups/pages/Incubators/Admins/Admins';
import Documents from './components/startups/pages/Incubators/Documents/Documents';

// Context Provider
import { StartupProvider } from './context/StartupContext';

// Utils
import ProtectedRoute from './utils/ProtectedRoute';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('user_role') || sessionStorage.getItem('user_role') || null;
  });

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('user_role', userRole);
    }
  }, [userRole]);

  const isAuthenticated = () => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated() ? <Navigate to="/startup/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        {/* Startup Routes - Wrapped with StartupProvider */}
        <Route path="/startup" element={
          <ProtectedRoute requiredRole="startup">
            <StartupProvider>
              <SideBar />
            </StartupProvider>
          </ProtectedRoute>
        }>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Profile Routes */}
          <Route path="profile" element={<StartupProfile />}>
            <Route index element={<Navigate to="startup-info" replace />} />
            <Route path="startup-info" element={<StartupInfo />} />
            <Route path="awards" element={<Awards />} />
            <Route path="funding" element={<Funding />} />
            <Route path="team" element={<Team />} />
            <Route path="intellectual-properties" element={<IntellectualProperties />} />
            <Route path="updates" element={<Updates />} />
          </Route>

          {/* Incubators Routes */}
          <Route path="incubators" element={<Incubators />}>
            {/* Nested Incubator Routes */}
            <Route path=":incubatorId">
              <Route path="programs/:programId">
                <Route path="cohorts/:cohortId">
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="members" element={<Members />} />
                  <Route path="mentors" element={<Mentors />} />
                  <Route path="admins" element={<Admins />} />
                  <Route path="documents" element={<Documents />} />
                </Route>
              </Route>
            </Route>
          </Route>

          {/* Accelerators Routes */}
          <Route path="accelerators" element={<Accelerators />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={
          isAuthenticated() ? 
            <Navigate to="/startup/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
