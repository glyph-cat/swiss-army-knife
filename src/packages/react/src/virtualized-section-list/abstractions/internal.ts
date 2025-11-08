export enum DimensionIdentifier {
  H = 'height',
  W = 'width',
}

export enum CellType {
  SECTION_HEADER = 1,
  // SECTION_SEPARATOR,
  SECTION_FOOTER,
  ITEM,
  ITEM_SEPARATOR,
}

export const RenderKeyPrefix = CellType
