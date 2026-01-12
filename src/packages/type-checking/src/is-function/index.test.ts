import { isFunction } from '.'

test(isFunction.name, () => {
  expect(isFunction(() => { /* ... */ })).toBe(true)
  expect(isFunction(function () { /* ... */ })).toBe(true)
  expect(isFunction(async function () { /* ... */ })).toBe(true)
  expect(isFunction({ call() { /* ... */ } })).toBe(false)
  expect(isFunction({})).toBe(false)
})
