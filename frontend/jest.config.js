module.exports = {
  moduleNameMapper: {
    // Path mapping-uri pentru @shared-constants conform regulilor globale
    // Utilizăm directorul shared-constants din rădăcina proiectului ca sursă unică de adevăr
    '^@shared-constants$': '<rootDir>/../shared-constants/index.ts',
    '^@shared-constants/(.*)$': '<rootDir>/../shared-constants/$1',
    // Fallback pentru cazul în care resolver-ul nu poate găsi path-ul corect
    // În contextul de testare, acest fallback asigură compatibilitatea cu alias-urile de path
    '^shared-constants/(.*)$': '<rootDir>/../shared-constants/$1',
  },

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
