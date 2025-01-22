import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';
import StartupLanding from './pages/StartupLanding';
import IncubatorLanding from './pages/IncubatorLanding';
import StartupProfile from './components/startups/components/StartupProfile/StartupProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/startup-landing" element={<StartupLanding />} />
          <Route path="/incubator-landing" element={<IncubatorLanding />} />
          <Route path="/startup-profile" element={<StartupProfile />} />
          <Route path="/" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
