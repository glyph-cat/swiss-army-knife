import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { isFunction } from '../../../data'

/**
 * Returns a stateful value, a function to update it, and a function to reset it.
 * @public
 */
export function useStateWithReset<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, () => void] {
  const [state, setState] = useState(initialState)
  const resetState = useCallback(() => {
    setState(isFunction(initialState) ? initialState() : initialState)
  }, [initialState])
  return [state, setState, resetState]
}
