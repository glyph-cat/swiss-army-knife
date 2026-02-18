import { Awaitable } from '@glyph-cat/foundation'
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useCallback,
  useRef,
  useState,
} from 'react'

/**
 * @public
 */
export type CustomActionState<State = unknown, DispatchArgs extends Array<unknown> = Array<unknown>> = [
  state: State,
  dispatch: (...dispatchArgs: DispatchArgs) => Promise<State>,
  isPending: boolean,
  setState: Dispatch<SetStateAction<State>>,
]

/**
 * @public
 * @deprecated This type is no longer used, but is still exported for backward compatibility. Use `CustomActionState` instead.
 */
export type CustomActionStateWithPayload<State, DispatchArgs extends Array<unknown> = Array<unknown>> = CustomActionState<State, DispatchArgs>

/**
 * A more lenient version of React's `useActionState`.
 * - To be used as a semi-drop-in substitution
 * - Action is already wrapped in `startTransition`
 * - State can be modified externally, useful for resetting form errors without re-dispatching.
 * - Does not have `permalink` parameter
 * @public
 */
export function useActionState<State, DispatchArgs extends Array<unknown> = Array<unknown>>(
  action: (state: State, ...dispatchArgs: DispatchArgs) => Awaitable<State>,
  initialState: State,
  initialIsPending = false,
): CustomActionState<State> {

  const actionRef = useRef<typeof action>(null!)
  actionRef.current = action

  const [state, setState] = useState(initialState)
  const stateRef = useRef<typeof state>(null!)
  stateRef.current = state

  // KIV
  // There seems to be a problem when using `useTransition()` and some descendant
  // component throws an error. It would sometimes cause React to throw:
  // Error: Rendered more hooks than during the previous render.
  const [isPending, setIsPending] = useState(initialIsPending)
  const dispatch = useCallback(async (...dispatchArgs: DispatchArgs) => {
    setIsPending(true)
    return new Promise<State>((resolve) => {
      startTransition(async () => {
        const newState = await actionRef.current(stateRef.current, ...dispatchArgs)
        setState(newState)
        resolve(newState)
        setIsPending(false)
      })
    })
  }, [])

  return [state, dispatch, isPending, setState]

}
