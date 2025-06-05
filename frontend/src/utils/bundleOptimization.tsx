/**
 * Utilități pentru optimizarea bundle-urilor Webpack
 *
 * Acest fișier conține configurări optimizate pentru Webpack,
 * strategii de code-splitting și funcții helper pentru
 * optimizarea build-ului final.
 */

/**
 * Configurare recomandată pentru Webpack
 *
 * Poate fi utilizată în configurările custom sau în suprascrierile de configurare
 * pentru Create React App (react-app-rewired, craco etc.)
 */
export const optimizedWebpackConfig = {
  /**
   * Strategii de code splitting pentru a reduce dimensiunea bundle-urilor
   */
  optimization: {
    // Extrage chunk-uri comune pentru librării
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        // Extrage React și alte librării core
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: "framework",
          priority: 40,
          chunks: "all",
        },
        // Extrage componentele UI comune
        ui: {
          test: /[\\/]node_modules[\\/](tailwindcss|@headlessui)[\\/]/,
          name: "ui-libs",
          priority: 30,
          chunks: "all",
        },
        // Extrage utilități și librării mici
        utils: {
          test: /[\\/]node_modules[\\/](lodash|date-fns|uuid)[\\/]/,
          name: "utils",
          priority: 20,
          chunks: "all",
        },
        // Extrage alte dependențe externe
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          chunks: "all",
        },
      },
    },
    // Refolosește chunk-uri între build-uri
    runtimeChunk: {
      name: "runtime",
    },
  },

  /**
   * Optimizări pentru procesul de build
   */
  performance: {
    // Avertizări pentru bundle-uri mari
    hints: "warning",
    maxEntrypointSize: 512000, // 500 KiB
    maxAssetSize: 512000, // 500 KiB
  },
};

/**
 * Module cunoscute care trebuie incluse în bundle-uri separate
 * Util pentru configurarea dinamică a code-splitting-ului
 */
export const bundleSplittingModules = {
  // Librării React și routing
  REACT_CORE: [
    "react",
    "react-dom",
    "react-router-dom",
    "react-router",
    "react-query",
    "react-hook-form",
  ],

  // State management
  STATE_MANAGEMENT: ["zustand", "@tanstack/react-query"],

  // Componente UI
  UI_COMPONENTS: ["@headlessui/react", "tailwindcss", "react-transition-group"],

  // Utilități
  UTILS: ["lodash", "date-fns", "uuid", "immer"],

  // Data processing
  DATA_PROCESSING: ["papaparse", "xlsx", "chart.js"],
};

/**
 * Reguli pentru includerea dinamică a modulelor în bundle-uri
 * Poate fi utilizat pentru a genera configurația de splitChunks
 */
export function generateSplitChunksConfig() {
  const cacheGroups: Record<string, any> = {};

  // Generăm grupuri de cache pentru fiecare categorie
  Object.entries(bundleSplittingModules).forEach(([key, modules], index) => {
    const priority = 50 - index * 10; // Prioritate descrescătoare

    cacheGroups[key.toLowerCase()] = {
      test: new RegExp(
        `[\\\\/]node_modules[\\\\/](${modules.join("|")})[\\\\/]`,
      ),
      name: key.toLowerCase().replace("_", "-"),
      priority,
      chunks: "all",
    };
  });

  // Adăugăm grupul default pentru restul modulelor
  cacheGroups.vendors = {
    test: /[\\/]node_modules[\\/]/,
    name: "vendors",
    priority: 10,
    chunks: "all",
  };

  return {
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 20000,
    cacheGroups,
  };
}

/**
 * Instrucțiuni pentru configurarea esbuild-loader pentru performanță
 * Poate reduce timpul de build cu 50-80%
 */
export const esbuildLoaderConfig = {
  test: /\.(js|jsx|ts|tsx)$/,
  loader: "esbuild-loader",
  options: {
    loader: "tsx",
    target: "es2015",
    tsconfigRaw: {
      compilerOptions: {
        jsx: "react",
        target: "es2015",
      },
    },
  },
  exclude: /node_modules/,
};

/**
 * Utilitarul de analiză bundle pentru a identifica modulele mari
 * Poate fi inclus în configurația webpack pentru analiză
 */
export const bundleAnalyzerConfig = {
  analyzerMode: "server",
  analyzerPort: 8888,
  reportFilename: "bundle-report.html",
  defaultSizes: "gzip",
  openAnalyzer: true,
  generateStatsFile: true,
  statsFilename: "bundle-stats.json",
};

/**
 * Exemple de comandă pentru analiză bundle
 * @returns {string} Comandă pentru analiză bundle
 */
export function getBundleAnalysisCommand(): string {
  return "ANALYZE=true npm run build";
}

/**
 * Generează fișierul craco.config.js pentru optimizarea CRA
 * @returns {string} Configurația craco
 */
export function generateCracoConfig(): string {
  return `
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimizare bundle splitting
      webpackConfig.optimization.splitChunks = ${JSON.stringify(generateSplitChunksConfig(), null, 2)};
      
      // Optimizare runtime
      webpackConfig.optimization.runtimeChunk = {
        name: 'runtime',
      };
      
      // Suport pentru ESBuild loader pentru build-uri rapide
      webpackConfig.module.rules.push(${JSON.stringify(esbuildLoaderConfig, null, 2)});
      
      // Optimizări de performanță
      webpackConfig.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
      
      return webpackConfig;
    },
  },
  // Plugin-uri pentru PostCSS (TailwindCSS etc.)
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};
  `.trim();
}
