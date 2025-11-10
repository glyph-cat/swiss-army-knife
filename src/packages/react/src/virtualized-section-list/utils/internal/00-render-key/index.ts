import { CellType } from '../../../abstractions'

const RENDER_KEY_PREFIX_DELIMITER = ':'

export function getRenderKey(cellType: CellType, baseKey: string): string {
  return cellType + RENDER_KEY_PREFIX_DELIMITER + baseKey
}
