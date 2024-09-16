import { useEffect, useLayoutEffect as useLayoutEffect_REACT } from 'react'

/**
 * @public
 */
// Because `useLayoutEffect` does not run in server environment
export const useLayoutEffect = typeof window === 'undefined'
  ? useEffect
  : useLayoutEffect_REACT
