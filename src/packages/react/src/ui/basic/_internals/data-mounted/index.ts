import { RefObject } from '@glyph-cat/foundation'
import { useLayoutEffect, useRef } from 'react'

const DATA_MOUNTED = 'data-mounted'
const TRUE = String(true)

export function mounted(selector: string): string {
  return `${selector}[${DATA_MOUNTED}="${TRUE}"]`
}

/**
 * When binary UI elements such as checkboxes and switches are checked,
 * styling them through CSS with ARIA properties would cause them to transition
 * from "off" state to "on" state after mounting, this hook disables the
 * animation so that these components immediately display the correct state
 * after mounting then only enables the animations immediately after that.
 * @param ref - The HTML element which will have a `data-mounted` attribute applied.
 */
export function useDataMounted(ref: RefObject<HTMLElement>): void {
  // NOTE: A ref is used here to avoid unnecessary re-rendering.
  const isMountedRef = useRef(false)
  useLayoutEffect(() => {
    if (isMountedRef.current) { return } // Early exit
    isMountedRef.current = true
    const animationFrameId = requestAnimationFrame(() => {
      ref.current?.setAttribute(DATA_MOUNTED, TRUE)
    })
    return () => { cancelAnimationFrame(animationFrameId) }
  }, [ref])
}

// KIV
// export function useBinaryAnimationMountedState(ref: RefObject<HTMLElement>, checked: unknown): boolean {
//   // TODO: Accept a ref to setAttribute on the element instead, refactor `mounted` here
//   const [areAnimationsAllowed, allowAnimations] = useReducer(reducer, !checked)
//   useEffect(() => {
//     if (areAnimationsAllowed) { return } // Early exit
//     const animationFrameId = requestAnimationFrame(allowAnimations)
//     return () => { cancelAnimationFrame(animationFrameId) }
//   }, [areAnimationsAllowed])
//   return areAnimationsAllowed
// }
