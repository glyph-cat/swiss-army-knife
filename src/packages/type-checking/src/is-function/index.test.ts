import { isFunction } from '.'

test(isFunction.name, () => {
  expect(isFunction(() => { /* ... */ })).toBeTrue()
  expect(isFunction(function () { /* ... */ })).toBeTrue()
  expect(isFunction(async function () { /* ... */ })).toBeTrue()
  expect(isFunction({ call() { /* ... */ } })).toBeFalse()
  expect(isFunction({})).toBeFalse()
})
