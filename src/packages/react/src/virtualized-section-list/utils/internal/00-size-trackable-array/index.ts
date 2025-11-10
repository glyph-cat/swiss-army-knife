import type { CellType, ISection } from '../../../abstractions'

export interface BaseSizeTrackingData {
  M$start?: number // px
  size: number // px
}

export type SizeTrackingData<SectionData, ItemData> = SectionSizeTrackingData<SectionData, ItemData> | ItemSizeTrackingData<SectionData, ItemData>

export interface SectionSizeTrackingData<SectionData, ItemData> extends BaseSizeTrackingData {
  type: CellType.SECTION_HEADER | CellType.SECTION_FOOTER
  props: SizeTrackingSectionProps<SectionData, ItemData>
}

export interface ItemSizeTrackingData<SectionData, ItemData> extends BaseSizeTrackingData {
  type: CellType.ITEM | CellType.ITEM_SEPARATOR
  props: SizeTrackableItemProps<SectionData, ItemData>
}

export interface SizeTrackingBaseProps {
  renderKey: string
  sectionKey: string
}

export type SizeTrackingSectionProps<SectionData, ItemData> = SizeTrackingBaseProps & ISection<SectionData, ItemData>

export type SizeTrackableItemProps<SectionData, ItemData> = SizeTrackingBaseProps & {
  section: ISection<SectionData, ItemData>
  itemKey: string
  data: ItemData
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
