import { TimeTracker } from '.'

test('Instantiation', () => {
  const timeTracker = new TimeTracker()
  expect(timeTracker.isRunning).toBe(false)
})

describe('Start & Stop', () => {

  test('Happy path', () => {
    const timeTracker = new TimeTracker()
    timeTracker.start()
    expect(timeTracker.isRunning).toBe(true)
    timeTracker.stop()
    expect(timeTracker.isRunning).toBe(false)
    timeTracker.start()
    expect(timeTracker.isRunning).toBe(true)
    timeTracker.stop()
    expect(timeTracker.isRunning).toBe(false)
  })

  test('Start when already started', () => {
    const timeTracker = new TimeTracker()
    timeTracker.start()
    timeTracker.start()
    expect(timeTracker.isRunning).toBe(true)
    expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
  })

  test('Stop before started', () => {
    const timeTracker = new TimeTracker()
    timeTracker.stop()
    expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
  })

  test('Stop when already stopped', () => {
    const timeTracker = new TimeTracker()
    timeTracker.start()
    timeTracker.stop()
    timeTracker.stop()
    expect(timeTracker.isRunning).toBe(false)
    expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
  })

})

describe(TimeTracker.prototype.now.name, () => {

  test('Not yet started', () => {
    const timeTracker = new TimeTracker()
    expect(timeTracker.now()).toBe(0)
  })

  test('Started but not yet stopped', async () => {
    const timeTracker = new TimeTracker()
    timeTracker.start()
    jest.advanceTimersByTime(10)
    expect(timeTracker.now()).toBe(10)
  })

  test('Started and stopped', () => {
    const timeTracker = new TimeTracker()
    timeTracker.start()
    jest.advanceTimersByTime(10)
    timeTracker.stop()
    jest.advanceTimersByTime(10)
    expect(timeTracker.now()).toBe(10)
  })

  describe('Stress test', () => {

    test('Not yet ended', () => {
      const timeTracker = new TimeTracker()
      for (let i = 0; i < 6; i++) {
        timeTracker.start()
        jest.advanceTimersByTime((i + 1) * 10)
        timeTracker.stop()
      }
      timeTracker.start()
      jest.advanceTimersByTime(70)
      expect(timeTracker.now()).toBe(280)
    })

    test('Already ended', () => {
      const timeTracker = new TimeTracker()
      for (let i = 0; i < 7; i++) {
        timeTracker.start()
        jest.advanceTimersByTime((i + 1) * 10)
        timeTracker.stop()
      }
      expect(timeTracker.now()).toBe(280)
    })

  })

})
