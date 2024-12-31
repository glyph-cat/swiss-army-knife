import { SimpleStateManager } from 'cotton-box'
import { useEffect } from 'react'
import { CleanupFunction } from '../../types'

/**
 * @public
 */
export const NavigatorState = new SimpleStateManager(false)

/**
 * @public
 * @example
 * const unwatchNavigatorState = watchNavigatorState() // start watching
 * unwatchNavigatorState() // stop watching
 */
export function watchNavigatorState(): CleanupFunction {
  if (typeof window === 'undefined') { return () => { /* empty */ } } // Early exit
  NavigatorState.set(navigator.onLine)
  const onOnLine = () => { NavigatorState.set(true) }
  const onOffLine = () => { NavigatorState.set(false) }
  window.addEventListener('online', onOnLine)
  window.addEventListener('offline', onOffLine)
  return () => {
    window.removeEventListener('online', onOnLine)
    window.removeEventListener('offline', onOffLine)
  }
}

/**
 * @public
 */
export function useWatchNavigatorState(): void {
  useEffect(watchNavigatorState, [])
}
