import { TypedFunction } from '@glyph-cat/foundation'

/**
 * Create an empty promise that is resolved after a specified time.
 * @param time - The delay time in milliseconds.
 * @returns A promise that resolves to `undefined`.
 * @public
 */
export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, time)
  })
}

/**
 * Create an empty promise that is resolved after a set number of frames.
 * The delay cannot be cancelled once executed.
 * @param count - The number of frames to delay by.
 * @returns A promise that resolves to `undefined`.
 * @public
 */
export function delayByFrame(count: number): Promise<void> {
  if (count <= 0) { return Promise.resolve() } // Early exit
  return new Promise((resolve) => {
    let counter = 0
    const run = () => {
      if (counter++ >= count) {
        resolve()
      } else {
        requestAnimationFrame(run)
      }
    }
    requestAnimationFrame(run)
  })
}

// TODO: Test

/**
 * Create an empty promise that is resolved after a specified time. The delay
 * can be cancelled at any time. If your application does not require such
 * flexibility, use `delay` instead, which consumes less system resources.
 * @public
 */
export class AdjustableDelay {

  /**
   * @internal
   */
  private M$timeoutRef: ReturnType<typeof setTimeout>

  /**
   * @internal
   */
  private M$resolveRef: TypedFunction

  /**
   * @param time - The delay time in milliseconds.
   * @example
   * const myAdjustableDelay = new AdjustableDelay()
   */
  constructor(private readonly time: number) { }

  /**
   * Run the delay.
   * @example
   * await myAdjustableDelay.now()
   */
  now(): Promise<void> {
    return new Promise((resolve) => {
      this.M$resolveRef = resolve
      this.M$timeoutRef = setTimeout(() => { resolve() }, this.time)
    })
  }

  // TODO: Add time to delay if not yet resolved
  /* eslint-disable */
  /**
   * ## Placeholder method - not actually available yet.
   * Add time to the delay. Only effective if the delay has not yet resolved.
   * @example
   * await myAdjustableDelay.add(1000)
   */
  add(time: number): void {
    // ...
  }
  /* eslint-ensable */

  /**
   * Cancel the delay.
   * @example
   * myAdjustableDelay.cancel()
   */
  cancel(): void {
    clearTimeout(this.M$timeoutRef)
    this.M$resolveRef()
  }

}
