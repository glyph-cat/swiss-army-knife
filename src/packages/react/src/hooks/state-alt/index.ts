import { PossiblyUndefined } from '@glyph-cat/foundation'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'

/**
 * An equivalent of {@link useState|`useState`} but with a third item in the
 * returned tuple which is used for resetting the state.
 * @example
 * const [counter, setCounter, resetCounter] = useStateAlt(0)
 * @public
 */
export function useStateAlt<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, () => void]

/**
 * An equivalent of {@link useState|`useState`} but with a third item in the
 * returned tuple which is used for resetting the state.
 * @example
 * const [state, setState, resetState] = useStateAlt()
 * @public
 */
export function useStateAlt<S = undefined>(): [
  PossiblyUndefined<S>,
  Dispatch<SetStateAction<PossiblyUndefined<S>>>,
  () => void,
]

export function useStateAlt<S>(
  initialState?: S | (() => S)
): [...ReturnType<typeof useState<S>>, () => void] {

  const [state, setState] = useState(initialState)

  const resetState = useCallback(() => {
    setState(initialState)
  }, [initialState])

  return [
    state,
    setState,
    resetState,
  ]

}
