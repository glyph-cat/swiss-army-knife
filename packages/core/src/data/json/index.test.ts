import { JSONclone, trySerializeJSON } from '.'

test(JSONclone.name, () => {
  const sourceObj = { foo: 1, bar: 2 }
  const output = JSONclone(sourceObj)
  expect(output).toStrictEqual({ foo: 1, bar: 2 })
  output.foo = 2
  expect(sourceObj).toStrictEqual({ foo: 1, bar: 2 }) // Immutability test
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
