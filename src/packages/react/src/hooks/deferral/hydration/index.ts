import { useContext, useEffect, useReducer } from 'react'
import { GCContext } from '../../../provider/context'
import { baseReducer } from '../internal'

/**
 * Used to indicate if hydration has occurred.
 *
 * This works similarly to {@link useMountedState|`useMountedState`},
 * but if wrapped in {@link GCProvider|`GCProvider`} and it has already been
 * mounted, then this hook returns `true` immediately instead of waiting for
 * another render.
 *
 * ---
 *
 * **NOTE**: This always returns `true` in React Native.
 *
 * @public
 */
export function useHydrationState(): boolean {
  const { M$isHydrated } = useContext(GCContext)
  const [isHydrated, setAsHydrated] = useReducer(baseReducer, M$isHydrated)
  useEffect(() => { setAsHydrated() }, [])
  return isHydrated
}
