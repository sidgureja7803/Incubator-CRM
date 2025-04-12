import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet
} from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';

// Startup Components
import StartupSidebar from './components/startups/pages/SideBar/SideBar';
import StartupDashboard from './components/startups/pages/Dashboard/Dashboard';
import StartupProfile from './components/startups/pages/StartupProfile/StartupProfile';
import StartupInfo from './components/startups/pages/StartupProfile/StartupInfo/StartupInfo';
import StartupAwards from './components/startups/pages/StartupProfile/Awards/Awards';
import StartupFunding from './components/startups/pages/StartupProfile/Funding/Funding';
import StartupTeam from './components/startups/pages/StartupProfile/Team/Team';
import StartupIntellectualProperties from './components/startups/pages/StartupProfile/IntelluctualProperties/IntelluctualProperties';
import StartupUpdates from './components/startups/pages/StartupProfile/Updates/Updates';

// Incubator Components
import IncubatorSidebar from './components/incubators/pages/Sidebar/Sidebar';
import IncubatorDashboard from './components/incubators/pages/Dashboard/Dashboard';
import IncubatorProfile from './components/incubators/pages/IncubatorProfile/IncubatorProfile';
import IncubatorInfo from './components/incubators/pages/IncubatorProfile/Info/IncuabtorInfo';
import IncubatorTeam from './components/incubators/pages/IncubatorProfile/Team/Team';
import IncubatorPartners from './components/incubators/pages/IncubatorProfile/Partners/Partners';
import IncubatorInstitute from './components/incubators/pages/IncubatorProfile/InstituteAssociated/InstituteAssociated';
import IncubatorInfrastructure from './components/incubators/pages/IncubatorProfile/Infrastructure/Infrastructure';
import IncubatorAwards from './components/incubators/pages/IncubatorProfile/Awards/Awards';

// Cohort Components
import Tasks from './components/startups/pages/Incubators/Tasks/Tasks';
import Members from './components/startups/pages/Incubators/Members/Members';
import Mentors from './components/startups/pages/Incubators/Mentors/Mentors';
import Admins from './components/startups/pages/Incubators/Admins/Admins';
import Documents from './components/startups/pages/Incubators/Documents/Documents';

// Context Providers
import { StartupProvider } from './context/StartupContext';
import { IncubatorProvider } from './context/IncubatorContext';

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
        <Route path="/" element={
          isAuthenticated() ? 
            (userRole === 'startup' ? <Navigate to="/startup/dashboard" replace /> : <Navigate to="/incubator/dashboard" replace />) 
            : <Navigate to="/landing" replace />
        } />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        {/* Startup Routes */}
        <Route path="/startup" element={
          <ProtectedRoute requiredRole="startup">
            <StartupProvider>
              <StartupSidebar />
            </StartupProvider>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StartupDashboard />} />
          <Route path="profile" element={<StartupProfile />}>
            <Route index element={<Navigate to="startup-info" replace />} />
            <Route path="startup-info" element={<StartupInfo />} />
            <Route path="awards" element={<StartupAwards />} />
            <Route path="funding" element={<StartupFunding />} />
            <Route path="team" element={<StartupTeam />} />
            <Route path="intellectual-properties" element={<StartupIntellectualProperties />} />
            <Route path="updates" element={<StartupUpdates />} />
          </Route>
          <Route path="incubators" element={<div>Incubators</div>}>
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
        </Route>

        {/* Incubator Routes */}
        <Route path="/incubator" element={
          <ProtectedRoute requiredRole="incubator">
            <IncubatorProvider>
              <IncubatorSidebar />
            </IncubatorProvider>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<IncubatorDashboard />} />
          <Route path="profile" element={<IncubatorProfile />}>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<IncubatorInfo />} />
            <Route path="team" element={<IncubatorTeam />} />
            <Route path="partners" element={<IncubatorPartners />} />
            <Route path="institute" element={<IncubatorInstitute />} />
            <Route path="infrastructure" element={<IncubatorInfrastructure />} />
            <Route path="awards" element={<IncubatorAwards />} />
          </Route>
          <Route path="programs" element={<div>Programs</div>} />
          <Route path="startups" element={<div>Startups</div>} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={
          isAuthenticated() ? 
            (userRole === 'startup' ? <Navigate to="/startup/dashboard" replace /> : <Navigate to="/incubator/dashboard" replace />)
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
