import { isNull } from '@glyph-cat/swiss-army-knife'
import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 50 // ms

/**
 * @public
 */
export function useDocumentFocus(): boolean {

  const lastPointerMoveTime = useRef<number>(null)
  if (isNull(lastPointerMoveTime.current)) {
    lastPointerMoveTime.current = Date.now()
  }

  useEffect(() => {
    const onMouseMove = () => { lastPointerMoveTime.current = Date.now() }
    window.addEventListener('mousemove', onMouseMove)
    return () => { window.removeEventListener('mousemove', onMouseMove) }
  }, [])

  const [isFocused, setFocusState] = useState(false)
  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (Date.now() - lastPointerMoveTime.current > (THRESHOLD * 2)) {
        setFocusState(document.hasFocus())
      }
    }, THRESHOLD)
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef)
      }
    }
  }, [])

  return isFocused

}
