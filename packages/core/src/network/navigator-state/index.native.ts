import { CleanupFunction, UnsupportedPlatformError } from '@glyph-cat/foundation'

/**
 * @public
 */
export function watchNavigatorState(): CleanupFunction {
  throw new UnsupportedPlatformError()
}

export * from './constants/public'
