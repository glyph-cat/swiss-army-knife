import { VirtualizedSectionListProps } from '../../../abstractions'
import { SizeTrackingArray } from '../00-size-trackable-array'
import {
  findOverscannedIndex,
  getCorrectedIndexFromEstimation,
  getEstimatedFractionalIndex,
} from '../01-visibility'

// === NOTE ===
// - Fractional estimation gives a rough idea of where to start searching for
//   the first item to render instead of blindly searching from 0.
// - This keeps the search performance close to O(1) as much as possible.
// - Searching from 0 will be very exhausting when the scroll position is very far below.
// - The closer it is to the end of the list, the performance gets closer to O(n).
//   The downside is that the accuracy of estimation may be off by a few indices,
//   so we need to correct them by checking if the scroll position is actually
//   in between the start and end of the component from the estimated index.

export interface IRenderIndexRangePayload {
  /**
   * The starting index, with overscan considered.
   */
  indexStart: number
  /**
   * The ending index, with overscan considered.
   */
  indexEnd: number
  /**
   * The starting index, with only the scroll insets considered, but not overscan.
   */
  scrollInsetPaddedIndexStart: number
}

export function getRenderIndexRange<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  visibleStart: number,
  visibleEnd: number,
  sizeTracker: SizeTrackingArray<SectionData, ItemData>,
  listSize: number,
  scrollInsetPaddedVisibleStart: number,
): IRenderIndexRangePayload {

  const { overscan } = props
  const { M$flatData: flatData } = sizeTracker

  let indexStart = getEstimatedFractionalIndex(visibleStart, listSize, flatData.length)
  indexStart = getCorrectedIndexFromEstimation(visibleStart, indexStart, sizeTracker)
  indexStart = findOverscannedIndex(indexStart, overscan, sizeTracker, -1)

  let scrollInsetPaddedIndexStart = getEstimatedFractionalIndex(
    scrollInsetPaddedVisibleStart,
    listSize,
    flatData.length,
  )
  scrollInsetPaddedIndexStart = getCorrectedIndexFromEstimation(
    scrollInsetPaddedVisibleStart,
    scrollInsetPaddedIndexStart,
    sizeTracker,
  )

  let indexEnd = getEstimatedFractionalIndex(visibleEnd, listSize, flatData.length)
  indexEnd = getCorrectedIndexFromEstimation(visibleEnd, indexEnd, sizeTracker)
  indexEnd = findOverscannedIndex(indexEnd, overscan, sizeTracker, 1)

  return {
    indexStart,
    indexEnd,
    scrollInsetPaddedIndexStart,
  }

}
