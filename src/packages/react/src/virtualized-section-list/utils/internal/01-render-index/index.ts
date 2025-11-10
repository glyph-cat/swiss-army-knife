import { VirtualizedSectionListProps } from '../../../abstractions'
import { SizeTrackingArray } from '../00-size-trackable-array'

export interface IRenderIndexRangePayload {
  indexStart: number
  indexEnd: number
  scrollInsetPaddedIndexStart: number
}

export function getRenderIndexRange<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  visibleStart: number,
  visibleEnd: number,
  sizeTracker: SizeTrackingArray<SectionData, ItemData>,
  scrollInsetPaddedVisibleStart: number,
): IRenderIndexRangePayload {

  return {
    indexStart: 0, // temp
    indexEnd: 0, // temp
    scrollInsetPaddedIndexStart: 0, // temp
  }

}
