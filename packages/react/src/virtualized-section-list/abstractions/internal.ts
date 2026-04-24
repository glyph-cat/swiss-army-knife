export enum DimensionIdentifier {
  H = 'height',
  W = 'width',
}

export enum CellType {
  ITEM = 1,
  ITEM_SEPARATOR,
  SECTION_HEADER,
  SECTION_FOOTER,
  // SECTION_SEPARATOR,
  // KIV: not sure if we really need a section separator
}

export const RenderKeyPrefix = CellType

export enum StickyMode {
  NORMAL = 1,
  STICKY,
  RELEASED,
}
