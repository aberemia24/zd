const {
  dependencyCruiser,
} = require('dependency-cruiser');
const {
  generateDepCruiserConfig,
} = require('dependency-cruiser/config-utl');

/**
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  forbidden: [
    // 1. Critical: Disallow circular dependencies
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You must resolve this.',
      from: {},
      to: {
        circular: true,
      },
    },
    // 2. High: Disallow dependencies on test files
    {
      name: 'no-test-dependencies',
      severity: 'error',
      comment:
        'Do not import from test files (e.g., .spec.ts, .test.ts) in your source code.',
      from: {
        pathNot: '(\\.spec|\\.test|\\.story|\\.stories)\\.(ts|tsx|js|jsx)$',
      },
      to: {
        path: '(\\.spec|\\.test|\\.story|\\.stories)\\.(ts|tsx|js|jsx)$',
      },
    },
    // 3. High: Enforce single source of truth for constants
    {
      name: 'enforce-shared-constants',
      severity: 'warn',
      comment:
        'Do not hard-code constants. Import them from @budget-app/shared-constants.',
      from: {
        path: '^src/features',
      },
      to: {
        // This is a placeholder. Real validation for hardcoded strings is done via ESLint.
        // This rule serves as a reminder within the architecture validation.
      },
    },
    // 4. Medium: Isolate feature modules
    {
      name: 'no-cross-feature-dependencies',
      severity: 'warn',
      comment:
        'Avoid direct imports between feature components. Use shared services or state management.',
      from: {
        path: '^frontend/src/components/features/([^/]+)/',
      },
      to: {
        path: '^frontend/src/components/features/([^/]+)/',
        pathNot: [
          '\\1', // allow imports within the same feature
          'shared-constants', // a feature can of course use shared constants
        ],
      },
    },
    // 5. Info: Disallow dependencies on 'deprecated' code
    {
      name: 'no-deprecated-dependencies',
      severity: 'info',
      comment:
        'This module depends on a module that is marked as deprecated.',
      from: {},
      to: {
        path: 'deprecated',
      },
    },
  ],
  options: {
    // We only focus on the frontend source code for this audit
    doNotFollow: {
      path: 'node_modules|backend|\\.spec\\.ts|\\.test\\.ts|\\.stories\\.tsx',
    },
    // We can add more extensions if needed
    fileSystem: {},
    // Configuration for the output
    reporterOptions: {
      dot: {
        // available themes: default, gray, color, earth
        theme: 'earth',
        collapse: '^(node_modules|packages|src/types)',
      },
      text: {
        highlightFocused: true,
      },
    },
    // Add enhancedResolveOptions to fix the "No 'exports' main defined" error
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
  },
}; 