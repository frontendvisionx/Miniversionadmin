/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Admin Panel Primary Colors - Ocean Teal (from Vendor App)
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
        // Accent Colors (from Vendor App)
        accent: {
          yellow: '#FFCB04',
          red: '#B30007',
          blue: '#0438FF',
          gray: '#6D6E71',
          darkGray: '#293439',
        },
        // Status Colors
        status: {
          success: '#00B3AC',
          warning: '#FFCB04',
          error: '#B30007',
          info: '#0438FF',
        },
      },
    },
  },
}

 