import { useReducer } from 'react'

/**
 * @public
 */
export const forceUpdateReducer = (c: number): number => c + 1

/**
 * Equivalent of `this.forceUpdate` in class components.
 * @public
 */
export function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0)
  return forceUpdate
}
