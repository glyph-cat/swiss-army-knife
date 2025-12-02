import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
    '@glyph-cat/swiss-army-knife': '<rootDir>/../core/src',
    '@glyph-cat/react-test-utils': '<rootDir>/../react-test-utils/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  setupFiles: [
    '<rootDir>/jest.pre-env-setup.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.post-env-setup.ts',
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
