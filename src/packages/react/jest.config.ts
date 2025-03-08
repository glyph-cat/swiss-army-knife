import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
    '@glyph-cat/swiss-army-knife': '<rootDir>/../core/src',
  },
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
