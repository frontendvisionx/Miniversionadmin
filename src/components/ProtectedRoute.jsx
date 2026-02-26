/**
 * Protected Route Component
 * Restricts access based on authentication status and permissions
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../config/constants.js';

/**
 * ProtectedRoute - Requires authentication
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-admin-100 mb-4">
            <div className="w-8 h-8 border-4 border-admin-300 border-t-admin-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-admin-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * SuperAdminRoute - Requires Super Admin role
 */
export const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-admin-100 mb-4">
            <div className="w-8 h-8 border-4 border-admin-300 border-t-admin-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-admin-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/admin/vendor-analytics" replace />;
  }

  return children;
};

/**
 * AdminRoute - Requires Admin or Super Admin role
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-admin-100 mb-4">
            <div className="w-8 h-8 border-4 border-admin-300 border-t-admin-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-admin-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * PublicRoute - Redirect authenticated users away
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-admin-100 mb-4">
            <div className="w-8 h-8 border-4 border-admin-300 border-t-admin-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-admin-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return <Navigate to="/admin/vendor-analytics" replace />;
  }

  return children;
};

export default {
  ProtectedRoute,
  SuperAdminRoute,
  AdminRoute,
  PublicRoute,
};
