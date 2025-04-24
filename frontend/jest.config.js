module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
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
  ],
  testMatch: [
    '**/?(*.)+(test).[jt]s?(x)'
  ]
};
