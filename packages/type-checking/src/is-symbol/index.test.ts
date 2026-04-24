import { isSymbol } from '.'

test(isSymbol.name, () => {
  expect(isSymbol(Symbol())).toBeTrue()
  expect(isSymbol({})).toBeFalse()
  expect(isSymbol(null)).toBeFalse()
  expect(isSymbol(undefined)).toBeFalse()
})
