/**
 * Component Index/Barrel Export
 * Centralized component exports for easier imports
 */

// ============================================
// UI Components
// ============================================
export { default as Button } from './Button.jsx';
export { default as Input } from './Input.jsx';
export { Card, Alert, Badge, Separator } from './UI.jsx';

// ============================================
// Layout Components
// ============================================
export { default as AdminLayout } from './AdminLayout.jsx';
export { Sidebar, MobileMenuToggle } from './Sidebar.jsx';

// ============================================
// Route Protection Components
// ============================================
export {
  ProtectedRoute,
  SuperAdminRoute,
  AdminRoute,
  PublicRoute,
} from './ProtectedRoute.jsx';
