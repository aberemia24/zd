module.exports = {
  extends: ['../../.eslintrc.json'],
  rules: {
    // Disable React Testing Library rules for Playwright E2E tests
    'testing-library/prefer-screen-queries': 'off',
    'testing-library/no-node-access': 'off',
    'testing-library/no-container': 'off',
  },
}; 