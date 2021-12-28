import { DateTime } from 'luxon'
import { createSchedule } from '.'

// TOFIX: The last run unit test failed

describe('Schedule', () => {

  jest.useFakeTimers()

  it('Let schedule run when timer matures', () => {
    const callback = jest.fn()
    const date = DateTime.now().plus({ seconds: 5 }).toJSDate()
    createSchedule(callback, date)
    expect(callback).not.toBeCalled()
    jest.advanceTimersByTime(5000 + 100) // <─────────┐
    // Give some time padding to compensate drifting ─┘
    expect(callback).toBeCalled()
  })

  it('Cancel schedule before timer matures', () => {
    const callback = jest.fn()
    const date = DateTime.now().plus({ seconds: 5 }).toJSDate()
    const scheduleRef = createSchedule(callback, date)
    scheduleRef.clear()
    jest.advanceTimersByTime(5000 + 100) // <─────────┐
    // Give some time padding to compensate drifting ─┘
    expect(callback).not.toBeCalled()
  })

})
