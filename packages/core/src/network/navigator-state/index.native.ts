import { UnsupportedPlatformError } from '../../error'
import { CleanupFunction } from '../../types'

/**
 * @public
 */
export function watchNavigatorState(): CleanupFunction {
  throw new UnsupportedPlatformError()
}

export * from './constants/public'
