import {
  NullableRefObject,
  RefObject,
  StringRecord,
} from '@glyph-cat/foundation'
import {
  Casing,
  objectMap,
  objectReduce,
  RectangularBoundary,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import {
  BasicButton,
  BasicUILayout,
  DisabledContext,
  ItemCellProps,
  SectionCellProps,
  SegmentedSelection,
  SegmentedSelectionItem,
  Switch,
  View,
  VirtualizedSectionList,
} from '@glyph-cat/swiss-army-knife-react'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from 'react'
import { DUMMY_SECTIONS, DummyItemData, DummySectionData } from './dummy-names'
import styles from './index.module.css'

import { CellType } from 'packages/react/src/virtualized-section-list/abstractions'

const ALL_CELL_TYPES: ReadonlyArray<CellType> = [
  CellType.ITEM,
  CellType.ITEM_SEPARATOR,
  CellType.SECTION_HEADER,
  CellType.SECTION_FOOTER,
]

interface IDemoOptionsState {
  overscanByCount: boolean
  listHeight: number
  listWidth: number
}

const DemoOptionsState = new SimpleStateManager<IDemoOptionsState>({
  listHeight: 400, // px
  listWidth: 300, // px
  overscanByCount: true,
})

interface IDemoPropsState {
  stickySectionHeaders: boolean
  overscanCount: number
  overscanSize: number
  layout: BasicUILayout
  disableVirtualization: boolean
}

const DemoPropsState = new SimpleStateManager<IDemoPropsState>({
  stickySectionHeaders: true,
  overscanCount: 0,
  overscanSize: 0,
  layout: 'vertical',
  disableVirtualization: false,
})

export default function (): ReactNode {

  const {
    visible: shouldShowBoundaries,
    ...cellVisibility
  } = useSimpleStateValue(BoundariesState)

  const {
    listHeight,
    listWidth,
    overscanByCount,
  } = useSimpleStateValue(DemoOptionsState)

  const {
    overscanCount,
    overscanSize,
    ...demoProps
  } = useSimpleStateValue(DemoPropsState)

  const updateBoundaries = useCallback(() => {
    // TODO: Add resize tracking too
    if (!shouldShowBoundaries) { return } // Early exit
    BoundaryMonitoredItems.set(
      objectReduce(BoundaryMonitorRefCollections.get(), (acc, value, key) => {
        const [ref] = value
        acc[key] = ref.current.getBoundingClientRect().toJSON()
        return acc
      }, {} as StringRecord<RectangularBoundary>)
    )
  }, [shouldShowBoundaries])

  return (
    <>
      <View className={styles.container}>
        <View className={styles.subContainer}>

          <View
            style={{
              overflow: 'auto',
              height: listHeight,
              resize: 'both', // TOFIX: Doesn't work when shrinking primary dimension
              width: listWidth,
            }}
          >
            <VirtualizedSectionList
              sections={DUMMY_SECTIONS}
              SectionHeader={{
                component: SectionHeader,
                size: 28,
              }}
              SectionFooter={{
                component: SectionFooter,
                size: 20,
              }}
              sectionKeyExtractor={sectionKeyExtractor}
              Item={{
                component: ListItem,
                size: 48,
              }}
              ItemSeparator={{
                component: ItemSeparator,
                size: 1,
              }}
              itemKeyExtractor={itemKeyExtractor}
              style={{
                border: 'solid 1px #80808040',
              }}
              TEMP_onScroll={updateBoundaries}
              overscan={overscanByCount ? { count: overscanCount } : { size: overscanSize }}
              {...demoProps}
            />
          </View>

          <View
            style={{
              gap: ThemeToken.spacingM,
              justifyItems: 'start',
              minWidth: 300,
            }}
          >
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td>
                    {'Overscan by'}
                  </td>
                  <td>
                    <SegmentedSelection
                      size='s'
                      value={overscanByCount}
                      onChange={useCallback((newValue: boolean) => {
                        DemoOptionsState.set((s) => ({
                          ...s,
                          overscanByCount: newValue,
                        }))
                      }, [])}
                    >
                      <SegmentedSelectionItem value={true}>
                        {'Count'}
                      </SegmentedSelectionItem>
                      <SegmentedSelectionItem value={false}>
                        {'Size'}
                      </SegmentedSelectionItem>
                    </SegmentedSelection>
                  </td>
                </tr>
                <tr>
                  <td>Layout</td>
                  <td>
                    <SegmentedSelection
                      size='s'
                      value={demoProps.layout}
                      onChange={useCallback((newLayout: BasicUILayout) => {
                        DemoPropsState.set((s) => ({
                          ...s,
                          layout: newLayout,
                        }))
                      }, [])}
                    >
                      <SegmentedSelectionItem value='vertical'>
                        {'Vertical'}
                      </SegmentedSelectionItem>
                      <SegmentedSelectionItem value='horizontal'>
                        {'Horizontal'}
                      </SegmentedSelectionItem>
                    </SegmentedSelection>
                  </td>
                </tr>
              </tbody>
            </table>
            <Switch
              color='danger'
              value={demoProps.disableVirtualization}
              onChange={useCallback((newValue: boolean) => {
                DemoPropsState.set((s) => ({
                  ...s,
                  disableVirtualization: newValue,
                }))
              }, [])}
            >
              {'Disable virtualization'}
            </Switch>
            <BasicButton
              template='text'
              size='s'
              onClick={DemoPropsState.reset}
            >
              {'Reset'}
            </BasicButton>

            <View
              style={{
                backgroundColor: ThemeToken.separatorColor,
                height: 1,
                width: '100%',
              }}
            />

            <Switch
              value={shouldShowBoundaries}
              onChange={useCallback((newValue: boolean) => {
                BoundariesState.set((s) => ({ ...s, visible: newValue }))
              }, [])}
            >
              {'Show boundaries'}
            </Switch>
            <View
              style={{
                gap: ThemeToken.spacingS,
                justifyItems: 'start',
                paddingInlineStart: ThemeToken.spacingM,
              }}
            >
              <DisabledContext disabled={!shouldShowBoundaries}>
                {ALL_CELL_TYPES.map((cellType) => {
                  return (
                    <Switch
                      key={cellType}
                      value={cellVisibility[cellType]}
                      onChange={useCallback((newValue: boolean) => {
                        BoundariesState.set((s) => ({ ...s, [cellType]: newValue }))
                      }, [cellType])}
                      size='s'
                    >
                      <code>{new Casing(CellType[cellType]).toPascalCase()}</code>
                    </Switch>
                  )
                })}
              </DisabledContext>
            </View>
            <BasicButton
              template='text'
              size='s'
              onClick={BoundariesState.reset}
            >
              {'Reset'}
            </BasicButton>
          </View>

        </View>
      </View>
      <BoundaryOverlay />
    </>
  )
}

function sectionKeyExtractor(
  sectionData: DummySectionData,
  sectionIndex: number,
  items: Array<DummyItemData>,
): string {
  return sectionData.group
}

function itemKeyExtractor(
  itemData: DummyItemData,
  itemIndex: number,
  sectionData: DummySectionData,
  sectionIndex: number,
): string {
  return itemData.id
}

const ListItem = memo(function ({
  data: { name },
  style,
}: ItemCellProps<DummySectionData, DummyItemData>): ReactNode {
  const viewRef = useRef<View>(null)
  useAddBoundaryMonitor(viewRef, CellType.ITEM)
  return (
    <View
      ref={viewRef}
      style={{
        ...style,
        alignItems: 'center',
        paddingInline: ThemeToken.spacingM,
      }}
    >
      {name}
    </View>
  )
})

const ItemSeparator = memo(function ({
  style,
}: ItemCellProps<DummySectionData, DummyItemData>): ReactNode {
  const viewRef = useRef<View>(null)
  useAddBoundaryMonitor(viewRef, CellType.ITEM_SEPARATOR)
  return (
    <View
      ref={viewRef}
      style={{
        ...style,
        backgroundColor: '#80808040',
      }}
    />
  )
})

const SectionHeader = memo(function ({
  data: { group },
  style,
  items,
}: SectionCellProps<DummySectionData, DummyItemData>): ReactNode {
  const viewRef = useRef<View>(null)
  useAddBoundaryMonitor(viewRef, CellType.SECTION_HEADER)
  return (
    <View
      ref={viewRef}
      style={{
        ...style,
        alignItems: 'center',
        backgroundColor: '#80808020',
        paddingInline: ThemeToken.spacingM,
      }}
    >
      <b>{group} ({items.length})</b>
    </View>
  )
})

const SectionFooter = memo(function ({
  data: { group },
  style,
}: SectionCellProps<DummySectionData, DummyItemData>): ReactNode {
  const viewRef = useRef<View>(null)
  useAddBoundaryMonitor(viewRef, CellType.SECTION_FOOTER)
  return (
    <View
      ref={viewRef}
      style={{
        ...style,
        alignItems: 'center',
        backgroundColor: '#80808010',
        color: '#808080',
        fontSize: '9pt',
        paddingInline: ThemeToken.spacingM,
      }}
    >
      <b>End of {group}</b>
    </View>
  )
})

// #region Boundary Overlay

interface IBoundariesState extends Record<CellType, boolean> {
  visible: boolean
  [CellType.SECTION_HEADER]: boolean
  [CellType.SECTION_FOOTER]: boolean
  [CellType.ITEM]: boolean
  [CellType.ITEM_SEPARATOR]: boolean
}

const BoundariesState = new SimpleStateManager<IBoundariesState>({
  visible: true,
  [CellType.SECTION_HEADER]: true,
  [CellType.SECTION_FOOTER]: true,
  [CellType.ITEM]: true,
  [CellType.ITEM_SEPARATOR]: true,
})

const BoundaryMonitorRefCollections = new SimpleStateManager<StringRecord<[RefObject<View>, CellType]>>({})
const BoundaryMonitoredItems = new SimpleStateManager<StringRecord<RectangularBoundary>>({})

function useAddBoundaryMonitor(ref: NullableRefObject<View>, cellType: CellType) {
  const shouldShowBoundaries = useSimpleStateValue(
    BoundariesState,
    (s) => s.visible && s[cellType]
  )
  const id = useId()
  useEffect(() => {
    if (!shouldShowBoundaries) { return } // Early exit
    BoundaryMonitorRefCollections.set((prevState) => ({
      ...prevState,
      [id]: [ref, cellType],
    }))
    return () => {
      BoundaryMonitorRefCollections.set((prevState) => {
        const { [id]: _, ...nextState } = prevState
        return nextState
      })
    }
  }, [cellType, id, ref, shouldShowBoundaries])
  useLayoutEffect(() => {
    if (!shouldShowBoundaries) { return } // Early exit
    BoundaryMonitoredItems.set((prevState) => ({
      ...prevState,
      [id]: ref.current?.getBoundingClientRect().toJSON(),
    }))
    return () => {
      BoundaryMonitoredItems.set((prevState) => {
        const { [id]: _, ...nextState } = prevState
        return nextState
      })
    }
  }, [cellType, id, ref, shouldShowBoundaries])
}

const separatorPadding = 40 // px
const separatorTranslateX = separatorPadding / 2 // px

function BoundaryOverlay(): ReactNode {
  const {
    visible: shouldShowBoundaries,
    ...cellVisibility
  } = useSimpleStateValue(BoundariesState)
  const boundaryMonitorRefCollections = useSimpleStateValue(BoundaryMonitorRefCollections)
  const boundaryMonitoredItems = useSimpleStateValue(BoundaryMonitoredItems)
  return shouldShowBoundaries && (
    <>
      {objectMap(boundaryMonitoredItems, (bounds, id) => {
        const [, cellType] = boundaryMonitorRefCollections[id]
        return cellVisibility[cellType] && (
          <View
            key={id}
            className={styles.boundary}
            style={{
              borderColor: `${CellTypeColor[cellType]}80`,
              height: bounds.height,
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              ...(cellType === CellType.ITEM_SEPARATOR ? {
                width: `calc(${bounds.width}px + ${separatorPadding}px)`,
                transform: `translateX(-${separatorTranslateX}px)`,
              } : {}),
            }}
          />
        )
      })}
    </>
  )
}

const CellTypeColor: Readonly<Record<CellType, string>> = {
  [CellType.ITEM]: '#bada55',
  [CellType.ITEM_SEPARATOR]: '#00ffff',
  [CellType.SECTION_HEADER]: '#ff6666',
  [CellType.SECTION_FOOTER]: '#cc80ff',
}

// #endregion Boundary Overlay
