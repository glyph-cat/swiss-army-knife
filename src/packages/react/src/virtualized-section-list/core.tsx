import { isObject } from '@glyph-cat/swiss-army-knife'
import { JSX, memo, useRef, useState } from 'react'
import { objectIsShallowEqual } from '../../../equality/src'
import { ProbeView, SizeAwareContext, useSizeAwareHandle } from '../size-aware'
import { View } from '../ui'
import { CellType, VirtualizedSectionListProps } from './abstractions'
import { flattenProps, getRenderKey, SizeTrackingArray } from './utils'

/**
 * @public
 */
export const VirtualizedSectionList = memo(
  VirtualizedSectionListBase,
  (prevProps, nextProps) => objectIsShallowEqual(
    flattenProps(prevProps),
    flattenProps(nextProps),
  ),
)

function VirtualizedSectionListBase<SectionData, ItemData>({
  sections,
  stickySectionHeaders,
  SectionHeader,
  Item,
  ItemSeparator,
  SectionFooter,
  sectionKeyExtractor,
  itemKeyExtractor,
  overscan = { count: 0 },
  initialScrollPosition = 0,
  style,
  TEMP_onScroll,
}: VirtualizedSectionListProps<SectionData, ItemData>): JSX.Element {

  const outerElementRef = useRef<View>(null)
  const [scrollPosition, setScrollPosition] = useState(initialScrollPosition)
  const [cachedSizes, setCachedSizes] = useState<Record<string, number>>({})
  const containerSize = 0
  const visibleStart = scrollPosition
  // const scrollInsetPaddedVisibleStart = visibleStart + scrollInsetsStartPx
  const visibleEnd = scrollPosition + containerSize

  const [probeRef, bounds] = useSizeAwareHandle()

  return (
    <View>
      <ProbeView ref={probeRef} />
      {isObject(bounds) && (
        <SizeAwareContext value={bounds}>
          <View
            style={{
              height: bounds.contentRect.height,
              overflow: 'auto',
              width: bounds.contentRect.width,
              ...style,
            }}
            onScroll={TEMP_onScroll}
          >
            {(() => {

              const scrollInsetsStartPx = 0 // KIV/TODO
              const sizeTracker = new SizeTrackingArray<SectionData, ItemData>(scrollInsetsStartPx)

              return sections.reduce((acc, section, sectionIndex) => {

                const { data: sectionData, items } = section
                const sectionKey = sectionKeyExtractor(sectionData, sectionIndex, items)

                // #region Section Header

                const renderSectionHeaderKey = getRenderKey(CellType.SECTION_HEADER, sectionKey)
                acc.push(
                  <SectionHeader.component
                    key={renderSectionHeaderKey}
                    items={items}
                    style={{
                      height: SectionHeader.size,
                      position: 'absolute',
                      top: sizeTracker._accumulatedSize,
                      width: '100%', // TODO: Necessary for vertical list, adjust for horizontal
                    }}
                    data={sectionData}
                  />
                )
                sizeTracker._push({
                  type: CellType.SECTION_HEADER,
                  props: {
                    renderKey: renderSectionHeaderKey,
                    sectionKey,
                    ...section,
                  },
                  size: SectionHeader.size,
                })

                // #endregion Section Header

                section.items.forEach((item, itemIndex) => {

                  const itemKey = itemKeyExtractor(item, itemIndex, section.data, sectionIndex)

                  // #region Item

                  const renderItemKey = getRenderKey(CellType.ITEM, itemKey)
                  acc.push(
                    <Item.component
                      key={renderItemKey}
                      style={{
                        height: Item.size,
                        position: 'absolute',
                        top: sizeTracker._accumulatedSize,
                        width: '100%',
                      }}
                      sectionKey={sectionKey}
                      section={section}
                      data={item}
                    />
                  )
                  sizeTracker._push({
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

                  // #endregion Item

                  if (ItemSeparator) {
                    const renderItemSeparatorKey = getRenderKey(CellType.ITEM_SEPARATOR, itemKey)
                    acc.push(
                      <ItemSeparator.component
                        key={renderItemSeparatorKey}
                        style={{
                          height: ItemSeparator.size,
                          position: 'absolute',
                          top: sizeTracker._accumulatedSize,
                          width: '100%',
                        }}
                        sectionKey={sectionKey}
                        section={section}
                        data={item}
                      />
                    )
                    sizeTracker._push({
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

                // #region Item Separator

                if (SectionFooter) {
                  const sectionFooterKey = getRenderKey(CellType.SECTION_FOOTER, sectionKey)
                }

                // #endregion Item Separator

                return acc

              }, [])
            })()}
          </View>
        </SizeAwareContext>
      )}
    </View>
  )

}
