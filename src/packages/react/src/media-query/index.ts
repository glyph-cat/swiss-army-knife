import { isFunction } from '@glyph-cat/swiss-army-knife'
import { useEffect, useMemo, useState } from 'react'
import { useHydrationState } from '../hooks/deferral/hydration'

/**
 * @public
 */
export function useMediaQuery(query: string): boolean {

  const isHydrated = useHydrationState()

  const isMediaQuerySupported = useMemo(() => {
    if (isHydrated) {
      return typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
    } else {
      return false
    }
  }, [isHydrated])

  const [matches, setMatchState] = useState(() => {
    return isMediaQuerySupported ? window.matchMedia(query).matches : false
  })

  useEffect(() => {
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
