export default {
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/server/**/*.test.js'],
      testPathIgnorePatterns: ['/int/'],
      setupFilesAfterEnv: ['./test/jest.setup.js']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test/**/*.int.spec.js'],
      setupFilesAfterEnv: ['./test/jest.setup.js']
    }
  ]
}
