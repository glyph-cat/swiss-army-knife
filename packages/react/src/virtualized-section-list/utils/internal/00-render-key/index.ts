// @ts-nocheck Might be pending a re-write
import { CellType } from '../../../abstractions'

const RENDER_KEY_PREFIX_DELIMITER = ':'

/**
 * Derive render key from a base section/item key for different cell types.
 * - Section
 *   - Section Header
 *   -  Section Footer
 * - Item
 *   - Item
 *   - Item Separator
 */
export function getRenderKey(cellType: CellType, baseKey: string): string {
  return cellType + RENDER_KEY_PREFIX_DELIMITER + baseKey
}
