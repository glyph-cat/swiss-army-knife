import { useReducer } from 'react'
import { IS_CLIENT_ENV } from '../../../constants'
import { useLayoutEffect } from '../isomorphic-layout-effect'
import { DEFAULT_WINDOW_DIMENSIONS } from './constants'
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
  if (IS_CLIENT_ENV) {
    return {
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
    }
  } else {
    return DEFAULT_WINDOW_DIMENSIONS
  }
}

/**
 * @public
 */
export function useWindowDimensions(): WindowDimensionSpec {
  const [dimensions, updateDimensions] = useReducer(
    getWindowDimensions,
    DEFAULT_WINDOW_DIMENSIONS,
    getWindowDimensions,
  )
  useLayoutEffect(() => {
    window.addEventListener('resize', updateDimensions)
    return () => { window.removeEventListener('resize', updateDimensions) }
  }, [])
  return dimensions
}

export * from './schema'
