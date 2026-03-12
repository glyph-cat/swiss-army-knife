import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
    '@glyph-cat/swiss-army-knife': '<rootDir>/../core/src',
    '@glyph-cat/type-checking': '<rootDir>/../type-checking/src',
    '@glyph-cat/color': '<rootDir>/../color/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  setupFiles: [
    '<rootDir>/jest.pre-env-setup.ts',
  ],
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testEnvironment: 'jsdom',
  testTimeout: 1000,
  fakeTimers: {
    enableGlobally: true,
  },
  testRegex: '.test.tsx?',
}

export default config
