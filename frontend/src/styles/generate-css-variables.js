/**
 * Script pentru generarea automată a variabilelor CSS din theme.ts
 * Rulează: node generate-css-variables.js
 */
const fs = require('fs');
const path = require('path');

// Importă direct valorile din theme.ts fără a-l compila
const theme = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#16a34a',
      600: '#15803d',
      700: '#166534',
      800: '#14532d',
      900: '#052e16'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    // Alte culori din tema ta...
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  // Alte setări din tema ta...
};

// Funcție pentru convertirea unui obiect într-un set de variabile CSS
function objectToCSS(obj, prefix = '') {
  let result = '';
  for (const [key, value] of Object.entries(obj)) {
    const cssKey = `${prefix}${key}`;
    if (typeof value === 'object' && value !== null) {
      result += objectToCSS(value, `${cssKey}-`);
    } else {
      result += `  --${cssKey}: ${value};\n`;
    }
  }
  return result;
}

// Generează CSS pentru culori
function generateColorVariables() {
  let css = '';
  for (const [name, scale] of Object.entries(theme.colors)) {
    css += `  /* COLORS: ${name.toUpperCase()} */\n`;
    if (typeof scale === 'object') {
      for (const [shade, value] of Object.entries(scale)) {
        css += `  --color-${name}-${shade}: ${value};\n`;
      }
    } else {
      css += `  --color-${name}: ${scale};\n`;
    }
    css += '\n';
  }
  return css;
}

function generateSpacingVariables() {
  let css = '  /* SPACING */\n';
  for (const [key, value] of Object.entries(theme.spacing || {})) {
    css += `  --spacing-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateShadowVariables() {
  let css = '  /* SHADOWS */\n';
  for (const [key, value] of Object.entries(theme.shadows || {})) {
    css += `  --shadow-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateRadiusVariables() {
  let css = '  /* BORDER RADIUS */\n';
  for (const [key, value] of Object.entries(theme.borderRadius || {})) {
    css += `  --radius-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateTypographyVariables() {
  let css = '';
  if (theme.typography) {
    css += '  /* TYPOGRAPHY: FONT FAMILY */\n';
    for (const [key, value] of Object.entries(theme.typography.fontFamily || {})) {
      css += `  --font-family-${key}: ${value};\n`;
    }
    css += '\n';
    css += '  /* TYPOGRAPHY: FONT SIZE */\n';
    for (const [key, value] of Object.entries(theme.typography.fontSize || {})) {
      css += `  --font-size-${key}: ${value};\n`;
    }
    css += '\n';
    css += '  /* TYPOGRAPHY: FONT WEIGHT */\n';
    for (const [key, value] of Object.entries(theme.typography.fontWeight || {})) {
      css += `  --font-weight-${key}: ${value};\n`;
    }
    css += '\n';
    css += '  /* TYPOGRAPHY: LINE HEIGHT */\n';
    for (const [key, value] of Object.entries(theme.typography.lineHeight || {})) {
      css += `  --line-height-${key}: ${value};\n`;
    }
    css += '\n';
  }
  return css;
}

function generateAppTokens() {
  return `  /* TOKENS SPECIFICE APLICAȚIEI */\n  --token: 1rem;\n  --token-xs: 0.25rem;\n  --token-sm: 0.5rem;\n  --token-md: 1rem;\n  --token-lg: 1.5rem;\n  --token-xl: 2rem;\n  \n  --border-token: 1px solid var(--color-secondary-200);\n  --shadow-token: var(--shadow-md);\n  --radius-token: var(--radius-lg);\n  --radius-token-lg: var(--radius-xl);\n`;
}

function generateCSS() {
  return `/* frontend/src/styles/theme-variables.css - auto-generat din theme.ts */\n\n:root {\n${generateColorVariables()}${generateSpacingVariables()}${generateShadowVariables()}${generateRadiusVariables()}${generateTypographyVariables()}  /* BREAKPOINTS */\n  --breakpoint-sm: 640px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 1024px;\n  --breakpoint-xl: 1280px;\n  --breakpoint-2xl: 1536px;\n  \n  /* Z-INDEX STACK */\n  --z-index-0: 0;\n  --z-index-10: 10;\n  --z-index-20: 20;\n  --z-index-30: 30;\n  --z-index-40: 40;\n  --z-index-50: 50;\n  --z-index-auto: auto;\n  \n  /* GRADIENTS */\n  --gradient-primary: linear-gradient(to right, var(--color-primary-500), var(--color-primary-600));\n  --gradient-secondary: linear-gradient(to right, var(--color-secondary-500), var(--color-secondary-600));\n  --gradient-success: linear-gradient(to right, var(--color-success-500), var(--color-success-600));\n  --gradient-warning: linear-gradient(to right, var(--color-warning-500), var(--color-warning-600));\n  --gradient-error: linear-gradient(to right, var(--color-error-500), var(--color-error-600));\n  \n  /* ANIMATIONS */\n  --animation-duration-fast: 150ms;\n  --animation-duration-normal: 300ms;\n  --animation-duration-slow: 500ms;\n  --animation-timing-ease: ease;\n  --animation-timing-ease-in: ease-in;\n  --animation-timing-ease-out: ease-out;\n  --animation-timing-ease-in-out: ease-in-out;\n  \n${generateAppTokens()}}\n`;
}

const outputPath = path.resolve(__dirname, './theme-variables.css');
fs.writeFileSync(outputPath, generateCSS());
console.log(`CSS variables generated successfully at: ${outputPath}`);
