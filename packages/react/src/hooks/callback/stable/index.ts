import { useCallback, useRef } from 'react'

/**
 * As escape hatch substitute for {@link useCallback|`useCallback`} that
 * does not require a dependency list and its reference remains stable even when
 * its dependencies change values.
 *
 * Note: ESLint will still expect this to be passed as a dependency to other
 * React hooks but the reference will never change; and it would not cause any
 * effects to re-run or accidentally cause infinite re-rendering.
 * @public
 */
export function useStableCallback<C extends (...args: any[]) => unknown>(callback: C): C {
  const callbackRef = useRef<C>(null!)
  callbackRef.current = callback
  return useCallback((...args: Parameters<C>): ReturnType<C> => {
    return callbackRef.current(...args) as ReturnType<C>
  }, []) as C
}
