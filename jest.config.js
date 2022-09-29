module.exports = {
  collectCoverageFrom: [
    '@internal/**/*.js',
    '@packages/**/*.js',
    '!**/node_modules/**',
    '!**/*/*.config.js',
    '!**/dist/**',
    "!scripts/*",
    "!**/__tests__/**",
    '!cypress/**/*.js',
  ],
  coverageThreshold: {
    global: {  // global thresholds
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
  },
  coverageReporters: ['lcov', 'text', 'text-summary'],
  setupFilesAfterEnv:['./lib/oop-test-helpers.js'],
  testMatch: ['**/__tests__/**/*.spec.js', '!cypress/**/*.js'],
};
