import { LazyValue } from '.'

describe(LazyValue.name, () => {

  test('Normal use case', () => {
    const factory = jest.fn(() => 'obj')
    const obj = new LazyValue(factory)
    expect(factory).not.toHaveBeenCalled()
    expect(obj.value).toBe('obj')
    expect(factory).toHaveBeenCalledTimes(1)
    const value = obj.value // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(factory).toHaveBeenCalledTimes(1)
  })

  test('With spread operator', () => {
    const factory = jest.fn(() => 'obj')
    const obj = new LazyValue(factory)
    expect(factory).not.toHaveBeenCalled()
    const { value } = obj
    expect(value).toBe('obj')
    expect(factory).toHaveBeenCalledTimes(1)
    const $value = value // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(factory).toHaveBeenCalledTimes(1)
  })

})
