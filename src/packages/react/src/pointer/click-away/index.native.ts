import { RefObject } from '@glyph-cat/foundation'
import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export function useClickAwayListener(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  callback: () => void,
  deps: Array<unknown>,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean = false,
  /* eslint-enable @typescript-eslint/no-unused-vars */
): void {
  throw new UnsupportedPlatformError()
}
