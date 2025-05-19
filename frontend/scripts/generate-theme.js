/**
 * Script pentru generarea temei CSS din theme.ts
 * Rulează: node scripts/generate-theme.js
 */

const fs = require('fs');
const path = require('path');

// 1. Citim direct fișierul theme.ts
const themeFile = path.resolve(__dirname, '../src/styles/theme.ts');
const themeContent = fs.readFileSync(themeFile, 'utf8');

// 2. Extragem obiectul theme din conținut
const themeMatch = themeContent.match(/export const theme: Theme = ({[\s\S]*?});/);
if (!themeMatch) {
  console.error('Nu s-a putut găsi obiectul theme în fișierul theme.ts');
  process.exit(1);
}

// 3. Convertim string-ul în obiect JavaScript
let theme;
try {
  // Folosim eval într-un context izolat pentru a evita probleme de securitate
  const vm = require('vm');
  const sandbox = { theme: {} };
  vm.createContext(sandbox);
  
  // Executăm codul într-un context izolat
  vm.runInContext(`theme = ${themeMatch[1].trim()};`, sandbox);
  theme = sandbox.theme;
} catch (error) {
  console.error('Eroare la parsarea temei:', error);
  process.exit(1);
}

// 4. Generează CSS-ul
const cssContent = generateCSS(theme);

// 5. Scrie fișierul CSS
const outputPath = path.resolve(__dirname, '../src/styles/theme-variables.css');
fs.writeFileSync(outputPath, cssContent);

console.log(`Tema CSS generată cu succes la: ${outputPath}`);

// Funcții pentru generarea CSS-ului (păstrăm logica existentă)
function generateCSS(theme) {
  return `/* frontend/src/styles/theme-variables.css - auto-generat din theme.ts */

:root {
${generateColorVariables(theme.colors)}
${generateSpacingVariables(theme.spacing)}
${generateShadowVariables(theme.shadows)}
${generateRadiusVariables(theme.borderRadius)}
${generateTypographyVariables(theme.typography)}
  /* BREAKPOINTS */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  
  /* Z-INDEX STACK */
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-auto: auto;
  
  /* GRADIENTS */
  --gradient-primary: linear-gradient(to right, var(--color-primary-500), var(--color-primary-600));
  --gradient-secondary: linear-gradient(to right, var(--color-secondary-500), var(--color-secondary-600));
  --gradient-success: linear-gradient(to right, var(--color-success-500), var(--color-success-600));
  --gradient-warning: linear-gradient(to right, var(--color-warning-500), var(--color-warning-600));
  --gradient-error: linear-gradient(to right, var(--color-error-500), var(--color-error-600));
  
  /* ANIMATIONS */
  --animation-duration-fast: 150ms;
  --animation-duration-normal: 300ms;
  --animation-duration-slow: 500ms;
  --animation-timing-ease: ease;
  --animation-timing-ease-in: ease-in;
  --animation-timing-ease-out: ease-out;
  --animation-timing-ease-in-out: ease-in-out;
  
${generateAppTokens()}}`;
}

function generateColorVariables(colors) {
  if (!colors) return '';
  
  let css = '';
  for (const [name, scale] of Object.entries(colors)) {
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

function generateSpacingVariables(spacing) {
  if (!spacing) return '';
  
  let css = '  /* SPACING */\n';
  for (const [key, value] of Object.entries(spacing)) {
    css += `  --spacing-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateShadowVariables(shadows) {
  if (!shadows) return '';
  
  let css = '  /* SHADOWS */\n';
  for (const [key, value] of Object.entries(shadows)) {
    css += `  --shadow-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateRadiusVariables(radius) {
  if (!radius) return '';
  
  let css = '  /* BORDER RADIUS */\n';
  for (const [key, value] of Object.entries(radius)) {
    css += `  --radius-${key}: ${value};\n`;
  }
  return css + '\n';
}

function generateTypographyVariables(typography) {
  if (!typography) return '';
  
  let css = '';
  if (typography.fontFamily) {
    css += '  /* TYPOGRAPHY: FONT FAMILY */\n';
    for (const [key, value] of Object.entries(typography.fontFamily)) {
      css += `  --font-family-${key}: ${value};\n`;
    }
    css += '\n';
  }
  
  if (typography.fontSize) {
    css += '  /* TYPOGRAPHY: FONT SIZE */\n';
    for (const [key, value] of Object.entries(typography.fontSize)) {
      css += `  --font-size-${key}: ${value};\n`;
    }
    css += '\n';
  }
  
  if (typography.fontWeight) {
    css += '  /* TYPOGRAPHY: FONT WEIGHT */\n';
    for (const [key, value] of Object.entries(typography.fontWeight)) {
      css += `  --font-weight-${key}: ${value};\n`;
    }
    css += '\n';
  }
  
  if (typography.lineHeight) {
    css += '  /* TYPOGRAPHY: LINE HEIGHT */\n';
    for (const [key, value] of Object.entries(typography.lineHeight)) {
      css += `  --line-height-${key}: ${value};\n`;
    }
    css += '\n';
  }
  
  return css;
}

function generateAppTokens() {
  return `  /* TOKENS SPECIFICE APLICAȚIEI */
  --token: 1rem;
  --token-xs: 0.25rem;
  --token-sm: 0.5rem;
  --token-md: 1rem;
  --token-lg: 1.5rem;
  --token-xl: 2rem;
  
  --border-token: 1px solid var(--color-secondary-200);
  --shadow-token: var(--shadow-md);
  --radius-token: var(--radius-lg);
  --radius-token-lg: var(--radius-xl);\n`;
}
