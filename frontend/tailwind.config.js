// tailwind.config.js pentru frontend - OPTIMIZAT pentru bundle size
// 🖤🔶 CARBON COPPER EDITION - Premium Fintech Design System OPTIMIZED
// 🌙 DARK MODE SUPPORT - Complete sophisticated night theme cu Carbon scale
const theme = require('./src/styles/theme').theme;

/**
 * Mapează tokens din theme.ts la formatul Tailwind
 * Ex: colors.carbon.500 => carbon-500
 */
function flattenColorScale(scale, prefix) {
  return Object.fromEntries(
    Object.entries(scale).map(([k, v]) => [`${prefix}-${k}`, v])
  );
}

/**
 * Construiește obiectul colors pentru Tailwind din theme tokens - OPTIMIZED
 * Includes doar essential Carbon Copper colors + dark mode variants
 */
function buildColors(theme) {
  return {
    // Core Carbon Copper colors DOAR cele folosite
    ...flattenColorScale(theme.colors.carbon, 'carbon'),
    ...flattenColorScale(theme.colors.copper, 'copper'),
    ...flattenColorScale(theme.colors.emerald, 'emerald'),
    ...flattenColorScale(theme.colors.ruby, 'ruby'),
    ...flattenColorScale(theme.colors.amber, 'amber'),
    
    // Essential alias pentru compatibilitate
    ...flattenColorScale(theme.colors.primary, 'primary'),     // Copper
    ...flattenColorScale(theme.colors.secondary, 'secondary'), // Carbon
    ...flattenColorScale(theme.colors.success, 'success'),     // Emerald
    ...flattenColorScale(theme.colors.warning, 'warning'),     // Amber
    ...flattenColorScale(theme.colors.error, 'error'),         // Ruby
    ...flattenColorScale(theme.colors.gray, 'gray'),           // Carbon
    background: theme.colors.background,
    white: theme.colors.white,
    black: theme.colors.black,
  };
}

module.exports = {
  // OPTIMIZED content paths pentru better purging
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    // Exclude test și story files pentru production
    '!./src/**/*.test.{js,jsx,ts,tsx}',
    '!./src/**/*.stories.{js,jsx,ts,tsx}',
    '!./src/**/__tests__/**/*',
  ],
  // Enable dark mode with class strategy
  darkMode: 'class',
  theme: {
    extend: {
      // OPTIMIZED Colors - doar essential colors
      colors: {
        ...buildColors(theme),
        // Essential CSS custom properties pentru runtime theming
        'primary-rgb': '234, 88, 12',      // Copper RGB
        'secondary-rgb': '87, 83, 78',     // Carbon RGB
        'success-rgb': '5, 150, 105',      // Emerald RGB
        'warning-rgb': '245, 158, 11',     // Amber RGB
        'error-rgb': '220, 38, 38',        // Ruby RGB
        
        // Essential dark mode colors
        'dark-primary': '#F97316',
        'dark-secondary': '#78716C',
        'dark-success': '#10B981',
        'dark-warning': '#F59E0B',
        'dark-error': '#EF4444',
        'dark-background': '#0A0908',
        'dark-surface': '#1C1917',
        'dark-border': '#292524',
      },
      // Essential spacing tokens
      spacing: theme.spacing,
      // Essential border radius
      borderRadius: theme.borderRadius,
      // OPTIMIZED shadows - doar essential ones
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 8px 32px rgba(234, 88, 12, 0.16)',
        'dark-glow': '0 8px 32px rgba(234, 88, 12, 0.24)',
      },
      // Essential typography
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight,
      
      // OPTIMIZED gradients - doar essential ones
      backgroundImage: {
        'copper-primary': 'linear-gradient(90deg, #EA580C 0%, #C2410C 100%)',
        'dark-copper': 'linear-gradient(90deg, #F97316 0%, #EA580C 100%)',
        'warm-background': 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%)',
        'dark-surface': 'linear-gradient(135deg, #1C1917 0%, #0A0908 100%)',
      },
      // Essential animation
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      // OPTIMIZED keyframes - doar essential animations
      keyframes: {
        'copper-glow': {
          '0%, 100%': { boxShadow: '0 8px 32px rgba(234, 88, 12, 0.16)' },
          '50%': { boxShadow: '0 12px 48px rgba(234, 88, 12, 0.24)' },
        },
      },
      animation: {
        'copper-glow': 'copper-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // Essential plugins doar - RESTORED @tailwindcss/typography
    require('@tailwindcss/typography'),
    
    // OPTIMIZED custom utilities - doar essential ones
    function({ addUtilities }) {
      addUtilities({
        '.theme-transition': {
          transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
        },
        '.glow-copper': {
          boxShadow: '0 8px 32px rgba(234, 88, 12, 0.16)',
        },
        '.glass-light': {
          backgroundColor: 'rgba(250, 250, 249, 0.8)',
          backdropFilter: 'blur(12px)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(28, 25, 23, 0.8)',
          backdropFilter: 'blur(12px)',
        },
      });
    },
  ],
  
  // BUNDLE OPTIMIZATION pentru production - CONSERVATIVE approach
  ...(process.env.NODE_ENV === 'production' && {
    // Conservative safelist - preserve classes needed for implementation
    safelist: [
      'bg-copper-500',
      'bg-carbon-900',
      'text-copper-600',
      'text-carbon-100',
      'border-copper-500',
      'shadow-glow',
      'dark:bg-dark-surface',
      'dark:text-dark-primary',
      // Typography classes
      'prose',
      'prose-sm',
      'prose-lg',
    ],
  }),
};




