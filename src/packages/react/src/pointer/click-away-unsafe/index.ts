import { RefObject } from '@glyph-cat/foundation'
import { isInRange } from '@glyph-cat/swiss-army-knife'
import { useEffect } from 'react'

/**
 * A hook that listens for click events that are not within a HTML element's boundaries.
 * @param callback - The function to invoke upon click-away.
 * @param deps - React hook dependency array.
 * @param elementRef - A {@link RefObject} containing the HTML element.
 * @param enabled - Determines if the listener should be enabled. Defaults to `true`.
 * @public
 * @deprecated This is an old implementation.
 */
export function useClickAwayListener_UNSAFE(
  callback: () => void,
  deps: Array<unknown>,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) { return } // Early exit
    const onClickAway = (e: MouseEvent) => {
      const element = elementRef.current
      if (!element) { return } // Early exit
      const {
        left,
        top,
        height,
        width,
      } = element.getBoundingClientRect()
      if (
        !isInRange(e.clientX, left, left + width) ||
        !isInRange(e.clientY, top, top + height)
      ) {
        callback()
      }
    }
    window.addEventListener('click', onClickAway)
    window.addEventListener('contextmenu', onClickAway)
    return () => {
      window.removeEventListener('click', onClickAway)
      window.removeEventListener('contextmenu', onClickAway)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, elementRef])
}
