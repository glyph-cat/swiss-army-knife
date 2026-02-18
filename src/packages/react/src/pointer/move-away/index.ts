import { RefObject } from '@glyph-cat/foundation'
import { useEffect, useRef } from 'react'

/**
 * A hook that listens for pointer events when it leaves a HTML element's boundaries.
 * @param callback - The function to invoke upon pointer leave, it does not need to
 * be memoized or wrapped in [`useCallback`](https://react.dev/reference/react/useCallback).
 * @param elementRef - A {@link RefObject} containing the HTML element.
 * @param enabled - Determines if the listener should be enabled. Defaults to `true`.
 * @public
 */
export function useMoveAwayListener(
  callback: () => void,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean = true,
): void {
  const isHoveredRef = useRef<boolean>(false)
  const callbackRef = useRef<typeof callback>(null!)
  callbackRef.current = callback
  useEffect(() => {
    if (!enabled || !elementRef.current) { return } // Early exit
    const onMouseMove = (e: MouseEvent) => {
      const isCurrentlyHovered = Object.is(e.target, elementRef.current)
      if (isHoveredRef.current && !isCurrentlyHovered) {
        callbackRef.current()
      }
      isHoveredRef.current = isCurrentlyHovered
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => { window.removeEventListener('mousemove', onMouseMove) }
  }, [enabled, elementRef])
}
