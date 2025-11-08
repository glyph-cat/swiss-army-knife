import type { CellType, ISection } from '../../../abstractions'

export interface BaseSizeTrackingData {
  _start?: number // px
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

  _accumulatedSize: number // px

  _trackingData: Array<SizeTrackingData<SectionData, ItemData>> = []

  constructor(initialSize: number) {
    this._accumulatedSize = initialSize
  }

  _push(item: SizeTrackingData<SectionData, ItemData>): void {
    this._trackingData.push({ ...item, _start: this._accumulatedSize })
    this._accumulatedSize += item.size
  }

}
