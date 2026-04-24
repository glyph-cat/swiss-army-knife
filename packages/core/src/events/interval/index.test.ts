import { LongPollingInterval, VaryingInterval } from '.'

test.skip(LongPollingInterval.name, (): void => {
  // TODO
  expect('').toBe('')
})

test(VaryingInterval.name, (): void => {

  const callback = jest.fn()
  const varyingInterval = new VaryingInterval(callback)

  // Check if callbacks are called correctly
  varyingInterval.start(1000)
  jest.advanceTimersByTime(3000 + 100) // 100 as padding
  expect(callback).toHaveBeenCalledTimes(3)

  // Check if frequency of callbacks have increased
  varyingInterval.start(500)
  jest.advanceTimersByTime(3000 + 100) // 100 as padding
  expect(callback).toHaveBeenCalledTimes(9)

  // Check callback is still being invoked after stopping
  varyingInterval.stop()
  jest.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalledTimes(9)

})
