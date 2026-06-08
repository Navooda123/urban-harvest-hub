/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom eco palette — requirement: two new colors
        'eco-green': '#4CAF50',
        'earth-brown': '#795548',
        // Extended slate shade used throughout components
        slate: {
          850: '#1a2235',
        }
      },
      fontFamily: {
        // Custom font — requirement: one new font family
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // Custom text size — used in admin tables and metadata
        'xxs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}

