import { isBoolean } from '.'

test(isBoolean.name, () => {
  expect(isBoolean(true)).toBeTrue()
  expect(isBoolean(false)).toBeTrue()
  expect(isBoolean('true')).toBeFalse()
  expect(isBoolean('false')).toBeFalse()
  expect(isBoolean(undefined)).toBeFalse()
  expect(isBoolean(null)).toBeFalse()
})
