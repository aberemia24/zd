/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
// import { visualizer } from 'rollup-plugin-visualizer'; // TODO: Fix compatibility with current Vite version
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        // Bundle analyzer - temporar disabled din cauza incompatibilității cu Vite
        // TODO: Fix rollup-plugin-visualizer compatibility
        // ...(process.env.ANALYZE === 'true' ? [
        //   visualizer({
        //     filename: 'dist/bundle-analysis.html',
        //     open: true,
        //     gzipSize: true,
        //     brotliSize: true
        //   })
        // ] : []),
        // 🚀 HTML OPTIMIZATION PLUGIN pentru resource hints
        {
            name: 'html-resource-hints',
            transformIndexHtml: {
                enforce: 'pre',
                transform: function (html) {
                    // Adaugă resource hints pentru font loading optimization
                    var resourceHints = "\n  <!-- \uD83D\uDE80 OPTIMIZARE PERFORMAN\u021A\u0102 - Resource Hints pentru \u00EEnc\u0103rcare mai rapid\u0103 -->\n  <!-- Preconnect pentru Google Fonts (DNS lookup + connection) -->\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n\n  <!-- Preload pentru fontul Inter (cel mai critic) -->\n  <link\n    rel=\"preload\"\n    href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\"\n    as=\"style\"\n    onload=\"this.onload=null;this.rel='stylesheet'\"\n  />\n\n  <!-- Fallback pentru browsere care nu suport\u0103 preload -->\n  <noscript>\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\"\n      rel=\"stylesheet\"\n    />\n  </noscript>\n\n  <!-- DNS prefetch pentru alte CDN-uri folosite -->\n  <link rel=\"dns-prefetch\" href=\"https://unpkg.com\" />\n\n  <!-- Meta pentru SEO \u0219i social -->\n  <meta name=\"description\" content=\"Aplica\u021Bie modern\u0103 pentru gestionarea bugetului personal\" />\n  <meta name=\"theme-color\" content=\"#EA580C\" />";
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
        minify: 'esbuild',
        sourcemap: false,
        // 📦 ASSET OPTIMIZATION
        assetsInlineLimit: 4096,
        cssCodeSplit: true,
        // ⚡ MODULE PRELOAD OPTIMIZATION
        modulePreload: {
            polyfill: true,
            resolveDependencies: function (filename, deps, _a) {
                var hostId = _a.hostId, hostType = _a.hostType;
                // Preload doar chunk-urile critice
                return deps.filter(function (dep) {
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
                chunkFileNames: function (chunkInfo) {
                    var _a;
                    var facadeModuleId = chunkInfo.facadeModuleId
                        ? (_a = chunkInfo.facadeModuleId.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.tsx', '').replace('.ts', '')
                        : 'chunk';
                    return "assets/".concat(facadeModuleId, "-[hash].js");
                },
                assetFileNames: function (assetInfo) {
                    // Organizează asset-urile pe tipuri pentru cache mai bun
                    var info = assetInfo.name || '';
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
        host: '0.0.0.0',
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
