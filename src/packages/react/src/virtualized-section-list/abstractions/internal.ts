export enum DimensionIdentifier {
  H = 'height',
  W = 'width',
}

export enum CellType {
  SECTION_HEADER = 1,
  // KIV: not sure if we really need `SECTION_SEPARATOR`
  SECTION_FOOTER,
  ITEM,
  ITEM_SEPARATOR,
}

export const RenderKeyPrefix = CellType

export enum StickyMode {
  NORMAL = 1,
  STICKY,
  RELEASED,
}
