import {
  Empty,
  ExtendedCSSProperties,
  getFirstKey,
  InternalError,
  StringRecord,
} from '@glyph-cat/swiss-army-knife'
import { STYLE_HEIGHT, STYLE_WIDTH } from '../../../../styling/constants'
import { BASIC_UI_LAYOUT_VERTICAL } from '../../../../ui/basic/constants'
import { CellType, VirtualizedSectionListProps } from '../../../abstractions'

export const DEFAULT_PROPS: Partial<VirtualizedSectionListProps<any, any>> = {
  overscan: { count: 0 },
  initialScrollPosition: 0,
  layout: 'vertical',
}

export type IPropNormalizationPayload<SectionData, ItemData> = [
  normalizedProps: VirtualizedSectionListProps<SectionData, ItemData>,
  isLayoutVertical: boolean,
  primaryDimension: typeof STYLE_HEIGHT | typeof STYLE_WIDTH,
  secondaryDimension: typeof STYLE_HEIGHT | typeof STYLE_WIDTH,
]

export function normalizeProps<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>
): IPropNormalizationPayload<SectionData, ItemData> {
  const mergedProps: VirtualizedSectionListProps<SectionData, ItemData> = {
    ...props,
    ...DEFAULT_PROPS,
  }
  const isLayoutVertical = mergedProps.layout === BASIC_UI_LAYOUT_VERTICAL
  const isDirectionLtr = false // todo
  const normalizedProps: VirtualizedSectionListProps<SectionData, ItemData> = {
    ...mergedProps,
    scrollInsets: {
      ...mergedProps.scrollInsets,
      ...getDefaultScrollInsets(isLayoutVertical, isDirectionLtr),
    },
  }
  if (isLayoutVertical) {
    return [normalizedProps, isLayoutVertical, STYLE_HEIGHT, STYLE_WIDTH]
  } else {
    return [normalizedProps, isLayoutVertical, STYLE_WIDTH, STYLE_HEIGHT]
  }
}

export function getPropByCellType<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  cellType: CellType.ITEM,
): VirtualizedSectionListProps<SectionData, ItemData>['Item']

export function getPropByCellType<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  cellType: CellType.ITEM_SEPARATOR,
): VirtualizedSectionListProps<SectionData, ItemData>['ItemSeparator']

export function getPropByCellType<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  cellType: CellType.SECTION_HEADER,
): VirtualizedSectionListProps<SectionData, ItemData>['SectionHeader']

export function getPropByCellType<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  cellType: CellType.SECTION_FOOTER,
): VirtualizedSectionListProps<SectionData, ItemData>['SectionFooter']

export function getPropByCellType<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
  cellType: CellType,
): VirtualizedSectionListProps<SectionData, ItemData>[keyof VirtualizedSectionListProps<SectionData, ItemData>] {
  switch (cellType) {
    case CellType.ITEM: return props.Item
    case CellType.ITEM_SEPARATOR: return props.ItemSeparator
    case CellType.SECTION_HEADER: return props.SectionHeader
    case CellType.SECTION_FOOTER: return props.SectionFooter
    default: throw new InternalError(`Unrecognized cell type "${String(cellType)}"`)
  }
}

export function getDefaultScrollInsets(
  isLayoutVertical: boolean,
  isDirectionLtr: boolean,
): ExtendedCSSProperties {
  // TOFIX: unless there is a way to convert safe insets to pixel-based values
  if (isLayoutVertical) {
    return {
      start: 0, // SafeAreaInset.TOP,
      end: 0, // SafeAreaInset.BOTTOM,
    }
  } else {
    if (isDirectionLtr) {
      return {
        start: 0, // SafeAreaInset.LEFT,
        end: 0, // SafeAreaInset.RIGHT,
      }
    } else {
      return {
        start: 0, // SafeAreaInset.RIGHT,
        end: 0, // SafeAreaInset.LEFT,
      }
    }
  }
}

// #region Prop diffing

export function areVirtualizedSectionListPropsEqual<SectionData, ItemData>(
  prevProps: VirtualizedSectionListProps<SectionData, ItemData>,
  nextProps: VirtualizedSectionListProps<SectionData, ItemData>,
): boolean {
  const {
    SectionHeader: prevSectionHeader,
    Item: prevItem,
    ItemSeparator: prevItemSeparator,
    SectionFooter: prevSectionFooter,
    overscan: prevOverscan,
    scrollInsets: prevScrollInsets,
    ...remainingPrevProps
  } = prevProps
  return
}

export function flattenOneLevelObject(wrappedReference: StringRecord): StringRecord {
  const objectName = getFirstKey(wrappedReference)[0]
  const targetObject = wrappedReference[objectName]
  if (!targetObject) { return Empty.OBJECT } // Early exit
  return Object.keys(targetObject).reduce((acc, propertyKey) => {
    acc[`${objectName}-${propertyKey}`] = targetObject[propertyKey]
    return acc
  }, {} as StringRecord)

}

export function flattenPropsForDiffing<SectionData, ItemData>(
  props: VirtualizedSectionListProps<SectionData, ItemData>,
): StringRecord {
  const {
    SectionHeader,
    Item,
    ItemSeparator,
    SectionFooter,
    overscan,
    scrollInsets,
    ...remainingProps
  } = props
  return {
    ...flattenOneLevelObject({ SectionHeader }),
    ...flattenOneLevelObject({ Item }),
    ...flattenOneLevelObject({ ItemSeparator }),
    ...flattenOneLevelObject({ SectionFooter }),
    ...flattenOneLevelObject({ overscan }),
    ...remainingProps,
  }
}

// #endregion Prop diffing
