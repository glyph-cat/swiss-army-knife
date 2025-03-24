import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testRegex: '.test.ts',
  // verbose: true,
}

export default config
