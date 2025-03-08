import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testEnvironment: 'jsdom',
  testTimeout: 1000,
  fakeTimers: {
    enableGlobally: true,
  },
  testRegex: '.test.(tsx|ts)',
  // verbose: true,
}

export default config
