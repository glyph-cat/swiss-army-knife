import { useEffect, useReducer } from 'react'

/**
 * Used to indicate if a component has mounted.
 * @returns `false` at first, then only returns `true` after the first render.
 * @public
 */
export function useMountedState(): boolean {
  const [isMounted, setAsMounted] = useReducer(baseReducer, false)
  useEffect(() => { setAsMounted() }, [])
  return isMounted
}

function baseReducer(): boolean {
  return true
}
