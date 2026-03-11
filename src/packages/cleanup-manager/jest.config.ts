import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
  },
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testTimeout: 1000,
  fakeTimers: {
    enableGlobally: true,
  },
  testRegex: '.test.tsx?',
}

export default config
