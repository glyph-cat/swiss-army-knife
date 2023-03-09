import { Sanitize } from '.'

test(Sanitize.toBoolean.name, () => {
  expect(Sanitize.toBoolean(true)).toBe(true)
  expect(Sanitize.toBoolean('true')).toBe(true)
  expect(Sanitize.toBoolean('Yes')).toBe(true)
  expect(Sanitize.toBoolean('YES')).toBe(true)
  expect(Sanitize.toBoolean('yes')).toBe(true)
  expect(Sanitize.toBoolean('Y')).toBe(true)
  expect(Sanitize.toBoolean('y')).toBe(true)
  expect(Sanitize.toBoolean('1')).toBe(true)
  expect(Sanitize.toBoolean(1)).toBe(true)

  expect(Sanitize.toBoolean(false)).toBe(false)
  expect(Sanitize.toBoolean('false')).toBe(false)
  expect(Sanitize.toBoolean('No')).toBe(false)
  expect(Sanitize.toBoolean('NO')).toBe(false)
  expect(Sanitize.toBoolean('no')).toBe(false)
  expect(Sanitize.toBoolean('N')).toBe(false)
  expect(Sanitize.toBoolean('n')).toBe(false)
  expect(Sanitize.toBoolean('0')).toBe(false)
  expect(Sanitize.toBoolean(0)).toBe(false)
  expect(Sanitize.toBoolean(null)).toBe(false)
  expect(Sanitize.toBoolean(undefined)).toBe(false)
  expect(Sanitize.toBoolean([])).toBe(false)
  expect(Sanitize.toBoolean('')).toBe(false)
})

test(Sanitize.toString.name, () => {
  expect(Sanitize.toString('')).toBe('')
  expect(Sanitize.toString(null)).toBe('null')
  expect(Sanitize.toString(undefined)).toBe('undefined')
  expect(Sanitize.toString(42)).toBe('42')
  expect(Sanitize.toString(' foo bar ')).toBe('foo bar')
  expect(Sanitize.toString({ firstName: 'John' })).toBe('{"firstName":"John"}')
})

test(Sanitize.trim.name, () => {
  expect(Sanitize.toString('  foo \t\n bar  ')).toBe('foo \t\n bar')
  expect(Sanitize.toString('\n\nfoo \t\n bar\n\n')).toBe('foo \t\n bar')
  expect(Sanitize.toString('\t\tfoo \t\n bar\t\t')).toBe('foo \t\n bar')
  expect(Sanitize.toString('\n \t foo \t\n bar\t \n')).toBe('foo \t\n bar')
})
