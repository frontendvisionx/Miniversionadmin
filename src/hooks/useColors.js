import { useTheme } from '../context/ThemeContext'

// Helper hooks for colors
export const useAdminColor = () => {
  const { colors } = useTheme()
  return colors.admin
}

export const useAccentColor = () => {
  const { colors } = useTheme()
  return colors.accent
}

export const useStatusColor = () => {
  const { colors } = useTheme()
  return colors.status
}

export const usePrimaryColor = () => {
  const { colors } = useTheme()
  return colors.primary
}

export const useSecondaryColor = () => {
  const { colors } = useTheme()
  return colors.secondary
}

export const useNeutralColor = () => {
  const { colors } = useTheme()
  return colors.neutral
}

// Color utility functions
export const getColorValue = (colorName, shade = 'main') => {
  const colors = {
    admin: {
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
    },
    accent: {
      yellow: '#FFCB04',
      red: '#B30007',
      blue: '#0438FF',
      gray: '#6D6E71',
      darkGray: '#293439',
    },
    status: {
      success: '#00B3AC',
      warning: '#FFCB04',
      error: '#B30007',
      info: '#0438FF',
    },
  }

  if (colors[colorName]) {
    return colors[colorName][shade] || colors[colorName].main
  }
  return '#00B3AC' // Default to ocean teal
}

// Common color shortcuts - Admin Panel Specific (Vendor App Theme)
export const COLORS = {
  // Primary Admin Colors - Ocean Teal
  adminMain: '#00B3AC',
  adminLight: '#33c4be',
  adminDark: '#00504c',
  
  // Secondary Colors - Yellow
  secondaryMain: '#FFCB04',
  secondaryLight: '#FFD633',
  secondaryDark: '#CCA203',
  
  // Accent Colors (from vendor app)
  accentYellow: '#FFCB04',
  accentRed: '#B30007',
  accentBlue: '#0438FF',
  accentGray: '#6D6E71',
  accentDarkGray: '#293439',
  
  // Status Colors
  success: '#00B3AC',
  warning: '#FFCB04',
  error: '#B30007',
  info: '#0438FF',
  
  // Neutral Colors
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
}

// Gradient presets for admin panel (vendor app theme)
export const GRADIENTS = {
  primary: `linear-gradient(to right, ${COLORS.adminMain}, ${COLORS.adminDark})`,
  secondary: `linear-gradient(to right, ${COLORS.secondaryMain}, ${COLORS.secondaryDark})`,
  tealYellow: `linear-gradient(to right, ${COLORS.adminMain}, ${COLORS.secondaryMain})`,
  info: `linear-gradient(to right, ${COLORS.adminLight}, ${COLORS.adminMain})`,
  warning: `linear-gradient(to right, ${COLORS.secondaryMain}, ${COLORS.secondaryDark})`,
  error: `linear-gradient(to right, ${COLORS.error}, #8A0005)`,
}
