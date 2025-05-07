const path = require('path');
[]
module.exports = {
  webpack: {
    alias: {
      '@shared-constants': path.resolve(__dirname, 'src/shared-constants'),
    },
  },
  jest: {
    configure: (jestConfig) => {
      // Transform shared src for tests
      jestConfig.transformIgnorePatterns = ['<rootDir>/node_modules/(?!(shared)/)'];
      // Map @shared-constants alias for tests
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        '^@shared-constants$': '<rootDir>/src/shared-constants/index.ts',
        '^@shared-constants/(.*)$': '<rootDir>/src/shared-constants/$1',
      };
      return jestConfig;
    }
  }
};
