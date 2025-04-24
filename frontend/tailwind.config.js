/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',   // Albastru principal
        'success': '#22c55e',   // Verde succes/income
        'error': '#ef4444',     // Roșu eroare/expense
        // Specifice aplicației
        'income': '#22c55e',    // Verde pentru venituri
        'expense': '#ef4444',   // Roșu pentru cheltuieli
        'saving': '#3b82f6',    // Albastru pentru economii
      },
      spacing: {
        // Putem păstra defaults Tailwind care sunt deja comprehensive
      },
    },
  },
  plugins: [],
}

