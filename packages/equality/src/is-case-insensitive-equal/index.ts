/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @public
 */
export function isCaseInsensitiveEqual(
  a: any,
  b: any,
): boolean {
  return (a as string)?.toLowerCase?.() === (b as string)?.toLowerCase?.()
}

/**
 * @public
 */
export function isLocaleCaseInsensitiveEqual(
  a: any,
  b: any,
  locales?: Intl.LocalesArgument,
): boolean {
  return (a as string)?.toLocaleLowerCase?.(locales) === (b as string)?.toLocaleLowerCase?.(locales)
}
