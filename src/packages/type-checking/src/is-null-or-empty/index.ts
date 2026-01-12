import { Nullable } from '@glyph-cat/foundation'
import { isNull } from '../is-null'

/**
 * @public
 */
export function isNullOrEmpty(value: Nullable<string>): value is null | '' {
  return isNull(value) || value === ''
}
