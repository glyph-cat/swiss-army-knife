import { isFunction } from '../../../data/type-check'
import { useForceUpdate } from '../force-update'
import { useLayoutEffect } from '../isomorphic-layout-effect'
import { useRef } from '../lazy-ref'

const IS_MEDIA_QUERY_SUPPORTED = typeof window !== 'undefined' &&
  typeof window.matchMedia !== 'undefined'

/**
 * @public
 */
export function useMediaQuery(query: string): boolean {
  const forceUpdate = useForceUpdate()
  const mq = useRef(() => {
    return IS_MEDIA_QUERY_SUPPORTED
      ? window.matchMedia(query)
      : null
  })
  useLayoutEffect(() => {
    // The ref value `mq.current will likely have changed by the time this
    // effect's cleanup function runs. So a copy by value is made inside this
    // effect.
    const { current: _mq } = mq
    if (IS_MEDIA_QUERY_SUPPORTED) {
      if (isFunction(_mq.addEventListener)) {
        // New API
        _mq.addEventListener('change', forceUpdate)
        return () => { _mq.removeEventListener('change', forceUpdate) }
      } else if (isFunction(_mq.addListener)) {
        // Deprecated API (fallback for old systems)
        _mq.addListener(forceUpdate)
        return () => { _mq.removeListener(forceUpdate) }
      }
    }
  }, [forceUpdate])
  return IS_MEDIA_QUERY_SUPPORTED
    ? mq.current.matches || false
    : false
}
