import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashBoard from '../components/incubators/components/DashBoard/DashBoard';
import IncubatorInfo from '../components/incubators/pages/IncubatorProfile/IncubatorInfo/IncubatorInfo';
import Team from '../components/incubators/pages/IncubatorProfile/Team/Team';
import Partners from '../components/incubators/pages/IncubatorProfile/Partners/Partners';
import InstituteAssociated from '../components/incubators/pages/IncubatorProfile/InstituteAssociated/InstituteAssociated';
import Infrastructure from '../components/incubators/pages/IncubatorProfile/Infrastructure/Infrastructure';
import Awards from '../components/incubators/pages/IncubatorProfile/Awards/Awards';
import Programs from '../components/incubators/pages/Programs/Programs';
import Startups from '../components/incubators/pages/Startups/Startups';
import SideBar from '../components/incubators/pages/Sidebar/Sidebar';
import './IncubatorRoutes.css';

const IncubatorLayout = ({ children }) => {
  return (
    <div className="incubator-layout">
      <SideBar />
      <div className="incubator-content">
        {children}
      </div>
    </div>
  );
};

const IncubatorRoutes = () => {
  return (
    <Routes>
      {/* Default route redirects to dashboard */}
      <Route path="/" element={<Navigate to="/incubator/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <IncubatorLayout>
          <DashBoard />
        </IncubatorLayout>
      } />

      {/* Profile Routes */}
      <Route path="/profile/*" element={
        <IncubatorLayout>
          <Routes>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<IncubatorInfo />} />
            <Route path="team" element={<Team />} />
            <Route path="partners" element={<Partners />} />
            <Route path="institute" element={<InstituteAssociated />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="awards" element={<Awards />} />
          </Routes>
        </IncubatorLayout>
      } />

      {/* Programs */}
      <Route path="/programs" element={
        <IncubatorLayout>
          <Programs />
        </IncubatorLayout>
      } />

      {/* Startups */}
      <Route path="/startups" element={
        <IncubatorLayout>
          <Startups />
        </IncubatorLayout>
      } />

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/incubator/dashboard" replace />} />
    </Routes>
  );
};

export default IncubatorRoutes; 