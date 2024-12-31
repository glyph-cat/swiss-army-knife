import {
  Dimensions,
  useWindowDimensions as useWindowDimensions_RN,
} from 'react-native'
import { ScreenDimensionSpec, WindowDimensionSpec } from '..'

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

/**
 * @public
 */
export function useWindowDimensions(): WindowDimensionSpec {
  const windowDimensions = useWindowDimensions_RN()
  return {
    height: windowDimensions.height,
    width: windowDimensions.width,
  }
}

export * from './schema'
