import { isThenable } from '.'

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
