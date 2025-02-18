import { RefObject } from '../../data/ref'
import { UnsupportedPlatformError } from '../../error'
import { CleanupFunction } from '../../types'
import { PrecedenceLevel } from './constants'

/**
 * @public
 */
export function addStyles(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  styles: string,
  precedenceLevel?: PrecedenceLevel,
  styleElementRef?: RefObject<HTMLStyleElement>,
  /* eslint-enable @typescript-eslint/no-unused-vars */
): CleanupFunction {
  throw new UnsupportedPlatformError()
}

// #region Other exports
export * from './constants/public'
// #endregion Other exports
