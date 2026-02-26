/**
 * Auth Context
 * Manages authentication state and user information
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminAuthAPI } from '../services/api.js';
import { STORAGE_KEYS, ROLES } from '../config/constants.js';

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Failed to parse stored user:', err);
          localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuthAPI.login(username, password);

      if (response.success) {
        const { token, admin } = response.data;

        // Store token and user
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(admin));

        setUser(admin);
        return { success: true, admin };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await adminAuthAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Check if user is super admin
  const isSuperAdmin = useCallback(() => {
    return user?.role === ROLES.SUPER_ADMIN;
  }, [user]);

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === ROLES.SUPER_ADMIN) return true;
    return user.permissions?.[permission] === true;
  }, [user]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isSuperAdmin,
    hasPermission,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom Hook - UseAuth
 * Access auth context in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
