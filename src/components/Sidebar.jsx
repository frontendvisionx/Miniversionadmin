/**
 * Sidebar Navigation Component
 * Main navigation menu for admin dashboard
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../config/constants.js';
import { Menu, X, LogOut, Users, Building2, UserPlus, ClipboardCheck, BarChart3 } from 'lucide-react';
import { COLORS, GRADIENTS } from '../hooks/useColors.js';

const menuItems = [
  {
    label: 'Vendor Analytics',
    path: '/admin/vendor-analytics',
    icon: BarChart3,
    requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: 'Create Business',
    path: '/admin/businesses',
    icon: Building2,
    requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: 'Vendor Submissions',
    path: '/admin/vendor-submissions',
    icon: ClipboardCheck,
    requiredRole: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: 'Create Admin',
    path: '/admin/create-admin',
    icon: UserPlus,
    requiredRole: [ROLES.SUPER_ADMIN],
  },
  {
    label: 'Admin List',
    path: '/admin/admins',
    icon: Users,
    requiredRole: [ROLES.SUPER_ADMIN],
  },

];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter((item) =>
    item.requiredRole.includes(user?.role)
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-xl
          transform transition-transform duration-300 z-50
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ borderRight: `3px solid ${COLORS.adminMain}` }}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ background: GRADIENTS.primary }}
              >
                A
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">Admin</h1>
                <p className="text-xs text-neutral-500">Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isActive ? 'text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'}
                  `
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? COLORS.adminMain : 'transparent',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className="w-5 h-5" 
                        style={{ color: isActive ? 'white' : COLORS.adminMain }}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: `2px solid ${COLORS.adminMain}20` }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200"
            style={{ backgroundColor: COLORS.error + '15', color: COLORS.error }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.error;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.error + '15';
              e.currentTarget.style.color = COLORS.error;
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

/**
 * Mobile Menu Toggle Button
 */
export const MobileMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 rounded-lg transition-all hover:scale-110"
      style={{ backgroundColor: COLORS.adminMain + '20' }}
    >
      {isOpen ? (
        <X className="w-6 h-6" style={{ color: COLORS.adminMain }} />
      ) : (
        <Menu className="w-6 h-6" style={{ color: COLORS.adminMain }} />
      )}
    </button>
  );
};

export default {
  Sidebar,
  MobileMenuToggle,
};
