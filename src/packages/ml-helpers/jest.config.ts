import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '@glyph-cat/swiss-army-knife': '<rootDir>/../core/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // moduleDirectories: [
  //   'node_modules',
  //   'src',
  // ],
  // setupFiles: [
  //   '<rootDir>/jest.setup.ts',
  // ],
  testRegex: '.test.(tsx|ts|jsx|js)',
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
}

export default config
