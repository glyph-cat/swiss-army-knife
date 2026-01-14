/**
 * Concatenates CSS class names into a string. Falsy values will be ignored.
 * @public
 */
export function concatClassNames(...classNames: Array<string | null | undefined | false>): string {
  return classNames.filter((className) => !!className)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// /**
//  * An alias for {@link concatClassNames}.
//  * @public
//  */
// export const c = concatClassNames

/**
 * Concatenates CSS class names into a string. Falsy values will be ignored.
 * @public
 */
export function c(...classNames: Array<string | null | undefined | false>): string {
  return classNames.filter((className) => !!className)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}
