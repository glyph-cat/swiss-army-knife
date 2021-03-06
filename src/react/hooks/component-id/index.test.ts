import { __idFactory__ } from '.'

describe(__idFactory__.name, (): void => {

  test('Number', (): void => {
    expect(__idFactory__(Number)(/* needs invocation */)).toBe(1)
    expect(__idFactory__(Number)(/* needs invocation */)).toBe(2)
    expect(__idFactory__(Number)(/* needs invocation */)).toBe(3)
  })

  test('Specific length', (): void => {
    const output = __idFactory__(8)(/* needs invocation */)
    expect(output).toMatch(/^[0-9a-z]{8}$/i)
  })

  describe('String', (): void => {

    test('Auto length', (): void => {
      const output = __idFactory__(String)(/* needs invocation */)
      expect(output).toMatch(/^[0-9a-z]{4}$/i)
      // Internally, we know the length starts at 4
    })

    test('Minimum length', (): void => {
      const output = __idFactory__(String, 8)(/* needs invocation */)
      expect(output).toMatch(/^[0-9a-z]{8}$/i)
      // The length is now expected to start at 8
    })

  })

  test('Symbol', (): void => {
    const output = __idFactory__(Symbol)(/* needs invocation */)
    expect(typeof output === 'symbol').toBe(true)
  })

})
