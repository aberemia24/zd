module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
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
        sourceType: 'module'
      },
      rules: {
        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        
        // React rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        
        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // General rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'warn',
        'no-var': 'error'
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