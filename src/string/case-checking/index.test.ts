import { isLowerCase, isUpperCase } from '.'

test(isLowerCase.name, (): void => {
  expect(isLowerCase('a')).toBe(true)
  expect(isLowerCase('A')).toBe(false)
})

test(isUpperCase.name, (): void => {
  expect(isUpperCase('A')).toBe(true)
  expect(isUpperCase('a')).toBe(false)
})
