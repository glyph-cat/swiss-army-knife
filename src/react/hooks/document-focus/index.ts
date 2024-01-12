import { useEffect, useState } from 'react'
import { useLayoutEffect } from '../isomorphic-layout-effect'
import { useRef } from '../lazy-ref'

const THRESHOLD = 50 // ms

/**
 * @public
 */
export function useDocumentFocus(): boolean {

  const lastPointerMoveTime = useRef(Date.now)
  useLayoutEffect(() => {
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
