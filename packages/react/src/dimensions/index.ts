import { WindowDimensionSpec, getWindowDimensions } from '@glyph-cat/swiss-army-knife'
import { useEffect, useReducer } from 'react'

// TEMP
const DEFAULT_WINDOW_DIMENSIONS = {
  height: 0,
  width: 0,
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
  useEffect(() => {
    window.addEventListener('resize', updateDimensions)
    return () => { window.removeEventListener('resize', updateDimensions) }
  }, [])
  return dimensions
}
