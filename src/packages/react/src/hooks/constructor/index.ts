// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { useInitializer } from '../initializer'

import { CleanupFunction } from '@glyph-cat/foundation'
import { useEffect, useId, useRef } from 'react'

const store: Record<string, Array<unknown>> = {}

// @deprecated Prefer using {@link useInitializer|`useInitializer`} from now on instead.

/**
 * @public
 */
export function useConstructor<T>(factory: () => T, cleanupFn: CleanupFunction<T>): T {

  const id = useId()

  const isInitialized = useRef(false)
  const ref = useRef<T>(null!)
  if (!isInitialized.current) {
    if (!store[id]) {
      store[id] = [] // eslint-disable-line react-hooks/immutability
    }
    const newInstance = factory()
    store[id].push(newInstance)
    ref.current = newInstance
    isInitialized.current = true
  }

  const cleanupFnRef = useRef<(t: T) => void>(null!)
  cleanupFnRef.current = cleanupFn
  useEffect(() => () => {
    cleanupFnRef.current(store[id].shift() as T)
  }, [id])

  return ref.current

}
