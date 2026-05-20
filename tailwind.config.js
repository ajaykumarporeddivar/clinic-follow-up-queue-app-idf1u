const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: '#2E7D32', // A calming green for wellness themes
        accent: '#D32F2F', // A subtle red for urgent/important actions
        primarybg: '#F8F9FA', // A light grey for general background
        secondarybg: '#E9ECEF', // A slightly darker grey for secondary elements
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}