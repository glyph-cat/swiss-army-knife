import { Nullable } from '.'

test(Nullable.name, () => {
  expect(Nullable(null)).toBeNull()
  expect(Nullable(undefined)).toBeNull()
  expect(Nullable('foo-bar')).toBe('foo-bar')
  expect(Nullable('')).toBe('')
  expect(Nullable(false)).toBeFalse()
  expect(Nullable(0)).toBe(0)
})
