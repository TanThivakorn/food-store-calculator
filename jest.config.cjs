module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  watchman: false,
  collectCoverageFrom: ['src/calculator/calculator.service.ts'],
};
