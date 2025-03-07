/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until it's value is accessed.
 * @public
 */
export class LazyValue<T> {

  /**
   * @internal
   */
  private M$isInitialized = false

  /**
   * @internal
   */
  private M$value: T

  /**
   * @param factory - The function that returns the initialized data.
   * @example
   * // Parameters can be passed in here.
   * const foo = new LazyValue(() => createFoo(param1, param2))
   * @example
   * // Or just pass the function itself if there are no parameters.
   * const foo = new LazyValue(createBar)
   */
  constructor(private readonly factory: () => T) { }

  /**
   * A flag indicating whether the value has been initialized.
   * @returns A `true` if the value has been initialized, otherwise `false`.
   * @example
   * const c = new LazyValue(() => new VeryComplexObject())
   * console.log(c.isInitialized) // false
   * doSomethingWith(c.value)
   * console.log(c.isInitialized) // true
   */
  get isInitialized(): boolean {
    return this.M$isInitialized
  }

  /**
   * Get the value of the lazy value.
   *
   * NOTE: For lazy values with asynchronous factory,
   * use `await` on the `.value`.
   * @returns The lazily instantiated value.
   * @example
   * const c = new LazyValue(() => new VeryComplexObject())
   * console.log(c.value)
   */
  get value(): T {
    if (!this.M$isInitialized) {
      this.M$value = this.factory()
      this.M$isInitialized = true
    }
    return this.M$value
  }

}
