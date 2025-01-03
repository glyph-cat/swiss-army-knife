import { UnsupportedPlatformError } from '../../error'
import { CleanupFunction } from '../../types'

/**
 * @public
 */
export function loadTemplateStyles(): CleanupFunction {
  throw new UnsupportedPlatformError()
}

export * from './abstractions.scripted'
