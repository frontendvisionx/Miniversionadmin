/**
 * Create Admin Page
 * Super Admin only - Create new administrator accounts
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm.js';
import { adminAuthAPI } from '../services/api.js';
import { Card, Alert } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { SUCCESS_MESSAGES } from '../config/constants.js';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';

const CreateAdminPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    { name: '', username: '', email: '', password: '' },
    async (formValues) => {
      setError('');
      setSuccess('');

      try {
        const response = await adminAuthAPI.createAdmin({
          name: formValues.name,
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        });

        if (response.success) {
          setSuccess(SUCCESS_MESSAGES.ADMIN_CREATED);
          toast.success(SUCCESS_MESSAGES.ADMIN_CREATED);
          resetForm();
          
          // Redirect to admin list after 2 seconds
          setTimeout(() => {
            navigate('/admin/admins');
          }, 2000);
        } else {
          setError(response.message || 'Failed to create admin');
        }
      } catch (err) {
        const errorMessage = err?.message || 'Failed to create admin';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
            <UserPlus className="w-8 h-8" style={{ color: COLORS.adminMain }} />
            Create New Admin
          </h1>
          <p className="text-neutral-600 mt-2">
            Add a new administrator to the system. Only Super Admin can perform this action.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8" shadow="md">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Input
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter full name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                icon={User}
                required
                hint="Use first and last name (minimum 2 characters)"
              />
            </div>

            {/* Username */}
            <div>
              <Input
                name="username"
                type="text"
                label="Username"
                placeholder="Enter username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.username}
                touched={touched.username}
                icon={User}
                required
                hint="3-20 characters, letters, numbers, underscores, or hyphens"
              />
            </div>

            {/* Email */}
            <div>
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                icon={Mail}
                required
                hint="Used for account recovery and notifications"
              />
            </div>

            {/* Password */}
            <div>
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                icon={Lock}
                required
                hint="Minimum 6 characters"
              />
            </div>

            {/* Info Box */}
            <div className="rounded-lg p-5 border-l-4" style={{ backgroundColor: COLORS.adminMain + '15', borderLeftColor: COLORS.adminMain }}>
              <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.adminMain }}>
                <span className="text-lg">ℹ️</span>
                Admin Information:
              </p>
              <ul className="text-sm space-y-2 list-none">
                <li className="flex items-start gap-2 text-neutral-700">
                  <span style={{ color: COLORS.adminMain }}>✓</span>
                  The new admin can access the dashboard with the credentials
                </li>
                <li className="flex items-start gap-2 text-neutral-700">
                  <span style={{ color: COLORS.adminMain }}>✓</span>
                  Only Super Admin can create new admin accounts
                </li>
                <li className="flex items-start gap-2 text-neutral-700">
                  <span style={{ color: COLORS.adminMain }}>✓</span>
                  Regular admins cannot create other admins
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ backgroundColor: COLORS.adminMain }}
              >
                Create Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/admin/vendor-analytics')}
                disabled={isSubmitting}
                style={{ borderColor: COLORS.adminMain, color: COLORS.adminMain }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateAdminPage;
