import { useEffect, useLayoutEffect as useLayoutEffect_REACT } from 'react'

/**
 * @public
 */
export const useIsomorphicLayoutEffect = typeof window === 'undefined'
  ? useEffect
  : useLayoutEffect_REACT
