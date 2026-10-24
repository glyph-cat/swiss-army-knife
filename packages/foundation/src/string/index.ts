/**
 * @public
 */
export type LenientString<T> = T | (string & {})

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NonEmptyString = `${any}${string}`
