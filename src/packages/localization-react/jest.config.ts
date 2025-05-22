import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/localization': '<rootDir>/../localization/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  setupFiles: [
    '<rootDir>/jest.pre-env-setup.ts',
  ],
  // setupFilesAfterEnv: [
  //   '<rootDir>/jest.post-env-setup.ts',
  // ],
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
