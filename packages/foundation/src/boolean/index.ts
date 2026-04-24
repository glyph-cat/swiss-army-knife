/**
 * @public
 */
export type Falsable<T> = T | false

/**
 * @public
 */
export enum ShortBool {
  NO,
  YES,
}

// /**
//  * String representation of boolean `true`.
//  *
//  * Purposes:
//  *  - Eliminate typing mistakes.
//  *  - Reduce bundle size by only having one declaration.
//  *  - Does not rely on `String(true)`, which value can only be produced at runtime,
//  *    and could not be used by compilers for optimizations such as trimming dead code.
//  * @public
//  */
// export const TRUE = 'true'

// /**
//  * String representation of boolean `false`.
//  *
//  * Purposes:
//  *  - Eliminate typing mistakes.
//  *  - Reduce bundle size by only having one declaration.
//  *  - Does not rely on `String(false)`, which value can only be produced at runtime,
//  *    and could not be used by compilers for optimizations such as trimming dead code.
//  * @public
//  */
// export const FALSE = 'false'
