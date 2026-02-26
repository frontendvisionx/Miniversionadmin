/**
 * Custom Hooks
 * Reusable logic for components
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { VALIDATION_RULES } from '../config/constants.js';

/**
 * Hook - useForm
 * Manages form state and validation
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      console.log(`✅ Cleared error for field: ${name}`);
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const newErrors = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }, [values]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      // Trim all string values before validation and submission
      const trimmedValues = Object.keys(values).reduce((acc, key) => {
        acc[key] = typeof values[key] === 'string' ? values[key].trim() : values[key];
        return acc;
      }, {});
      
      console.log('🔍 Form submit triggered, current values:', trimmedValues);
      setIsSubmitting(true);

      // Validate all fields with trimmed values
      const newErrors = validateForm(trimmedValues);
      console.log('🔍 Validation result:', JSON.stringify(newErrors, null, 2));
      
      setErrors(newErrors);
      setTouched(
        Object.keys(trimmedValues).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );

      if (Object.keys(newErrors).length === 0) {
        console.log('✅ No validation errors, submitting form with trimmed values:', trimmedValues);
        try {
          await onSubmit(trimmedValues);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      } else {
        console.warn('❌ Validation errors found:', JSON.stringify(newErrors, null, 2));
      }

      setIsSubmitting(false);
    },
    [values, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};

/**
 * Validate single field
 */
export const validateField = (fieldName, value) => {
  const errors = {};
  
  // Trim whitespace for validation
  const trimmedValue = typeof value === 'string' ? value.trim() : value;

  if (!trimmedValue || trimmedValue === '') {
    errors[fieldName] = `${fieldName} is required`;
    return errors;
  }

  switch (fieldName) {
    case 'username':
      if (trimmedValue.length < VALIDATION_RULES.USERNAME.minLength) {
        errors[fieldName] = `Username must be at least ${VALIDATION_RULES.USERNAME.minLength} characters`;
      } else if (trimmedValue.length > VALIDATION_RULES.USERNAME.maxLength) {
        errors[fieldName] = `Username must not exceed ${VALIDATION_RULES.USERNAME.maxLength} characters`;
      } else if (!VALIDATION_RULES.USERNAME.pattern.test(trimmedValue)) {
        errors[fieldName] = VALIDATION_RULES.USERNAME.message;
      }
      break;

    case 'password':
      if (trimmedValue.length < VALIDATION_RULES.PASSWORD.minLength) {
        errors[fieldName] = VALIDATION_RULES.PASSWORD.message;
      }
      break;

    case 'email':
      if (!VALIDATION_RULES.EMAIL.pattern.test(trimmedValue)) {
        errors[fieldName] = VALIDATION_RULES.EMAIL.message;
      }
      break;

    case 'name':
    case 'fullName':
      if (trimmedValue.length < VALIDATION_RULES.FULLNAME.minLength) {
        errors[fieldName] = `Name must be at least ${VALIDATION_RULES.FULLNAME.minLength} characters`;
      } else if (trimmedValue.length > VALIDATION_RULES.FULLNAME.maxLength) {
        errors[fieldName] = `Name must not exceed ${VALIDATION_RULES.FULLNAME.maxLength} characters`;
      } else if (!VALIDATION_RULES.FULLNAME.pattern.test(trimmedValue)) {
        errors[fieldName] = VALIDATION_RULES.FULLNAME.message;
      }
      break;

    default:
      break;
  }

  return errors;
};

/**
 * Validate entire form
 */
export const validateForm = (values) => {
  const errors = {};

  Object.keys(values).forEach((key) => {
    const fieldErrors = validateField(key, values[key]);
    Object.assign(errors, fieldErrors);
  });

  return errors;
};

/**
 * Hook - useDebounce
 * Debounce values for search, filter, etc.
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook - useLocalStorage
 * Persist state in localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

export default {
  useForm,
  validateField,
  validateForm,
  useDebounce,
  useLocalStorage,
};
