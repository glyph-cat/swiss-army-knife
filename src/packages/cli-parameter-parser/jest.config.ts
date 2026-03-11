import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
  },
  // moduleDirectories: [
  //   'node_modules',
  //   'src',
  // ],
  // setupFiles: [
  //   '<rootDir>/jest.setup.ts',
  // ],
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  testRegex: '.test.tsx?',
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
}

export default config
