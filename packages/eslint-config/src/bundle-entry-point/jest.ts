import { Severity } from '../abstractions/public'
import { createJestConfig } from '../presets/jest'

/**
 * @public
 */
export const recommended = createJestConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.WARN,
  remapError: Severity.ERROR,
})

export default recommended

/**
 * @public
 */
export const libraryAuthoring = createJestConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.ERROR,
  remapError: Severity.ERROR,
})
