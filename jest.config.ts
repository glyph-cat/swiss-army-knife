import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  testRegex: '.test.(tsx|ts|jsx|js)',
  verbose: true,
}

export default config
