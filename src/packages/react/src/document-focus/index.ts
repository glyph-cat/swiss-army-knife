import { isNull } from '@glyph-cat/type-checking'
import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 50 // ms

/**
 * @public
 */
export function useDocumentFocus(): boolean {

  const lastPointerMoveTime = useRef<number>(null)
  // KIV: Will this work safely?
  // if (isNull(lastPointerMoveTime.current)) {
  //   lastPointerMoveTime.current = Date.now()
  // }

  useEffect(() => {
    const onMouseMove = () => { lastPointerMoveTime.current = Date.now() }
    window.addEventListener('mousemove', onMouseMove)
    return () => { window.removeEventListener('mousemove', onMouseMove) }
  }, [])

  const [isFocused, setFocusState] = useState(false)
  useEffect(() => {
    // KIV
    // Only start observing when document is clearly not in focus
    // if (isFocused) { return }
    // Probably should not use 'mousemove' alone, should consider touchscreen platforms
    // (mouse/key/pointer?)
    // but still, only observe for changes when document is not in focus
    const intervalRef = setInterval(() => {
      if (
        isNull(lastPointerMoveTime.current) ||
        (Date.now() - lastPointerMoveTime.current) > (THRESHOLD * 2)
      ) {
        setFocusState(document.hasFocus())
      }
    }, THRESHOLD)
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef)
      }
    }
  }, [isFocused])

  return isFocused

}
