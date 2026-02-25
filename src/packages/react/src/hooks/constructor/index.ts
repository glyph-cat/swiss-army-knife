import { BuildType, CleanupFunction, Factory } from '@glyph-cat/foundation'
import { createContext, useCallback, useContext, useEffect, useId, useRef } from 'react'
import { BUILD_TYPE, IS_SOURCE_ENV } from '../../constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StoreContext = createContext(new Map<string, Array<ValueWithCleanup<any>>>())

/**
 * @public
 */
export type ValueWithCleanup<T> = [T, CleanupFunction]

/**
 * A hook that initializes a value while a component is rendering for the _**first time**_
 * and performs cleanup only when the component is _**really being unmounted**_.
 *
 * This includes preventing cleanup functions from executing in the wrong order
 * and causing memory leaks when Effects are being re-run in
 * [`<StrictMode>`](https://react.dev/reference/react/StrictMode).
 *
 * -----------------------------------------------------------------------------
 *
 * Known issue: When rendered by
 * [`renderToStaticMarkup`](https://react.dev/reference/react-dom/server/renderToStaticMarkup)
 * or [`renderToString`](https://react.dev/reference/react-dom/server/renderToString)
 * from `'react-dom/server'` from within a _**client**_ environment, the cleanup
 * function cannot be triggered and will result in a memory leak.
 * While a solution/fix is possible, it would introduce too much overhead and
 * potentially degrade performance for normal use cases.
 * @public
 */
export function useConstructor<T>(factory: Factory<ValueWithCleanup<T>>): T {

  const id = useId()
  const store = useContext(StoreContext)
  const factoryRef = useRef<typeof factory>(null!)

  if (typeof window !== 'undefined') {

    if (!store.has(id)) { store.set(id, []) }
    const bufferStack = store.get(id)!

    factoryRef.current = factory

    if (bufferStack.length <= 0) {
      bufferStack.push(factoryRef.current())
      // ========== THIS WILL BE EXCLUDED WHEN BUNDLING ==========
      if (IS_SOURCE_ENV) {
        // Simulate random additional/overlapping/off-screen renders
        // eslint-disable-next-line react-hooks/purity
        const fluctuationFactor = Math.round(Math.random() * 5)
        for (let i = 0; i < fluctuationFactor; i++) {
          bufferStack.push(factoryRef.current())
        }
      }
      // ========== THIS WILL BE EXCLUDED WHEN BUNDLING ==========
    }

  }

  /**
   * @returns a reference to the original buffer stack.
   */
  const flushBufferStack = useCallback(() => {
    const bufferStack = store.get(id)!
    while (bufferStack.length > 1) {
      bufferStack.shift()![1]()
    }
    return bufferStack
  }, [id, store])

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
  useEffect(() => {
    clearTimeout(timeoutRef.current)
    return () => {
      const bufferStack = flushBufferStack()
      timeoutRef.current = setTimeout(() => {
        const [, cleanup] = bufferStack.shift()!
        cleanup()
      })
    }
  }, [flushBufferStack])

  if (BUILD_TYPE === BuildType.RN || typeof window !== 'undefined') {
    const bufferStack = flushBufferStack()
    return bufferStack.at(-1)![0]
  } else {
    const [staticValue, cleanup] = factory()
    cleanup()
    return staticValue
    // NOTE: If something requires cleanup, then it's probably not a good idea
    // for it to be included in server logic to begin with. But for simple use
    // cases, we can still workaround this by immediately cleaning it up.
  }

}
