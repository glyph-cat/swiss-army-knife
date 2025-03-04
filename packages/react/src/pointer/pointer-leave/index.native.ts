import { RefObject, UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

/**
 * @public
 */
export function usePointerLeaveListener(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  callback: () => void,
  deps: Array<unknown>,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean = true,
  /* eslint-enable @typescript-eslint/no-unused-vars */
): void {
  throw new UnsupportedPlatformError()
}
