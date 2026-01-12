import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '@glyph-cat/foundation': '<rootDir>/../foundation/src',
    '@glyph-cat/type-checking': '<rootDir>/../type-checking/src',
  },
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testRegex: '.test.ts',
  // verbose: true,
}

export default config
