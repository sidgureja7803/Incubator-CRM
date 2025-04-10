import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role') || sessionStorage.getItem('user_role');

  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 