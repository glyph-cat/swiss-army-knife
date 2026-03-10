import { isLowerCase, isUpperCase } from '.'

test(isLowerCase.name, (): void => {
  expect(isLowerCase('')).toBeTrue()
  expect(isLowerCase('hello world')).toBeTrue()
  expect(isLowerCase('Hello World')).toBeFalse()
  expect(isLowerCase('HELLO WORLD')).toBeFalse()
})

test(isUpperCase.name, (): void => {
  expect(isUpperCase('')).toBeTrue()
  expect(isUpperCase('HELLO WORLD')).toBeTrue()
  expect(isUpperCase('Hello World')).toBeFalse()
  expect(isUpperCase('hello world')).toBeFalse()
})
