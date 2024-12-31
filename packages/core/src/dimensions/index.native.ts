import { Dimensions } from 'react-native'
import { ScreenDimensionSpec, WindowDimensionSpec } from './abstractions'

/**
 * @public
 */
export function getScreenDimensions(): ScreenDimensionSpec {
  const screenDimensions = Dimensions.get('screen')
  return {
    height: screenDimensions.height,
    width: screenDimensions.width,
  }
}

/**
 * @public
 */
export function getWindowDimensions(): WindowDimensionSpec {
  const windowDimensions = Dimensions.get('window')
  return {
    height: windowDimensions.height,
    width: windowDimensions.width,
  }
}

export * from './abstractions'
export * from './constants'
