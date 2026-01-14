import { CSSPropertiesExtended } from '@glyph-cat/css-utils'
import { InternalError } from '@glyph-cat/swiss-army-knife'
import { isNull, isObject } from '@glyph-cat/type-checking'
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
import {
  CellType,
  IVirtualizedSectionList,
  StickyMode,
  VirtualizedSectionListProps,
} from './abstractions'
import {
  flattenPropsForDiffing,
  getFlatData,
  getPropByCellType,
  getRenderIndexRange,
  getRenderKey,
  normalizeProps,
} from './utils'

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

// NOTES:
// 1. Whether the list is scrolling, this can/should be implemented by dev for
//    full control (incl. debouncing/throttling) and save development overhead.
//    `const [isScrolling, setIsScrolling] = useState(false)`

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
    disableVirtualization,
  } = props

  // #endregion Props

  const [probeRef, bounds] = useSizeAwareHandle()
  const [forceUpdateHash, forceUpdate] = useReducer(forceUpdateReducer, 0)

  // const outerElementRef = useRef<View>(null)
  const containerRef = useRef<View>(null)

  const [scrollPosition, setScrollPosition] = useState(initialScrollPosition)
  const [containerStart, setContainerStart] = useState(0)
  const [cachedSizes, setCachedSizes] = useState<Record<string, number>>({})

  const containerSize = bounds?.height ?? 0
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

  const scrollTo = useCallback((...args: [number] | [CellType, string]) => {
    // ...
  }, [])

  const scrollBy = useCallback((size: number) => {
    // ...
  }, [])

  useImperativeHandle(ref, () => ({
    scrollTo,
    scrollBy,
    forceUpdate,
  }), [scrollBy, scrollTo])

  // #endregion Interface exposure

  // #region Effects

  useEffect(() => {
    if (isNull(bounds)) { return } // Early exit
    const target = containerRef.current
    if (!target) { return } // Early exit
    const onScroll = (e: Event) => {
      setScrollPosition(target.scrollTop)
      TEMP_onScroll?.(e as any)
    }
    target.addEventListener('scroll', onScroll)
    return () => { target.removeEventListener('scroll', onScroll) }
  }, [TEMP_onScroll, bounds])

  // #endregion Effects

  return (
    <View>
      <ProbeView ref={probeRef} />
      {isObject(bounds) && (
        <SizeAwareContext value={bounds}>
          <View
            ref={containerRef}
            style={{
              [primaryDimension]: bounds.height,
              overflow: STYLE_AUTO,
              ...style,
            }}
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
                  if (disableVirtualization) {
                    for (let i = 0; i < sizeTracker.M$flatData.length; i++) {
                      renderIndexStack.push(i)
                    }
                  } else {
                    // NOTE: Render range is inclusive of `indexStart` and `indexEnd`
                    for (let i = indexStart; i <= indexEnd; i++) {
                      renderIndexStack.push(i)
                    }
                  }
                }

                const sectionHeadersThatShouldBeInReleaseMode = new Set<number>()

                if (stickySectionHeaders && scrollPosition >= 0) {
                  // ...
                }

                const { M$flatData: flatData } = sizeTracker

                return renderIndexStack.map((renderIndex) => {

                  console.log('renderIndex', renderIndex)
                  const {
                    M$start: currentCellStart,
                    size: currentCellSize,
                    cellType,
                    section,
                    sectionKey,
                    item,
                    itemKey,
                  } = flatData[renderIndex]

                  const isHeaderType = cellType === CellType.SECTION_HEADER ||
                    cellType === CellType.SECTION_FOOTER
                  // const {
                  //   component: RenderCellComponent,
                  //   // trackScrolling,
                  //   // trackVisibility,
                  //   // trackSticky,
                  //   // estimated,
                  // } = getPropByCellType(props, cellType)

                  const shouldBeSticky = isHeaderType && stickySectionHeaders && sectionKey === keyOfHeaderThatShouldBeSticky

                  let nextSectionHeaderStart = 0
                  let shouldReleaseSticky = false

                  if (flatData[indexOfNextSection]) {
                    nextSectionHeaderStart = flatData[indexOfNextSection].M$start
                    shouldReleaseSticky = nextSectionHeaderStart - currentCellSize < scrollInsetPaddedVisibleStart
                  }

                  const shouldReleaseStickyAsPrev = sectionHeadersThatShouldBeInReleaseMode.has(renderIndex)
                  let stickyMode = StickyMode.NORMAL

                  let anchorStart = 'top' // temp
                  const virtualizationStyles: CSSPropertiesExtended = {
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
                      virtualizationStyles[anchorStart] = stickyHeaderReleaseMap[getRenderKey(CellType.SECTION_HEADER, sectionKey)]
                      virtualizationStyles.position = STYLE_ABSOLUTE
                      stickyMode = StickyMode.RELEASED
                      virtualizationStyles.zIndex = 1
                    } else {
                      virtualizationStyles[anchorStart] = currentCellStart
                      virtualizationStyles.position = STYLE_ABSOLUTE
                      virtualizationStyles.zIndex = 0
                    }
                  }

                  switch (cellType) {
                    // NOTE: cell types are sorted by typical frequency
                    case CellType.ITEM: {
                      return (
                        <Item.component
                          key={getRenderKey(cellType, itemKey)}
                          section={section}
                          sectionKey={sectionKey} // KIV: do we need this?
                          data={item}
                          style={{
                            ...virtualizationStyles,
                            [primaryDimension]: Item.size,
                          }}
                        />
                      )
                    }
                    case CellType.ITEM_SEPARATOR: {
                      return (
                        <ItemSeparator.component
                          key={getRenderKey(cellType, itemKey)}
                          section={section}
                          sectionKey={sectionKey} // KIV: do we need this?
                          data={item}
                          style={{
                            ...virtualizationStyles,
                            [primaryDimension]: ItemSeparator.size,
                          }}
                        />
                      )
                    }
                    case CellType.SECTION_HEADER: {
                      return (
                        <SectionHeader.component
                          key={getRenderKey(cellType, sectionKey)}
                          {...section}
                          style={{
                            ...virtualizationStyles,
                            [primaryDimension]: SectionHeader.size,
                          }}
                        />
                      )
                    }
                    case CellType.SECTION_FOOTER: {
                      return (
                        <SectionFooter.component
                          key={getRenderKey(cellType, sectionKey)}
                          {...section}
                          style={{
                            ...virtualizationStyles,
                            [primaryDimension]: SectionFooter.size,
                          }}
                        />
                      )
                    }
                    default: {
                      throw new InternalError(`Unknown cell type "${String(cellType)}"`)
                    }
                  }

                })

              })()}
            </View>
          </View>
        </SizeAwareContext>
      )}
    </View>
  )

}
