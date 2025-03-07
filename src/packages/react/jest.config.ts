import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testEnvironment: 'jsdom',
  testRegex: '.test.(tsx|ts|jsx|js)',
  testTimeout: 1000,
  fakeTimers: {
    enableGlobally: true,
  },
  // verbose: true,
}

export default config
