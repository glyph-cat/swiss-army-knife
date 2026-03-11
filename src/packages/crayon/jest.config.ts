import { Config } from 'jest'

const config: Config = {
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
