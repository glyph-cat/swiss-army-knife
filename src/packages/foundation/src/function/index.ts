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
export type CleanupFunction<T = unknown> = (object?: T) => void
