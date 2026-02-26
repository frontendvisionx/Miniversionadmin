/**
 * Main App Component
 * Setup routing and authentication
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import {
  ProtectedRoute,
  SuperAdminRoute,
  PublicRoute,
} from './components/ProtectedRoute.jsx';

// Pages
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import CreateAdminPage from './pages/CreateAdminPage.jsx';
import AdminListPage from './pages/AdminListPage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';
import BusinessListPage from './pages/BusinessListPage.jsx';
import CreateBusinessPage from './pages/CreateBusinessPage.jsx';
import VendorBusinessTypeSubmissions from './pages/VendorBusinessTypeSubmissions.jsx';
import VendorAnalytics from './pages/VendorAnalytics.jsx';

/**
 * Routes Component
 * All route definitions here - guaranteed to be within AuthProvider context
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/admin/create-admin"
        element={
          <SuperAdminRoute>
            <CreateAdminPage />
          </SuperAdminRoute>
        }
      />

      <Route
        path="/admin/admins"
        element={
          <SuperAdminRoute>
            <AdminListPage />
          </SuperAdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Business Management Routes */}
      <Route
        path="/admin/businesses"
        element={
          <ProtectedRoute>
            <BusinessListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/business/create"
        element={
          <ProtectedRoute>
            <CreateBusinessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/business/edit/:id"
        element={
          <ProtectedRoute>
            <CreateBusinessPage />
          </ProtectedRoute>
        }
      />

      {/* Vendor Submissions Management */}
      <Route
        path="/admin/vendor-submissions"
        element={
          <ProtectedRoute>
            <VendorBusinessTypeSubmissions />
          </ProtectedRoute>
        }
      />

      {/* Vendor Analytics */}
      <Route
        path="/admin/vendor-analytics"
        element={
          <ProtectedRoute>
            <VendorAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/admin/vendor-analytics" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/vendor-analytics" replace />} />
      <Route path="*" element={<Navigate to="/admin/vendor-analytics" replace />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
