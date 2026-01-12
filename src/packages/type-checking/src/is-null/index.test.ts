import { isNull } from '.'

test(isNull.name, () => {
  expect(isNull(null)).toBe(true)
  expect(isNull(undefined)).toBe(false)
  expect(isNull(false)).toBe(false)
  expect(isNull({})).toBe(false)
})
