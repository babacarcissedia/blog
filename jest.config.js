module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  roots: ['<rootDir>/test'],
  coveragePathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/node_modules'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/node_modules/**'
  ],
  verbose: true,
  coverageDirectory: './coverage',
  bail: 1,
  testTimeout: 30000,
  setupFiles: ['<rootDir>/test/setup.ts'],
  coverageReporters: ['json', 'html', 'text'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(tsx?)$',
  testURL: 'http://localhost/' // https://github.com/facebook/jest/issues/6769
}
