import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
    '@glyph-cat/type-checking': '<rootDir>/../type-checking/src',
    '@glyph-cat/color': '<rootDir>/../color/src',
    '@glyph-cat/css-utils': '<rootDir>/../css-utils/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  setupFiles: [
    '<rootDir>/jest.pre-env-setup.ts',
  ],
  setupFilesAfterEnv: [
    'jest-extended/all',
    '<rootDir>/jest.post-env-setup.ts',
  ],
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testRegex: '.test.tsx?',
  testTimeout: 1000,
  fakeTimers: {
    enableGlobally: true,
  },
}

export default config
