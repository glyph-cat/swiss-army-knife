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
      if (++counter >= count) {
        resolve()
      } else {
        requestAnimationFrame(run)
      }
    }
    requestAnimationFrame(run)
  })
}
