import {
  isBoolean,
  isFunction,
  isNaN,
  isNull,
  isNullOrUndefined,
  isNumber,
  isNumberOrNaN,
  isObject,
  isObjectNotNull,
  isObjectOrNull,
  isString,
  isSymbol,
  isThenable,
  isUndefined,
} from '.'

test(isBoolean.name, () => {
  expect(isBoolean(true)).toBe(true)
  expect(isBoolean(false)).toBe(true)
  expect(isBoolean('true')).toBe(false)
  expect(isBoolean('false')).toBe(false)
  expect(isBoolean(undefined)).toBe(false)
  expect(isBoolean(null)).toBe(false)
})

test(isFunction.name, () => {
  expect(isFunction(() => { /* ... */ })).toBe(true)
  expect(isFunction(function () { /* ... */ })).toBe(true)
  expect(isFunction(async function () { /* ... */ })).toBe(true)
  expect(isFunction({ call() { /* ... */ } })).toBe(false)
  expect(isFunction({})).toBe(false)
})

test(isNaN.name, () => {
  expect(isNaN(NaN)).toBe(true)
  expect(isNaN(42)).toBe(false)
  expect(isNaN('42')).toBe(false)
  expect(isNaN(null)).toBe(false)
  expect(isNaN(undefined)).toBe(false)
})

test(isNumberOrNaN.name, () => {
  expect(isNumberOrNaN(NaN)).toBe(true)
  expect(isNumberOrNaN(42)).toBe(true)
  expect(isNumberOrNaN('42')).toBe(false)
  expect(isNumberOrNaN(null)).toBe(false)
  expect(isNumberOrNaN(undefined)).toBe(false)
})

test(isNumber.name, () => {
  expect(isNumber(42)).toBe(true)
  expect(isNumber('42')).toBe(false)
  expect(isNumber(NaN)).toBe(false)
  expect(isNumberOrNaN(null)).toBe(false)
  expect(isNumberOrNaN(undefined)).toBe(false)
})

test(isObject.name, () => {
  expect(isObject({})).toBe(true)
  expect(isObject([])).toBe(true)
  expect(isObject(null)).toBe(false)
  expect(isObject(function () { /* ... */ })).toBe(false)
  expect(isObject('')).toBe(false)
  expect(isObject(false)).toBe(false)
  expect(isObject(undefined)).toBe(false)
})

test(isObjectOrNull.name, () => {
  expect(isObjectOrNull({})).toBe(true)
  expect(isObjectOrNull([])).toBe(true)
  expect(isObjectOrNull(null)).toBe(true)
  expect(isObjectOrNull(function () { /* ... */ })).toBe(false)
  expect(isObjectOrNull('')).toBe(false)
  expect(isObjectOrNull(false)).toBe(false)
  expect(isObjectOrNull(undefined)).toBe(false)
})

test(isObjectNotNull.name, () => {
  expect(isObjectNotNull({})).toBe(true)
  expect(isObjectNotNull([])).toBe(true)
  expect(isObjectNotNull(null)).toBe(false)
  expect(isObjectNotNull(function () { /* ... */ })).toBe(false)
  expect(isObjectNotNull('')).toBe(false)
  expect(isObjectNotNull(false)).toBe(false)
  expect(isObjectNotNull(undefined)).toBe(false)
})

test(isString.name, () => {
  expect(isString('')).toBe(true)
  expect(isString(null)).toBe(false)
  expect(isString(undefined)).toBe(false)
  expect(isString(42)).toBe(false)
})

test(isSymbol.name, () => {
  expect(isSymbol(Symbol())).toBe(true)
  expect(isSymbol({})).toBe(false)
  expect(isSymbol(null)).toBe(false)
  expect(isSymbol(undefined)).toBe(false)
})

describe(isThenable.name, () => {

  test('Async function', () => {
    async function fn() { return 42 }
    const output = isThenable(fn())
    expect(output).toBe(true)
  })

  test('Function that returns a Promise', () => {
    function fn() { return new Promise((resolve) => { resolve(42) }) }
    const output = isThenable(fn())
    expect(output).toBe(true)
  })

  test('Normal function', () => {
    function fn() { return 42 }
    const output = isThenable(fn())
    expect(output).toBe(false)
  })

  test('Falsey value', () => {
    const output = isThenable(null)
    expect(output).toBe(false)
  })

})

test(isUndefined.name, () => {
  expect(isUndefined(undefined)).toBe(true)
  expect(isUndefined(null)).toBe(false)
  expect(isUndefined(false)).toBe(false)
  expect(isUndefined({})).toBe(false)
})

test(isNull.name, () => {
  expect(isNull(null)).toBe(true)
  expect(isNull(undefined)).toBe(false)
  expect(isNull(false)).toBe(false)
  expect(isNull({})).toBe(false)
})

test(isNullOrUndefined.name, () => {
  expect(isNullOrUndefined(undefined)).toBe(true)
  expect(isNullOrUndefined(null)).toBe(true)
  expect(isNullOrUndefined(false)).toBe(false)
  expect(isNullOrUndefined({})).toBe(false)
})
