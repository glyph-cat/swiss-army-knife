import { isString } from '@glyph-cat/type-checking'

export function normalizePattern(
  pattern: string | RegExp,
  caseSensitive: boolean | undefined,
): RegExp {
  return isString(pattern)
    ? new RegExp(`(${pattern})`, caseSensitive ? '' : 'i')
    : pattern // TODO: (low priority) try auto wrap regex with `()` if not already
}
