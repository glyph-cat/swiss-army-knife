// @ts-nocheck Might be pending a re-write
import type { CellType, ISection } from '../../../abstractions'

export interface BaseSizeTrackingData {
  /**
   * Start position in pixels.
   */
  M$start?: number
  /**
   * Size of the cell in pixels.
   */
  size: number
}

export interface SizeTrackingData<SectionData, ItemData> extends BaseSizeTrackingData {
  cellType: CellType
  section: ISection<SectionData, ItemData>
  sectionKey: string
  item?: ItemData
  itemKey?: string
}

export interface SectionSizeTrackingData<SectionData, ItemData> extends BaseSizeTrackingData {
  type: CellType.SECTION_HEADER | CellType.SECTION_FOOTER
  section: ISection<SectionData, ItemData>
  sectionKey: string
}

export interface ItemSizeTrackingData<SectionData, ItemData> extends Omit<SectionSizeTrackingData<SectionData, ItemData>, 'type'> {
  type: CellType.ITEM | CellType.ITEM_SEPARATOR
  item: ItemData
  itemKey: string
}

export class SizeTrackingArray<SectionData, ItemData> {

  M$accumulatedSize: number // px

  M$flatData: Array<SizeTrackingData<SectionData, ItemData>> = []

  constructor(initialSize: number) {
    this.M$accumulatedSize = initialSize
  }

  M$push(item: SizeTrackingData<SectionData, ItemData>): void {
    this.M$flatData.push({ ...item, M$start: this.M$accumulatedSize })
    this.M$accumulatedSize += item.size
  }

}
