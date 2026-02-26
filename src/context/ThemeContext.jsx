import React, { createContext, useContext } from 'react'

const ThemeContext = createContext()

// Admin Panel Color Palette - Vendor App Ocean Teal Theme
const ADMIN_COLORS = {
  50: '#e6f7f7',
  100: '#ccf0ef',
  150: '#99e0de',
  200: '#66d1ce',
  250: '#33c4be',
  300: '#00b3ac',
  350: '#009a94',
  400: '#00827c',
  450: '#006964',
  500: '#00504c',
  550: '#004842',
  600: '#003f39',
  650: '#00372f',
  700: '#002e26',
  750: '#00261c',
  800: '#001d13',
  850: '#001509',
  900: '#000c00',
  950: '#000400',
}

const ACCENT_COLORS = {
  yellow: '#FFCB04',
  red: '#B30007',
  blue: '#0438FF',
  gray: '#6D6E71',
  darkGray: '#293439',
}

const STATUS_COLORS = {
  success: '#00B3AC',
  warning: '#FFCB04',
  error: '#B30007',
  info: '#0438FF',
}

const THEME_COLORS = {
  admin: ADMIN_COLORS,
  accent: ACCENT_COLORS,
  status: STATUS_COLORS,
  primary: {
    main: '#00B3AC',
    light: '#33c4be',
    dark: '#00504c',
  },
  secondary: {
    main: '#FFCB04',
    light: '#FFD633',
    dark: '#CCA203',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F5F5F5',
    gray100: '#E0E0E0',
    gray200: '#BDBDBD',
    gray300: '#9E9E9E',
    gray400: '#757575',
    gray500: '#6D6E71',
    gray600: '#616161',
    gray700: '#424242',
    gray800: '#293439',
    gray900: '#000000',
  },
}

export const ThemeProvider = ({ children }) => {
  const value = {
    colors: THEME_COLORS,
    getAdminColor: (shade) => ADMIN_COLORS[shade],
    getAccentColor: (type) => ACCENT_COLORS[type],
    getStatusColor: (type) => STATUS_COLORS[type],
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
