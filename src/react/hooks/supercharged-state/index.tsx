import { useCallback, useState } from 'react'

/**
 * @public
 */
export type SuperChargedStateObject<S> = [
  state: S,
  setState: (newState: S | ((currentState: S) => S)) => void,
  resetState: () => void,
  factorySetState: (newState: S) => (() => void),
  factoryResetState: () => (() => void),
]

// TODO: Write test

/**
 * @public
 */
export function useSuperchargedState<S>(
  initialValueOrFactory: S | (() => S)
): SuperChargedStateObject<S> {

  const [state, setState] = useState(initialValueOrFactory)

  const resetState = useCallback(() => {
    setState(initialValueOrFactory)
  }, [initialValueOrFactory])

  const factorySetState = useCallback((newState: S) => {
    return () => { setState(newState) }
  }, [])

  const factoryResetState = useCallback(() => {
    return () => { resetState() }
  }, [resetState])

  return [
    state,
    setState,
    resetState,
    factorySetState,
    factoryResetState,
  ]

}
