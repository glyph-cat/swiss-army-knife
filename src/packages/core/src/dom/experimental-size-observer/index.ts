import { CleanupFunction } from '@glyph-cat/foundation'
import { RectangularBoundary } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJSONequal(a: any, b: any): b is typeof a {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * @public
 * @deprecated
 */
export class ExperimentalSizeObserver {

  constructor(private readonly element: HTMLElement) { }

  observe(callback: (bounds: RectangularBoundary) => void): CleanupFunction {
    let prevBounds: RectangularBoundary = null
    const measureAndUpdateBoundsIfChanged = () => {
      const rawBounds = this.element.getBoundingClientRect()
      const nextBounds: RectangularBoundary = {
        height: rawBounds.height,
        left: rawBounds.left,
        top: rawBounds.top,
        width: rawBounds.width,
      }
      if (!isJSONequal(prevBounds, nextBounds)) {
        prevBounds = nextBounds
        callback(nextBounds)
      }
    }
    let fastIntervalCounter = 0
    const fastIntervalRef = setInterval(() => {
      measureAndUpdateBoundsIfChanged()
      if (fastIntervalCounter++ > 9) { clearInterval(fastIntervalRef) }
    }, 10)
    const slowIntervalRef = setInterval(measureAndUpdateBoundsIfChanged, 100)
    const unobserve = () => {
      clearInterval(fastIntervalRef)
      clearInterval(slowIntervalRef)
    }
    return unobserve
  }

}
