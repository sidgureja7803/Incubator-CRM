import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from './utils/queryClient';

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
import StartupTeam from './components/startups/pages/StartupProfile/StartupTeam/StartupTeam';

import StartupIntellectualProperties from './components/startups/pages/StartupProfile/IntelluctualProperties/IntelluctualProperties';
import StartupUpdates from './components/startups/pages/StartupProfile/Updates/Updates';
import MyIncubators from './components/startups/pages/Incubators/MyIncubators/MyIncubators';
import ApplyIncubation from './components/startups/pages/Incubators/ApplyIncubation/ApplyIncubation';
import Incubators from './components/startups/pages/Incubators/Incubators';
import Cohorts from './components/startups/pages/Incubators/Cohorts/Cohorts';
import ProgramDetails from './components/startups/pages/Incubators/ProgramDetails/ProgramDetails';

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
import IncubatorPrograms from './components/incubators/pages/Programs/Programs';
import IncubatorStartups from './components/incubators/pages/Startups/Startup';

// Startup Detail View components
import StartupDetailView from './components/incubators/pages/Startups/Startups/StartupDetailView';
import StartupBasicInfo from './components/incubators/pages/Startups/Info/Info';
import IncubatedStartupAwards from './components/incubators/pages/Startups/Awards/Awards';
import IncubatedStartupFunding from './components/incubators/pages/Startups/Funding/Funding';
import IncubatedStartupTeam from './components/incubators/pages/Startups/Team/StartupTeam';
import IncubatedStartupProperties from './components/incubators/pages/Startups/IP/IntellectualProperties';
import IncubatedStartupUpdates from './components/incubators/pages/Startups/Updates/Updates';
import IncubatedStartupFees from './components/incubators/pages/Startups/Fees/Fees';

// Cohort Components
import Tasks from './components/startups/pages/Incubators/Cohorts/Tasks/Tasks';
import Members from './components/startups/pages/Incubators/Cohorts/Members/Members';
import Mentors from './components/startups/pages/Incubators/Cohorts/Mentors/Mentors';
import Admins from './components/startups/pages/Incubators/Cohorts/Admins/Admins';
import Documents from './components/startups/pages/Incubators/Cohorts/Documents/Documents';

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
    <QueryClientProvider client={queryClient}>
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
            <Route path="incubators" element={<Incubators />}>
              <Route index element={<Navigate to="my-incubators" replace />} />
              <Route path="my-incubators" element={<MyIncubators />} />
              <Route path="apply-incubation" element={<ApplyIncubation />} />
              <Route path=":incubatorId/programs" element={<ProgramDetails />} />
              <Route path=":incubatorId/programs/:programId" element={<ProgramDetails />} />
              <Route path=":incubatorId/programs/:programId/cohorts/:cohortId/*" element={<Cohorts />} />
            </Route>
            <Route path="accelerators" element={<div>Accelerators</div>} />
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
            <Route path="programs" element={<IncubatorPrograms/>} />
            <Route path="startups/*" element={<IncubatorStartups />} />
            
            {/* Add explicit routes for startup detail view with nested tabs */}
            <Route path="startups/incubated/:startupId" element={<StartupDetailView />}>
              <Route index element={<Navigate to="info" replace />} />
              <Route path="info" element={<StartupBasicInfo />} />
              <Route path="awards" element={<IncubatedStartupAwards />} />
              <Route path="funding" element={<IncubatedStartupFunding />} />
              <Route path="team" element={<IncubatedStartupTeam />} />
              <Route path="properties" element={<IncubatedStartupProperties />} />
              <Route path="updates" element={<IncubatedStartupUpdates />} />
              <Route path="fee" element={<IncubatedStartupFees />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={
            isAuthenticated() ? 
              (userRole === 'startup' ? <Navigate to="/startup/dashboard" replace /> : <Navigate to="/incubator/dashboard" replace />)
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
