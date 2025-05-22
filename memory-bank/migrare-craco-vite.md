# Plan de migrare de la CRACO la Vite

## Obiectiv
Migrarea BudgetApp de la Create React App (CRA) + CRACO la Vite pentru a îmbunătăți viteza de dezvoltare, timpul de build și experiența developer.

## Motivație
- Vite oferă o experiență de dezvoltare mult mai rapidă comparativ cu CRA/CRACO
- Hot Module Replacement (HMR) instantaneu
- Timpuri de build reduse semnificativ în producție
- Configurare mai simplă și mai flexibilă
- Mai puține dependențe și overhead
- CRA nu mai este activ dezvoltat, în timp ce Vite are suport activ

## Configurație actuală
- Create React App cu CRACO pentru extinderea configurației
- Alias-uri definite prin CRACO
- Configurație Jest personalizată prin CRACO
- TailwindCSS integrat prin configurare standard
- Structură monorepo cu shared-constants sincronizate

## Dependențe actuale
- @craco/craco: ^7.1.0
- react-scripts: ^5.0.1
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.4.5
- tailwindcss: ^4.1.4
- @tanstack/react-query: ^5.76.1
- @tanstack/react-table: ^8.21.3

## Plan de migrare

### 1. Pregătire și backup
- [x] Crearea unui branch nou pentru migrare
- [ ] Backup al configurației actuale

### 2. Instalarea dependențelor Vite
- [ ] Instalare Vite și plugin-uri necesare
```bash
npm install -D vite @vitejs/plugin-react vite-tsconfig-paths
```
- [ ] Opțional: Instalare plugin-uri adiționale după necesitate
```bash
npm install -D @vitejs/plugin-legacy # Pentru suport browsere vechi
npm install -D vite-plugin-html # Pentru manipulare HTML avansată
```

### 3. Configurarea Vite
- [ ] Creare fișier `vite.config.ts` cu următoarea configurație:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@shared-constants': path.resolve(__dirname, 'src/shared-constants')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
});
```

- [ ] Creare fișier `tsconfig.node.json` pentru tipare Vite:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 4. Modificare fișier HTML
- [ ] Creare/adaptare `index.html` în directorul root:
```html
<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BudgetApp</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

### 5. Actualizare scripts în package.json
- [ ] Modificare script-uri în `package.json`:
```json
{
  "scripts": {
    "sync-shared-constants": "node ../scripts/sync-shared-constants.js",
    "generate:theme": "node scripts/generate-theme.js",
    "prestart": "npm run sync-shared-constants && npm run generate:theme",
    "start": "vite",
    "prebuild": "npm run sync-shared-constants && npm run generate:theme",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "postinstall": "npm run sync-shared-constants",
    "pretest": "npm run sync-shared-constants",
    "test": "cross-env REACT_APP_API_URL=http://localhost:3000 REACT_APP_SUPABASE_URL=mock REACT_APP_SUPABASE_ANON_KEY=mock vitest run",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src"
  }
}
```

### 6. Adaptare configurare TailwindCSS
- [ ] Ajustare `tailwind.config.js` pentru Vite dacă e necesar:
```javascript
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
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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
```

### 7. Configurare testare cu Vitest
- [ ] Instalare Vitest și utilitare pentru testare:
```bash
npm install -D vitest jsdom @testing-library/jest-dom @testing-library/react
```

- [ ] Creare configurare Vitest în `vite.config.ts`:
```typescript
// Adaugă în vite.config.ts
export default defineConfig({
  // ... restul configurației
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true
  }
});
```

- [ ] Creare fișier `src/setupTests.ts` sau migrare din jest.setup.js:
```typescript
import '@testing-library/jest-dom';
// Adaugă orice mockuri sau configurări necesare pentru teste
```

### 8. Actualizare variabile de mediu
- [ ] Creare fișier `.env` și `.env.development` pentru variabile de mediu:
```
VITE_APP_API_URL=http://localhost:3001
VITE_APP_SUPABASE_URL=https://yourproject.supabase.co
VITE_APP_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] Actualizare referințe în cod:
```typescript
// Înainte
process.env.REACT_APP_API_URL
// După
import.meta.env.VITE_APP_API_URL
```

### 9. Ajustări în cod pentru compatibilitate
- [ ] Verificare importuri statice pentru fișiere care nu sunt JavaScript/TypeScript
- [ ] Actualizare importuri pentru assets și CSS modules dacă e necesar
- [ ] Verificare importuri pentru SVG-uri și alte fișiere statice

### 10. Eliminare fișiere și dependențe CRACO
- [ ] Eliminare `craco.config.js`
- [ ] Dezinstalare dependențe CRACO
```bash
npm uninstall @craco/craco
```

### 11. Testare
- [ ] Rulare aplicație în mod dezvoltare
```bash
npm start
```
- [ ] Verificare funcționalitate aplicație
- [ ] Rulare teste
```bash
npm test
```
- [ ] Build pentru producție
```bash
npm run build
```
- [ ] Testare build local
```bash
npm run preview
```

### 12. Troubleshooting posibil
- Importuri absolute - verificare și ajustare aliasuri
- Variabile de mediu - prefix diferit (VITE_ vs REACT_APP_)
- Fișiere statice - posibil să necesite ajustări în importuri
- CSS modules - verificare funcționalitate
- Hot Module Replacement - verificare funcționalitate
- Jest mocks - posibil să necesite ajustări pentru Vitest

### 13. Optimizări adiționale
- [ ] Configurare code splitting
- [ ] Optimizare build pentru producție
- [ ] Implementare lazy loading pentru componente mari
- [ ] Configurare pre-compressing pentru assets statice

### 14. Actualizare documentație
- [ ] Actualizare README.md cu noile instrucțiuni de dezvoltare
- [ ] Actualizare documentație de arhitectură
- [ ] Actualizare ghiduri pentru dezvoltatori noi

## Timeline estimativ
| Etapă | Durată estimată (zile) |
|-------|------------------------|
| Pregătire și instalare | 0.5 |
| Configurare de bază Vite | 1 |
| Migrare teste | 1-2 |
| Ajustări cod pentru compatibilitate | 1-2 |
| Testare și troubleshooting | 1-2 |
| Optimizări și documentație | 1 |
| **Total** | **5.5-8.5** |

## Plan de rollback
În cazul unor probleme majore care nu pot fi rezolvate:
1. Păstrare branch separat pentru migrare
2. Revenire la configurația CRACO originală
3. Documentare probleme întâmpinate pentru încercări viitoare

## Avantaje așteptate după migrare
- Timp de start în dezvoltare: ~500ms (vs ~10-20s cu CRA)
- Timp de build în producție: reducere cu 30-50%
- Hot Module Replacement instantaneu
- Experiență de dezvoltare îmbunătățită
- Reducere dimensiune bundle final
- Configurare mai flexibilă și extensibilă

## Riscuri și mitigări
- Incompatibilități cu anumite plugin-uri sau librării:
  - Mitigare: Testare timpurie a integrării
- Diferențe în gestionarea CSS și assets:
  - Mitigare: Ajustări în configurație și cod
- Integrare cu sistemul existent de sincronizare shared-constants:
  - Mitigare: Verificare și adaptare script-uri existente

## Notițe adiționale
- Vite folosește esbuild pentru dezvoltare și Rollup pentru producție
- Prefixul variabilelor de mediu se schimbă din REACT_APP_ în VITE_
- Pentru importuri dinamice, sintaxa poate diferi ușor 