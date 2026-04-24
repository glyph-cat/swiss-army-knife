import { TypedFunction } from '../function'

/**
 * @public
 */
export type Awaitable<T> = T | Promise<T>

/**
 * @example
 * async function getString(): Promise<string> {
 *   return 'Hello, world!'
 * }
 * let myString: AwaitedReturnType<typeof getString>
 * myString = await getString()
 * @public
 */
export type AwaitedReturnType<T extends TypedFunction> = Awaited<ReturnType<T>>
