import { RefObject } from '@glyph-cat/foundation'
import { useEffect, useRef } from 'react'

/**
 * A hook that listens for click events that are not within a HTML element's boundaries.
 * @param callback - The function to invoke upon click-away, it does not need to
 * be memoized or wrapped in [`useCallback`](https://react.dev/reference/react/useCallback).
 * @param elementRef - A {@link RefObject|`RefObject`} containing the HTML element.
 * @param enabled - Determines if the listener should be enabled. Defaults to `true`.
 * @public
 */
export function useClickAwayListener(
  callback: () => void,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean = true,
): void {
  const callbackRef = useRef<typeof callback>(null)
  callbackRef.current = callback
  useEffect(() => {
    if (!enabled || !elementRef.current) { return } // Early exit
    const onClickAway = (e: MouseEvent) => {
      if (!Object.is(e.target, elementRef.current)) {
        callbackRef.current()
      }
    }
    window.addEventListener('click', onClickAway)
    window.addEventListener('contextmenu', onClickAway)
    return () => {
      window.removeEventListener('click', onClickAway)
      window.removeEventListener('contextmenu', onClickAway)
    }
  }, [enabled, elementRef])
}
