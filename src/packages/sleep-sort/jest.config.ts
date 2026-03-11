import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  testPathIgnorePatterns: [
    '.draft',
    '.old',
  ],
  testRegex: '.test.ts',
}

export default config
