import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role') || sessionStorage.getItem('user_role');

  console.log('Protected Route Check:', {
    isAuthenticated,
    userRole,
    requiredRole,
    hasLocalToken: !!localStorage.getItem('access_token'),
    hasSessionToken: !!sessionStorage.getItem('access_token'),
    hasLocalRole: !!localStorage.getItem('user_role'),
    hasSessionRole: !!sessionStorage.getItem('user_role')
  });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`Role mismatch: required ${requiredRole}, got ${userRole}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 