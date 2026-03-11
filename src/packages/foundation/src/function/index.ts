/**
 * A representation of a generic JavaScript function with type inference.
 * @example
 * let getSum: TypedFunction<[a: number, b: number], number>
 * getSum = (a, b) => a + b
 * @public
 * @deprecated Please use {@link Fn|`Fn`} instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedFunction<Args extends any[] = any[], Payload = any> = (...args: Args) => Payload

/**
 * A representation of a generic JavaScript function with type inference.
 * @example
 * // Function that accepts no parameter and returns nothing
 * const doSomething: Fn = () => { }
 *
 * // Function that accepts one parameter but returns nothing
 * const setValue: Fn<number> = (value) => { someValue = value }
 *
 * // Function that accepts no parameter and returns a number
 * const getRandomNumber: Fn<void, number> = () => Math.random()
 *
 * // Function that accepts one parameter and returns something
 * const isEven: Fn<number, boolean> = (value) => value % 2 === 0
 *
 * // Function that accepts multiple parameters and returns something
 * const getSum: Fn<[number, number], number> = (a, b) => a + b
 *
 * // Function that accepts one array parameter and returns something
 * const concat: Fn<[Array<string>], string> = (values) => values.join(',')
 * @public
 */
export type Fn<T = void, K = void> = T extends unknown[]
  ? (...args: T) => K
  : (T extends void ? () => K : (arg: T) => K)

/**
 * An alternative expression for `() => void`.
 * @public
 */
export type EmptyFunction = Fn

/**
 * @example
 * // Cleanup function that accepts no parameters
 * CleanupFunction // () => void
 *
 * // Cleanup function that accepts one parameter
 * CleanupFunction<number> // (arg_0: number) => void
 *
 * // Cleanup function that accepts multiple parameters
 * CleanupFunction<[number, string]> // (arg_0: number, arg_1: string) => void
 * @public
 */
export type CleanupFunction<T = void> = Fn<T>

/**
 * @example
 * // Factory that accepts no parameters
 * Factory<number> // () => number
 *
 * // Factory that accepts one parameter
 * Factory<number, boolean> // (arg_0: number) => boolean
 *
 * // Factory that accepts multiple parameters
 * Factory<[number, string], boolean> // (arg_0: number, arg_1: string) => boolean
 * @public
 */
export type Factory<T, K = void> = K extends void ? Fn<void, T> : Fn<T, K>
