import { CleanupFunction } from '@glyph-cat/foundation'
import { useContext, useEffect, useId, useRef } from 'react'
import { GCContext } from '../../provider/context'

/**
 * @public
 */
export function useInitializer<T>(initializer: () => [T, CleanupFunction]): T {

  const id = useId()
  const {
    M$initializerStore: store,
  } = useContext(GCContext)
  if (!store[id]) {
    store[id] = [] // eslint-disable-line react-hooks/immutability
  }

  const isInitializedRef = useRef(false)
  if (!isInitializedRef.current) {
    const initializerPayload = initializer()
    store[id].push(initializerPayload)
    isInitializedRef.current = true
  }

  useEffect(() => () => {
    const [, cleanupFn] = store[id].shift()
    cleanupFn()
  }, [id, store])

  return store[id][store[id].length - 1][0] as T

}
