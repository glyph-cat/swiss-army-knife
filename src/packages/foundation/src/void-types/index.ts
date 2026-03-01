/**
 * @public
 */
export type Voidable<T> = T | void

/**
 * @public
 */
export type PossiblyUndefined<T> = T | undefined

/**
 * @public
 */
export type PossiblyNullOrUndefined<T> = T | null | undefined

/**
 * Used to indicate that a parameter is optional.
 *
 * This is equivalent to {@link PossiblyNullOrUndefined|`PossiblyNullOrUndefined`},
 * but semantically serves a different purpose.
 * @public
 */
export type Optional<T> = T | null | undefined
