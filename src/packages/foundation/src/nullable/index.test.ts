import { Nullable } from '.'

test(Nullable.name, () => {
  expect(Nullable(null)).toBe(null)
  expect(Nullable(undefined)).toBe(null)
  expect(Nullable('foo-bar')).toBe('foo-bar')
  expect(Nullable('')).toBe('')
  expect(Nullable(false)).toBe(false)
  expect(Nullable(0)).toBe(0)
})
