import { StringRecord } from '@glyph-cat/swiss-army-knife'
import { CellType, VirtualizedSectionListProps } from '../../../abstractions'
import { getRenderKey } from '../00-render-key'
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

    const renderSectionHeaderKey = getRenderKey(CellType.SECTION_HEADER, sectionKey)
    sizeTracker.M$push({
      type: CellType.SECTION_HEADER,
      props: {
        renderKey: renderSectionHeaderKey,
        sectionKey,
        ...section,
      },
      size: SectionHeader.size,
    })

    section.items.forEach((item, itemIndex) => {

      const itemKey = itemKeyExtractor(item, itemIndex, section.data, sectionIndex)

      const renderItemKey = getRenderKey(CellType.ITEM, itemKey)
      sizeTracker.M$push({
        type: CellType.ITEM,
        props: {
          renderKey: renderItemKey,
          sectionKey: sectionKey,
          section,
          itemKey,
          data: item,
        },
        size: Item.size,
      })

      if (ItemSeparator) {
        const renderItemSeparatorKey = getRenderKey(CellType.ITEM_SEPARATOR, itemKey)
        sizeTracker.M$push({
          type: CellType.ITEM_SEPARATOR,
          props: {
            renderKey: renderItemSeparatorKey,
            sectionKey: sectionKey,
            section,
            itemKey,
            data: item,
          },
          size: ItemSeparator.size,
        })
      }

    })

    if (SectionFooter) {
      const renderSectionFooterKey = getRenderKey(CellType.SECTION_FOOTER, sectionKey)
      sizeTracker.M$push({
        type: CellType.SECTION_FOOTER,
        props: {
          renderKey: renderSectionFooterKey,
          sectionKey,
          ...section,
        },
        size: SectionFooter.size,
      })
    }

  })

  return {
    M$sizeTracker: sizeTracker,
    M$stickyHeaderReleaseMap: stickyHeaderReleaseMap,
  }

}
