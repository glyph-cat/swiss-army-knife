import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // moduleDirectories: [
  //   'node_modules',
  //   'src',
  // ],
  // setupFiles: [
  //   '<rootDir>/jest.setup.ts',
  // ],
  testRegex: '.test.(tsx|ts)',
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
}

export default config
