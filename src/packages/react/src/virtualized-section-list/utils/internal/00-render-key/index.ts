import { CellType } from '../../../abstractions'

const RENDER_KEY_PREFIX_DELIMITER = ':'

// todo: the section data are eventually flattened out, the developer is responsible for generating unique keys in the implementation of both key extractors... hence this should not be used anymore

/**
 * @deprecated
 */
export function getRenderKey(cellType: CellType, baseKey: string): string {
  return cellType + RENDER_KEY_PREFIX_DELIMITER + baseKey
}
