/**
 * Application Constants
 * Central constants for the admin panel
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  ADMIN: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    PROFILE: '/admin/auth/me',
    CREATE_ADMIN: '/admin/auth/create-admin',
    GET_ALL_ADMINS: '/admin/auth/admins',
  },
  BUSINESS: {
    GET_ALL: '/admin/business-types',
    GET_BY_ID: (id) => `/admin/business-types/${id}`,
    CREATE: '/admin/business-types',
    UPDATE: (id) => `/admin/business-types/${id}`,
    DELETE: (id) => `/admin/business-types/${id}`,
    TOGGLE_PUBLISH: (id) => `/admin/business-types/${id}/toggle-publish`,
  },
  FORM_TEMPLATES: {
    GET_ALL: '/admin/form-templates',
    GET_BY_ID: (id) => `/admin/form-templates/${id}`,
  },
  AI_SUGGESTIONS: {
    CHAT: '/admin/ai-suggestions/chat',
    VALIDATE: '/admin/ai-suggestions/validate',
    EXPAND_CATEGORIES: '/admin/ai-suggestions/expand-categories',
    TRENDING: '/admin/ai-suggestions/trending',
    HEALTH: '/admin/ai-suggestions/health',
  },
  VENDOR_SUBMISSIONS: {
    GET_ALL: '/admin/vendor-business-types/submissions',
    GET_PENDING: '/admin/vendor-business-types/submissions/pending',
    GET_EXPIRING: '/admin/vendor-business-types/submissions/expiring',
    GET_BY_ID: (id) => `/admin/vendor-business-types/submissions/${id}`,
    APPROVE: (id) => `/admin/vendor-business-types/submissions/${id}/approve`,
    REJECT: (id) => `/admin/vendor-business-types/submissions/${id}/reject`,
    DELETE: (id) => `/admin/vendor-business-types/submissions/${id}`,
    UPDATE_NOTES: (id) => `/admin/vendor-business-types/submissions/${id}/notes`,
    MARK_EXPIRED: '/admin/vendor-business-types/submissions/mark-expired',
    STATS: '/admin/vendor-business-types/stats',
    VENDOR_COUNTS: '/admin/vendor-business-types/vendor-counts',
  },
  SYSTEM_CONFIG: {
    GET_ALL: '/admin/system-config',
    GET_BY_KEY: (key) => `/admin/system-config/${key}`,
    CREATE: '/admin/system-config',
    UPDATE: (key) => `/admin/system-config/${key}`,
    DELETE: (key) => `/admin/system-config/${key}`,
    GET_BY_CATEGORY: (category) => `/admin/system-config/category/${category}`,
    INITIALIZE_DEFAULTS: '/admin/system-config/initialize-defaults',
    TOGGLE_VENDOR_SUBMISSIONS: '/admin/system-config/toggle-vendor-submissions',
    VENDOR_SUBMISSIONS_STATUS: '/admin/system-config/vendor-submissions-status',
  },
  VENDOR_ANALYTICS: {
    SUMMARY: '/admin/vendor-analytics/summary',
    BUSINESS_TYPES: '/admin/vendor-analytics/business-types',
    CATEGORIES: (businessTypeId) => `/admin/vendor-analytics/categories/${businessTypeId}`,
    SUBCATEGORIES: (businessTypeId, categoryId) => `/admin/vendor-analytics/subcategories/${businessTypeId}/${categoryId}`,
    VENDORS_LIST: '/admin/vendor-analytics/vendors',
    EXPORT: '/admin/vendor-analytics/export',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_auth_token',
  ADMIN_USER: 'admin_user',
  SIDEBAR_STATE: 'admin_sidebar_state',
};

// Role Types
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
};

// Admin Permissions
export const PERMISSIONS = {
  CREATE_ADMIN: 'createAdmin',
  VIEW_ADMINS: 'viewAdmins',
  EDIT_ADMIN: 'editAdmin',
  DELETE_ADMIN: 'deleteAdmin',
  MANAGE_USERS: 'users',
  MANAGE_VENDORS: 'vendors',
  MANAGE_AFFILIATES: 'affiliates',
  MANAGE_TRANSACTIONS: 'transactions',
  MANAGE_SETTINGS: 'settings',
};

// Default Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  ADMIN_CREATED: 'Admin created successfully.',
  ADMIN_UPDATED: 'Admin updated successfully.',
  ADMIN_DELETED: 'Admin deleted successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  BUSINESS_CREATED: 'Business type created successfully.',
  BUSINESS_UPDATED: 'Business type updated successfully.',
  BUSINESS_DELETED: 'Business type deleted successfully.',
};

// Form Validation
export const VALIDATION_RULES = {
  USERNAME: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Username must be 3-20 characters with letters, numbers, underscores, or hyphens',
  },
  PASSWORD: {
    minLength: 6,
    message: 'Password must be at least 6 characters long',
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  FULLNAME: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name must contain only letters, spaces, hyphens, or apostrophes',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
};

// Request Timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ROLES,
  PERMISSIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  PAGINATION,
  REQUEST_TIMEOUT,
};
