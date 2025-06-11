module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks'
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    'playwright-report/',
    'test-results/',
    'reports/',
    'jscpd-report.html/',
    'shared-constants/dist/'
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './frontend/tsconfig.json', './backend/tsconfig.json', './shared-constants/tsconfig.json']
      },
      rules: {
        // TypeScript rules - FOARTE STRICTE
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/no-misused-promises': 'error',

        // React rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // General rules - STRICTE
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'error',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-throw-literal': 'error',
        'no-implicit-coercion': 'error',
        'no-magic-numbers': ['warn', { ignore: [0, 1, -1, 2] }],
        'no-duplicate-imports': 'error',
        'prefer-template': 'error'
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    },
    {
      files: ['**/*.js'],
      env: {
        node: true
      },
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['**/scripts/**/*.js'],
      env: {
        node: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
