import { Nullable } from '@glyph-cat/foundation'
import { isNull } from '../../data'

/**
 * @public
 */
export function isNullOrEmpty(value: Nullable<string>): value is null | '' {
  return isNull(value) || value === ''
}

/**
 * @public
 */
export function isNullOrWhitespace(value: Nullable<string>): boolean {
  return isNull(value) || value.trim() === ''
}
