/**
 * Card Component
 * Container for content with shadow and border
 */

import React from 'react';

export const Card = React.forwardRef(
  (
    {
      children,
      className = '',
      padding = 'md',
      shadow = 'md',
      hoverable = false,
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const shadowStyles = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg border border-neutral-200
          ${paddingStyles[padding]}
          ${shadowStyles[shadow]}
          ${hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Alert Component
 */
export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const typeStyles = {
    success: { backgroundColor: '#00B3AC15', borderColor: '#00B3AC', color: '#00504c' },
    error: { backgroundColor: '#B3000715', borderColor: '#B30007', color: '#B30007' },
    warning: { backgroundColor: '#FFCB0415', borderColor: '#FFCB04', color: '#8A6F00' },
    info: { backgroundColor: '#0438FF15', borderColor: '#0438FF', color: '#0438FF' },
  };

  const iconStyles = {
    success: '#00B3AC',
    error: '#B30007',
    warning: '#FFCB04',
    info: '#0438FF',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  return (
    <div
      className={`
        p-4 rounded-lg border-l-4 flex gap-3
        ${className}
      `}
      style={{
        backgroundColor: typeStyles[type]?.backgroundColor,
        borderLeftColor: typeStyles[type]?.borderColor,
      }}
      role="alert"
    >
      <div className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center font-bold`} style={{ backgroundColor: iconStyles[type], color: 'white' }}>
        {icons[type]}
      </div>

      <div className="flex-1">
        {title && <p className="font-bold text-sm mb-1" style={{ color: typeStyles[type]?.color }}>{title}</p>}
        {message && <p className="text-sm" style={{ color: typeStyles[type]?.color }}>{message}</p>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity font-bold"
          style={{ color: typeStyles[type]?.color }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const variantStyles = {
    primary: { backgroundColor: '#ccf0ef', color: '#002e26' },
    success: { backgroundColor: '#FFCB04', color: '#000000' },
    error: { backgroundColor: '#B30007', color: '#ffffff' },
    warning: { backgroundColor: '#FFCB04', color: '#000000' },
    neutral: { backgroundColor: '#E0E0E0', color: '#424242' },
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        ${sizeStyles[size]}
        ${className}
      `}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
};

/**
 * Separator Component
 */
export const Separator = ({ className = '', vertical = false }) => {
  return (
    <div
      className={`
        bg-neutral-200
        ${vertical ? 'w-px h-full' : 'h-px w-full'}
        ${className}
      `}
    />
  );
};

export default {
  Card,
  Alert,
  Badge,
  Separator,
};
