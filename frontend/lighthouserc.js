module.exports = {
  ci: {
    collect: {
      // URL-urile care vor fi auditate
      url: [
        'http://localhost:3000', // Home page
        'http://localhost:3000/transactions', // Main transactions page
        'http://localhost:3000/options', // Options page
      ],
      // Configurare pentru server local
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3, // Rulează de 3 ori pentru rezultate mai stabile
    },
    assert: {
      // Thresholds pentru performance metrics
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }], // Minimum 85% performance score
        'categories:accessibility': ['error', { minScore: 0.95 }], // Minimum 95% accessibility score
        'categories:best-practices': ['error', { minScore: 0.9 }], // Minimum 90% best practices score
        'categories:seo': ['error', { minScore: 0.9 }], // Minimum 90% SEO score
        
        // Specific performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // FCP < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }], // LCP < 3s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // TBT < 300ms
        'speed-index': ['error', { maxNumericValue: 3000 }], // SI < 3s
        
        // Bundle size warnings
        'unused-javascript': ['warn', { maxNumericValue: 100000 }], // Warn if > 100KB unused JS
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }], // Warn if > 50KB unused CSS
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        
        // Network efficiency
        'efficient-animated-content': 'warn',
        'offscreen-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'uses-text-compression': 'error',
        
        // Resource hints optimization
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
      },
    },
    upload: {
      // Configurare pentru salvarea rezultatelor (dacă avem server LHCI)
      target: 'temporary-public-storage',
    },
    server: {},
  },
}; 