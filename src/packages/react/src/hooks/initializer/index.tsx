import { CleanupFunction } from '@glyph-cat/foundation'
import { createContext, useContext, useEffect, useId, useRef } from 'react'
import { RuntimeContext } from '../../runtime-manager'

const InitializerIdContext = createContext<string>(null)

// For now there is no good way to do it

/**
 * @internal
 */
export function useInitializer<T>(initializer: () => [T, CleanupFunction]): T {

  const id = useContext(InitializerIdContext)

  const { M$initializerStore: store } = useContext(RuntimeContext)
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

  // const lastCache = useRef<T>(null)
  // if (store[id]?.[store[id]?.length - 1]?.[0]) {
  //   lastCache.current = store[id][store[id].length - 1][0] as T
  // }

  // return lastCache.current
  return store[id][store[id].length - 1][0] as T

}

// export function useInitializer_OLD<T>(initializer: () => [T, CleanupFunction]): T {

//   const id = useId()
//   // The id changes when component tree hierarchy changes
//   // When switching between StrictMode and "normal mode", this breaks

//   const { M$initializerStore: store } = useContext(RuntimeContext)
//   if (!store[id]) {
//     store[id] = [] // eslint-disable-line react-hooks/immutability
//   }

//   const isInitializedRef = useRef(false)
//   if (!isInitializedRef.current) {
//     const initializerPayload = initializer()
//     store[id].push(initializerPayload)
//     isInitializedRef.current = true
//   }

//   useEffect(() => () => {
//     const [, cleanupFn] = store[id].shift()
//     cleanupFn()
//   }, [id, store])

//   const lastCache = useRef<T>(null)
//   if (store[id]?.[store[id]?.length - 1]?.[0]) {
//     lastCache.current = store[id][store[id].length - 1][0] as T
//   }

//   return lastCache.current
//   // return store[id][store[id].length - 1][0] as T

// }
