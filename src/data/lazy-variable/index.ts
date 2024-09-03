/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until is is needed (when `.get()` is
 * called).
 * @public
 */
export class LazyVariable<T> {

  private M$value: T = null
  private M$isInitialized = false

  /**
   * @param factory - The function that returns the initialized data.
   * @example
   * // Parameters can be passed in here.
   * const foo = new LazyVariable(() => createFoo(param1, param2))
   * @example
   * // Or just pass the function itself if there are no parameters.
   * const foo = new LazyVariable(createFoo)
   */
  constructor(private readonly factory: () => T) { }

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
    if (!this.M$isInitialized) {
      this.M$value = this.factory()
      this.M$isInitialized = true
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
    return await this.get()
  }

}
