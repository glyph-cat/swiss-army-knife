import { useReducer } from 'react'
import { useLayoutEffect } from '../isomorphic-layout-effect'
import { ScreenDimensionSpec, WindowDimensionSpec } from './schema'

/**
 * @public
 */
export function getScreenDimensions(): ScreenDimensionSpec {
  return {
    height: window.screen.height,
    width: window.screen.width,
  }
}

/**
 * @public
 */
export function getWindowDimensions(): WindowDimensionSpec {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
  }
}

/**
 * @public
 */
export function useWindowDimensions(): WindowDimensionSpec {
  const [dimensions, updateDimensions] = useReducer(
    getWindowDimensions,
    { height: 0, width: 0 },
    getWindowDimensions,
  )
  useLayoutEffect(() => {
    window.addEventListener('resize', updateDimensions)
    return () => { window.removeEventListener('resize', updateDimensions) }
  }, [])
  return dimensions
}

export * from './schema'
