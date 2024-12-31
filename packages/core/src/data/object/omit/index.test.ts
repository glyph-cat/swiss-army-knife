import { omit } from '.'

test('Empty object', () => {
  const sourceObject = {}
  const output = omit(sourceObject, 'foo')
  expect(output).toStrictEqual({})
})

test('Happy path', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = omit(sourceObject, 'foo')
  expect(output).toStrictEqual({ bar: 2, baz: 3 })
})

test('Multiple unique keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = omit(sourceObject, 'foo', 'baz')
  expect(output).toStrictEqual({ bar: 2 })
})

test('Multiple repeated keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = omit(sourceObject, 'foo', 'foo')
  expect(output).toStrictEqual({ bar: 2, baz: 3 })
})

test('Multiple repeated + non-existent keys', () => {
  const sourceObject = { foo: 1, bar: 2, baz: 3 }
  const output = omit(sourceObject, 'foo', 'qux')
  expect(output).toStrictEqual({ bar: 2, baz: 3 })
})
