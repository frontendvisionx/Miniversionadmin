/**
 * Utility Functions
 * Common helper functions
 */

/**
 * Format date to readable format
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '-';
  
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return d.toLocaleDateString('en-US', options);
};

/**
 * Format time to readable format
 */
export const formatTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase to Title Case
 */
export const camelToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

/**
 * Truncate string
 */
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'Copied to clipboard' };
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return { success: false, message: 'Failed to copy' };
  }
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj || {}).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calculate reading time
 */
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Convert file size to readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Sort array of objects
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupByKey = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Filter array by multiple conditions
 */
export const filterByConditions = (array, conditions) => {
  return array.filter((item) => {
    return Object.keys(conditions).every((key) => {
      const conditionValue = conditions[key];
      if (typeof conditionValue === 'function') {
        return conditionValue(item[key]);
      }
      return item[key] === conditionValue;
    });
  });
};

export default {
  formatDate,
  formatTime,
  capitalize,
  camelToTitle,
  truncate,
  copyToClipboard,
  generateId,
  isEmpty,
  deepClone,
  calculateReadingTime,
  validateEmail,
  formatFileSize,
  getInitials,
  sortByKey,
  groupByKey,
  filterByConditions,
};
