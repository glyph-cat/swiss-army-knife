import { CleanupFunction } from '@glyph-cat/foundation'
import { Empty } from '../../data'
import { NavigatorState } from './constants'

const EVENT_ONLINE = 'online'
const EVENT_OFFLINE = 'offline'

/**
 * @public
 * @example
 * const unwatchNavigatorState = watchNavigatorState() // start watching
 * unwatchNavigatorState() // stop watching
 */
export function watchNavigatorState(): CleanupFunction {
  if (typeof window === 'undefined') { return Empty.FUNCTION } // Early exit
  NavigatorState.set(navigator.onLine)
  const onOnLine = () => { NavigatorState.set(true) }
  const onOffLine = () => { NavigatorState.set(false) }
  window.addEventListener(EVENT_ONLINE, onOnLine)
  window.addEventListener(EVENT_OFFLINE, onOffLine)
  return () => {
    window.removeEventListener(EVENT_ONLINE, onOnLine)
    window.removeEventListener(EVENT_OFFLINE, onOffLine)
  }
}

export * from './constants/public'
