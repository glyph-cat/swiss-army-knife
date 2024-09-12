import { LazyValue } from '.'

test(LazyValue.name, () => {
  const factory = jest.fn(() => 'obj')
  const obj = new LazyValue(factory)
  expect(factory).not.toHaveBeenCalled()
  expect(obj.value).toBe('obj')
  expect(factory).toHaveBeenCalledTimes(1)
})
