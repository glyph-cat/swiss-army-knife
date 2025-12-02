import { createDebouncedCallback, createDebouncedPromise } from '.'

describe(createDebouncedCallback.name, () => {

  test('Arguments are forwarded accordingly', () => {

    const originalCallback = jest.fn()
    const debouncedCallback = createDebouncedCallback(originalCallback, 200)

    debouncedCallback('a', 'b', 'c', 'd', 'e')
    jest.advanceTimersByTime(200)
    expect(originalCallback).toHaveBeenNthCalledWith(1, 'a', 'b', 'c', 'd', 'e')

  })

  test('Continuous calls', () => {

    const originalCallback = jest.fn()
    const debouncedCallback = createDebouncedCallback(originalCallback, 200)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(0)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(200)
    expect(originalCallback).toHaveBeenCalledTimes(1)

  })

  test('Delayed calls within debounce time limit', () => {

    const originalCallback = jest.fn()
    const debouncedCallback = createDebouncedCallback(originalCallback, 200)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(100)
    expect(originalCallback).toHaveBeenCalledTimes(0)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(200)
    expect(originalCallback).toHaveBeenCalledTimes(1)

  })

  test('Delayed calls exceeding debounce time limit', () => {

    const originalCallback = jest.fn()
    const debouncedCallback = createDebouncedCallback(originalCallback, 200)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(250)
    expect(originalCallback).toHaveBeenCalledTimes(1)

    debouncedCallback()
    expect(originalCallback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(200)
    expect(originalCallback).toHaveBeenCalledTimes(2)

  })

})

describe(createDebouncedPromise.name, () => {

  test('', () => {
    // TODO: modify fn first to always return reference to same the `Promise<R>`
  })

})
