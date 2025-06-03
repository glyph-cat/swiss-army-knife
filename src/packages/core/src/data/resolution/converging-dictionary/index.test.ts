import { ConvergingDictionary } from '.'

test(ConvergingDictionary.name, () => {

  const K1 = {}
  const K2 = {}
  const K3 = {}
  const K4 = {}
  const V1 = {}
  const V2 = {}

  const dictionary = new ConvergingDictionary([
    [[K1, K2], V1],
    [[K3, K4], V2],
  ])

  expect(Object.is(dictionary.resolve(K1), V1)).toBe(true)
  expect(Object.is(dictionary.resolve(K2), V1)).toBe(true)
  expect(Object.is(dictionary.resolve(K3), V2)).toBe(true)
  expect(Object.is(dictionary.resolve(K4), V2)).toBe(true)
  expect(dictionary.resolve({})).toBe(undefined)

})
