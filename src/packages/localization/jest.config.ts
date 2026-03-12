import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
    '@glyph-cat/swiss-army-knife': '<rootDir>/../core/src',
    '@glyph-cat/type-checking': '<rootDir>/../type-checking/src',
    '@glyph-cat/color': '<rootDir>/../color/src',
    '@glyph-cat/css-utils': '<rootDir>/../css-utils/src',
    '@glyph-cat/cleanup-manager': '<rootDir>/../cleanup-manager/src',
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
