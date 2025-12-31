import { useSimpleStateValue } from 'cotton-box-react'
import { useContext, useEffect } from 'react'
import { RuntimeContext } from '../../../runtime-manager'

/**
 * Used to indicate if hydration has occurred.
 *
 * This works similarly to {@link useMountedState|`useMountedState`},
 * but if the hooks has been called by other components in preceding renders,
 * then it immediately returns `true` instead of waiting for another render.
 *
 * ---
 *
 * **NOTE**: This always returns `true` in React Native.
 *
 * @public
 */
export function useHydrationState(): boolean {
  const { M$hydrationState } = useContext(RuntimeContext)
  const isHydrated = useSimpleStateValue(M$hydrationState)
  useEffect(() => {
    if (isHydrated) { return } // Early exit
    M$hydrationState.set(true)
  }, [M$hydrationState, isHydrated])
  return isHydrated
}
