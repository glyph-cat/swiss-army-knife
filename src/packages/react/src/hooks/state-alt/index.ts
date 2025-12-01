import { useCallback, useState } from 'react'

/**
 * An equivalent of {@link useState|`useState`} but with a third item in the
 * returned tuple which is used for resetting the state.
 * @example
 * const [counter, setCounter, resetCounter] = useStateAlt(0)
 * const [state, setState, resetState] = useStateAlt({})
 * @public
 */
export function useStateAlt<S>(
  initialValueOrFactory: S | (() => S)
): [...ReturnType<typeof useState>, () => void] {

  const [state, setState] = useState(initialValueOrFactory)

  const resetState = useCallback(() => {
    setState(initialValueOrFactory)
  }, [initialValueOrFactory])

  return [
    state,
    setState,
    resetState,
  ]

}
