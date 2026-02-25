/**
 * An alternative expression for `() => void`.
 * @public
 */
export type EmptyFunction = () => void

/**
 * A representation of a generic JavaScript function with type inference.
 * @example
 * let getSum: TypedFunction<[a: number, b: number], number>
 * getSum = (a, b) => a + b
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedFunction<Args extends any[] = any[], Payload = any> = (...args: Args) => Payload

/**
 * @public
 */
export type CleanupFunction = () => void

/**
 * @public
 */
export type CleanupFunctionWithArgs<T extends Array<unknown>> = (...args: T) => void

/**
 * @public
 */
export type Factory<T> = () => T

/**
 * @public
 */
export type FactoryWithArgs<T, Args extends Array<unknown>> = (...args: Args) => T
