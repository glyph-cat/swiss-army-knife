import { createLongPollingInterval, createVaryingInterval } from '.'

test(createLongPollingInterval.name, (): void => {
  // TODO
  expect('').toBe('')
})

test(createVaryingInterval.name, (): void => {

  const callback = jest.fn()
  const varyingInterval = createVaryingInterval(callback)

  // Check if callbacks are called correctly
  varyingInterval.start(1000)
  jest.advanceTimersByTime(3000 + 100) // 100 as padding
  expect(callback).toBeCalledTimes(3)

  // Check if frequency of callbacks have increased
  varyingInterval.start(500)
  jest.advanceTimersByTime(3000 + 100) // 100 as padding
  expect(callback).toBeCalledTimes(9)

  // Check callback is still being invoked after stopping
  varyingInterval.stop()
  jest.advanceTimersByTime(1000)
  expect(callback).toBeCalledTimes(9)

})
