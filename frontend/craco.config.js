module.exports = {
  jest: {
    configure: (jestConfig) => {
      // Transform shared src for tests
      jestConfig.transformIgnorePatterns = ['<rootDir>/node_modules/(?!(shared)/)'];
      return jestConfig;
    }
  }
};
