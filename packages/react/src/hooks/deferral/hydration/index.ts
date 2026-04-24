import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { useEffect } from 'react'

const HydrationState = new SimpleStateManager(false)

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
  const isHydrated = useSimpleStateValue(HydrationState)
  useEffect(() => {
    if (isHydrated) { return } // Early exit
    HydrationState.set(true)
  }, [isHydrated])
  return isHydrated
}
