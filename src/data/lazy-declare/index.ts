import { GCObject } from '../../bases'
import { EMPTY_OBJECT } from '../dummies'

/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until is is needed (when `.get()` is
 * called).
 * @public
 */
export class LazyVariable<T> extends GCObject {

  private value: T
  private factory: () => T

  /**
   * @param factory - The function that returns the initialized data.
   * @example
   * // Parameters can be passed in here.
   * const foo = new LazyVariable(() => createFoo(param1, param2))
   * @example
   * // Or just pass the function itself if there are no parameters.
   * const foo = new LazyVariable(createFoo)
   */
  constructor(factory: () => T) {
    super()
    this.value = EMPTY_OBJECT as T
    this.factory = factory
  }

  /**
   * Get the value of the lazy variable.
   * @returns The lazily instantiated variable.
   * @example
   * import { Animated } from 'react-native'
   *
   * const animationRef = new LazyVariable(() => new Animated.Value(0))
   * animationRef.get()
   */
  get(): T {
    if (Object.is(this.value, EMPTY_OBJECT)) {
      this.value = this.factory()
    }
    return this.value
  }

}
