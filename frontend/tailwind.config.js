/** @type {import('tailwindcss').Config} */
const theme = require('./src/styles/theme').theme;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        gray: theme.colors.gray,
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'earthy-primary': 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
        'earthy-secondary': 'linear-gradient(90deg, #334155 0%, #1e293b 100%)',
        'earthy-accent': 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
      },
      spacing: {
        // Putem păstra defaults Tailwind care sunt deja comprehensive
      },
    },
  },
  plugins: [],
}


