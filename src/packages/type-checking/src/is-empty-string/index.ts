import { Nullable } from '@glyph-cat/foundation'

/**
 * @public
 */
export function isEmptyString(value: Nullable<string>): value is '' {
  return value === ''
}
