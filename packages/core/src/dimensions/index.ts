import { ScreenDimensionSpec, WindowDimensionSpec } from './abstractions'
import { DEFAULT_WINDOW_DIMENSIONS } from './constants'

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
  if (typeof document !== 'undefined') {
    return {
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
    }
  } else {
    return DEFAULT_WINDOW_DIMENSIONS
  }
}

export * from './abstractions'
export * from './constants'
