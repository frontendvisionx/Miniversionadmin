/**
 * Admin Settings Page
 * Admin profile and settings management
 */

import React, { useState } from 'react';
import { Card, Alert } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Settings, User, Mail } from 'lucide-react';
import { getInitials } from '../utils/helpers.js';
import { COLORS } from '../hooks/useColors.js';

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <Settings className="w-8 h-8" style={{ color: COLORS.adminMain }} />
            Settings & Profile
          </h1>
          <p className="text-neutral-600 mt-2">
            Manage your admin account settings and preferences.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Success"
              message={success}
              onClose={() => setSuccess('')}
            />
          </div>
        )}

        {/* Profile Card */}
        <Card className="p-8" shadow="md">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Profile Information</h2>
            {!editMode && (
              <Button variant="outline" size="md" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-admin-100 rounded-full flex items-center justify-center text-admin-700 font-bold text-2xl">
              {getInitials(user?.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">{user?.name}</h3>
              <p className="text-neutral-600">@{user?.username}</p>
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-600 mb-2 block">
                    Full Name
                  </label>
                  <p className="text-neutral-900 font-medium">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600 mb-2 block">
                    Username
                  </label>
                  <p className="text-neutral-900 font-medium">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600 mb-2 block">
                    Email
                  </label>
                  <p className="text-neutral-900 font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-600 mb-2 block">
                    Role
                  </label>
                  <p className="text-neutral-900 font-medium">
                    {user?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  defaultValue={user?.name}
                  disabled
                  icon={User}
                />
                <Input
                  label="Username"
                  type="text"
                  defaultValue={user?.username}
                  disabled
                  icon={User}
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  icon={Mail}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setEditMode(false);
                    setSuccess('Profile updated successfully!');
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Security Card */}
        <Card className="p-8" shadow="md">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Security Settings</h2>

          <div className="space-y-6">
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Change Password</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Update your password to keep your account secure.
              </p>
              <Button variant="outline">Change Password</Button>
            </div>

            <div className="pb-6 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Add an extra layer of security to your account.
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">Active Sessions</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Manage your active login sessions across devices.
              </p>
              <Button variant="outline">View Sessions</Button>
            </div>
          </div>
        </Card>

        {/* Preferences Card */}
        <Card className="p-8" shadow="md">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-600">Receive email updates about admin activities</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Login Alerts</p>
                <p className="text-sm text-neutral-600">Get notified when your account is accessed</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 border-2 border-red-200 bg-red-50" shadow="md">
          <h2 className="text-2xl font-bold text-red-900 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <div className="pb-4 border-b border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
              <p className="text-sm text-red-700 mb-4">
                This action cannot be undone. Please be certain before deleting your account.
              </p>
              <Button variant="danger" size="md">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
