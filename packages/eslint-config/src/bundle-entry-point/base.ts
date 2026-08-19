import { Config } from 'eslint/config'
import { Severity } from '../abstractions/public'
import { createBaseConfig } from '../presets/base'

/**
 * @public
 */
export const recommended: Array<Config> = createBaseConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.WARN,
  remapError: Severity.ERROR,
})

export default recommended

/**
 * @public
 */
export const libraryAuthoring: Array<Config> = createBaseConfig({
  remapOff: Severity.OFF,
  remapWarn: Severity.ERROR,
  remapError: Severity.ERROR,
})
