import { isSymbol } from '.'

test(isSymbol.name, () => {
  expect(isSymbol(Symbol())).toBe(true)
  expect(isSymbol({})).toBe(false)
  expect(isSymbol(null)).toBe(false)
  expect(isSymbol(undefined)).toBe(false)
})
