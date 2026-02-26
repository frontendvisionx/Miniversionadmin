/**
 * Admin List Page
 * Super Admin only - View all administrators
 */

import React, { useState, useEffect } from 'react';
import { adminAuthAPI } from '../services/api.js';
import { Card, Alert, Badge } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { Users, Plus, Trash2, Eye, Calendar } from 'lucide-react';
import { formatDate, getInitials, truncate } from '../utils/helpers.js';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminAuthAPI.getAllAdmins();

      if (response.success) {
        setAdmins(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch admins');
      }
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch admins';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Admin Details Modal
  const AdminDetailsModal = ({ admin, onClose }) => {
    if (!admin) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md" shadow="lg">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ backgroundColor: COLORS.secondaryMain }}>
                  {getInitials(admin.name)}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{admin.name}</h3>
                  <p className="text-sm text-neutral-500">{admin.username}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-500">Email</label>
                <p className="text-sm text-neutral-900 break-all">{admin.email}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">Password</label>
                <p className="text-sm text-neutral-900 font-mono">{admin.password || 'Not available'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">Role</label>
                <div className="mt-1">
                  <Badge variant={admin.role === 'super_admin' ? 'primary' : 'neutral'}>
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">Status</label>
                <div className="mt-1">
                  <Badge variant={admin.isActive ? 'success' : 'error'}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500">Created</label>
                <p className="text-sm text-neutral-900">{formatDate(admin.createdAt)}</p>
              </div>

              {admin.lastLogin && (
                <div>
                  <label className="text-xs font-medium text-neutral-500">Last Login</label>
                  <p className="text-sm text-neutral-900">{formatDate(admin.lastLogin)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Users className="w-8 h-8" style={{ color: COLORS.secondaryMain }} />
              Admin Management
            </h1>
            <p className="text-neutral-600 mt-2">
              View and manage all administrator accounts in the system.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => (window.location.href = '/admin/create-admin')}
            style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
            className="hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Create New Admin
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: COLORS.secondaryMain + '20' }}>
              <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.secondaryMain + '40', borderTopColor: COLORS.secondaryMain }}></div>
            </div>
            <p className="font-semibold" style={{ color: COLORS.secondaryMain }}>Loading administrators...</p>
          </Card>
        ) : admins.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Admin Found</h3>
            <p className="text-neutral-600 mb-6">
              You haven't created any administrator accounts yet.
            </p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = '/admin/create-admin')}
              style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              className="hover:opacity-90"
            >
              Create First Admin
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.secondaryMain }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Total Admins</p>
                <p className="text-3xl font-bold text-neutral-900">{admins.length}</p>
              </Card>
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.secondaryMain }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Active Admins</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.secondaryMain }}>
                  {admins.filter((a) => a.isActive).length}
                </p>
              </Card>
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.error }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.error }}>Inactive Admins</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.error }}>
                  {admins.filter((a) => !a.isActive).length}
                </p>
              </Card>
            </div>

            {/* Admin Table */}
            <Card className="p-0 overflow-hidden" shadow="md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2" style={{ backgroundColor: COLORS.secondaryMain + '15', borderBottomColor: COLORS.secondaryMain }}>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white" style={{ backgroundColor: COLORS.secondaryMain }}>
                              {getInitials(admin.name)}
                            </div>
                            <span className="font-semibold text-neutral-900">{admin.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-700 font-medium">{admin.username}</td>
                        <td className="px-6 py-4 text-neutral-700 text-sm font-medium">
                          {truncate(admin.email, 25)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={admin.isActive ? 'success' : 'error'}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-neutral-700 text-sm font-medium">
                          {formatDate(admin.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAdmin(admin)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: COLORS.secondaryMain + '20', color: COLORS.secondaryMain }}
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <AdminDetailsModal
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminListPage;
