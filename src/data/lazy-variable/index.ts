/**
 * Allows the declaration of a variable lazily. Constructor or functions that
 * initializes the data will not be run until it's value is accessed.
 * @public
 */
export class LazyValue<T> {

  private M$isInitialized = false
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
   * @example
   * const c = new LazyValue(() => new VeryComplexObject())
   * console.log(c.isInitialized) // false
   * doSomethingWith(c.value)
   * console.log(c.isInitialized) // true
   * @returns A `true` if the value has been initialized, otherwise `false`.
   */
  get isInitialized(): boolean {
    return this.M$isInitialized
  }

  /**
   * Get the value of the lazy value.
   *
   * NOTE: For lazy values with asynchronous factory,
   * use `await` on the `.value`.
   * @example
   * const c = new LazyValue(() => new VeryComplexObject())
   * console.log(c.value)
   * @returns The lazily instantiated value.
   */
  get value(): T {
    if (!this.M$isInitialized) {
      this.M$value = this.factory()
    }
    return this.M$value
  }

}
