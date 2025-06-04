/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    // Bundle analyzer - generate doar dacă ANALYZE=true
    ...(process.env.ANALYZE === 'true' ? [
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ] : []),
    
    // 🚀 HTML OPTIMIZATION PLUGIN pentru resource hints
    {
      name: 'html-resource-hints',
      transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
          // Adaugă resource hints pentru font loading optimization
          const resourceHints = `
  <!-- 🚀 OPTIMIZARE PERFORMANȚĂ - Resource Hints pentru încărcare mai rapidă -->
  <!-- Preconnect pentru Google Fonts (DNS lookup + connection) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  
  <!-- Preload pentru fontul Inter (cel mai critic) -->
  <link 
    rel="preload" 
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
    as="style" 
    onload="this.onload=null;this.rel='stylesheet'"
  />
  
  <!-- Fallback pentru browsere care nu suportă preload -->
  <noscript>
    <link 
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
      rel="stylesheet"
    />
  </noscript>
  
  <!-- DNS prefetch pentru alte CDN-uri folosite -->
  <link rel="dns-prefetch" href="https://unpkg.com" />
  
  <!-- Meta pentru SEO și social -->
  <meta name="description" content="Aplicație modernă pentru gestionarea bugetului personal" />
  <meta name="theme-color" content="#EA580C" />`;
          
          // Inserează resource hints după <title>
          return html.replace('</title>', '</title>' + resourceHints);
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@shared-constants': path.resolve(__dirname, '../shared-constants')
    }
  },
  build: {
    // 🚀 OPTIMIZĂRI PENTRU PERFORMANCE
    target: 'esnext',
    minify: 'esbuild', // Esbuild este mai rapid decât Terser
    sourcemap: false, // Disabled pentru production pentru size
    
    // 📦 ASSET OPTIMIZATION
    assetsInlineLimit: 4096, // 4KB - inline doar asset-urile foarte mici
    cssCodeSplit: true, // Split CSS pentru mai bună cache-abilititate
    
    // ⚡ MODULE PRELOAD OPTIMIZATION
    modulePreload: {
      polyfill: true, // Include polyfill pentru browsere mai vechi
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Preload doar chunk-urile critice
        return deps.filter(dep => {
          // Preload vendor chunks (critical)
          if (dep.includes('react-vendor') || dep.includes('supabase')) {
            return true;
          }
          // Skip preload pentru chunk-uri mari care nu sunt critice
          if (dep.includes('html2canvas') || dep.includes('pdf-export')) {
            return false;
          }
          return true;
        });
      }
    },
    
    rollupOptions: {
      output: {
        // Manual chunking optimizat pentru librării mari
        manualChunks: {
          // React și dependințe core (critical - încărcate imediat)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Tanstack components (mare dar folosit frecvent)
          'tanstack': ['@tanstack/react-query', '@tanstack/react-table', '@tanstack/react-virtual'],
          
          // UI și feedback libraries (mediu)
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          
          // Form handling (folosit frecvent)
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Supabase și database (critical)
          'supabase': ['@supabase/supabase-js'],
          
          // CVA styling system (se va elimina cu migrarea CVA v2)
          'cva-vendor': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          
          // CHART LIBRARIES (mari și non-critice - lazy load candidat)
          'charts': ['recharts'],
          
          // EXPORT LIBRARIES (foarte mari și rar folosite - lazy load candidat)  
          'excel-export': ['exceljs', 'xlsx'],
          'pdf-export': ['jspdf', 'jspdf-autotable'],
          'file-utils': ['file-saver', 'react-csv'],
          
          // HEAVY UTILITIES (rar folosite)
          'html2canvas': ['html2canvas'],
          
          // I18N libraries (mediu)
          'i18n': ['i18next', 'react-i18next']
        },
        // 📁 OPTIMIZED FILE NAMING pentru mai bună cache-abilititate
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') 
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // Organizează asset-urile pe tipuri pentru cache mai bun
          const info = assetInfo.name || '';
          if (/\.(gif|jpe?g|png|svg)$/.test(info)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(info)) {
            return 'assets/styles/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Setează warning limit la 800KB (mai strict)
    chunkSizeWarningLimit: 800
  },
  
  // 🔧 DEV OPTIMIZATIONS
  server: {
    port: 3000,
    open: false
  },
  
  // Pre-bundle dependencies pentru dev mai rapid
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['html2canvas'] // Exclude heavy deps din pre-bundling
  },
  
  // 📊 PREVIEW OPTIMIZATIONS
  preview: {
    // Enable compression pentru preview mode
    cors: true,
    headers: {
      'Cache-Control': 'max-age=31536000'
    }
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git'],
    css: true,
    deps: {
      inline: ['@testing-library/user-event']
    }
  }
}); 