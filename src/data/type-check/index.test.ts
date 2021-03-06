import { isNumber, isThenable } from '.'

test(isNumber.name, () => {
  expect(isNumber(42)).toBe(true)
  expect(isNumber('42')).toBe(false)
  expect(isNumber(NaN)).toBe(false)
})

describe(isThenable.name, () => {

  test('should be true - async function', () => {
    async function fn() { return 42 }
    const output = isThenable(fn())
    expect(output).toBe(true)
  })

  test('should be true - function that returns a Promise', () => {
    function fn() { return new Promise((resolve) => { resolve(42) }) }
    const output = isThenable(fn())
    expect(output).toBe(true)
  })

  test('should be false - normal function', () => {
    function fn() { return 42 }
    const output = isThenable(fn())
    expect(output).toBe(false)
  })

  test('should be false - falsey value', () => {
    const output = isThenable(null)
    expect(output).toBe(false)
  })

})
