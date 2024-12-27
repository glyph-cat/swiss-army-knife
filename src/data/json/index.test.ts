import {
  JSONclone,
  isJSONequal,
  trySerializeJSON,
} from '.'


test(JSONclone.name, () => {
  const sourceObj = { foo: 1, bar: 2 }
  const output = JSONclone(sourceObj)
  expect(output).toStrictEqual({ foo: 1, bar: 2 })
  output.foo = 2
  expect(sourceObj).toStrictEqual({ foo: 1, bar: 2 }) // Immutability test
})

describe(isJSONequal.name, () => {

  test('Is equal', () => {
    expect(isJSONequal({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBe(true)
  })

  test('Not equal', () => {
    expect(isJSONequal({ foo: 1, bar: 2 }, { baz: 1, quz: 2 })).toBe(false)
  })

  describe('Edge case: non-object types', () => {

    test('Is equal', () => {
      expect(isJSONequal(42, 42)).toBe(true)
    })

    test('Not equal', () => {
      expect(isJSONequal(42, 41)).toBe(false)
    })

  })

})

describe(trySerializeJSON.name, () => {

  test('Happy path', () => {
    const output = trySerializeJSON({ foo: 1, bar: 2 })
    expect(output).toBe('{"foo":1,"bar":2}')
  })

  test('Non-object type', () => {
    const output = trySerializeJSON(42)
    expect(output).toBe('42')
  })

})
