import { ExtendedCSSProperties } from '@glyph-cat/swiss-army-knife'
import { ComponentType, UIEventHandler } from 'react'
import { BasicUILayout } from '../../ui'
import { CellType } from './internal'

export enum StickyState {
  NORMAL,
  STICKY,
  RELEASED,
}

/**
 * @public
 */
export interface ISection<SectionData, ItemData> {
  data: SectionData
  items: Array<ItemData>
}

export interface BaseCellProps<PropsAsData> {
  style: ExtendedCSSProperties
  data: PropsAsData
  // /**
  //  * Indicates whether the list is scrolling
  //  */
  // isScrolling?: boolean
  // /**
  //  * - `0` — Completely not visible
  //  * - `1` — Completely visible
  //  * - Any value in between — Partially visible (percentage of visible cell area)
  //  */
  // visibility?: number
}

export interface SectionCellProps<SectionData, ItemData> extends BaseCellProps<SectionData> {
  items: Array<ItemData>
}

export interface ItemCellProps<SectionData, ItemData> extends BaseCellProps<ItemData> {
  sectionKey: string
  section: ISection<SectionData, ItemData>
}

export interface SectionHeaderCellProps<SectionData, ItemData> extends SectionCellProps<SectionData, ItemData> {
  stickyState?: StickyState
}

export interface SectionFooterCellProps<SectionData, ItemData> extends SectionCellProps<SectionData, ItemData> { }

export interface BaseCellConfig {
  size: number // px
  // todo: alternatively, accept `() => number` for scenarios where size are variable but can still be determined without needing to wait for render, given the item data or ID
  // trackScrolling?: boolean
  // estimated?: boolean // JIT size measurement, `size` is still mandatory, required as initial size
  // trackVisibility?: TrackVisibility
}

export interface ItemCellConfig<SectionData, ItemData> extends BaseCellConfig {
  component: ComponentType<ItemCellProps<SectionData, ItemData>>
}

export interface ItemSeparatorCellConfig<SectionData, ItemData> extends BaseCellConfig {
  component: ComponentType<ItemCellProps<SectionData, ItemData>>
}

export interface SectionHeaderCellConfig<SectionData, ItemData> extends BaseCellConfig {
  component: ComponentType<SectionHeaderCellProps<SectionData, ItemData>>
  trackSticky?: boolean
}

export interface SectionFooterCellConfig<SectionData, ItemData> extends BaseCellConfig {
  component: ComponentType<SectionFooterCellProps<SectionData, ItemData>>
}

/**
 * @public
 */
export interface VirtualizedSectionListProps<SectionData, ItemData> {
  TEMP_onScroll?: UIEventHandler<HTMLDivElement>
  sections: Array<ISection<SectionData, ItemData>>
  /**
   * @defaultValue `true`
   */
  stickySectionHeaders?: boolean
  SectionHeader: SectionHeaderCellConfig<SectionData, ItemData>
  Item: ItemCellConfig<SectionData, ItemData>
  /**
   * @defaultValue `undefined`
   */
  ItemSeparator?: ItemSeparatorCellConfig<SectionData, ItemData>
  /**
   * @defaultValue `undefined`
   */
  SectionFooter?: SectionFooterCellConfig<SectionData, ItemData>
  // note: the section data are eventually flattened out, the developer is responsible for generating unique keys in the implementation of both key extractors
  sectionKeyExtractor(
    sectionData: SectionData,
    sectionIndex: number,
    items: Array<ItemData>,
  ): string
  itemKeyExtractor(
    itemData: ItemData,
    itemIndex: number,
    sectionData: SectionData,
    sectionIndex: number,
  ): string
  /**
   * @defaultValue `{ count: 0 }`
   */
  overscan?: VirtualizedListOverScanOption
  /**
   * @defaultValue `0`
   */
  initialScrollPosition?: number
  /**
   * @defaultValue `undefined`
   */
  scrollInsets?: VirtualizedListScrollInsets
  /**
   * @defaultValue `BasicUILayout.vertical`
   */
  layout?: BasicUILayout
  /**
   * @defaultValue `undefined`
   */
  style?: ExtendedCSSProperties
  /**
   * @defaultValue `false`
   */
  disableVirtualization?: boolean
}

/**
 * @public
 */
export interface IVirtualizedSectionList {
  scrollTo(position: number): void
  scrollTo(cellType: CellType, key: string): void
  scrollBy(size: number): void
  forceUpdate(): void
}

/**
 * @public
 */
export interface VirtualizedListScrollInsets {
  start?: number
  end?: number
}

/**
 * @public
 */
export interface VirtualizedListOverScanOptionByCount {
  /**
   * Number of cells to overscan. This applies to both ends of the list.
   * A value of `1` means that 1 cell will be overscanned for top and bottom areas each.
   * @defaultValue `0`
   */
  count: number
  /**
   * The minimum size overscanned cells should take up.
   * This is useful for lists with very contrasting cell sizes.
   * A value of `100` means 100 pixels will be overscanned for top and bottom areas each.
   * @defaultValue `0`
   */
  pixels?: never
}

/**
 * @public
 */
export interface VirtualizedListOverScanOptionByMinSize {
  /**
   * Number of cells to overscan. This applies to both ends of the list.
   * A value of `1` means that 1 cell will be overscanned for top and bottom areas each.
   * @defaultValue `0`
   */
  count?: never
  /**
   * The minimum size overscanned cells should take up.
   * This is useful for lists with very contrasting cell sizes.
   * A value of `100` means 100 pixels will be overscanned for top and bottom areas each.
   * @defaultValue `0`
   */
  pixels: number
}

/**
 * @public
 */
export type VirtualizedListOverScanOption = VirtualizedListOverScanOptionByCount | VirtualizedListOverScanOptionByMinSize
