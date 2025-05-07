import { ReadonlyOrWritableArray } from '../../types'

/**
 * Concatenates CSS class names into a string. Falsy values will be ignored.
 * @public
 */
export function concatClassNames(...classNames: ReadonlyOrWritableArray<string>): string {
  return classNames.filter((className) => !!className)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * An alias for {@link concatClassNames}.
 * @public
 */
export const c = concatClassNames
