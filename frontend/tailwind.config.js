/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary Kitchora Ember
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          dark: '#0f172a',
        },
        accent: {
          emerald: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        },
        dark: {
          bg: '#090d16',
          card: '#131b2e',
          border: '#1e293b',
          hover: '#1c2842',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
