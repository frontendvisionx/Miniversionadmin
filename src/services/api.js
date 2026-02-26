/**
 * API Service
 * Centralized API communication module
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES, REQUEST_TIMEOUT } from '../config/constants.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Admin Authentication API Calls
 */
export const adminAuthAPI = {
  /**
   * Login admin
   * @param {string} username
   * @param {string} password
   */
  login: async (username, password) => {
    try {
      console.log('🚀 Login attempt:', { username, password });
      console.log('📍 API Endpoint:', API_BASE_URL + API_ENDPOINTS.ADMIN.LOGIN);
      
      const response = await apiClient.post(API_ENDPOINTS.ADMIN.LOGIN, {
        username,
        password,
      });
      
      console.log('✅ Login success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw handleAPIError(error);
    }
  },

  /**
   * Logout admin
   */
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN.LOGOUT);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get current admin profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.PROFILE);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Create new admin (Super Admin only)
   * @param {Object} adminData - { name, username, password, email }
   */
  createAdmin: async (adminData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, adminData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get all admins (Super Admin only)
   */
  getAllAdmins: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_ALL_ADMINS);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * Business Type Management API Calls
 */
export const businessAPI = {
  /**
   * Get all business types
   * @param {Object} params - { page, limit, search }
   */
  getAllBusinessTypes: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BUSINESS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get business type by ID
   * @param {string} id - Business type ID
   */
  getBusinessTypeById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BUSINESS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Create new business type
   * @param {FormData} formData - Form data with icons and business details
   */
  createBusinessType: async (formData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BUSINESS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Update business type
   * @param {string} id - Business type ID
   * @param {FormData} formData - Form data with icons and business details
   */
  updateBusinessType: async (id, formData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.BUSINESS.UPDATE(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Delete business type
   * @param {string} id - Business type ID
   */
  deleteBusinessType: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.BUSINESS.DELETE(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Toggle publish status of business type
   * @param {string} id - Business type ID
   */
  togglePublishBusiness: async (id) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.BUSINESS.TOGGLE_PUBLISH(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * Form Templates API Calls
 */
export const formTemplatesAPI = {
  /**
   * Get all form templates
   */
  getAllTemplates: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FORM_TEMPLATES.GET_ALL);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get template by ID
   * @param {string} id - Template ID
   */
  getTemplateById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FORM_TEMPLATES.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * AI Suggestions API Calls
 * Gemini-powered business type and category suggestions
 */
export const aiSuggestionsAPI = {
  /**
   * Get AI chat suggestions
   * @param {string} message - User message/query
   * @param {Array} conversationHistory - Previous messages for context
   */
  getChatSuggestions: async (message, conversationHistory = []) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTIONS.CHAT, {
        message,
        conversationHistory
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Validate a business idea
   * @param {string} businessIdea - Business type idea to validate
   */
  validateBusinessIdea: async (businessIdea) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTIONS.VALIDATE, {
        businessIdea
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get category expansion suggestions
   * @param {string} businessTypeId - ID of the business type
   * @param {string} businessTypeName - Name of the business type
   */
  expandCategories: async (businessTypeId, businessTypeName) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTIONS.EXPAND_CATEGORIES, {
        businessTypeId,
        businessTypeName
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Get trending business types
   */
  getTrendingBusinessTypes: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AI_SUGGESTIONS.TRENDING);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  /**
   * Check AI service health
   */
  checkHealth: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AI_SUGGESTIONS.HEALTH);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * Vendor Business Type Submissions API Calls
 * Admin review and management of vendor-submitted business types
 */
export const vendorSubmissionsAPI = {
  getAllSubmissions: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getPendingSubmissions: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.GET_PENDING, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getExpiringSubmissions: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.GET_EXPIRING);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getSubmissionById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  approveSubmission: async (id, data = {}) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VENDOR_SUBMISSIONS.APPROVE(id), data);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  rejectSubmission: async (id, data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VENDOR_SUBMISSIONS.REJECT(id), data);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  deleteSubmission: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.VENDOR_SUBMISSIONS.DELETE(id));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  updateAdminNotes: async (id, adminNotes) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.VENDOR_SUBMISSIONS.UPDATE_NOTES(id), { adminNotes });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.STATS);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getVendorCounts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_SUBMISSIONS.VENDOR_COUNTS);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * System Configuration API Calls
 * Manage global system settings
 */
export const systemConfigAPI = {
  getAllConfigs: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SYSTEM_CONFIG.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getConfigByKey: async (key) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SYSTEM_CONFIG.GET_BY_KEY(key));
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  updateConfig: async (key, data) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.SYSTEM_CONFIG.UPDATE(key), data);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  toggleVendorSubmissions: async (enabled, reason = '') => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.SYSTEM_CONFIG.TOGGLE_VENDOR_SUBMISSIONS, {
        enabled,
        reason
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getVendorSubmissionsStatus: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SYSTEM_CONFIG.VENDOR_SUBMISSIONS_STATUS);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * Vendor Analytics API Calls  
 * Get vendor statistics by business types, categories, and subcategories
 */
export const vendorAnalyticsAPI = {
  getSummary: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.SUMMARY);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getBusinessTypes: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.BUSINESS_TYPES, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCategories: async (businessTypeId, params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.CATEGORIES(businessTypeId), { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getSubcategories: async (businessTypeId, categoryId, params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.SUBCATEGORIES(businessTypeId, categoryId), { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getVendorsList: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.VENDORS_LIST, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  exportData: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VENDOR_ANALYTICS.EXPORT, { params });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};

/**
 * Error Handler
 * Standardizes error responses
 */
const handleAPIError = (error) => {
  let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
  let errorCode = 'SERVER_ERROR';

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    errorMessage = data?.message || data?.error || errorMessage;
    errorCode = data?.code || `ERROR_${status}`;

    switch (status) {
      case 400:
        errorMessage = data?.message || 'Invalid request';
        break;
      case 401:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 403:
        errorMessage = ERROR_MESSAGES.FORBIDDEN;
        break;
      case 404:
        errorMessage = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 409:
        errorMessage = data?.message || 'Resource conflict';
        break;
      case 500:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        break;
    }
  } else if (error.request) {
    // Request sent but no response
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    errorCode = 'NETWORK_ERROR';
  } else {
    // Error in request setup
    errorMessage = error.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return {
    message: errorMessage,
    code: errorCode,
    error: error,
  };
};

export default apiClient;
