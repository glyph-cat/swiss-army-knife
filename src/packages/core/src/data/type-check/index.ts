import { PlainRecord, TypedFunction } from '../../types'

/**
 * Determine if a value is a boolean.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a boolean.
 * @public
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Determine if a value is a function.
 * @param value - The value to check.
 * @example
 * const getSum = (a: number, b: number): number => a + b
 * isTypedFunction<[a: number, b: number], number>(getSum)
 * // NOTE: Type inference is optional
 * @returns A boolean indicating whether the value is a function.
 * @returns A boolean indicating whether the value is a function.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction<Args extends any[] = any[], Payload = any>(
  value: unknown
): value is TypedFunction<Args, Payload> {
  return typeof value === 'function'
}

/**
 * Determine if a value is `NaN`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is `NaN`.
 * @public
 */
export function isNaN(value: unknown): value is typeof NaN {
  return Object.is(value, NaN)
}

/**
 * Determine if a value is a number or `NaN`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a number or `NaN`.
 * @public
 */
export function isNumberOrNaN(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Determine if a value is a number.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a number.
 * @public
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Determine if a value is an object (and not `null`, even though `null` is also
 * treated as an object in JavaScript).
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object (and not `null`).
 * @public
 */
export function isObject(value: unknown): value is PlainRecord {
  return typeof value === 'object' && !isNull(value)
}

/**
 * Determine if a value is an object or `null` (because `null` is also
 * treated as an object in JavaScript).
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object or `null`.
 * @public
 */
export function isObjectOrNull(value: unknown): value is PlainRecord | null {
  return typeof value === 'object'
}

/**
 * Determine if a value is an object (and not `null`, even though `null` is also
 * treated as an object in JavaScript).
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object (and not `null`).
 * @public
 * @deprecated Please use {@link isObject | `isObject`} instead.
 */
export function isObjectNotNull(value: unknown): value is PlainRecord {
  return typeof value === 'object' && !isNull(value)
}

/**
 * Determine if a value is a string.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a string.
 * @public
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Determine if a value is a symbol.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a symbol.
 * @public
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * A quick and dirty way to determine if an object is a promise. Eventually the
 * ideal method would be `isPromise()`, where not only the `.then` property is
 * checked. For example, may be we can check the constructor or the stringified
 * tag... but so far none of these worked well.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#thenable_objects
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a promise.
 * @public
 */
export function isThenable<T = unknown>(executedFn: unknown): executedFn is Promise<T> {
  //// @ts-expect-error because we are forcefully probing at the property.
  return isFunction(executedFn?.['then'])
}

/**
 * Determine if a value is undefined.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is undefined.
 * @public
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}

/**
 * Determine if a value is null.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is null.
 * @public
 */
export function isNull(value: unknown): value is null {
  return Object.is(value, null)
}

/**
 * Shorthand for `isNull(value) || isUndefined(value)`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is null or undefined.
 * @public
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}

/**
 * Shorthand for `isUndefined(value) || isNull(value)`.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is undefined or null.
 * @public
 */
export function isUndefinedOrNull(value: unknown): value is null | undefined {
  return isUndefined(value) || isNull(value)
}
