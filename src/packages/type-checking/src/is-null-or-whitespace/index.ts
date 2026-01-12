import { Nullable } from '@glyph-cat/foundation'
import { isNull } from '../is-null'

/**
 * @public
 */
export function isNullOrWhitespace(value: Nullable<string>): boolean {
  return isNull(value) || value.trim() === ''
}
