import { clamp, isClamped, isNumber } from '@glyph-cat/swiss-army-knife'
import { CellType, VirtualizedListOverScanOption } from '../../../abstractions'
import { SizeTrackingArray, SizeTrackingData } from '../00-size-trackable-array'

/**
 * Find the estimated index based on the given specs
 * @param position - This can be `visibleStart` or `visibleEnd`
 * @param listSize - Total size of all cells; is also the size of inner container
 * @param flatDataLength - `flatData.length`
 */
export function getEstimatedFractionalIndex(
  position: number,
  listSize: number,
  flatDataLength: number,
): number {
  // NOTE: The valid range is from 0 to (flatDataLength - 1) after all
  const fraction = clamp(position, 0, listSize) / listSize
  return Math.floor(fraction * (flatDataLength - 1))
}

export function checkPositionStatusWithBounds<SectionData, ItemData>(
  position: number,
  flatDataItem: SizeTrackingData<SectionData, ItemData>,
): -1 | 0 | 1 {
  const { M$start, size } = flatDataItem
  const lBound = M$start
  const uBound = lBound + size
  if (position < lBound) {
    return -1 // NOTE: Before bound, index needs to be stepped backward, therefore -1
  } else if (position > uBound) {
    return 1  // NOTE: After bound, index needs to be stepped forward, therefore +1
  } else {
    return 0  // NOTE: Within bound, nothing needs to be done, therefore 0
  }
}

/**
 * Corrects the estimated index by first checking if `position` is within
 * the bounds of the estimated flat data item.
 * Then, either step up/down the index until an item is found where `position`
 * is within its bounds.
 * @param position - This can be `visibleStart` or `visibleEnd`.
 */
export function getCorrectedIndexFromEstimation<SectionData, ItemData>(
  position: number,
  index: number,
  sizeTracker: SizeTrackingArray<SectionData, ItemData>,
): number {

  const { M$flatData: flatData } = sizeTracker

  let stepper = checkPositionStatusWithBounds(position, flatData[index])

  while (stepper !== 0) {

    // Peek into next item by declaring new variables (nothing is modified)
    const nextIndex = index + stepper
    const nextIndexIsValid = isClamped(nextIndex, 0, flatData.length - 1)

    if (!nextIndexIsValid) { break } // Breaks if next index is invalid

    // Finally, make changes to the variables that persist across the loops
    // That is, if the loop doesn't break at the line above
    index = nextIndex
    stepper = checkPositionStatusWithBounds(position, flatData[index])

  }

  return index

}

export function findOverscannedIndex<SectionData, ItemData>(
  index: number,
  overscan: VirtualizedListOverScanOption,
  sizeTracker: SizeTrackingArray<SectionData, ItemData>,
  stepper: -1 | 1,
): number {

  const { M$flatData: flatData } = sizeTracker

  let overscanCountTracker = 0
  let overscanMinSizeTracker = 0

  while (
    (isNumber(overscan.count) && (overscanCountTracker < overscan.count)) ||
    (isNumber(overscan.pixels) && (overscanMinSizeTracker < overscan.pixels))
  ) {

    // Peek into next item by declaring new variables (nothing is modified)
    // NOTE: Loop will be infinite if `stepper` is 0
    const nextIndex = index + stepper

    // We do not have to iterate any further if next index is out of valid range.
    if (nextIndex < 0 || nextIndex >= flatData.length) { break }

    // Finally, make changes to the variables that persist across the loops
    // That is, if the loop doesn't break at the line above
    index = nextIndex

    // NOTE: Separator types are ignored
    if (flatData[index].cellType !== CellType.ITEM_SEPARATOR) {
      overscanCountTracker += 1
    }

    overscanMinSizeTracker += flatData[index].size

  }

  return index

}
