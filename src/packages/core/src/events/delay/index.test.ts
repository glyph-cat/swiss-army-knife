import { delay, delayByFrame } from '.'
import { getFrameTime } from '../../frame'

jest.useRealTimers()

// NOTE: setTimeout is required to perform these tests because there is no other
// "delay" method that allows the test method to run asynchronously while we
// wait for the promise to settle —— these are the base methods.

const withPadding = (timeout: number): number => timeout + 10

test(delay.name, () => {

  const TOTAL_WAIT_TIME = 100 // ms
  let isPromiseResolved = false
  delay(TOTAL_WAIT_TIME).then(() => { isPromiseResolved = true })

  // Not expecting promise to be resolved immediately.
  expect(isPromiseResolved).toBe(false)

  return new Promise<void>((resolve) => {

    setTimeout(() => {
      // Not expecting promise to be resolved halfway through.
      expect(isPromiseResolved).toBe(false)
    }, TOTAL_WAIT_TIME / 2)

    setTimeout(() => {
      // Expecting promise to be resolved after supposed wait time.
      expect(isPromiseResolved).toBe(true)
      resolve()
    }, withPadding(TOTAL_WAIT_TIME))

  })

})

// Need reliable way to mock `requestAnimationFrame`:
test.skip(delayByFrame.name, () => {

  return new Promise<void>((resolve) => {

    const TOTAL_WAIT_FRAMES = 3

    getFrameTime(3).then((frameTime) => {

      let isPromiseResolved = false
      delayByFrame(TOTAL_WAIT_FRAMES).then(() => { isPromiseResolved = true })

      // Not expecting promise to be resolved immediately.
      expect(isPromiseResolved).toBe(false)

      setTimeout(() => {
        // Not expecting promise to be resolved halfway through.
        expect(isPromiseResolved).toBe(false)
      }, Math.floor(TOTAL_WAIT_FRAMES / 2 * frameTime))

      setTimeout(() => {
        // Expecting promise to be resolved after supposed wait time.
        expect(isPromiseResolved).toBe(true)
        resolve()
      }, withPadding(TOTAL_WAIT_FRAMES * frameTime))

    })

  })

})
