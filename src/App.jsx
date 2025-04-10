import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import StartupRoutes from './routes/StartupRoutes';
import IncubatorRoutes from './routes/IncubatorRoutes';
import { IncubatorProvider } from './context/IncubatorContext';
import './App.css';

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  const userType = () => {
    return localStorage.getItem('user_role') || sessionStorage.getItem('user_role');
  };

  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    const type = userType();
    if (type === 'startup' && window.location.pathname.includes('/incubator')) {
      return <Navigate to="/startup/dashboard" replace />;
    }
    if (type === 'incubator' && window.location.pathname.includes('/startup')) {
      return <Navigate to="/incubator/dashboard" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/startup/*" element={
          <PrivateRoute>
            <StartupRoutes />
          </PrivateRoute>
        } />

        <Route path="/incubator/*" element={
          <PrivateRoute>
            <IncubatorProvider>
              <IncubatorRoutes />
            </IncubatorProvider>
          </PrivateRoute>
        } />

        <Route path="/" element={
          isAuthenticated() ? (
            <Navigate to={`/${userType()}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App; 