/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function isCaseInsensitiveEqual(a: any, b: any): boolean {
  return (a as string)?.toLowerCase?.() === (b as string)?.toLowerCase?.()
}

export function isLocaleCaseInsensitiveEqual(a: any, b: any): boolean {
  return (a as string)?.toLocaleLowerCase?.() === (b as string)?.toLocaleLowerCase?.()
}
