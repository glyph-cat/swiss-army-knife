import { isBoolean } from '.'

test(isBoolean.name, () => {
  expect(isBoolean(true)).toBe(true)
  expect(isBoolean(false)).toBe(true)
  expect(isBoolean('true')).toBe(false)
  expect(isBoolean('false')).toBe(false)
  expect(isBoolean(undefined)).toBe(false)
  expect(isBoolean(null)).toBe(false)
})
