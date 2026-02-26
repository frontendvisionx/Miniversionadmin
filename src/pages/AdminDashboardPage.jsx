/**
 * Admin Dashboard Page
 * Main dashboard for admin users
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, Badge } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { adminAuthAPI } from '../services/api.js';
import {
  BarChart3,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Plus,
  UserCheck,
} from 'lucide-react';
import { ROLES } from '../config/constants.js';
import { formatDate } from '../utils/helpers.js';
import { COLORS, GRADIENTS } from '../hooks/useColors.js';

const AdminDashboardPage = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSuperAdmin()) {
      fetchAdminCount();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const fetchAdminCount = async () => {
    try {
      const response = await adminAuthAPI.getAllAdmins();
      if (response.success) {
        setAdminCount(response.data?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch admin count:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div 
          className="rounded-xl p-8 text-white shadow-lg"
          style={{ background: GRADIENTS.secondary }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
          <p className="text-admin-100">
            You are logged in as <strong>{user?.role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'Admin'}</strong>
          </p>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role Card */}
            <Card className="p-6 border-l-4" shadow="md" hoverable style={{ borderLeftColor: COLORS.secondaryMain }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Your Role</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {user?.role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.secondaryMain }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                {user?.role === ROLES.SUPER_ADMIN
                  ? 'Full system access and admin management'
                  : 'Standard admin access'}
              </p>
            </Card>

            {/* Status Card */}
            <Card className="p-6 border-l-4" shadow="md" hoverable style={{ borderLeftColor: COLORS.secondaryMain }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Account Status</p>
                  <p className="text-2xl font-bold text-neutral-900">Active</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.secondaryMain }}
                >
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">Your account is active and operational</p>
            </Card>

            {/* Last Login Card */}
            <Card className="p-6 border-l-4" shadow="md" hoverable style={{ borderLeftColor: COLORS.warning }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: COLORS.warning }}>Last Login</p>
                  <p className="text-lg font-bold text-neutral-900">Today</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.warning }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                {user?.lastLogin ? formatDate(user.lastLogin) : 'First login'}
              </p>
            </Card>

            {/* Admin Count Card (Super Admin Only) */}
            {isSuperAdmin() && (
              <Card className="p-6 border-l-4" shadow="md" hoverable style={{ borderLeftColor: COLORS.secondaryMain }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Total Admins</p>
                    <p className="text-2xl font-bold text-neutral-900">{adminCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.secondaryMain }}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">Admins created by you</p>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions - Super Admin */}
        {isSuperAdmin() && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Admin Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Admin Action */}
              <Card
                className="p-6 cursor-pointer hover:shadow-xl transition-all border-l-4"
                shadow="md"
                onClick={() => navigate('/admin/create-admin')}
                style={{ borderLeftColor: COLORS.secondaryMain }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                      <Plus className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
                      Create New Admin
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      Add a new administrator account to the system with custom permissions.
                    </p>
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                      style={{ backgroundColor: COLORS.secondaryMain }}
                    >
                      <Plus className="w-4 h-4" />
                      Create Admin
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.secondaryMain }}>
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              {/* View Admin List Action */}
              <Card
                className="p-6 cursor-pointer hover:shadow-xl transition-all border-l-4"
                shadow="md"
                onClick={() => navigate('/admin/admins')}
                style={{ borderLeftColor: COLORS.secondaryMain }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
                      View All Admins
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      See a list of all administrators in the system with their details and status.
                    </p>
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                      style={{ backgroundColor: COLORS.secondaryMain }}
                    >
                      <Users className="w-4 h-4" />
                      View List
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.secondaryMain }}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Secure Authentication */}
            <Card className="p-6" shadow="sm">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.info}20` }}
              >
                <Shield className="w-6 h-6" style={{ color: COLORS.info }} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Secure Authentication</h3>
              <p className="text-neutral-600 text-sm">
                JWT-based authentication with encrypted passwords and secure session management.
              </p>
            </Card>

            {/* Role-Based Access */}
            <Card className="p-6" shadow="sm">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.success}20` }}
              >
                <UserCheck className="w-6 h-6" style={{ color: COLORS.success }} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Role-Based Access</h3>
              <p className="text-neutral-600 text-sm">
                Different permission levels for Super Admin and regular Admin roles.
              </p>
            </Card>

            {/* Activity Tracking */}
            <Card className="p-6" shadow="sm">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.warning}20` }}
              >
                <Clock className="w-6 h-6" style={{ color: COLORS.warning }} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Activity Tracking</h3>
              <p className="text-neutral-600 text-sm">
                Monitor last login times and other admin activities for security.
              </p>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="p-6 bg-admin-50 border-2 border-admin-200" shadow="sm">
          <h3 className="text-lg font-bold text-admin-900 mb-2 flex items-center gap-2">
            <span>💡</span> Need Help?
          </h3>
          <p className="text-admin-700 text-sm mb-4">
            This is the admin panel for the Mini application. You can create and manage administrator accounts,
            but only if you are logged in as a Super Admin.
          </p>
          {isSuperAdmin() ? (
            <p className="text-admin-700 text-sm font-medium">
              ✓ You have Super Admin access and can create new admin accounts.
            </p>
          ) : (
            <p className="text-admin-700 text-sm font-medium">
              ℹ️ You have regular Admin access. Contact a Super Admin to create new administrator accounts.
            </p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
