module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    'jest-summarizing-reporter',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: 'test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true
      }
    ]
  ]
};
