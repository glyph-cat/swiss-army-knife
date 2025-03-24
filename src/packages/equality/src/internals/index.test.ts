import { isObject } from '.'

describe(isObject.name, () => {

  test('Plain object', () => {
    const output = isObject({ hello: 'world' })
    expect(output).toBe(true)
  })

  test('Class instance', () => {
    const output = isObject(new Date())
    expect(output).toBe(true)
  })

  test('Something else', () => {
    const output = isObject(42)
    expect(output).toBe(false)
  })

  test('Null', () => {
    const output = isObject(null)
    expect(output).toBe(false)
  })

})
