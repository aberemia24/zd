// tailwind.config.js pentru frontend - sursă unică pentru tokens
const theme = require('./src/styles/theme').theme;

/**
 * Mapează tokens din theme.ts la formatul Tailwind
 * Ex: colors.primary.500 => primary-500
 */
function flattenColorScale(scale, prefix) {
  return Object.fromEntries(
    Object.entries(scale).map(([k, v]) => [`${prefix}-${k}`, v])
  );
}

/**
 * Construiește obiectul colors pentru Tailwind din theme tokens
 */
function buildColors(theme) {
  return {
    ...flattenColorScale(theme.colors.primary, 'primary'),
    ...flattenColorScale(theme.colors.secondary, 'secondary'),
    ...flattenColorScale(theme.colors.success, 'success'),
    ...flattenColorScale(theme.colors.warning, 'warning'),
    ...flattenColorScale(theme.colors.error, 'error'),
    ...flattenColorScale(theme.colors.gray, 'gray'),
    white: theme.colors.white,
    black: theme.colors.black,
  };
}

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      // Culori din tokens
      colors: buildColors(theme),
      // Spacing tokens
      spacing: theme.spacing,
      // Border radius tokens
      borderRadius: theme.borderRadius,
      // Shadow tokens
      boxShadow: theme.shadows,
      // Font tokens
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight,
      // Gradiente custom
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'earthy-primary': 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
        'earthy-secondary': 'linear-gradient(90deg, #334155 0%, #1e293b 100%)',
        'earthy-accent': 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
      },
    },
  },
  plugins: [],
};



