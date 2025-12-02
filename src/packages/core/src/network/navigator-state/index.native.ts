import { CleanupFunction } from '@glyph-cat/foundation'
import { UnsupportedPlatformError } from '../../error'

/**
 * @public
 */
export function watchNavigatorState(): CleanupFunction {
  throw new UnsupportedPlatformError()
}

export * from './constants/public'
