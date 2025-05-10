// tailwind.config.js
const themeTokens = require('./frontend/src/styles/theme').theme;

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
    './frontend/src/**/*.{js,jsx,ts,tsx}',
    './frontend/public/index.html',
  ],
  theme: {
    extend: {
      colors: buildColors(themeTokens),
      spacing: themeTokens.spacing,
      borderRadius: themeTokens.borderRadius,
      boxShadow: themeTokens.shadows,
      fontFamily: themeTokens.typography.fontFamily,
      fontSize: themeTokens.typography.fontSize,
      fontWeight: themeTokens.typography.fontWeight,
      lineHeight: themeTokens.typography.lineHeight,
    },
  },
  plugins: [],
};
