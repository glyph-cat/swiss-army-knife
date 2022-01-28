import { createGCFactoryObject, GCFunctionalObject } from '../../bases'
import { EMPTY_OBJECT } from '../dummies'

/**
 * @public
 */
export interface LazyVariable<T> extends GCFunctionalObject {
  get(): T
}

/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until is is needed (when `.get()` is
 * called).
 * @param factory - The function that returns the initialized data.
 * @example
 * const foo = lazyDeclare(() => createFoo(param1, param2))
 * // Parameters can be passed in here
 * @example
 * const foo = lazyDeclare(createFoo)
 * // Or just pass the function itself if there are no parameters
 * @public
 */
export function lazyDeclare<T>(factory: () => T): LazyVariable<T> {
  const $factoryObject = createGCFactoryObject()
  // @ts-expect-error: Type Record<never, never> is not assignable to type 'T'.
  let value: T = EMPTY_OBJECT
  const get = () => {
    if (Object.is(value, EMPTY_OBJECT)) {
      value = factory()
    }
    return value
  }
  return {
    ...$factoryObject,
    get,
  }
}
