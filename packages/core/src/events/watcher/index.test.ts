import { Watcher } from '.'

describe('Type checking', () => {

  test('One argument', () => {
    const watcher = new Watcher<number>()
    watcher.post(42)
    watcher.watch((x) => { x.toFixed(2) })
    expect('').pass('')
  })

  test('Multiple arguments', () => {
    const watcher = new Watcher<[number, string]>()
    watcher.post(42, 'x')
    watcher.watch((x, y) => { String(x.toFixed() + y.toUpperCase()) })
    expect('').pass('')
  })

  test('One array argument', () => {
    const watcher = new Watcher<[Array<boolean>]>()
    watcher.post([true])
    watcher.watch((x) => { x.map((xx) => xx.valueOf()) })
    expect('').pass('')
  })

})

test(`${Watcher.prototype.post.name} & ${Watcher.prototype.watch.name}`, () => {
  const watcher = new Watcher<[number, string]>()
  const watchFn = jest.fn()
  watcher.watch(watchFn)
  watcher.post(42, 'abc')
  watcher.post(41, 'def')
  expect(watchFn).toHaveBeenCalledTimes(2)
  expect(watchFn).toHaveBeenNthCalledWith(1, 42, 'abc')
  expect(watchFn).toHaveBeenNthCalledWith(2, 41, 'def')
})

test(Watcher.prototype.unwatchAll.name, () => {
  const watcher = new Watcher<number>()
  const watchFn1 = jest.fn()
  watcher.watch(watchFn1)
  watcher.unwatchAll()
  const watchFn2 = jest.fn()
  watcher.watch(watchFn2)
  watcher.post(42)
  expect(watchFn1).not.toHaveBeenCalled()
  expect(watchFn2).toHaveBeenCalledTimes(1)
  expect(watchFn2).toHaveBeenNthCalledWith(1, 42)
})

test(Watcher.prototype.dispose.name, () => {
  const watcher = new Watcher()
  const watchFn1 = jest.fn()
  watcher.watch(watchFn1)
  watcher.dispose()
  const watchFn2 = jest.fn()
  watcher.watch(watchFn2)
  watcher.post(undefined)
  expect(watchFn1).not.toHaveBeenCalled()
  expect(watchFn2).not.toHaveBeenCalled()
})
