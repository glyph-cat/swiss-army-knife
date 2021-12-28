import {
  useEffect,
  // eslint-disable-next-line no-restricted-imports
  useLayoutEffect as useLayoutEffect_REACT,
} from 'react'

/**
 * @public
 */
// Because `useLayoutEffect` does not run in server environemnt
export const useLayoutEffect = typeof window === 'undefined'
  ? useEffect
  : useLayoutEffect_REACT
