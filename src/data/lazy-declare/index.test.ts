import { lazyDeclare } from '.'

test(lazyDeclare.name, (): void => {

  const createObj = jest.fn(() => 'obj')

  // NOTE: Can also be written as `lazyDeclare(createObj)` in this case
  // because we don't need to pass any parameters into `createObj`.
  const obj = lazyDeclare(() => createObj())
  expect(createObj).not.toBeCalled()

  const output = obj.get()
  expect(output).toBe('obj')
  expect(createObj).toBeCalledTimes(1)

})
