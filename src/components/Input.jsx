/**
 * Input Component
 * Reusable text input with validation
 */

import React from 'react';
import { COLORS } from '../hooks/useColors.js';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      touched,
      hint,
      icon: Icon = null,
      size = 'md',
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const getBorderStyle = () => {
      if (error && touched) {
        return { borderColor: COLORS.error, borderWidth: '2px' };
      }
      return { borderColor: COLORS.gray200, borderWidth: '2px' };
    };

    const getFocusStyle = (e, isFocus) => {
      if (error && touched) {
        if (isFocus) {
          e.target.style.borderColor = COLORS.error;
          e.target.style.boxShadow = `0 0 0 3px ${COLORS.error}20`;
        }
      } else {
        if (isFocus) {
          e.target.style.borderColor = COLORS.secondaryMain;
          e.target.style.boxShadow = `0 0 0 3px ${COLORS.secondaryMain}20`;
        } else {
          e.target.style.borderColor = COLORS.gray200;
          e.target.style.boxShadow = 'none';
        }
      }
    };

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-semibold text-neutral-800">
            {label}
            {props.required && <span className="ml-1" style={{ color: COLORS.error }}>*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: error && touched ? COLORS.error : COLORS.secondaryMain }}>
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full
              ${sizeStyles[size]}
              rounded-lg
              focus:outline-none
              transition-all duration-200
              placeholder:text-neutral-400
              disabled:bg-neutral-50 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${className}
            `}
            style={getBorderStyle()}
            onFocus={(e) => getFocusStyle(e, true)}
            onBlur={(e) => {
              getFocusStyle(e, false);
              if (props.onBlur) props.onBlur(e);
            }}
            {...props}
          />
        </div>

        {error && touched && (
          <p className="text-xs font-semibold flex items-center gap-1" style={{ color: COLORS.error }}>
            <span>⚠️</span>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-neutral-600">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
