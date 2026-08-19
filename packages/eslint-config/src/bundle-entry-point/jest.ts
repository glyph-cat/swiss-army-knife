import { Config } from 'eslint/config'
import { Severity } from '../abstractions/public'
import { createJestConfig } from '../presets/jest'

/**
 * @public
 */
export const recommended: Array<Config> = createJestConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.WARN,
  remapError: Severity.ERROR,
})

export default recommended

/**
 * @public
 */
export const libraryAuthoring: Array<Config> = createJestConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.ERROR,
  remapError: Severity.ERROR,
})
