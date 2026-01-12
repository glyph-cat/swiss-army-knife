import { isFunction } from '../is-function'

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
  return isFunction(executedFn?.['then'])
}
