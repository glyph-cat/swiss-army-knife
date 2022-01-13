/**
 * Create an empty promise that is resolved after a specified time.
 * @param time - The time in milliseconds.
 * @returns An empty promise.
 * @public
 */
export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, time)
  })
}
