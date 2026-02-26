/**
 * Button Component
 * Reusable button with multiple variants
 */

import React from 'react';
import { COLORS, BORDER_RADIUS } from '../config/theme.js';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      loading = false,
      icon: Icon = null,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
      primary: `text-white hover:opacity-90 focus:ring-admin-400 shadow-md hover:shadow-lg active:opacity-80 active:shadow-sm`,
      secondary: `bg-admin-100 text-admin-700 hover:bg-admin-200 focus:ring-admin-300 shadow-sm`,
      outline: `border-2 text-admin-600 hover:bg-admin-50 focus:ring-admin-400`,
      danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 shadow-md hover:shadow-lg active:bg-red-800`,
      ghost: `text-admin-600 hover:bg-admin-50 focus:ring-admin-300`,
    };

    // Get background color for primary variant
    const getBackgroundColor = () => {
      if (variant === 'primary') {
        return { backgroundColor: COLORS.adminMain };
      }
      if (variant === 'outline') {
        return { borderColor: COLORS.adminMain };
      }
      return {};
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-2 text-xs rounded-md gap-1',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-lg gap-2',
      xl: 'px-8 py-4 text-lg rounded-xl gap-2',
    };

    const styles = `
      ${baseStyles}
      ${variantStyles[variant] || variantStyles.primary}
      ${sizeStyles[size] || sizeStyles.md}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <button ref={ref} className={styles} disabled={disabled || loading} style={getBackgroundColor()} {...props}>
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
            Loading...
          </>
        ) : (
          <>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
