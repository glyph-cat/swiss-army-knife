/* eslint-disable no-restricted-imports */
import { useCallback, useRef, useState, useTransition } from 'react'

/**
 * A more lenient version of React's `useActionState`.
 * - To be used as a semi-drop-in substitution
 * - Action is already wrapped in `startTransition`
 * - Does not have `permalink` parameter
 * @public
 */
export function useActionState<State>(
  action: (state: Awaited<State>) => State | Promise<State>,
  initialState: Awaited<State>
): [state: Awaited<State>, dispatch: () => void, isPending: boolean]

/**
 * A more lenient version of React's `useActionState`.
 * - To be used as a semi-drop-in substitution
 * - Action is already wrapped in `startTransition`
 * - Does not have `permalink` parameter
 * @public
 */
export function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>
): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean]

export function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload?: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
): [state: Awaited<State>, dispatch: (payload?: Payload) => void, isPending: boolean] {

  const actionRef = useRef<typeof action>(null)
  actionRef.current = action

  const [state, setState] = useState(initialState)
  const stateRef = useRef<typeof state>(null)
  stateRef.current = state

  const [isPending, startTransition] = useTransition()
  const dispatch = useCallback(async (payload: Payload) => {
    startTransition(async () => {
      setState(await actionRef.current(stateRef.current, payload))
    })
  }, [])

  return [state, dispatch, isPending]

}
