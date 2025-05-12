import { isFunction } from '@glyph-cat/swiss-army-knife'
import { useCallback, useRef, useState } from 'react'

/**
 * @public
 */
export type ISandboxedValue<T> = [T]

/**
 * @public
 */
export function useSandboxedState<T>(initialState: T | (() => T)): [
  sandboxedState: ISandboxedValue<T>,
  setState: (newState: T | ((state: T) => T)) => void,
] {
  const [sandboxedState, setSandboxedState] = useState<ISandboxedValue<T>>(() => {
    return [isFunction(initialState) ? initialState() : initialState]
  })
  const stateRef = useRef<T>(sandboxedState[0])
  const setState = useCallback((newState: T | ((state: T) => T)) => {
    stateRef.current = isFunction(newState) ? newState(stateRef.current) : newState
    setSandboxedState([stateRef.current])
  }, [])
  return [sandboxedState, setState]
}
