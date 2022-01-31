import {
  TimeEstimator,
  MINIMUM_TIME_ESTIMATOR_CACHE_SIZE,
} from '.'

describe(TimeEstimator.name, (): void => {

  test('Not enough snapshots', (): void => {
    const timeEstimator = new TimeEstimator()
    expect(timeEstimator.getEstimation()).toBe(Infinity)
  })

  test(TimeEstimator.prototype.reset.name, (): void => {
    const timeEstimator = new TimeEstimator()
    timeEstimator.mark(10)
    jest.advanceTimersByTime(5000)
    timeEstimator.mark(20)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(30)
    timeEstimator.reset()
    expect(timeEstimator.getEstimation()).toBe(Infinity)
  })

  test(`Snapshot limit: ${MINIMUM_TIME_ESTIMATOR_CACHE_SIZE} (Default)`, (): void => {
    const timeEstimator = new TimeEstimator()
    timeEstimator.mark(10)
    jest.advanceTimersByTime(5000)
    timeEstimator.mark(20)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(30)
    expect(timeEstimator.getEstimation()).toBe(7000)
  })

  test('Snapshot limit: 5 (Custom)', (): void => {
    const timeEstimator = new TimeEstimator(5)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(10)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(20)
    jest.advanceTimersByTime(1000)
    expect(timeEstimator.getEstimation()).toBe(1600)
  })

  test('Upon completion', (): void => {
    const timeEstimator = new TimeEstimator(5)
    timeEstimator.mark(100)
    expect(timeEstimator.getEstimation()).toBe(0)
  })

  test('Very rapid snapshots', (): void => {
    const timeEstimator = new TimeEstimator(5)
    timeEstimator.mark(25)
    timeEstimator.mark(50)
    timeEstimator.mark(75)
    expect(timeEstimator.getEstimation()).toBe(0)
  })

  test('Some snapshots have same progress', (): void => {
    const timeEstimator = new TimeEstimator(5)
    timeEstimator.mark(10)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(20)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(20)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(30)
    jest.advanceTimersByTime(1000)
    timeEstimator.mark(40)
    // 7.5 progress per 1000ms
    // Remaining 60 percent of progress ÷ 7.5 = 8000ms
    expect(timeEstimator.getEstimation()).toBe(8000)
  })

  test('All snapshots have same progress', (): void => {
    const timeEstimator = new TimeEstimator(5)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(5)
    jest.advanceTimersByTime(100)
    timeEstimator.mark(5)
    expect(timeEstimator.getEstimation()).toBe(Infinity)
  })

})
