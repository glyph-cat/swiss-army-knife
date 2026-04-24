import { isBoolean, isNumber, isString } from '@glyph-cat/type-checking'

/**
 * Concatenates CSS class names into a string.
 * Empty strings, boolean, `null`, and `undefined` will be ignored.
 * @deprecated in favor of [`clsx`](https://www.npmjs.com/package/clsx) for a
 * consistency with other existing web projects out there.
 * @public
 */
export function concatClassNames(...classNames: Array<string | boolean | number | null | undefined>): string {
  return classNames.filter((className) => {
    if (isString(className)) {
      return className
    }
    if (isNumber(className)) {
      return true
    }
    if (isBoolean(className)) {
      return false
    }
    return false
  }).join(' ').trim().replace(/\s+/g, ' ')
}

/**
 * An alias for {@link concatClassNames}.
 * @deprecated in favor of [`clsx`](https://www.npmjs.com/package/clsx) for a
 * consistency with other existing web projects out there.
 * @public
 */
export const c = concatClassNames
