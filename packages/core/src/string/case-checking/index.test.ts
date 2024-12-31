import { isLowerCase, isUpperCase } from '.'

test(isLowerCase.name, (): void => {
  expect(isLowerCase('')).toBe(true)
  expect(isLowerCase('hello world')).toBe(true)
  expect(isLowerCase('Hello World')).toBe(false)
  expect(isLowerCase('HELLO WORLD')).toBe(false)
})

test(isUpperCase.name, (): void => {
  expect(isUpperCase('')).toBe(true)
  expect(isUpperCase('HELLO WORLD')).toBe(true)
  expect(isUpperCase('Hello World')).toBe(false)
  expect(isUpperCase('hello world')).toBe(false)
})
