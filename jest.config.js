module.exports = {
  collectCoverageFrom: [
    '@internal/**/*.js',
    '@new-packages/**/*.js',
    '@packages/**/*.js',
    '!**/node_modules/**',
    '!**/*/*.config.js',
    '!**/dist/**',
    '!scripts/*',
    '!**/__tests__/**',
    '!cypress/**/*.js',
    '!@shared/**/*.js',
    '!**/.eslintrc.js',
  ],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {  // global thresholds
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
  },
  setupFilesAfterEnv:['./lib/oop-test-helpers.js', './lib/timers.js'],
  testMatch: ['**/__tests__/**/*.spec.js', '!cypress/**/*.js'],
};
