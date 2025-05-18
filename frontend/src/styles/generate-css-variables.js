/**
 * Script pentru generarea automată a variabilelor CSS din theme.ts
 * Rulează: node generate-css-variables.js
 */
const fs = require('fs');
const path = require('path');

// Importă theme.ts și extrage valorile
const theme = require('./theme').theme;

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
