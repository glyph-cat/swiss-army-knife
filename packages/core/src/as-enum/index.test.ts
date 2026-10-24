import { asEnum } from '.'

test('Has duplicate values', () => {
  expect(() => {
    asEnum({
      a: 1,
      b: 2,
      c: 1,
      d: 3,
      e: 2,
    })
  }).toThrow('Enums should not have duplicate values: { "1":["a","c"], "2":["b","e"] }')
})

test('No duplicate values', () => {
  expect(asEnum({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
  })).toStrictEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
  })
})
