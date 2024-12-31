import { isFunction } from '@glyph-cat/swiss-army-knife'
import { useLayoutEffect, useState } from 'react'

/**
 * @public
 */
export function useMediaQuery(query: string): boolean {
  const [isMediaQuerySupported] = useState(() => {
    return typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
  })
  const [matches, setMatchState] = useState(() => {
    return isMediaQuerySupported ? window.matchMedia(query).matches : false
  })
  useLayoutEffect(() => {
    if (!isMediaQuerySupported) { return } // Early exit
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => { setMatchState(e.matches) }
    if (isFunction(mq.addEventListener)) {
      // Current standard API
      mq.addEventListener('change', onChange)
      return () => { mq.removeEventListener('change', onChange) }
    } else if (isFunction(mq.addListener)) {
      // Deprecated API (fallback for old systems)
      mq.addListener(onChange)
      return () => { mq.removeListener(onChange) }
    }
  }, [isMediaQuerySupported, query])
  return matches
}
