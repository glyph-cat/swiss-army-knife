import { NullableRefObject } from '@glyph-cat/foundation'
import { isInRange } from '@glyph-cat/swiss-army-knife'
import { useEffect } from 'react'

/**
 * A hook that listens for pointer events when it leaves a HTML element's boundaries.
 * @param callback - The function to invoke upon pointer leave.
 * @param deps - React hook dependency array.
 * @param elementRef - A {@link NullableRefObject} containing the HTML element.
 * @param enabled - Determines if the listener should be enabled. Defaults to `true`.
 * @public
 * @deprecated This is an old implementation.
 */
export function usePointerLeaveListener_UNSAFE(
  callback: () => void,
  deps: Array<unknown>,
  elementRef: NullableRefObject<HTMLElement>,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) { return } // Early exit
    const onMouseMove = (e: MouseEvent) => {
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
    window.addEventListener('mousemove', onMouseMove)
    return () => { window.removeEventListener('mousemove', onMouseMove) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, elementRef])
}
