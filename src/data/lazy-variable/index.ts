import { GCObject } from '../../bases'
import { EMPTY_OBJECT } from '../dummies'

/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until is is needed (when `.get()` is
 * called).
 * @public
 */
export class LazyVariable<T> extends GCObject {

  private M$value: T
  private M$factory: () => T

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
    this.M$value = EMPTY_OBJECT as T
    this.M$factory = factory
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
    if (Object.is(this.M$value, EMPTY_OBJECT)) {
      this.M$value = this.M$factory()
    }
    return this.M$value
  }

  /**
   * Get the value of the lazy variable asynchronously.
   * @returns A promise of the lazily instantiated variable.
   * @example
   * const someRef = new LazyVariable(() => fetch('...'))
   * await someRef.getAsync()
   */
  async getAsync(): Promise<T> {
    if (Object.is(this.M$value, EMPTY_OBJECT)) {
      this.M$value = await this.M$factory()
    }
    return this.M$value
  }

}
