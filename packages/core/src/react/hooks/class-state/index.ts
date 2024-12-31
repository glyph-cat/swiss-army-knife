import { useCallback, useState } from 'react'
import { isFunction } from '../../../data/type-check'

/**
 * @public
 */
export interface SetClassStateAction<S> {
  (newState: Partial<S>): void
  (newStateFactory: (oldState: S) => S): void
}

/**
 * A state hook that behaves like states in class components.
 * @public
 */
export function useClassState<S>(
  initialState: S | (() => S)
): [S, SetClassStateAction<S>] {
  const [state, setStateBase] = useState(initialState)
  const setState = useCallback((partialState) => {
    setStateBase((oldState) => {
      const newState =
        isFunction(partialState)
          ? partialState(oldState)
          : partialState
      return {
        ...oldState,
        ...newState,
      }
    })
  }, [])
  return [state, setState]
}
