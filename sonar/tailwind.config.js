/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonar: {
          base: '#231123',      // Midnight Violet
          surface: '#4B2840',   // Blackberry Cream
          text: '#DCDCDD',      // Alabaster Grey
          accent: '#003844',    // Dark Teal
          alert: '#B80C09',     // Brick Ember
        }
      }
    }
  },
  plugins: [],
}
