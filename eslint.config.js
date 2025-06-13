import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import js from "@eslint/js";

export default tseslint.config(
  {
    // Global ignores
    ignores: [
      "**/node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "*.config.js",
      "*.config.ts",
      "playwright-report/",
      "test-results/",
      "shared-constants/dist/",
      "backend/dist/",
      "frontend/build/"
    ],
  },
  // Base config for all files
  js.configs.recommended,

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { modules: true, jsx: true },
        project: ["./tsconfig.base.json", "./frontend/tsconfig.json", "./backend/tsconfig.json"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  
  // React-specific configuration for frontend
  {
    files: ["frontend/**/*.{ts,tsx}"],
    ...pluginReactConfig,
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...pluginReactConfig.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": ["warn", { "extensions": [".tsx"] }],
      "prefer-const": "warn",
      "no-var": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "eqeqeq": ["error", "always"],
      "curly": ["warn", "multi-line"]
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Backend-specific configuration
  {
    files: ["backend/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Add any backend-specific rules here
    }
  },
  // Scripts-specific configuration
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
); 