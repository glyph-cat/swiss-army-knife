import { WindowDimensionSpec } from '@glyph-cat/swiss-army-knife'
import { useWindowDimensions as useWindowDimensions_RN } from 'react-native'

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
