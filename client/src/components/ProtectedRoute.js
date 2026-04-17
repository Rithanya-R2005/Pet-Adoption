import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isUser } from '../utils/auth';

const ProtectedRoute = ({ children, requireAuth: needsAuth = false, requireAdmin: needsAdmin = false, requireUser: needsUser = false }) => {
  // Check if user is authenticated
  if (needsAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs admin privileges
  if (needsAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user needs regular user privileges
  if (needsUser && !isUser()) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
