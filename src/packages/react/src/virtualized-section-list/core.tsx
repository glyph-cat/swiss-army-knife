import { ExtendedCSSProperties, isObject } from '@glyph-cat/swiss-army-knife'
import {
  ForwardedRef,
  forwardRef,
  JSX,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { objectIsShallowEqual } from '../../../equality/src'
import { forceUpdateReducer } from '../hooks'
import { ProbeView, SizeAwareContext, useSizeAwareHandle } from '../size-aware'
import {
  STYLE_100_PERCENT,
  STYLE_ABSOLUTE,
  STYLE_AUTO,
  STYLE_FIXED,
} from '../styling/constants'
import { View } from '../ui'
import { CellType, StickyMode, VirtualizedSectionListProps } from './abstractions'
import {
  flattenPropsForDiffing,
  getFlatData,
  getPropByCellType,
  getRenderIndexRange,
  normalizeProps,
} from './utils'

/**
 * @public
 */
interface IVirtualizedSectionList {
  scrollTo
  scrollBy
  scrollToItem
  forceUpdate(): void
}

/**
 * @public
 */
export const VirtualizedSectionList = memo(
  forwardRef(VirtualizedSectionListBase),
  (prevProps, nextProps) => objectIsShallowEqual(
    flattenPropsForDiffing(prevProps),
    flattenPropsForDiffing(nextProps),
  ),
)

function VirtualizedSectionListBase<SectionData, ItemData>(
  $props: VirtualizedSectionListProps<SectionData, ItemData>,
  ref: ForwardedRef<IVirtualizedSectionList>,
): JSX.Element {

  // #region Props

  const [
    props,
    isLayoutVertical,
    primaryDimension,
    secondaryDimension,
  ] = useMemo(() => normalizeProps($props), [$props])

  const {
    sections,
    stickySectionHeaders,
    SectionHeader,
    Item,
    ItemSeparator,
    SectionFooter,
    sectionKeyExtractor,
    itemKeyExtractor,
    overscan,
    initialScrollPosition,
    scrollInsets,
    layout,
    style,
    TEMP_onScroll,
  } = props

  // #endregion Props

  const [probeRef, bounds] = useSizeAwareHandle()
  const [forceUpdateHash, forceUpdate] = useReducer(forceUpdateReducer, 0)
  const outerElementRef = useRef<View>(null)
  const [scrollPosition, setScrollPosition] = useState(initialScrollPosition)
  const [isScrolling, setIsScrolling] = useState(false)
  const [containerStart, setContainerStart] = useState(0)
  const [cachedSizes, setCachedSizes] = useState<Record<string, number>>({})

  const containerSize = bounds?.contentRect.height ?? 0
  const visibleStart = scrollPosition
  const visibleEnd = scrollPosition + containerSize
  const scrollInsetPaddedVisibleStart = visibleStart + scrollInsets.start
  const scrollInsetPaddedVisibleEnd = visibleEnd - scrollInsets.end

  const {
    M$sizeTracker: sizeTracker,
    M$stickyHeaderReleaseMap: stickyHeaderReleaseMap,
  } = useMemo(() => {
    return getFlatData(props, scrollInsets.start, forceUpdateHash)
  }, [props, scrollInsets.start, forceUpdateHash])

  const listSize = sizeTracker.M$accumulatedSize + scrollInsets.end

  // #region Interface exposure

  const scrollTo = useCallback(() => {
    // ...
  }, [])

  const scrollBy = useCallback(() => {
    // ...
  }, [])

  const scrollToItem = useCallback(() => {
    // ...
  }, [])

  useImperativeHandle(ref, () => ({
    scrollTo,
    scrollBy,
    scrollToItem,
    forceUpdate,
  }), [scrollBy, scrollTo, scrollToItem])

  // #endregion Interface exposure

  // #region Effects

  useEffect(() => {
    // ...
    return () => {
      // ...
    }
  }, [])

  // #endregion Effects

  return (
    <View>
      <ProbeView ref={probeRef} />
      {isObject(bounds) && (
        <SizeAwareContext value={bounds}>
          <View
            style={{
              [primaryDimension]: bounds.contentRect.height,
              overflow: STYLE_AUTO,
              ...style,
            }}
            onScroll={TEMP_onScroll}
          >
            <View
              style={{
                height: listSize,
              }}
            >
              {(() => {

                if (sections.length <= 0) { return null } // Early exit

                const {
                  indexStart,
                  indexEnd,
                  scrollInsetPaddedIndexStart,
                } = getRenderIndexRange(
                  props,
                  visibleStart,
                  visibleEnd,
                  sizeTracker,
                  listSize,
                  scrollInsetPaddedVisibleStart,
                )

                let keyOfHeaderThatShouldBeSticky = ''
                let keyOfNextSection = ''
                let indexOfNextSection = -1

                // Determine indices to render
                let renderIndexStack: Array<number> = []

                if (indexStart === indexEnd) {
                  renderIndexStack.push(indexStart)
                } else {
                  // NOTE: Render range is inclusive of `indexStart` and `indexEnd`
                  for (let i = indexStart; i <= indexEnd; i++) {
                    renderIndexStack.push(i)
                  }
                }

                const sectionHeadersThatShouldBeInReleaseMode = new Set<number>()

                if (stickySectionHeaders && scrollPosition >= 0) {
                  // ...
                }

                const { M$flatData: flatData } = sizeTracker

                return renderIndexStack.map((renderIndex) => {

                  const {
                    type: currentCellType,
                    props: currentCellComponentProps,
                    M$start: currentCellStart,
                    size: currentCellSize,
                    // secrets: currentCellSecrets,
                  } = flatData[renderIndex]

                  const isHeaderType = currentCellType === CellType.SECTION_HEADER ||
                    currentCellType === CellType.SECTION_FOOTER
                  const {
                    component: RenderCellComponent,
                    // trackScrolling,
                    // trackVisibility,
                    // trackSticky,
                    // estimated,
                  } = getPropByCellType(props, currentCellType)

                  const shouldBeSticky = isHeaderType && stickySectionHeaders && currentCellComponentProps.sectionKey === keyOfHeaderThatShouldBeSticky

                  let nextSectionHeaderStart = 0
                  let shouldReleaseSticky = false

                  if (flatData[indexOfNextSection]) {
                    nextSectionHeaderStart = flatData[indexOfNextSection].M$start
                    shouldReleaseSticky = nextSectionHeaderStart - currentCellSize < scrollInsetPaddedVisibleStart
                  }

                  const shouldReleaseStickyAsPrev = sectionHeadersThatShouldBeInReleaseMode.has(renderIndex)
                  let stickyMode = StickyMode.NORMAL

                  let anchorStart = 'top' // temp
                  const virtualizationStyles: ExtendedCSSProperties = {
                    [primaryDimension]: Item.size,
                    [secondaryDimension]: STYLE_100_PERCENT,
                  }
                  if (shouldBeSticky) {
                    if (shouldReleaseSticky) {
                      virtualizationStyles[anchorStart] = nextSectionHeaderStart - currentCellSize
                      virtualizationStyles.position = STYLE_ABSOLUTE
                      stickyMode = StickyMode.RELEASED
                    } else {
                      virtualizationStyles[anchorStart] = containerStart
                      virtualizationStyles.position = STYLE_FIXED
                      stickyMode = StickyMode.STICKY
                    }
                    virtualizationStyles.zIndex = 1
                  } else {
                    if (shouldReleaseStickyAsPrev) {
                      virtualizationStyles[anchorStart] = stickyHeaderReleaseMap[currentCellComponentProps.renderKey]
                      virtualizationStyles.position = STYLE_ABSOLUTE
                      stickyMode = StickyMode.RELEASED
                      virtualizationStyles.zIndex = 1
                    } else {
                      virtualizationStyles[anchorStart] = currentCellStart
                      virtualizationStyles.position = STYLE_ABSOLUTE
                      virtualizationStyles.zIndex = 0
                    }
                  }

                  if (currentCellType === CellType.ITEM) {
                    return (
                      <RenderCellComponent
                        key={currentCellComponentProps.renderKey}
                        section={currentCellComponentProps.section}
                        data={currentCellComponentProps.data}
                        sectionKey={currentCellComponentProps.sectionKey}
                        style={virtualizationStyles}
                      // style={{
                      //   ...virtualizationStyles,
                      //   [primaryDimension]: Item.size,
                      //   [secondaryDimension]: STYLE_100_PERCENT,
                      //   // position: STYLE_ABSOLUTE,
                      // }}
                      />
                    )
                  }

                  return null

                })

              })()}
            </View>
          </View>
        </SizeAwareContext>
      )}
    </View>
  )

}

// acc.push(
//   <SectionHeader.component
//     key={renderSectionHeaderKey}
//     items={items}
//     style={{
//       height: SectionHeader.size,
//       position: STYLE_ABSOLUTE,
//       top: sizeTracker._accumulatedSize,
//       width: STYLE_100_PERCENT, // TODO: Necessary for vertical list, adjust for horizontal
//     }}
//     data={sectionData}
//   />
// )

// acc.push(
//   <Item.component
//     key={renderItemKey}
//     style={{
//       height: Item.size,
//       position: STYLE_ABSOLUTE,
//       top: sizeTracker._accumulatedSize,
//       width: STYLE_100_PERCENT,
//     }}
//     sectionKey={sectionKey}
//     section={section}
//     data={item}
//   />
// )

// acc.push(
//   <ItemSeparator.component
//     key={renderItemSeparatorKey}
//     style={{
//       height: ItemSeparator.size,
//       position: STYLE_ABSOLUTE,
//       top: sizeTracker._accumulatedSize,
//       width: STYLE_100_PERCENT,
//     }}
//     sectionKey={sectionKey}
//     section={section}
//     data={item}
//   />
// )
