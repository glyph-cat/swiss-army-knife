import { isNull } from '../is-null'

/**
 * @public
 */
export function isNullOrEmpty(value: unknown): value is null | '' {
  return isNull(value) || value === ''
}
