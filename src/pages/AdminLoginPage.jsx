/**
 * Admin Login Page
 * Super admin and admin authentication
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { Card, Alert } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { Mail, Lock } from 'lucide-react';
import { COLORS, GRADIENTS } from '../hooks/useColors.js';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuth();
  const [localError, setLocalError] = useState('');

  // Log errors persistently
  useEffect(() => {
    if (localError) {
      console.error('🔴 LOGIN ERROR PERSISTED:', localError);
      console.trace('Error trace:');
    }
  }, [localError]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { username: '', password: '' },
    async (values) => {
      console.log('📝 Form submitted with values:', values);
      console.log('🔍 Username:', values.username);
      console.log('🔍 Password length:', values.password?.length);
      
      setLocalError('');
      setError(null); // Clear context error
      
      const result = await login(values.username, values.password);

      console.log('📊 Login result:', result);
      console.log('📊 Success:', result.success);
      console.log('📊 Message:', result.message);
      
      if (result.success) {
        console.log('✅ Login successful, redirecting to vendor analytics');
        setTimeout(() => {
          navigate('/admin/vendor-analytics');
        }, 1000);
      } else {
        const errorMsg = result.message || 'Login failed. Please check your credentials.';
        console.error('❌ LOGIN FAILED:', errorMsg);
        console.error('❌ Full result:', JSON.stringify(result, null, 2));
        setLocalError(errorMsg);
        // Keep error visible
        setTimeout(() => {
          console.error('🔴 ERROR STILL ACTIVE:', errorMsg);
        }, 100);
      }
    }
  );

  // Custom handleChange that doesn't clear the login error
  const handleFieldChange = (e) => {
    // Clear errors only when user starts typing, not the localError
    handleChange(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${COLORS.adminMain}15, ${COLORS.adminLight}20)` }}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl mb-4 transform hover:scale-105 transition-transform"
            style={{ background: GRADIENTS.primary }}
          >
            <span className="text-4xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.adminMain }}>Admin Panel</h1>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-t-4" shadow="lg" style={{ borderTopColor: COLORS.adminMain }}>
          {/* Error Alert */}
          {(localError || error) && (
            <div className="mb-6">
              <Alert
                type="error"
                title="Login Failed"
                message={localError || error}
                onClose={() => {
                  setLocalError('');
                  setError(null);
                }}
              />
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <Input
                name="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={errors.username}
                touched={touched.username}
                icon={Mail}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                icon={Lock}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{ backgroundColor: COLORS.adminMain }}
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
