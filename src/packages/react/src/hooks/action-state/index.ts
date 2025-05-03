import { Dispatch, SetStateAction, startTransition, useCallback, useRef, useState, useTransition } from 'react'

/**
 * @public
 */
export type CustomActionState<State> = [
  state: Awaited<State>,
  dispatch: () => void,
  isPending: boolean,
  setState: Dispatch<SetStateAction<State>>,
]

/**
 * @public
 */
export type CustomActionStateWithPayload<State, Payload> = [
  state: Awaited<State>,
  dispatch: (payload: Payload) => void,
  isPending: boolean,
  setState: Dispatch<SetStateAction<State>>,
]

/**
 * A more lenient version of React's `useActionState`.
 * - To be used as a semi-drop-in substitution
 * - Action is already wrapped in `startTransition`
 * - State can be modified externally, useful for resetting form errors without re-dispatching.
 * - Does not have `permalink` parameter
 * @public
 */
export function useActionState<State>(
  action: (state: Awaited<State>) => State | Promise<State>,
  initialState: Awaited<State>
): CustomActionState<State>

/**
 * A more lenient version of React's `useActionState`.
 * - To be used as a semi-drop-in substitution
 * - Action is already wrapped in `startTransition`
 * - State can be modified externally, useful for resetting form errors without re-dispatching
 * - Does not have `permalink` parameter
 * @public
 */
export function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>
): CustomActionStateWithPayload<State, Payload>

export function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload?: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
): CustomActionState<State> | CustomActionStateWithPayload<State, Payload> {

  const actionRef = useRef<typeof action>(null)
  actionRef.current = action

  const [state, setState] = useState(initialState)
  const stateRef = useRef<typeof state>(null)
  stateRef.current = state

  // KIV
  // There seems to be a problem when using `useTransition()` and some descendant
  // component throws an error. It would sometimes cause React to throw:
  // Error: Rendered more hooks than during the previous render.
  // const [isPending, startTransition] = useTransition()
  //                                                   ^
  // const [isPending, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)
  const dispatch = useCallback(async (payload: Payload) => {
    setIsPending(true)
    await startTransition(async () => {
      setState(await actionRef.current(stateRef.current, payload))
      setIsPending(false)
    })
    // startTransition(async () => {
    //   setState(await actionRef.current(stateRef.current, payload))
    // })
  }, [])

  return [state, dispatch, isPending, setState]

}
