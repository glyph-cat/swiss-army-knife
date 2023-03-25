import { LazyVariable } from '.'
import { delay } from '../../events'

describe(LazyVariable.name, () => {

  jest.useRealTimers()
  jest.setTimeout(300)

  test('Synchronous', () => {

    const factory = jest.fn(() => 'obj')

    // NOTE: Can also be written as `new LazyVariable(factory)` in this case
    // because we don't need to pass any parameters into `factory`.
    const obj = new LazyVariable(() => factory())
    expect(factory).not.toBeCalled()

    const output = obj.get()
    expect(output).toBe('obj')
    expect(factory).toBeCalledTimes(1)

  })

  test('Asynchronous', async () => {

    const factory = jest.fn(() => 'obj')

    // NOTE: Can also be written as `new LazyVariable(factory)` in this case
    // because we don't need to pass any parameters into `factory`.
    const obj = new LazyVariable(async () => {
      await delay(200)
      return factory()
    })
    expect(factory).not.toBeCalled()

    const output = await obj.getAsync()
    expect(output).toBe('obj')
    expect(factory).toBeCalledTimes(1)

  })

})
