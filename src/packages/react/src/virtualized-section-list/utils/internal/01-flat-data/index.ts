import { StringRecord } from '@glyph-cat/foundation'
import { CellType, VirtualizedSectionListProps } from '../../../abstractions'
import { SizeTrackingArray } from '../00-size-trackable-array'

export interface IFlatDataPayload<SectionData, ItemData> {
  M$sizeTracker: SizeTrackingArray<SectionData, ItemData>
  /**
   * Dictionary storing information of when headers should be released after a
   * certain scroll point.
   * Keys in this object are based on the keys used for rendering in React.
   */
  M$stickyHeaderReleaseMap: StringRecord<number>
}

export function getFlatData<SectionData, ItemData>(
  {
    sections,
    SectionHeader,
    Item,
    ItemSeparator,
    SectionFooter,
    sectionKeyExtractor,
    itemKeyExtractor,
  }: VirtualizedSectionListProps<SectionData, ItemData>,
  scrollInsetsStartPx: number,
  _forceUpdateHash: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  // Include forceUpdateHash to bail out of memoization upon force refresh.
  // This allows ESLint to recognize and allow forceUpdateHash to be included in the dep array.
): IFlatDataPayload<SectionData, ItemData> {

  const sizeTracker = new SizeTrackingArray<SectionData, ItemData>(scrollInsetsStartPx)
  const stickyHeaderReleaseMap: StringRecord<number> = {}

  sections.forEach((section, sectionIndex) => {

    const { data: sectionData, items } = section
    const sectionKey = sectionKeyExtractor(sectionData, sectionIndex, items)
    sizeTracker.M$push({
      size: SectionHeader.size,
      cellType: CellType.SECTION_HEADER,
      sectionKey,
      section,
    })

    section.items.forEach((item, itemIndex) => {

      const itemKey = itemKeyExtractor(item, itemIndex, section.data, sectionIndex)
      sizeTracker.M$push({
        size: Item.size,
        cellType: CellType.ITEM,
        sectionKey,
        section,
        itemKey,
        item,
      })

      if (ItemSeparator) {
        sizeTracker.M$push({
          size: ItemSeparator.size,
          cellType: CellType.ITEM_SEPARATOR,
          sectionKey,
          section,
          itemKey,
          item,
        })
      }

    })

    if (SectionFooter) {
      sizeTracker.M$push({
        size: SectionFooter.size,
        cellType: CellType.SECTION_FOOTER,
        section,
        sectionKey,
      })
    }

  })

  return {
    M$sizeTracker: sizeTracker,
    M$stickyHeaderReleaseMap: stickyHeaderReleaseMap,
  }

}
