import { ReverseDictionary } from '.'

test(ReverseDictionary.name, () => {

  const K1 = {}
  const K2 = {}
  const V1 = {}
  const V2 = {}
  const V3 = {}
  const V4 = {}

  const dictionary = new ReverseDictionary([
    [K1, [V1, V2]],
    [K2, [V3, V4]],
  ])

  expect(Object.is(dictionary.resolve(V1), K1)).toBe(true)
  expect(Object.is(dictionary.resolve(V2), K1)).toBe(true)
  expect(Object.is(dictionary.resolve(V3), K2)).toBe(true)
  expect(Object.is(dictionary.resolve(V4), K2)).toBe(true)
  expect(dictionary.resolve({})).toBeUndefined()

})
