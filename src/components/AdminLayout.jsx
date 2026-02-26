/**
 * Admin Layout Component
 * Main layout wrapper for all admin pages
 */

import React, { useState } from 'react';
import { Sidebar, MobileMenuToggle } from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocalStorage } from '../hooks/useForm.js';
import { STORAGE_KEYS, ROLES } from '../config/constants.js';
import { COLORS } from '../hooks/useColors.js';

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-md" style={{ borderBottom: `3px solid ${COLORS.adminMain}` }}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <MobileMenuToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
              <h1 className="text-xl font-bold hidden sm:block" style={{ color: COLORS.adminMain }}>
                Admin Dashboard
              </h1>
            </div>
            
            {/* User Profile in Navbar */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.adminMain + '15' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.adminMain }}>
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-neutral-900">
                  {user?.name || 'Super Admin'}
                </p>
                <p className="text-xs font-semibold" style={{ color: COLORS.adminMain }}>
                  {user?.role === ROLES.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
