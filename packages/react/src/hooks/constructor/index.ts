import { CleanupFunction } from '@glyph-cat/swiss-army-knife'
import { useEffect, useId, useRef } from 'react'

const store: Record<string, Array<unknown>> = {}

/**
 * @public
 */
export function useConstructor<T>(factory: () => T, cleanupFn: CleanupFunction<T>): T {

  const id = useId()

  const isInitialized = useRef(false)
  const ref = useRef<T>(null)
  if (!isInitialized.current) {
    if (!store[id]) { store[id] = [] }
    const newInstance = factory()
    store[id].push(newInstance)
    ref.current = newInstance
    isInitialized.current = true
  }

  const cleanupFnRef = useRef<(t: T) => void>(null)
  cleanupFnRef.current = cleanupFn
  useEffect(() => () => {
    cleanupFnRef.current(store[id].shift() as T)
  }, [id])

  return ref.current

}
