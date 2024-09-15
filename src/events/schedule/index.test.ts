import { DateTime } from 'luxon'
import { ScheduledCallback } from '.'

describe('Schedule', () => {

  jest.useFakeTimers()

  test('Let schedule run when timer matures', () => {
    const callback = jest.fn()
    const date = DateTime.now().plus({ seconds: 5 }).toJSDate()
    const scheduleRef = new ScheduledCallback(callback, date)
    scheduleRef.run()
    expect(callback).not.toBeCalled()
    jest.advanceTimersByTime(5000 + 100) // <─────────┐
    // Give some time padding to compensate drifting ─┘
    expect(callback).toBeCalled()
  })

  test('Cancel schedule before timer matures', () => {
    const callback = jest.fn()
    const date = DateTime.now().plus({ seconds: 5 }).toJSDate()
    const scheduleRef = new ScheduledCallback(callback, date)
    scheduleRef.cancel()
    jest.advanceTimersByTime(5000 + 100) // <─────────┐
    // Give some time padding to compensate drifting ─┘
    expect(callback).not.toBeCalled()
  })

})
