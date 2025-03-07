import { delay } from '.'

test(delay.name, async (): Promise<void> => {

  jest.useRealTimers()

  let isPromiseResolved = false
  delay(500).then((): void => { isPromiseResolved = true })

  // Not expecting promise to be resolved immediately
  expect(isPromiseResolved).toBe(false)

  return new Promise((resolve): void => {
    setTimeout((): void => {
      // Not expecting promise to be resolved after 500ms
      expect(isPromiseResolved).toBe(false)
    }, 250)
    setTimeout((): void => {
      // Expecting promise to be resolved after a total of 1000ms
      expect(isPromiseResolved).toBe(true)
      resolve()
    }, 500 + 100)
  })

})
